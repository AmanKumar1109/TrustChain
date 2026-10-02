const crypto = require('crypto');
const { ethers } = require('ethers');
const Unit = require('../models/Unit');
const Batch = require('../models/Batch');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const Transfer = require('../models/Transfer');
const UnitTransfer = require('../models/UnitTransfer');
const Scan = require('../models/Scan');
const User = require('../models/User');
const blockchainService = require('../services/blockchain.service');
const walletService = require('../services/wallet.service');
const smsService = require('../services/sms.service');
const { leafHash } = require('../utils/merkle');
const { successResponse, errorResponse } = require('../utils/response');
const { ROLES } = require('../constants/roles');
const config = require('../config/env');

/**
 * @desc Get consumer products list with status (Pending Claim, Claimed)
 * @route GET /api/v1/consumer/products
 * @access Consumer
 */
const getMyProducts = async (req, res, next) => {
  try {
    const userPhone = req.user.phone;
    const userId = req.user._id;
    const userWallet = req.user.walletAddress;

    // 1. Fetch Claimed Products (where current owner is user or claimed by user)
    const claimedUnits = await Unit.find({
      $or: [{ claimedBy: userId }, { currentOwnerWallet: userWallet, soldState: 2 }],
    })
      .populate('product')
      .populate('retailer', 'name companyName')
      .populate('sale')
      .sort({ claimedAt: -1, updatedAt: -1 });

    const claimedUnitCodes = new Set(claimedUnits.map(u => u.unitCode));

    // 2. Fetch Pending Claim Sales (purchased by customer's phone/id, but not yet claimed)
    const pendingSales = await Sale.find({
      $or: [{ customer: userId }, { customerPhone: userPhone }],
      isClaimed: false,
    })
      .populate('product')
      .populate('unit')
      .sort({ purchaseDate: -1 });

    const products = [];

    // Add Claimed Units
    for (const unit of claimedUnits) {
      let batch = null;
      if (unit.batch) {
        batch = await Batch.findById(unit.batch);
      }
      if (!batch && unit.batchId) {
        batch = await Batch.findOne({ batchId: unit.batchId });
      }

      const prod = unit.product || batch?.product;
      const sale = unit.sale || (await Sale.findOne({ unit: unit._id }));

      products.push({
        unitCode: unit.unitCode,
        batchNumber: batch?.batchNumber || unit.batchNumber,
        productName: prod?.name || batch?.productName || unit.productName || 'Product',
        category: prod?.category || batch?.category || 'General',
        images: prod?.images || [],
        status: 'Claimed',
        claimedState: 'Claimed',
        purchaseDate: unit.soldAt || sale?.purchaseDate || null,
        claimedAt: unit.claimedAt || null,
        warranty: sale?.warranty || {
          durationMonths: 12,
          startDate: unit.soldAt,
          expiryDate: unit.warrantyExpiryDate,
          status: 'Claimed',
        },
        retailerName: unit.retailer?.companyName || unit.retailer?.name || sale?.retailerName || 'Authorized Retailer',
        isOwner: true,
        canResell: true,
      });
    }

    // Add Pending Claim Units (preventing duplicates if already in claimedUnits)
    for (const sale of pendingSales) {
      if (claimedUnitCodes.has(sale.unitCode)) continue;

      const unit = sale.unit || (await Unit.findOne({ unitCode: sale.unitCode }));
      let batch = null;
      if (sale.batch) {
        batch = await Batch.findById(sale.batch);
      }
      if (!batch && sale.batchId) {
        batch = await Batch.findOne({ batchId: sale.batchId });
      }

      const prod = sale.product || unit?.product || batch?.product;

      products.push({
        unitCode: sale.unitCode,
        batchNumber: batch?.batchNumber || sale.batchId,
        productName: prod?.name || sale.productName || 'Product',
        category: prod?.category || batch?.category || 'General',
        images: prod?.images || [],
        status: 'Pending Claim',
        claimedState: 'Pending Claim',
        purchaseDate: sale.purchaseDate,
        claimedAt: null,
        warranty: sale.warranty,
        claimToken: sale.claimToken,
        claimLink: sale.claimLink,
        retailerName: sale.retailerName || 'Authorized Retailer',
        isOwner: false,
        canResell: false,
      });
    }

    return successResponse(res, {
      count: products.length,
      products,
      summary: {
        total: products.length,
        claimed: products.filter(p => p.status === 'Claimed').length,
        pendingClaim: products.filter(p => p.status === 'Pending Claim').length,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get consumer product detail with warranty info, purchase proof, and ownership history
 * @route GET /api/v1/consumer/products/:code
 * @access Consumer
 */
const getProductDetail = async (req, res, next) => {
  try {
    const rawCode = decodeURIComponent(req.params.code || '').trim();

    // 1. Find Unit
    let unit = await Unit.findOne({ unitCode: rawCode })
      .populate('product')
      .populate('retailer', 'name companyName email phone walletAddress')
      .populate('claimedBy', 'name phone walletAddress')
      .populate('sale');

    if (!unit && rawCode.includes('#')) {
      const baseCode = rawCode.split('#')[0];
      unit = await Unit.findOne({ unitCode: baseCode })
        .populate('product')
        .populate('retailer', 'name companyName email phone walletAddress')
        .populate('claimedBy', 'name phone walletAddress')
        .populate('sale');
    }

    if (!unit) {
      return errorResponse(res, `Product unit "${rawCode}" not found.`, 404, 'UNIT_NOT_FOUND');
    }

    // 2. Find Batch
    let batch = await Batch.findById(unit.batch)
      .populate('brand')
      .populate('manufacturer', 'name companyName walletAddress');
    if (!batch && unit.batchId) {
      batch = await Batch.findOne({ batchId: unit.batchId })
        .populate('brand')
        .populate('manufacturer', 'name companyName walletAddress');
    }

    // 3. Find Sale Record
    const sale = unit.sale || (await Sale.findOne({ unit: unit._id })) || (await Sale.findOne({ unitCode: unit.unitCode }));

    // 4. Construct Full Ownership History Timeline
    const ownershipHistory = [];

    // Stage 1: Manufacturing
    if (batch) {
      ownershipHistory.push({
        stage: 'Manufacturing',
        title: 'Batch Manufactured & Registered On-Chain',
        timestamp: batch.mfgDate || batch.createdAt,
        actor: batch.brandName || batch.manufacturer?.companyName || 'Manufacturer',
        actorRole: 'manufacturer',
        location: 'Factory Plant',
        txHash: batch.txHash,
        notes: `Registered with Merkle Root. Protection: ${batch.protectionLevel}`,
      });

      // Stage 2: Custody Transfers
      try {
        const batchTransfers = await Transfer.find({
          $or: [{ batchId: batch.batchId }, { batchNumber: batch.batchNumber }],
          status: 'Accepted',
        }).sort({ updatedAt: 1 });

        for (const t of batchTransfers) {
          ownershipHistory.push({
            stage: t.toRole === 'retailer' ? 'Retail Supply' : 'Distribution',
            title: `Batch Custody Transferred to ${t.toRole.charAt(0).toUpperCase() + t.toRole.slice(1)}`,
            timestamp: t.updatedAt || t.createdAt,
            actor: t.toName || t.toRole,
            actorRole: t.toRole,
            from: t.fromName,
            to: t.toName,
            txHash: t.respondTxHash || t.txHash,
            notes: t.notes || `Received ${t.quantity} units into inventory`,
          });
        }
      } catch (e) {
        console.warn(`[Timeline Warning] Transfers: ${e.message}`);
      }
    }

    // Stage 3: Retail Sale
    if (unit.soldAt || sale) {
      ownershipHistory.push({
        stage: 'Retail Sale',
        title: 'Purchased at Retail Store',
        timestamp: unit.soldAt || sale?.purchaseDate || new Date(),
        actor: unit.retailer?.companyName || sale?.retailerName || 'Authorized Retailer',
        actorRole: 'retailer',
        location: 'Authorized Retailer Point-of-Sale',
        txHash: sale?.txHash || null,
        notes: `Sold to customer (${sale?.customerPhone || 'Verified Customer'}) with ${sale?.warranty?.durationMonths || 12}-month warranty.`,
      });
    }

    // Stage 4: Consumer Claim
    if (unit.soldState === 2 || unit.status === 'claimed' || unit.claimedAt) {
      ownershipHistory.push({
        stage: 'Consumer Ownership',
        title: 'Warranty & Rewards Claimed',
        timestamp: unit.claimedAt || sale?.claimedAt || new Date(),
        actor: unit.claimedBy?.name || 'Verified Consumer',
        actorRole: 'consumer',
        txHash: sale?.claimTxHash || null,
        notes: 'Ownership authenticated on-chain. TPTS loyalty tokens awarded.',
      });
    }

    // Stage 5: Secondary Resale Transfers (if any)
    try {
      const resales = await UnitTransfer.find({
        unit: unit._id,
        status: 'Accepted',
      }).sort({ updatedAt: 1 });

      for (const r of resales) {
        ownershipHistory.push({
          stage: 'Secondary Resale',
          title: 'Transferred via Peer-to-Peer Resale',
          timestamp: r.updatedAt || r.createdAt,
          actor: r.buyerName || r.buyerPhone,
          actorRole: 'consumer',
          from: r.sellerName || r.sellerPhone,
          to: r.buyerName || r.buyerPhone,
          txHash: r.respondTxHash || r.txHash,
          notes: r.notes || `Resold/Transferred on secondary market for ₹${r.price || 0}`,
        });
      }
    } catch (e) {
      console.warn(`[Timeline Warning] Resales: ${e.message}`);
    }

    const prod = unit.product || batch?.product || {};
    const isClaimed = unit.soldState === 2 || unit.status === 'claimed';
    const isCurrentOwner =
      req.user &&
      (unit.currentOwnerWallet === req.user.walletAddress || (unit.claimedBy && unit.claimedBy._id.equals(req.user._id)));

    return successResponse(res, {
      product: {
        id: prod._id,
        name: prod.name || batch?.productName,
        category: prod.category || batch?.category,
        sku: prod.sku || batch?.productSku,
        description: prod.description || batch?.description,
        images: prod.images || [],
        price: prod.price || sale?.price || 0,
      },
      batch: {
        batchNumber: batch?.batchNumber || unit.batchNumber,
        brandName: batch?.brandName || 'Authorized Brand',
        mfgDate: batch?.mfgDate,
        expiryDate: batch?.expiryDate,
        protectionLevel: batch?.protectionLevel || 'Standard',
        txHash: batch?.txHash,
      },
      warranty: sale?.warranty || {
        durationMonths: 12,
        startDate: unit.soldAt,
        expiryDate: unit.warrantyExpiryDate,
        status: isClaimed ? 'Claimed' : 'Active',
        terms: 'Standard manufacturer warranty against defects.',
      },
      purchaseProof: sale
        ? {
            saleId: sale.saleId,
            retailerName: sale.retailerName,
            retailerWallet: sale.retailerWallet,
            customerPhone: sale.customerPhone,
            customerWallet: sale.customerWallet,
            purchaseDate: sale.purchaseDate,
            price: sale.price,
            invoiceNumber: sale.invoiceNumber,
            txHash: sale.txHash,
            claimTxHash: sale.claimTxHash,
          }
        : null,
      unitStatus: {
        unitCode: unit.unitCode,
        status: isClaimed ? 'Claimed' : 'Pending Claim',
        soldState: unit.soldState === 1 ? 'Sold' : unit.soldState === 2 ? 'Claimed' : 'Unsold',
        isOwner: isCurrentOwner,
        canResell: isCurrentOwner && isClaimed,
      },
      ownershipHistory,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Resale: Owner initiates unit transfer to buyer phone number
 * @route POST /api/v1/consumer/resale/transfer
 * @access Consumer
 */
const initiateResale = async (req, res, next) => {
  try {
    const rawCode = (req.body.code || req.body.unitCode || '').trim();
    const buyerPhone = (req.body.buyerPhone || '').trim();
    const price = req.body.price !== undefined ? parseFloat(req.body.price) : 0;
    const notes = req.body.notes || '';

    if (!rawCode) {
      return errorResponse(res, 'Product unit code is required.', 400, 'CODE_REQUIRED');
    }
    if (!buyerPhone) {
      return errorResponse(res, 'Buyer phone number is required.', 400, 'BUYER_PHONE_REQUIRED');
    }

    if (buyerPhone === req.user.phone) {
      return errorResponse(res, 'Cannot transfer product ownership to your own phone number.', 400, 'SELF_TRANSFER_FORBIDDEN');
    }

    // 1. Resolve Unit
    const code = decodeURIComponent(rawCode);
    const unit = await Unit.findOne({ unitCode: code }).populate('product');
    if (!unit) {
      return errorResponse(res, `Unit "${code}" not found.`, 404, 'UNIT_NOT_FOUND');
    }

    // 2. Validate Ownership: caller must be current recorded owner
    const isOwner =
      unit.soldState === 2 &&
      (unit.currentOwnerWallet === req.user.walletAddress ||
        (unit.claimedBy && unit.claimedBy.toString() === req.user._id.toString()));

    if (!isOwner) {
      return errorResponse(
        res,
        'You do not own this claimed unit. Only the verified owner can initiate resale transfer.',
        403,
        'NOT_UNIT_OWNER'
      );
    }

    // 3. Block if another pending resale transfer already exists for this unit
    const activeTransfer = await UnitTransfer.findOne({
      unit: unit._id,
      status: 'Pending',
    });
    if (activeTransfer) {
      return errorResponse(
        res,
        `A pending transfer already exists for this unit (Transfer ID: ${activeTransfer.transferId}). Please wait for buyer response or cancel it.`,
        400,
        'TRANSFER_ALREADY_PENDING'
      );
    }

    // 4. Find or Create Buyer User (with custodial wallet)
    let buyer = await User.findOne({ phone: buyerPhone });
    if (!buyer) {
      const custodialWallet = walletService.createCustodialWallet();
      buyer = await User.create({
        name: `Customer ${buyerPhone.slice(-4)}`,
        phone: buyerPhone,
        role: ROLES.CONSUMER,
        walletAddress: custodialWallet.address,
        encryptedPrivateKey: custodialWallet.encryptedPrivateKey,
        isPhoneVerified: true,
        pointsBalance: 0,
      });
    } else if (!buyer.walletAddress) {
      const custodialWallet = walletService.createCustodialWallet();
      buyer.walletAddress = custodialWallet.address;
      buyer.encryptedPrivateKey = custodialWallet.encryptedPrivateKey;
      await buyer.save();
    }

    // 5. Call initiateUnitTransfer on-chain
    const unitHash = leafHash(unit.unitCode);
    let txHash = null;
    let transferId = null;

    try {
      const chainRes = await blockchainService.initiateUnitTransfer({
        unitHash,
        fromWallet: req.user.walletAddress,
        toWallet: buyer.walletAddress,
      });
      txHash = chainRes.txHash;
      transferId = chainRes.transferId;
    } catch (chainErr) {
      console.warn(`[Blockchain Warning] initiateUnitTransfer simulated: ${chainErr.message}`);
      txHash = ethers.id(`simulated-unit-transfer-tx-${Date.now()}`);
      transferId = `UTRF-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    }

    const transferIdBytes32 = ethers.isHexString(transferId, 32)
      ? transferId
      : ethers.id(transferId);

    // 6. Create UnitTransfer Record
    const transfer = await UnitTransfer.create({
      transferId,
      transferIdBytes32,
      unit: unit._id,
      unitCode: unit.unitCode,
      unitHash,
      batch: unit.batch,
      batchId: unit.batchId,
      product: unit.product?._id || unit.product,
      seller: req.user._id,
      sellerName: req.user.name,
      sellerPhone: req.user.phone,
      sellerWallet: req.user.walletAddress,
      buyer: buyer._id,
      buyerName: buyer.name,
      buyerPhone: buyer.phone,
      buyerWallet: buyer.walletAddress,
      status: 'Pending',
      price,
      notes,
      txHash,
      timeline: [
        {
          status: 'Pending',
          action: 'INITIATED',
          timestamp: new Date(),
          actor: req.user._id,
          actorName: req.user.name,
          actorRole: 'consumer',
          note: `Owner initiated secondary transfer to ${buyer.phone}.`,
        },
      ],
    });

    // 7. Dispatch Mock SMS to Buyer
    await smsService.sendSms(
      buyer.phone,
      `Ownership transfer initiated: ${req.user.name} sent you product unit "${unit.unitCode}". Log in to accept or reject the transfer.`
    );

    return successResponse(
      res,
      {
        transfer: {
          id: transfer._id,
          transferId: transfer.transferId,
          unitCode: transfer.unitCode,
          sellerPhone: transfer.sellerPhone,
          buyerPhone: transfer.buyerPhone,
          status: transfer.status,
          price: transfer.price,
          txHash: transfer.txHash,
          createdAt: transfer.createdAt,
        },
        timeline: transfer.timeline,
        message: 'Resale transfer initiated successfully. Buyer has been notified.',
      },
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get consumer resale transfers (incoming and outgoing)
 * @route GET /api/v1/consumer/resale/transfers
 * @access Consumer
 */
const getResaleTransfers = async (req, res, next) => {
  try {
    const { direction = 'all', status } = req.query;
    const userId = req.user._id;

    let query = {};
    if (direction === 'incoming') {
      query.buyer = userId;
    } else if (direction === 'outgoing') {
      query.seller = userId;
    } else {
      query.$or = [{ buyer: userId }, { seller: userId }];
    }

    if (status && ['Pending', 'Accepted', 'Rejected'].includes(status)) {
      query.status = status;
    }

    const transfers = await UnitTransfer.find(query)
      .populate('product', 'name category sku images')
      .populate('unit', 'unitCode batchNumber')
      .sort({ createdAt: -1 });

    const [pendingCount, acceptedCount, rejectedCount] = await Promise.all([
      UnitTransfer.countDocuments({ ...query, status: 'Pending' }),
      UnitTransfer.countDocuments({ ...query, status: 'Accepted' }),
      UnitTransfer.countDocuments({ ...query, status: 'Rejected' }),
    ]);

    return successResponse(res, {
      transfers,
      tabs: {
        pending: pendingCount,
        accepted: acceptedCount,
        rejected: rejectedCount,
        all: transfers.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Resale: Buyer accepts or rejects unit transfer
 * @route POST /api/v1/consumer/resale/transfers/:id/respond
 * @access Consumer
 */
const respondResale = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { accept, reason } = req.body;
    const buyer = req.user;

    const query = { $or: [{ transferId: id }] };
    if (require('mongoose').Types.ObjectId.isValid(id)) {
      query.$or.push({ _id: id });
    }

    const transfer = await UnitTransfer.findOne(query).populate('unit');
    if (!transfer) {
      return errorResponse(res, `Transfer "${id}" was not found.`, 404, 'TRANSFER_NOT_FOUND');
    }

    if (transfer.status !== 'Pending') {
      return errorResponse(res, `Transfer is already marked as "${transfer.status}".`, 400, 'TRANSFER_NOT_PENDING');
    }

    // Authorization: only the designated buyer can respond
    const isBuyer =
      transfer.buyer.toString() === buyer._id.toString() ||
      transfer.buyerWallet.toLowerCase() === buyer.walletAddress?.toLowerCase();

    if (!isBuyer && buyer.role !== ROLES.ADMIN) {
      return errorResponse(res, 'You are not the designated recipient of this transfer.', 403, 'FORBIDDEN');
    }

    // 1. Broadcast respondUnitTransfer on-chain via Relayer
    let respondTxHash = null;
    try {
      const chainRes = await blockchainService.respondUnitTransfer(
        transfer.transferIdBytes32 || transfer.transferId,
        accept
      );
      respondTxHash = chainRes.txHash;
    } catch (err) {
      console.warn(`[Blockchain Warning] respondUnitTransfer simulated: ${err.message}`);
      respondTxHash = ethers.id(`simulated-respond-unit-tx-${Date.now()}`);
    }

    transfer.respondTxHash = respondTxHash;

    if (accept) {
      transfer.status = 'Accepted';
      transfer.timeline.push({
        status: 'Accepted',
        action: 'ACCEPTED',
        timestamp: new Date(),
        actor: buyer._id,
        actorName: buyer.name,
        actorRole: 'consumer',
        note: 'Buyer accepted unit transfer and claimed ownership.',
      });

      // Update unit ownership in MongoDB
      if (transfer.unit) {
        const unit = await Unit.findById(transfer.unit._id);
        if (unit) {
          unit.currentOwnerWallet = buyer.walletAddress;
          unit.claimedBy = buyer._id;
          await unit.save();
        }
      }
    } else {
      transfer.status = 'Rejected';
      transfer.rejectionReason = reason || 'Transfer declined by recipient.';
      transfer.timeline.push({
        status: 'Rejected',
        action: 'REJECTED',
        timestamp: new Date(),
        actor: buyer._id,
        actorName: buyer.name,
        actorRole: 'consumer',
        note: reason || 'Transfer declined by recipient.',
      });
    }

    await transfer.save();

    return successResponse(res, {
      transfer: {
        id: transfer._id,
        transferId: transfer.transferId,
        unitCode: transfer.unitCode,
        status: transfer.status,
        respondTxHash,
        rejectionReason: transfer.rejectionReason,
      },
      timeline: transfer.timeline,
      message: accept ? 'Unit ownership transfer accepted successfully!' : 'Unit transfer rejected.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get scan history of the logged-in user
 * @route GET /api/v1/consumer/scans
 * @access Authenticated
 */
const getMyScans = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';

    const scans = await Scan.find({
      $or: [{ userId }, { ip: clientIp }],
    })
      .populate('unit', 'unitCode batchNumber status soldState')
      .populate('batch', 'batchNumber productName brandName')
      .sort({ timestamp: -1 })
      .limit(100);

    const formattedScans = scans.map(s => ({
      id: s._id,
      code: s.code,
      result: s.result,
      reason: s.reason,
      city: s.city,
      timestamp: s.timestamp || s.createdAt,
      productName: s.batch?.productName || 'Verified Product',
      brandName: s.batch?.brandName || 'Verified Brand',
      batchNumber: s.batch?.batchNumber || s.batchId,
    }));

    return successResponse(res, {
      count: formattedScans.length,
      scans: formattedScans,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyProducts,
  getProductDetail,
  initiateResale,
  getResaleTransfers,
  respondResale,
  getMyScans,
};
