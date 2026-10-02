const crypto = require('crypto');
const { ethers } = require('ethers');
const Report = require('../models/Report');
const Unit = require('../models/Unit');
const Batch = require('../models/Batch');
const Product = require('../models/Product');
const Brand = require('../models/Brand');
const User = require('../models/User');
const Scan = require('../models/Scan');
const RewardLedger = require('../models/RewardLedger');
const blockchainService = require('../services/blockchain.service');
const rewardService = require('../services/reward.service');
const smsService = require('../services/sms.service');
const walletService = require('../services/wallet.service');
const { successResponse, errorResponse } = require('../utils/response');
const { ROLES } = require('../constants/roles');

// Standard coordinates dictionary for Indian cities to support rich heatmap visualization
const CITY_COORDINATES = {
  mumbai: { lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
  delhi: { lat: 28.6139, lng: 77.2090, state: 'Delhi' },
  'new delhi': { lat: 28.6139, lng: 77.2090, state: 'Delhi' },
  bengaluru: { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  bangalore: { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  hyderabad: { lat: 17.3850, lng: 78.4867, state: 'Telangana' },
  chennai: { lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
  kolkata: { lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
  pune: { lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  ahmedabad: { lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
  jaipur: { lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
  surat: { lat: 21.1702, lng: 72.8311, state: 'Gujarat' },
  lucknow: { lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh' },
  kanpur: { lat: 26.4499, lng: 80.3319, state: 'Uttar Pradesh' },
  nagpur: { lat: 21.1458, lng: 79.0882, state: 'Maharashtra' },
  patna: { lat: 25.5941, lng: 85.1376, state: 'Bihar' },
  indore: { lat: 22.7196, lng: 75.8577, state: 'Madhya Pradesh' },
  bhopal: { lat: 23.2599, lng: 77.4126, state: 'Madhya Pradesh' },
  chandigarh: { lat: 30.7333, lng: 76.7794, state: 'Punjab' },
  coimbatore: { lat: 11.0168, lng: 76.9558, state: 'Tamil Nadu' },
};

/**
 * Resolve geo coordinates from city name or provided lat/lng
 */
const resolveCoordinates = (city, lat, lng) => {
  if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
    return { lat: parseFloat(lat), lng: parseFloat(lng) };
  }
  const cleanCity = (city || '').toLowerCase().trim();
  if (CITY_COORDINATES[cleanCity]) {
    return { lat: CITY_COORDINATES[cleanCity].lat, lng: CITY_COORDINATES[cleanCity].lng };
  }
  // Default to central India
  return { lat: 20.5937, lng: 78.9629 };
};

/**
 * @desc Submit a fake/counterfeit product report
 * @route POST /api/v1/reports
 * @access Public / Authenticated (Guests can submit; rewards only apply if logged in)
 */
const submitReport = async (req, res, next) => {
  try {
    const {
      shopName,
      comment,
      code,
      city,
      state,
      address,
      latitude,
      longitude,
      guestName,
      guestPhone,
      guestEmail,
    } = req.body;

    if (!shopName || shopName.trim().length < 2) {
      return errorResponse(res, 'Shop or establishment name is required (min 2 characters).', 400, 'SHOP_REQUIRED');
    }
    if (!comment || comment.trim().length < 3) {
      return errorResponse(res, 'Detailed report comment is required (min 3 characters).', 400, 'COMMENT_REQUIRED');
    }

    const isGuest = !req.user;
    const user = req.user || null;

    // Resolve Location
    const resolvedCity =
      city ||
      req.query.city ||
      req.headers['x-simulate-city'] ||
      req.headers['x-city'] ||
      'Delhi';

    const coords = resolveCoordinates(resolvedCity, latitude, longitude);

    // Photos uploaded via Multer
    const photos = req.files && req.files.length > 0
      ? req.files.map(f => `/uploads/reports/${f.filename}`)
      : [];

    // Resolve linked Unit, Batch, Product, and Brand if code is provided
    let unit = null;
    let batch = null;
    let product = null;
    let brand = null;
    let manufacturer = null;
    let productName = '';
    let brandName = '';
    let batchNumber = '';

    const cleanCode = (code || '').trim();
    if (cleanCode) {
      unit = await Unit.findOne({ unitCode: cleanCode });
      if (!unit && cleanCode.includes('#')) {
        unit = await Unit.findOne({ unitCode: cleanCode.split('#')[0] });
      }

      if (unit) {
        batchNumber = unit.batchNumber;
        batch = await Batch.findById(unit.batch);
        product = await Product.findById(unit.product);
      } else {
        batch = await Batch.findOne({ $or: [{ batchNumber: cleanCode }, { batchId: cleanCode }] });
        if (batch) {
          batchNumber = batch.batchNumber;
          product = await Product.findById(batch.product);
        }
      }

      if (batch) {
        productName = batch.productName;
        brandName = batch.brandName;
        manufacturer = batch.manufacturer;
        brand = batch.brand ? await Brand.findById(batch.brand) : null;
      } else if (product) {
        productName = product.name;
        manufacturer = product.manufacturer;
      }
    }

    const reportId = `RPT-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

    const report = await Report.create({
      reportId,
      user: user ? user._id : null,
      isGuest,
      guestContact: isGuest ? {
        name: guestName || 'Anonymous Guest',
        phone: guestPhone || '',
        email: guestEmail || '',
      } : {
        name: user.name,
        phone: user.phone || '',
        email: user.email || '',
      },
      photos,
      geo: {
        latitude: coords.lat,
        longitude: coords.lng,
        city: resolvedCity,
        state: state || (CITY_COORDINATES[resolvedCity.toLowerCase()]?.state || ''),
        address: address || `${shopName}, ${resolvedCity}`,
      },
      shopName: shopName.trim(),
      comment: comment.trim(),
      code: cleanCode,
      unit: unit ? unit._id : null,
      batch: batch ? batch._id : null,
      batchNumber,
      product: product ? product._id : null,
      productName,
      brand: brand ? brand._id : null,
      brandName,
      manufacturer,
      status: 'Submitted',
    });

    // Notify the brand when a report comes in
    console.log('\n🚨 ==================== [BRAND ALERT: COUNTERFEIT REPORT] ====================');
    console.log(`🆔 Report ID: ${reportId}`);
    console.log(`🏢 Brand / Manufacturer: ${brandName || 'Brand Compliance Department'}`);
    console.log(`📍 Shop: "${shopName}", City: ${resolvedCity}`);
    console.log(`💬 Consumer Observation: "${comment}"`);
    console.log(`📸 Evidence Photos Attached: ${photos.length}`);
    console.log(`👤 Filed by: ${isGuest ? 'Guest Consumer' : `${user.name} (${user.phone})`}`);
    console.log('============================================================================\n');

    // Send mock notification to manufacturer phone if available
    if (manufacturer) {
      const mfgUser = await User.findById(manufacturer);
      if (mfgUser && mfgUser.phone) {
        await smsService.sendSms(
          mfgUser.phone,
          `[BRAND SECURITY ALERT] Counterfeit product reported at "${shopName}", ${resolvedCity} for ${brandName || 'your brand'}. Report ID: ${reportId}. Inspect immediately.`
        );
        report.notifiedBrand = true;
        await report.save();
      }
    }

    return successResponse(
      res,
      {
        reportId: report.reportId,
        status: report.status,
        isGuest,
        shopName: report.shopName,
        city: report.geo.city,
        photosCount: photos.length,
        rewardsEligible: !isGuest,
        message: isGuest
          ? 'Counterfeit report submitted successfully. Thank you for protecting consumers!'
          : 'Counterfeit report submitted successfully! If validated by compliance, you will receive reward bonus points.',
      },
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get reports filed by the current logged-in consumer
 * @route GET /api/v1/reports/my-reports
 * @access Consumer, Admin
 */
const getMyReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ user: req.user._id })
      .populate('product', 'name category images')
      .populate('batch', 'batchNumber productName')
      .sort({ createdAt: -1 });

    return successResponse(res, {
      count: reports.length,
      reports,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get report detail
 * @route GET /api/v1/reports/:id
 * @access Authenticated (Consumer for their own, Admin/Manufacturer for scoped)
 */
const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = { $or: [{ reportId: id }] };
    if (require('mongoose').Types.ObjectId.isValid(id)) {
      query.$or.push({ _id: id });
    }

    const report = await Report.findOne(query)
      .populate('user', 'name phone email role walletAddress')
      .populate('product', 'name category sku images')
      .populate('batch', 'batchNumber productName brandName mfgDate expiryDate')
      .populate('adminReview.reviewedBy', 'name email');

    if (!report) {
      return errorResponse(res, `Report "${id}" was not found.`, 404, 'REPORT_NOT_FOUND');
    }

    // Permission check
    const isOwner = req.user && report.user && report.user._id.equals(req.user._id);
    const isPrivileged = req.user && (req.user.role === ROLES.ADMIN || (req.user.role === ROLES.MANUFACTURER && report.manufacturer?.equals(req.user._id)));
    const isGuestQuery = !req.user && report.isGuest && report.reportId === id;

    if (!isOwner && !isPrivileged && !isGuestQuery) {
      return errorResponse(res, 'You do not have permission to view this report.', 403, 'FORBIDDEN');
    }

    return successResponse(res, { report });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Admin list reports with filters & pagination
 * @route GET /api/v1/admin/reports
 * @access Admin
 */
const getAdminReports = async (req, res, next) => {
  try {
    const { status, city, brand, page = '1', limit = '20', startDate, endDate } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const query = {};
    if (status && ['Submitted', 'UnderReview', 'Valid', 'Invalid'].includes(status)) {
      query.status = status;
    }
    if (city) {
      query['geo.city'] = new RegExp(city.trim(), 'i');
    }
    if (brand) {
      query.brandName = new RegExp(brand.trim(), 'i');
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const total = await Report.countDocuments(query);
    const reports = await Report.find(query)
      .populate('user', 'name phone email')
      .populate('product', 'name category')
      .populate('batch', 'batchNumber')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const [submittedCount, underReviewCount, validCount, invalidCount] = await Promise.all([
      Report.countDocuments({ status: 'Submitted' }),
      Report.countDocuments({ status: 'UnderReview' }),
      Report.countDocuments({ status: 'Valid' }),
      Report.countDocuments({ status: 'Invalid' }),
    ]);

    return successResponse(res, {
      total,
      page: pageNum,
      limit: limitNum,
      reports,
      tabs: {
        submitted: submittedCount,
        underReview: underReviewCount,
        valid: validCount,
        invalid: invalidCount,
        all: submittedCount + underReviewCount + validCount + invalidCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Admin marks report Valid or Invalid; Valid awards fake-report bonus points if logged-in user
 * @route PATCH /api/v1/admin/reports/:id/review
 * @access Admin
 */
const reviewReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!['Submitted', 'UnderReview', 'Valid', 'Invalid'].includes(status)) {
      return errorResponse(res, 'Valid status is required (Submitted, UnderReview, Valid, Invalid).', 400, 'INVALID_STATUS');
    }

    const query = { $or: [{ reportId: id }] };
    if (require('mongoose').Types.ObjectId.isValid(id)) {
      query.$or.push({ _id: id });
    }

    const report = await Report.findOne(query).populate('user');
    if (!report) {
      return errorResponse(res, `Report "${id}" was not found.`, 404, 'REPORT_NOT_FOUND');
    }

    let pointsAwarded = 0;
    let txHash = null;

    // If marked 'Valid': award fake-report bonus points if logged in user
    if (status === 'Valid' && report.user && (!report.adminReview?.pointsAwarded || report.adminReview.pointsAwarded === 0)) {
      const campaign = await rewardService.getCampaignSettings(report.manufacturer);
      const bonus = campaign.fakeReportBonus || 100;
      pointsAwarded = bonus;

      const reporter = await User.findById(report.user._id || report.user);
      if (reporter) {
        if (!reporter.walletAddress) {
          const wallet = walletService.createCustodialWallet();
          reporter.walletAddress = wallet.address;
          reporter.encryptedPrivateKey = wallet.encryptedPrivateKey;
        }

        try {
          const chainRes = await blockchainService.rewardTrustPoints(
            reporter.walletAddress,
            bonus,
            `FAKE_REPORT_BONUS_${report.reportId}`
          );
          txHash = chainRes.txHash;
        } catch (e) {
          console.warn(`[Blockchain Warning] rewardTrustPoints simulated: ${e.message}`);
          txHash = ethers.id(`simulated-fake-report-tx-${Date.now()}`);
        }

        reporter.pointsBalance = (reporter.pointsBalance || 0) + bonus;
        await reporter.save();

        await RewardLedger.create({
          user: reporter._id,
          type: 'FAKE_REPORT_BONUS',
          points: bonus,
          txHash,
          description: `Reward for validated counterfeit report at "${report.shopName}" (${report.reportId})`,
          balanceAfter: reporter.pointsBalance,
          metadata: {
            reportId: report.reportId,
            shopName: report.shopName,
            city: report.geo.city,
          },
        });

        // Notify user via mock SMS
        if (reporter.phone) {
          await smsService.sendSms(
            reporter.phone,
            `Congratulations! Your counterfeit product report for "${report.shopName}" was validated. You earned ${bonus} TPTS loyalty points!`
          );
        }
      }
    }

    report.status = status;
    report.adminReview = {
      reviewedBy: req.user._id,
      reviewedAt: new Date(),
      reviewNotes: notes || '',
      pointsAwarded,
      txHash,
    };
    await report.save();

    return successResponse(res, {
      report: {
        id: report._id,
        reportId: report.reportId,
        status: report.status,
        adminReview: report.adminReview,
      },
      pointsAwarded,
      txHash,
      message: status === 'Valid'
        ? (report.user ? `Report validated and ${pointsAwarded} bonus points awarded to reporter!` : 'Report marked as Valid (no points awarded to guest).')
        : `Report status updated to "${status}".`,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Hotspot endpoint for manufacturers: aggregate reports & suspicious scans by area
 * @route GET /api/v1/reports/hotspots (and GET /api/v1/manufacturers/hotspots)
 * @access Manufacturer, Admin
 */
const getHotspots = async (req, res, next) => {
  try {
    const { startDate, endDate, product, batch, city } = req.query;

    // Scope check: If Manufacturer, only aggregate their own products/batches
    let mfgBatchIds = [];
    if (req.user.role === ROLES.MANUFACTURER) {
      const mfgBatches = await Batch.find({ manufacturer: req.user._id }).select('batchNumber batchId');
      mfgBatchIds = mfgBatches.map(b => b.batchNumber);
    }

    // 1. Build Date Filter
    const dateQuery = {};
    if (startDate || endDate) {
      if (startDate) dateQuery.$gte = new Date(startDate);
      if (endDate) dateQuery.$lte = new Date(endDate);
    }

    // 2. Query Reports Match
    const reportMatch = {
      status: { $in: ['Submitted', 'UnderReview', 'Valid'] },
    };
    if (Object.keys(dateQuery).length > 0) {
      reportMatch.createdAt = dateQuery;
    }
    if (req.user.role === ROLES.MANUFACTURER) {
      reportMatch.$or = [{ manufacturer: req.user._id }, { batchNumber: { $in: mfgBatchIds } }];
    }
    if (city) {
      reportMatch['geo.city'] = new RegExp(city.trim(), 'i');
    }
    if (batch) {
      reportMatch.batchNumber = new RegExp(batch.trim(), 'i');
    }

    // 3. Query Suspicious Scans Match
    const scanMatch = {
      result: { $in: ['suspicious', 'fake', 'recalled', 'SUSPICIOUS', 'INVALID', 'RECALLED'] },
    };
    if (Object.keys(dateQuery).length > 0) {
      scanMatch.timestamp = dateQuery;
    }
    if (req.user.role === ROLES.MANUFACTURER && mfgBatchIds.length > 0) {
      scanMatch.batchId = { $in: mfgBatchIds };
    }
    if (city) {
      scanMatch.city = new RegExp(city.trim(), 'i');
    }
    if (batch) {
      scanMatch.batchId = new RegExp(batch.trim(), 'i');
    }

    // 4. Product filter support for both reports and scans
    if (product) {
      const prodQuery = {
        $or: [
          { name: new RegExp(product.trim(), 'i') },
          { sku: new RegExp(product.trim(), 'i') },
        ],
      };
      if (require('mongoose').Types.ObjectId.isValid(product)) {
        prodQuery.$or.push({ _id: product });
      }
      if (req.user.role === ROLES.MANUFACTURER) {
        prodQuery.manufacturer = req.user._id;
      }
      const matchedProducts = await Product.find(prodQuery).select('_id');
      const matchedProductIds = matchedProducts.map(p => p._id);
      const matchedBatches = await Batch.find({ product: { $in: matchedProductIds } }).select('batchNumber _id');
      const matchedBatchNumbers = matchedBatches.map(b => b.batchNumber);
      const matchedBatchOids = matchedBatches.map(b => b._id);

      reportMatch.$and = reportMatch.$and || [];
      reportMatch.$and.push({
        $or: [
          { product: { $in: matchedProductIds } },
          { productName: new RegExp(product.trim(), 'i') },
          { batchNumber: { $in: matchedBatchNumbers } },
        ],
      });

      scanMatch.$and = scanMatch.$and || [];
      scanMatch.$and.push({
        $or: [
          { batchId: { $in: matchedBatchNumbers } },
          { batch: { $in: matchedBatchOids } },
        ],
      });
    }

    const reports = await Report.find(reportMatch);
    const suspiciousScans = await Scan.find(scanMatch);

    // 4. Aggregate by City
    const areaMap = new Map();

    const getOrCreateArea = (cityName, lat, lng, stateName) => {
      const normalized = (cityName || 'Unknown').trim().toLowerCase();
      if (!areaMap.has(normalized)) {
        const coords = resolveCoordinates(cityName, lat, lng);
        areaMap.set(normalized, {
          city: cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase(),
          state: stateName || (CITY_COORDINATES[normalized]?.state || ''),
          lat: coords.lat,
          lng: coords.lng,
          reportsCount: 0,
          suspiciousScansCount: 0,
          totalIncidents: 0,
          reportedShops: new Set(),
          recentReports: [],
        });
      }
      return areaMap.get(normalized);
    };

    // Process Reports
    for (const r of reports) {
      const area = getOrCreateArea(r.geo.city, r.geo.latitude, r.geo.longitude, r.geo.state);
      area.reportsCount += 1;
      area.totalIncidents += 1;
      if (r.shopName) area.reportedShops.add(r.shopName);
      if (area.recentReports.length < 5) {
        area.recentReports.push({
          reportId: r.reportId,
          shopName: r.shopName,
          comment: r.comment,
          date: r.createdAt,
          status: r.status,
        });
      }
    }

    // Process Suspicious Scans
    for (const s of suspiciousScans) {
      const area = getOrCreateArea(s.city, s.geo?.latitude, s.geo?.longitude);
      area.suspiciousScansCount += 1;
      area.totalIncidents += 1;
    }

    // 5. Convert to Top Areas List and Heatmap Data
    const topAreas = Array.from(areaMap.values())
      .map(a => ({
        city: a.city,
        state: a.state,
        lat: a.lat,
        lng: a.lng,
        totalIncidents: a.totalIncidents,
        reportsCount: a.reportsCount,
        suspiciousScansCount: a.suspiciousScansCount,
        riskLevel: a.totalIncidents >= 8 ? 'HIGH' : a.totalIncidents >= 3 ? 'MEDIUM' : 'LOW',
        topReportedShops: Array.from(a.reportedShops),
        recentReports: a.recentReports,
      }))
      .sort((a, b) => b.totalIncidents - a.totalIncidents);

    // Heatmap data array ready for Google Maps / Leaflet HeatLayer / Mapbox
    const heatmapData = topAreas.map(a => ({
      lat: a.lat,
      lng: a.lng,
      city: a.city,
      weight: a.totalIncidents,
      intensity: Math.min(1.0, 0.2 + a.totalIncidents * 0.1),
      reportsCount: a.reportsCount,
      suspiciousScansCount: a.suspiciousScansCount,
    }));

    return successResponse(res, {
      summary: {
        totalIncidents: reports.length + suspiciousScans.length,
        totalReports: reports.length,
        totalSuspiciousScans: suspiciousScans.length,
        highRiskCitiesCount: topAreas.filter(a => a.riskLevel === 'HIGH').length,
        citiesMonitored: topAreas.length,
      },
      heatmapData,
      topAreas,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitReport,
  getMyReports,
  getReportById,
  getAdminReports,
  reviewReport,
  getHotspots,
};
