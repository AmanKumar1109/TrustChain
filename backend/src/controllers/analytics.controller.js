const mongoose = require('mongoose');
const Product = require('../models/Product');
const Batch = require('../models/Batch');
const Unit = require('../models/Unit');
const Scan = require('../models/Scan');
const Report = require('../models/Report');
const RewardLedger = require('../models/RewardLedger');
const { successResponse, errorResponse } = require('../utils/response');
const { ROLES } = require('../constants/roles');

/**
 * @desc Get comprehensive manufacturer analytics:
 *       - Overview stats (products, active batches, total scans, fake reports, rewards distributed)
 *       - Scans over time (timeseries daily trends)
 *       - City-wise scans
 *       - Genuine / Suspicious / Fake split
 *       - Batch performance table
 *       - Date range filtering
 * @route GET /api/v1/analytics/manufacturer
 * @access Manufacturer, Admin
 */
const getManufacturerAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate, productId, batchNumber } = req.query;

    // 1. Build Date Filter
    const dateQuery = {};
    if (startDate || endDate) {
      if (startDate) dateQuery.$gte = new Date(startDate);
      if (endDate) dateQuery.$lte = new Date(endDate);
    }
    const hasDateFilter = Object.keys(dateQuery).length > 0;

    // 2. Resolve Manufacturer Scope
    const isMfg = req.user.role === ROLES.MANUFACTURER;
    const mfgId = isMfg ? req.user._id : req.query.manufacturerId || null;

    // Products query
    const prodQuery = {};
    if (mfgId) prodQuery.manufacturer = mfgId;
    if (productId) {
      if (mongoose.Types.ObjectId.isValid(productId)) {
        prodQuery._id = productId;
      } else {
        prodQuery.$or = [
          { name: new RegExp(productId.trim(), 'i') },
          { sku: new RegExp(productId.trim(), 'i') },
        ];
      }
    }
    const products = await Product.find(prodQuery);
    const productIds = products.map((p) => p._id);

    // Batches query
    const batchQuery = {};
    if (mfgId) batchQuery.manufacturer = mfgId;
    if (productIds.length > 0 && productId) {
      batchQuery.product = { $in: productIds };
    }
    if (batchNumber) {
      batchQuery.$or = [
        { batchNumber: new RegExp(batchNumber.trim(), 'i') },
        { batchId: new RegExp(batchNumber.trim(), 'i') },
      ];
    }
    const batches = await Batch.find(batchQuery);
    const batchNumbers = batches.map((b) => b.batchNumber);
    const batchOids = batches.map((b) => b._id);

    // Active & Recalled Batch Counts
    const activeBatchesCount = batches.filter(
      (b) => b.status === 'Active' && !b.isRecalled && !b.recalled
    ).length;
    const recalledBatchesCount = batches.filter(
      (b) => b.status === 'Recalled' || b.isRecalled || b.recalled
    ).length;
    const totalUnitsMinted = batches.reduce((acc, b) => acc + (b.quantity || 0), 0);

    // 3. Query Scans
    const scanMatch = {
      $or: [{ batchId: { $in: batchNumbers } }, { batch: { $in: batchOids } }],
    };
    if (hasDateFilter) {
      scanMatch.timestamp = dateQuery;
    }
    const scans = await Scan.find(scanMatch).sort({ timestamp: 1 });

    // 4. Query Fake Reports
    const reportMatch = {
      $or: [
        ...(mfgId ? [{ manufacturer: mfgId }] : []),
        { batchNumber: { $in: batchNumbers } },
        { batch: { $in: batchOids } },
      ],
    };
    if (hasDateFilter) {
      reportMatch.createdAt = dateQuery;
    }
    const reports = await Report.find(reportMatch);

    // 5. Query Rewards Distributed
    const mfgUnits = await Unit.find({ batch: { $in: batchOids } }).distinct('_id');
    const rewardMatch = {
      points: { $gt: 0 },
      $or: [
        { 'metadata.batchNumber': { $in: batchNumbers } },
        { unit: { $in: mfgUnits } },
      ],
    };
    if (hasDateFilter) {
      rewardMatch.createdAt = dateQuery;
    }
    const rewards = await RewardLedger.find(rewardMatch);
    const totalRewardsDistributed = rewards.reduce((sum, r) => sum + (r.points || 0), 0);

    // 6. Overview Stats
    const overview = {
      totalProducts: products.length,
      totalBatches: batches.length,
      activeBatches: activeBatchesCount,
      recalledBatches: recalledBatchesCount,
      totalUnitsMinted,
      totalScans: scans.length,
      totalFakeReports: reports.length,
      rewardsDistributed: totalRewardsDistributed,
    };

    // 7. Scans Over Time (Daily Timeseries Aggregation)
    const timeMap = new Map();
    for (const s of scans) {
      const day = s.timestamp ? s.timestamp.toISOString().split('T')[0] : 'Unknown';
      if (!timeMap.has(day)) {
        timeMap.set(day, { date: day, totalScans: 0, genuine: 0, suspicious: 0, fake: 0 });
      }
      const entry = timeMap.get(day);
      entry.totalScans += 1;
      const resNorm = (s.result || '').toLowerCase();
      if (resNorm === 'genuine' || resNorm === 'soldawaitingclaim') {
        entry.genuine += 1;
      } else if (resNorm === 'suspicious') {
        entry.suspicious += 1;
      } else {
        entry.fake += 1;
      }
    }
    const scansOverTime = Array.from(timeMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    // 8. City-Wise Scans Breakdown
    const cityMap = new Map();
    for (const s of scans) {
      const city = s.city && s.city.trim() ? s.city.trim() : 'Unknown';
      if (!cityMap.has(city)) {
        cityMap.set(city, { city, scansCount: 0, genuineCount: 0, suspiciousCount: 0 });
      }
      const entry = cityMap.get(city);
      entry.scansCount += 1;
      const resNorm = (s.result || '').toLowerCase();
      if (resNorm === 'genuine' || resNorm === 'soldawaitingclaim') {
        entry.genuineCount += 1;
      } else {
        entry.suspiciousCount += 1;
      }
    }
    const cityWiseScans = Array.from(cityMap.values())
      .map((c) => ({
        ...c,
        percentage:
          scans.length > 0 ? ((c.scansCount / scans.length) * 100).toFixed(1) + '%' : '0%',
      }))
      .sort((a, b) => b.scansCount - a.scansCount);

    // 9. Genuine / Suspicious / Fake Split
    let genuineCount = 0;
    let suspiciousCount = 0;
    let fakeCount = 0;
    let recalledCount = 0;
    let soldAwaitingClaimCount = 0;
    let otherCount = 0;

    for (const s of scans) {
      const resNorm = (s.result || '').toLowerCase();
      if (resNorm === 'genuine') genuineCount += 1;
      else if (resNorm === 'suspicious') suspiciousCount += 1;
      else if (['fake', 'notfound', 'invalid'].includes(resNorm)) fakeCount += 1;
      else if (resNorm === 'recalled') recalledCount += 1;
      else if (resNorm === 'soldawaitingclaim') soldAwaitingClaimCount += 1;
      else otherCount += 1;
    }

    const calcPct = (count) =>
      scans.length > 0 ? ((count / scans.length) * 100).toFixed(1) + '%' : '0%';

    const resultSplit = {
      total: scans.length,
      genuine: { count: genuineCount, percentage: calcPct(genuineCount) },
      suspicious: { count: suspiciousCount, percentage: calcPct(suspiciousCount) },
      fake: { count: fakeCount, percentage: calcPct(fakeCount) },
      recalled: { count: recalledCount, percentage: calcPct(recalledCount) },
      soldAwaitingClaim: {
        count: soldAwaitingClaimCount,
        percentage: calcPct(soldAwaitingClaimCount),
      },
      other: { count: otherCount, percentage: calcPct(otherCount) },
    };

    // 10. Batch Performance Table
    const batchPerformance = batches.map((b) => {
      const batchScans = scans.filter(
        (s) => s.batchId === b.batchNumber || (s.batch && s.batch.equals(b._id))
      );
      const bReports = reports.filter(
        (r) => r.batchNumber === b.batchNumber || (r.batch && r.batch.equals(b._id))
      );
      const bGenuine = batchScans.filter((s) => (s.result || '').toLowerCase() === 'genuine').length;
      const bSuspicious = batchScans.filter((s) =>
        ['suspicious', 'fake', 'invalid'].includes((s.result || '').toLowerCase())
      ).length;

      const isRecalled = b.status === 'Recalled' || b.isRecalled || b.recalled;
      let riskStatus = 'NORMAL';
      if (isRecalled) riskStatus = 'RECALLED';
      else if (bSuspicious >= 5 || bReports.length >= 3) riskStatus = 'HIGH_RISK';
      else if (bSuspicious > 0 || bReports.length > 0) riskStatus = 'ELEVATED';

      return {
        id: b._id,
        batchNumber: b.batchNumber,
        batchId: b.batchId,
        productName: b.productName,
        brandName: b.brandName,
        quantity: b.quantity,
        protectionLevel: b.protectionLevel,
        mfgDate: b.mfgDate,
        expiryDate: b.expiryDate,
        status: b.status,
        totalScans: batchScans.length,
        genuineScans: bGenuine,
        suspiciousScans: bSuspicious,
        fakeReportsCount: bReports.length,
        verificationRate:
          batchScans.length > 0
            ? ((bGenuine / batchScans.length) * 100).toFixed(1) + '%'
            : '100%',
        riskStatus,
      };
    });

    // Sort batches by total scans descending
    batchPerformance.sort((a, b) => b.totalScans - a.totalScans);

    return successResponse(res, {
      dateRange: {
        startDate: startDate || null,
        endDate: endDate || null,
      },
      overview,
      scansOverTime,
      cityWiseScans,
      resultSplit,
      batchPerformance,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getManufacturerAnalytics,
};
