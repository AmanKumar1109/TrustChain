const mongoose = require('mongoose');
const User = require('../models/User');
const Brand = require('../models/Brand');
const Product = require('../models/Product');
const Batch = require('../models/Batch');
const Unit = require('../models/Unit');
const Scan = require('../models/Scan');
const Report = require('../models/Report');
const RewardOffer = require('../models/RewardOffer');
const RewardLedger = require('../models/RewardLedger');
const Redemption = require('../models/Redemption');
const CreditLedger = require('../models/CreditLedger');
const Invoice = require('../models/Invoice');
const Transaction = require('../models/Transaction');
const contractService = require('../services/contract.service');
const transactionService = require('../services/transaction.service');
const listenerService = require('../services/listener.service');
const blockchainService = require('../services/blockchain.service');
const config = require('../config/env');
const { ethers } = require('ethers');
const { successResponse, errorResponse } = require('../utils/response');
const { ROLES } = require('../constants/roles');

// =============================================================================
// 1. USER MANAGEMENT (SEARCH, SUSPEND & ACTIVATE)
// =============================================================================

/**
 * @desc Get users list with multi-field search, role & status filtering, pagination
 * @route GET /api/v1/admin/users
 * @access Admin
 */
const getUsers = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 15 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 15));
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (role && Object.values(ROLES).includes(role.toLowerCase())) {
      query.role = role.toLowerCase();
    }

    if (status && ['ACTIVE', 'SUSPENDED'].includes(status.toUpperCase())) {
      query.status = status.toUpperCase();
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { companyName: searchRegex },
        { walletAddress: searchRegex },
      ];
    }

    const [users, total, activeCount, suspendedCount] = await Promise.all([
      User.find(query)
        .select('-password -encryptedPrivateKey -__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(query),
      User.countDocuments({ status: 'ACTIVE' }),
      User.countDocuments({ status: 'SUSPENDED' }),
    ]);

    return successResponse(res, {
      total,
      activeCount,
      suspendedCount,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
      users,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Suspend a user account with mandatory reason
 * @route PATCH /api/v1/admin/users/:userId/suspend
 * @access Admin
 */
const suspendUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 'User not found.', 404, 'USER_NOT_FOUND');
    }

    // Safety check: Cannot suspend oneself or another super admin
    if (user._id.toString() === req.user._id.toString()) {
      return errorResponse(res, 'You cannot suspend your own admin account.', 400, 'SELF_SUSPENSION_BLOCKED');
    }

    if (user.role === ROLES.ADMIN) {
      return errorResponse(res, 'Super Administrator accounts cannot be suspended.', 403, 'ADMIN_SUSPENSION_BLOCKED');
    }

    user.status = 'SUSPENDED';
    user.suspension = {
      suspendedAt: new Date(),
      suspendedBy: req.user._id,
      reason: reason || 'Administrative compliance suspension',
    };
    await user.save();

    console.log(`\n🚫 [ADMIN ACTION] User "${user.name}" (${user.email || user.phone}) suspended by Admin.`);
    console.log(`   Reason: "${user.suspension.reason}"\n`);

    return successResponse(res, {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      suspension: user.suspension,
      message: `User "${user.name}" has been suspended successfully.`,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Reactivate a suspended user account
 * @route PATCH /api/v1/admin/users/:userId/activate
 * @access Admin
 */
const activateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 'User not found.', 404, 'USER_NOT_FOUND');
    }

    user.status = 'ACTIVE';
    user.suspension = {
      suspendedAt: null,
      suspendedBy: null,
      reason: null,
    };
    await user.save();

    console.log(`\n✅ [ADMIN ACTION] User "${user.name}" (${user.email || user.phone}) reactivated.`);

    return successResponse(res, {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      message: `User "${user.name}" has been reactivated successfully.`,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Verify and authorize a user on-chain (Manufacturer or Partner)
 * @route PATCH /api/v1/admin/users/:userId/verify
 * @access Admin
 */
const verifyUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return errorResponse(res, 'User not found.', 404, 'USER_NOT_FOUND');
    }

    user.isVerified = true;
    await user.save();

    if (user.role === ROLES.MANUFACTURER && user.walletAddress) {
      await blockchainService.ensureManufacturerAuthorized(user.walletAddress);
    } else if ([ROLES.DISTRIBUTOR, ROLES.RETAILER].includes(user.role) && user.walletAddress) {
      await blockchainService.ensurePartnerAuthorized(user.walletAddress);
    }

    return successResponse(res, {
      userId: user._id,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
      walletAddress: user.walletAddress,
      message: `User ${user.name} approved and authorized on TrustChain.`,
    });
  } catch (err) {
    next(err);
  }
};

