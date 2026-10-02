const QRCode = require('qrcode');
const archiver = require('archiver');
const PDFDocument = require('pdfkit');
const config = require('../config/env');
const Unit = require('../models/Unit');

/**
 * Factory helper for archiver compatibility across v7 and v8+
 */
function createZipArchive(options = {}) {
  if (typeof archiver === 'function') {
    return archiver('zip', options);
  }
  if (archiver.ZipArchive) {
    return new archiver.ZipArchive(options);
  }
  if (archiver.default && typeof archiver.default === 'function') {
    return archiver.default('zip', options);
  }
  throw new Error('Unsupported archiver export format');
}

/**
 * QR Code Generation & Streaming Service
 * Generates verification QR codes pointing to FRONTEND_URL/verify/<unitCode>
 * and streams them as ZIP archives or printable PDF sheets with low memory footprint.
 */
class QrService {
  /**
   * Constructs the absolute public verification URL for a given unit code
   */
  getVerificationUrl(unitCode) {
    const baseUrl = config.frontendUrl.replace(/\/+$/, '');
    return `${baseUrl}/verify/${encodeURIComponent(unitCode)}`;
  }

  /**
   * Generates a PNG buffer of a QR code
   */
  async generateQrBuffer(text, options = {}) {
    return QRCode.toBuffer(text, {
      type: 'png',
      width: options.width || 300,
      margin: options.margin !== undefined ? options.margin : 2,
      errorCorrectionLevel: options.errorCorrectionLevel || 'M',
      color: {
        dark: options.darkColor || '#000000',
        light: options.lightColor || '#ffffff',
      },
    });
  }

  /**
   * Streams all QR codes of a batch as a ZIP of individual PNG files
   *
   * @param {Object} batch Batch document
   * @param {import('express').Response} res Express response object
   */
  async streamBatchZip(batch, res) {
    const batchIdentifier = batch.batchNumber || batch.batchId;
    const filename = `${batchIdentifier}-qr-codes.zip`;

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const archive = createZipArchive({
      zlib: { level: 6 },
    });

    archive.on('warning', err => {
      console.warn(`[QrService Archive Warning] ${err.message}`);
    });

    archive.on('error', err => {
      console.error(`[QrService Archive Error] ${err.message}`);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: { message: 'Failed to generate QR ZIP archive.' } });
      }
    });

    archive.pipe(res);

    // Stream query using Mongoose cursor for memory efficiency with large batches
    const cursor = Unit.find({
      $or: [{ batchNumber: batchIdentifier }, { batchId: batchIdentifier }],
    }).cursor();

    let count = 0;
    for await (const unit of cursor) {
      count++;
      const verificationUrl = this.getVerificationUrl(unit.unitCode);
      const qrBuffer = await this.generateQrBuffer(verificationUrl, {
        width: 350,
        margin: 2,
      });

      archive.append(qrBuffer, {
        name: `qr-${unit.unitCode}.png`,
      });
    }

    // Include manifest metadata file inside ZIP
    const manifest = {
      batchNumber: batchIdentifier,
      productName: batch.productName,
      productSku: batch.productSku || '',
      brandName: batch.brandName,
      quantity: batch.quantity,
      protectionLevel: batch.protectionLevel,
      mfgDate: batch.mfgDate,
      expiryDate: batch.expiryDate,
      merkleRoot: batch.merkleRoot,
      verificationBaseUrl: `${config.frontendUrl.replace(/\/+$/, '')}/verify`,
      totalQRCodes: count,
      generatedAt: new Date().toISOString(),
    };

    archive.append(JSON.stringify(manifest, null, 2), {
      name: 'manifest.json',
    });

    await archive.finalize();
  }

  /**
   * Streams all QR codes of a batch as a printable, multi-page A4 PDF sheet (12 labels / page)
   *
   * @param {Object} batch Batch document
   * @param {import('express').Response} res Express response object
   */
  async streamBatchPdf(batch, res) {
    const batchIdentifier = batch.batchNumber || batch.batchId;
    const filename = `${batchIdentifier}-qr-sheet.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const doc = new PDFDocument({
      size: 'A4',
      margin: 30,
      autoFirstPage: true,
      info: {
        Title: `TrustChain QR Sheet - ${batchIdentifier}`,
        Author: 'TrustChain Provenance Platform',
        Subject: `Authentication QR codes for ${batch.productName}`,
      },
    });

    doc.pipe(res);

    // Grid layout parameters (A4: 595.28 x 841.89 points)
    const margin = 30;
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const headerHeight = 45;
    const usableWidth = pageWidth - margin * 2; // 535.28
    const cols = 3;
    const rows = 4;
    const itemsPerPage = cols * rows; // 12 labels per page

    const cellWidth = Math.floor((usableWidth - (cols - 1) * 12) / cols); // ~170 pt
    const cellHeight = Math.floor((pageHeight - margin * 2 - headerHeight - (rows - 1) * 10) / rows); // ~170 pt
    const gapX = (usableWidth - cellWidth * cols) / (cols - 1);
    const gapY = 10;

    let pageNumber = 1;

    // Helper: Draw header on current page
    const drawPageHeader = () => {
      doc.save();
      // Brand / TrustChain banner
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .fillColor('#0f172a')
        .text('TrustChain Authentication Labels', margin, margin);

      doc
        .fontSize(8)
        .font('Helvetica')
        .fillColor('#475569')
        .text(
          `Batch: ${batchIdentifier}  |  Product: ${batch.productName}  |  Level: ${batch.protectionLevel}  |  Page ${pageNumber}`,
          margin,
          margin + 15
        );

      // Thin separator line
      doc
        .strokeColor('#cbd5e1')
        .lineWidth(0.75)
        .moveTo(margin, margin + 30)
        .lineTo(pageWidth - margin, margin + 30)
        .stroke();

      doc.restore();
    };

    drawPageHeader();

    // Stream query using Mongoose cursor
    const cursor = Unit.find({
      $or: [{ batchNumber: batchIdentifier }, { batchId: batchIdentifier }],
    }).cursor();

    let itemIndex = 0;

    for await (const unit of cursor) {
      const indexOnPage = itemIndex % itemsPerPage;

      // Add new page when current page is filled
      if (itemIndex > 0 && indexOnPage === 0) {
        doc.addPage();
        pageNumber++;
        drawPageHeader();
      }

      const col = indexOnPage % cols;
      const row = Math.floor(indexOnPage / cols);

      const x = margin + col * (cellWidth + gapX);
      const y = margin + headerHeight + row * (cellHeight + gapY);

      // 1. Draw label card container with subtle rounded border
      doc.save();
      doc
        .roundedRect(x, y, cellWidth, cellHeight, 6)
        .strokeColor('#e2e8f0')
        .lineWidth(1)
        .fillAndStroke('#ffffff', '#e2e8f0');

      // Top brand header bar inside label
      doc
        .roundedRect(x, y, cellWidth, 18, 6)
        .fill('#f8fafc');

      // 2. Product & Brand Label Text
      doc
        .fontSize(7)
        .font('Helvetica-Bold')
        .fillColor('#1e293b')
        .text(batch.brandName || 'TrustChain Verified', x + 6, y + 5, {
          width: cellWidth - 12,
          ellipsis: true,
        });

      // 3. Generate and embed QR code image
      const verificationUrl = this.getVerificationUrl(unit.unitCode);
      const qrBuffer = await this.generateQrBuffer(verificationUrl, {
        width: 200,
        margin: 1,
      });

      const qrSize = 90;
      const qrX = x + (cellWidth - qrSize) / 2;
      const qrY = y + 22;

      doc.image(qrBuffer, qrX, qrY, {
        width: qrSize,
        height: qrSize,
      });

      // 4. Unit Serial Code Text
      doc
        .fontSize(6)
        .font('Helvetica-Bold')
        .fillColor('#0f172a')
        .text(unit.unitCode, x + 4, qrY + qrSize + 4, {
          width: cellWidth - 8,
          align: 'center',
          ellipsis: true,
        });

      // 5. Security & Verification subtitle
      const isHighValue = unit.protectionLevel === 'HighValue' || batch.protectionLevel === 'HighValue';
      const securityText = isHighValue ? 'Protected: Scratch for Secret' : 'Scan QR to Verify Authenticity';

      doc
        .fontSize(5.5)
        .font('Helvetica')
        .fillColor(isHighValue ? '#b91c1c' : '#2563eb')
        .text(securityText, x + 4, qrY + qrSize + 15, {
          width: cellWidth - 8,
          align: 'center',
        });

      doc.restore();
      itemIndex++;
    }

    doc.end();
  }
}

module.exports = new QrService();