// =============================================================================
// 2. BRAND MANAGEMENT (SEARCH, SUSPEND & ACTIVATE)
// =============================================================================

/**
 * @desc List brands with multi-field search and status filtering
 * @route GET /api/v1/admin/brands
 * @access Admin
 */
const getBrands = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 15 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 15));
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (status && ['pending', 'approved', 'rejected', 'infoRequested', 'suspended'].includes(status.toLowerCase())) {
      query.status = status.toLowerCase();
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { companyName: searchRegex },
        { gst: searchRegex },
        { cin: searchRegex },
      ];
    }

    const [brands, total, statusCounts] = await Promise.all([
      Brand.find(query)
        .populate('manufacturer', 'name email phone walletAddress companyName status isVerified')
        .populate('approvedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Brand.countDocuments(query),
      Brand.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const counts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      infoRequested: 0,
      suspended: 0,
    };
    statusCounts.forEach((s) => {
      if (counts[s._id] !== undefined) counts[s._id] = s.count;
    });

    return successResponse(res, {
      total,
      statusCounts: counts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
      brands,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Suspend a manufacturer brand
 * @route PATCH /api/v1/admin/brands/:id/suspend
 * @access Admin
 */
const suspendBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const brand = await Brand.findById(id).populate('manufacturer');
    if (!brand) {
      return errorResponse(res, 'Brand record not found.', 404, 'BRAND_NOT_FOUND');
    }

    brand.status = 'suspended';
    brand.suspensionReason = reason || 'Regulatory compliance review suspension';
    brand.suspendedAt = new Date();
    await brand.save();

    if (brand.manufacturer) {
      brand.manufacturer.brandStatus = 'suspended';
      await brand.manufacturer.save();
    }

    console.log(`\n🚫 [ADMIN ACTION] Brand "${brand.companyName}" suspended. Reason: "${brand.suspensionReason}"`);

    return successResponse(res, {
      brandId: brand._id,
      companyName: brand.companyName,
      status: brand.status,
      suspensionReason: brand.suspensionReason,
      suspendedAt: brand.suspendedAt,
      message: `Brand "${brand.companyName}" has been suspended.`,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Reactivate a suspended brand
 * @route PATCH /api/v1/admin/brands/:id/activate
 * @access Admin
 */
const activateBrand = async (req, res, next) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findById(id).populate('manufacturer');
    if (!brand) {
      return errorResponse(res, 'Brand record not found.', 404, 'BRAND_NOT_FOUND');
    }

    brand.status = 'approved';
    brand.suspensionReason = null;
    brand.suspendedAt = null;
    await brand.save();

    if (brand.manufacturer) {
      brand.manufacturer.brandStatus = 'approved';
      await brand.manufacturer.save();
    }

    console.log(`\n✅ [ADMIN ACTION] Brand "${brand.companyName}" reactivated to approved status.`);

    return successResponse(res, {
      brandId: brand._id,
      companyName: brand.companyName,
      status: brand.status,
      message: `Brand "${brand.companyName}" has been reactivated to approved status.`,
    });
  } catch (err) {
    next(err);
  }
};

// =============================================================================
// 3. REWARD PARTNERS & OFFERS CRUD
// =============================================================================

/**
 * @desc List reward offers with search, category filtering & pagination
 * @route GET /api/v1/admin/rewards/offers
 * @access Admin
 */
const getAdminRewardOffers = async (req, res, next) => {
  try {
    const { search, category, isActive, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { partner: searchRegex }, { description: searchRegex }];
    }

    const [offers, total] = await Promise.all([
      RewardOffer.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      RewardOffer.countDocuments(query),
    ]);

    return successResponse(res, {
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
      offers,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Create new reward offer
 * @route POST /api/v1/admin/rewards/offers
 * @access Admin
 */
const createRewardOffer = async (req, res, next) => {
  try {
    const offer = await RewardOffer.create(req.body);
    return successResponse(res, { offer, message: 'Reward offer created successfully.' }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get single reward offer by ID
 * @route GET /api/v1/admin/rewards/offers/:id
 * @access Admin
 */
const getRewardOfferById = async (req, res, next) => {
  try {
    const offer = await RewardOffer.findById(req.params.id);
    if (!offer) {
      return errorResponse(res, 'Reward offer not found.', 404, 'OFFER_NOT_FOUND');
    }
    return successResponse(res, { offer });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Update existing reward offer
 * @route PATCH /api/v1/admin/rewards/offers/:id
 * @access Admin
 */
const updateRewardOffer = async (req, res, next) => {
  try {
    const offer = await RewardOffer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!offer) {
      return errorResponse(res, 'Reward offer not found.', 404, 'OFFER_NOT_FOUND');
    }
    return successResponse(res, { offer, message: 'Reward offer updated successfully.' });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Delete reward offer
 * @route DELETE /api/v1/admin/rewards/offers/:id
 * @access Admin
 */
const deleteRewardOffer = async (req, res, next) => {
  try {
    const offer = await RewardOffer.findByIdAndDelete(req.params.id);
    if (!offer) {
      return errorResponse(res, 'Reward offer not found.', 404, 'OFFER_NOT_FOUND');
    }
    return successResponse(res, { message: `Reward offer "${offer.title}" deleted successfully.` });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Toggle active status of reward offer
 * @route PATCH /api/v1/admin/rewards/offers/:id/toggle
 * @access Admin
 */
const toggleRewardOfferStatus = async (req, res, next) => {
  try {
    const offer = await RewardOffer.findById(req.params.id);
    if (!offer) {
      return errorResponse(res, 'Reward offer not found.', 404, 'OFFER_NOT_FOUND');
    }
    offer.isActive = !offer.isActive;
    await offer.save();
    return successResponse(res, {
      offer,
      message: `Reward offer is now ${offer.isActive ? 'Active' : 'Inactive'}.`,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get list of reward partners with offer counts
 * @route GET /api/v1/admin/rewards/partners
 * @access Admin
 */
const getRewardPartners = async (req, res, next) => {
  try {
    const partners = await RewardOffer.aggregate([
      {
        $group: {
          _id: '$partner',
          totalOffers: { $sum: 1 },
          activeOffers: { $sum: { $cond: ['$isActive', 1, 0] } },
          categories: { $addToSet: '$category' },
        },
      },
      { $sort: { totalOffers: -1 } },
    ]);

    return successResponse(res, {
      total: partners.length,
      partners: partners.map((p) => ({
        partnerName: p._id,
        totalOffers: p.totalOffers,
        activeOffers: p.activeOffers,
        categories: p.categories,
      })),
    });
  } catch (err) {
    next(err);
  }
};

// =============================================================================
// 4. PLATFORM-WIDE COMPREHENSIVE ANALYTICS
// =============================================================================

/**
 * @desc Platform-wide analytics across all manufacturers, users, scans, reports, financials
 * @route GET /api/v1/admin/analytics
 * @access Admin
 */
const getPlatformAnalytics = async (req, res, next) => {
  try {
    const [
      // 1. User counts by role
      usersByRole,
      totalUsers,
      activeUsers,
      suspendedUsers,
      // 2. Brand counts by status
      brandsByStatus,
      totalBrands,
      // 3. Batches & Products
      totalProducts,
      totalBatches,
      activeBatches,
      recalledBatches,
      totalUnits,
      // 4. Scans breakdown
      scansResultAgg,
      totalScans,
      // 5. Reports breakdown
      reportsStatusAgg,
      totalReports,
      // 6. Financials
      invoicesAgg,
      creditLedgerAgg,
      totalInvoices,
      // 7. Rewards
      rewardLedgerAgg,
      totalRedemptions,
      totalRewardOffers,
    ] = await Promise.all([
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
      User.countDocuments(),
      User.countDocuments({ status: 'ACTIVE' }),
      User.countDocuments({ status: 'SUSPENDED' }),

      Brand.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Brand.countDocuments(),

      Product.countDocuments(),
      Batch.countDocuments(),
      Batch.countDocuments({ status: 'Active', isRecalled: { $ne: true } }),
      Batch.countDocuments({ $or: [{ status: 'Recalled' }, { isRecalled: true }] }),
      Unit.countDocuments(),

      Scan.aggregate([{ $group: { _id: { $toLower: '$result' }, count: { $sum: 1 } } }]),
      Scan.countDocuments(),

      Report.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Report.countDocuments(),

      Invoice.aggregate([
        { $match: { status: 'PAID' } },
        {
          $group: {
            _id: null,
            totalRevenueINR: { $sum: '$totalAmountINR' },
            totalSubtotalINR: { $sum: '$subtotalINR' },
            totalGSTCollectedINR: { $sum: '$gstAmountINR' },
            totalCreditsIssued: { $sum: '$creditsPurchased' },
          },
        },
      ]),
      CreditLedger.aggregate([
        {
          $group: {
            _id: '$type',
            totalINR: { $sum: '$amountINR' },
            totalCredits: { $sum: '$credits' },
          },
        },
      ]),
      Invoice.countDocuments(),

      RewardLedger.aggregate([
        { $group: { _id: null, totalPointsMinted: { $sum: '$points' } } },
      ]),
      Redemption.countDocuments(),
      RewardOffer.countDocuments(),
    ]);

    // Format Users Role Breakdown
    const usersMap = {
      manufacturer: 0,
      distributor: 0,
      retailer: 0,
      consumer: 0,
      admin: 0,
    };
    usersByRole.forEach((u) => {
      if (usersMap[u._id] !== undefined) usersMap[u._id] = u.count;
    });

    // Format Brands Breakdown
    const brandsMap = {
      approved: 0,
      pending: 0,
      rejected: 0,
      infoRequested: 0,
      suspended: 0,
    };
    brandsByStatus.forEach((b) => {
      if (brandsMap[b._id] !== undefined) brandsMap[b._id] = b.count;
    });

    // Format Scans Breakdown
    const scanMap = {
      genuine: 0,
      suspicious: 0,
      fake: 0,
      recalled: 0,
      soldawaitingclaim: 0,
    };
    scansResultAgg.forEach((s) => {
      if (scanMap[s._id] !== undefined) scanMap[s._id] = s.count;
    });

    // Format Reports Breakdown
    const reportMap = {
      Submitted: 0,
      UnderReview: 0,
      Valid: 0,
      Invalid: 0,
    };
    reportsStatusAgg.forEach((r) => {
      if (reportMap[r._id] !== undefined) reportMap[r._id] = r.count;
    });

    // Financial Metrics
    const invData = invoicesAgg[0] || {
      totalRevenueINR: 0,
      totalSubtotalINR: 0,
      totalGSTCollectedINR: 0,
      totalCreditsIssued: 0,
    };

    const topupLedger = creditLedgerAgg.find((c) => c._id === 'TOPUP') || { totalCredits: 0 };
    const deductionLedger = creditLedgerAgg.find((c) => c._id === 'DEDUCTION') || { totalCredits: 0 };

    // Total active credit balance currently held by manufacturers
    const mfgBalances = await User.aggregate([
      { $match: { role: 'manufacturer' } },
      { $group: { _id: null, activePool: { $sum: '$creditBalance' } } },
    ]);
    const activeManufacturerCreditsPool = mfgBalances[0]?.activePool || 0;

    return successResponse(res, {
      users: {
        total: totalUsers,
        active: activeUsers,
        suspended: suspendedUsers,
        breakdown: usersMap,
      },
      brands: {
        total: totalBrands,
        breakdown: brandsMap,
      },
      productsAndBatches: {
        totalProducts,
        totalBatches,
        activeBatches,
        recalledBatches,
        totalUnitsSerialized: totalUnits,
        recallRate: totalBatches > 0 ? ((recalledBatches / totalBatches) * 100).toFixed(1) + '%' : '0%',
      },
      scans: {
        total: totalScans,
        breakdown: scanMap,
        cloneAnomalyRate:
          totalScans > 0 ? (((scanMap.suspicious + scanMap.fake) / totalScans) * 100).toFixed(1) + '%' : '0%',
      },
      reports: {
        total: totalReports,
        breakdown: reportMap,
        resolutionRate:
          totalReports > 0
            ? (((reportMap.Valid + reportMap.Invalid) / totalReports) * 100).toFixed(1) + '%'
            : '100%',
      },
      financials: {
        currency: 'INR',
        totalInvoices,
        totalRevenueINR: invData.totalRevenueINR,
        totalSubtotalINR: invData.totalSubtotalINR,
        totalGSTCollectedINR: invData.totalGSTCollectedINR,
        totalCreditsPurchased: topupLedger.totalCredits,
        totalCreditsConsumed: deductionLedger.totalCredits,
        activeManufacturerCreditsPool,
      },
      loyaltyAndRewards: {
        totalPointsMinted: rewardLedgerAgg[0]?.totalPointsMinted || 0,
        totalRedemptions,
        totalRewardOffers,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get basic quick stats (legacy compatibility)
 * @route GET /api/v1/admin/stats
 * @access Admin
 */
const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalBatches, totalUnits, totalRecalls, totalScans] = await Promise.all([
      User.countDocuments(),
      Batch.countDocuments(),
      Unit.countDocuments(),
      Batch.countDocuments({ $or: [{ isRecalled: true }, { status: 'Recalled' }] }),
      Scan.countDocuments(),
    ]);

    return successResponse(res, {
      totalUsers,
      totalBatches,
      totalUnits,
      totalRecalls,
      totalScans,
    });
  } catch (err) {
    next(err);
  }
};

// =============================================================================
// 5. SYSTEM HEALTH, TRANSACTION QUEUE & EVENT LISTENER
// =============================================================================

/**
 * @desc Admin System Health & Infrastructure Diagnostics:
 *       - Relayer wallet balance displayed as "network credits balance" + low balance flag (< 0.5 ETH)
 *       - Pending and Failed Transactions queue list
 *       - Service status for MongoDB, JSON-RPC, and Smart Contract Event Listener
 * @route GET /api/v1/admin/health
 * @access Admin
 */
const getAdminSystemHealth = async (req, res, next) => {
  try {
    // 1. Database Health Check & Latency
    const dbStartTime = Date.now();
    const dbState = mongoose.connection.readyState;
    let dbStatus = dbState === 1 ? 'UP' : 'DOWN';
    let dbPingMs = 0;
    try {
      if (mongoose.connection.db) {
        await mongoose.connection.db.admin().ping();
      }
      dbPingMs = Date.now() - dbStartTime;
    } catch (dbErr) {
      dbStatus = dbState === 1 ? 'UP' : 'DOWN';
      dbPingMs = Date.now() - dbStartTime;
    }

    // 2. RPC Provider Health & Latency
    const provider = contractService.getProvider();
    const relayer = contractService.getRelayerWallet();
    let rpcStatus = 'DOWN';
    let rpcLatencyMs = null;
    let blockNumber = null;
    let chainId = null;
    let balanceETH = 0;
    let isLowBalance = false;
    let relayerAddress = relayer?.address || 'UNCONFIGURED';

    if (provider && relayer) {
      const rpcStartTime = Date.now();
      try {
        const [block, network, balWei] = await Promise.all([
          provider.getBlockNumber(),
          provider.getNetwork(),
          provider.getBalance(relayer.address),
        ]);
        rpcLatencyMs = Date.now() - rpcStartTime;
        blockNumber = block;
        chainId = network.chainId.toString();
        rpcStatus = 'UP';
        balanceETH = Number(ethers.formatEther(balWei));
        isLowBalance = balanceETH < 0.5;
      } catch (rpcErr) {
        rpcStatus = 'DOWN';
      }
    }

    // Convert ETH into Network Gas Credits (1 ETH = 1,000,000 Network Credits)
    const networkCreditsBalance = Math.round(balanceETH * 1000000);
    const lowBalanceWarning = isLowBalance
      ? 'CRITICAL ALERT: Relayer wallet balance is below the 0.5 ETH safety threshold. Fund the relayer wallet to avoid transaction rejections!'
      : null;

    // 3. Listener Status
    const listenerStatus = listenerService.getStatus();

    // 4. Pending & Failed Transactions Queue
    const [pendingTxs, failedTxs, pendingCount, failedCount, confirmedCount] = await Promise.all([
      Transaction.find({ status: 'pending' }).sort({ createdAt: -1 }).limit(20),
      Transaction.find({ status: 'failed' }).sort({ updatedAt: -1 }).limit(20),
      Transaction.countDocuments({ status: 'pending' }),
      Transaction.countDocuments({ status: 'failed' }),
      Transaction.countDocuments({ status: 'confirmed' }),
    ]);

    return successResponse(res, {
      systemStatus: dbStatus === 'UP' && rpcStatus === 'UP' ? 'HEALTHY' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      // Relayer & Network Gas Credits
      relayerWallet: {
        address: relayerAddress,
        balanceETH: Number(balanceETH.toFixed(4)),
        networkCreditsBalance,
        formattedCredits: `${Number(balanceETH.toFixed(4))} ETH (${networkCreditsBalance.toLocaleString()} Network Gas Credits)`,
        isLowBalance,
        lowBalanceThresholdETH: 0.5,
        lowBalanceWarning,
      },
      // Services Status (DB, RPC, Listener)
      services: {
        database: {
          name: 'MongoDB',
          status: dbStatus,
          host: mongoose.connection.host || '127.0.0.1',
          dbName: mongoose.connection.name || 'trustchain',
          pingMs: dbPingMs,
        },
        rpc: {
          name: 'Ethereum EVM Node',
          status: rpcStatus,
          rpcUrl: config.rpcUrl,
          chainId,
          blockNumber,
          latencyMs: rpcLatencyMs,
        },
        listener: {
          name: 'Smart Contract Event Listener & Reconciler',
          ...listenerStatus,
        },
      },
      // Transactions Telemetry
      transactionsQueue: {
        pendingCount,
        failedCount,
        confirmedCount,
        totalTracked: pendingCount + failedCount + confirmedCount,
        pending: pendingTxs,
        failed: failedTxs,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Retry a specific failed on-chain transaction
 * @route POST /api/v1/admin/transactions/:id/retry
 * @access Admin
 */
const retryFailedTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await transactionService.retryTransactionById(id);

    return successResponse(res, {
      message: `Transaction ${id} retried successfully on-chain!`,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Retry all failed transactions in the queue
 * @route POST /api/v1/admin/transactions/retry-all
 * @access Admin
 */
const retryAllFailedTransactions = async (req, res, next) => {
  try {
    const results = await transactionService.retryFailedTransactions();
    return successResponse(res, {
      message: `Retry sweep completed: ${results.succeeded} succeeded, ${results.failed} failed out of ${results.retried} retried.`,
      ...results,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get on-chain event listener status & reconciliation telemetry
 * @route GET /api/v1/admin/listener
 * @access Admin
 */
const getListenerTelemetry = async (req, res, next) => {
  try {
    const status = listenerService.getStatus();
    return successResponse(res, { listener: status });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Trigger manual on-demand block reconciliation scan
 * @route POST /api/v1/admin/listener/reconcile
 * @access Admin
 */
const reconcileOnChainEvents = async (req, res, next) => {
  try {
    await listenerService.scanRecentBlocks();
    const status = listenerService.getStatus();
    return successResponse(res, {
      message: 'On-chain reconciliation sweep completed successfully.',
      listener: status,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  suspendUser,
  activateUser,
  verifyUser,
  getBrands,
  suspendBrand,
  activateBrand,
  getAdminRewardOffers,
  createRewardOffer,
  getRewardOfferById,
  updateRewardOffer,
  deleteRewardOffer,
  toggleRewardOfferStatus,
  getRewardPartners,
  getPlatformAnalytics,
  getStats,
  getAdminSystemHealth,
  retryFailedTransaction,
  retryAllFailedTransactions,
  getListenerTelemetry,
  reconcileOnChainEvents,
};
