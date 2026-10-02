const RewardLedger = require('../models/RewardLedger');
const RewardOffer = require('../models/RewardOffer');
const Redemption = require('../models/Redemption');
const RewardCampaign = require('../models/RewardCampaign');
const User = require('../models/User');
const rewardService = require('../services/reward.service');
const blockchainService = require('../services/blockchain.service');
const { successResponse, errorResponse } = require('../utils/response');
const { ROLES } = require('../constants/roles');
const config = require('../config/env');

/**
 * @desc Get consumer's current TPTS balance and on-chain status
 * @route GET /api/v1/rewards/balance
 * @access Consumer, Admin
 */
const getBalance = async (req, res, next) => {
  try {
    const user = req.user;
    let onChainBalance = 0;

    if (user.walletAddress) {
      onChainBalance = await blockchainService.getPointsBalance(user.walletAddress);
    }

    return successResponse(res, {
      pointsBalance: user.pointsBalance || 0,
      onChainBalance,
      walletAddress: user.walletAddress,
      referralCode: user.referralCode,
      scanStreak: user.scanStreak || { currentStreak: 0, longestStreak: 0 },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get points ledger history (credits, debits, streak bonuses, redemptions)
 * @route GET /api/v1/rewards/history
 * @access Consumer, Admin
 */
const getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const type = req.query.type;

    const query = { user: req.user._id };
    if (type) {
      query.type = type;
    }

    const total = await RewardLedger.countDocuments(query);
    const history = await RewardLedger.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return successResponse(res, {
      total,
      page,
      limit,
      history,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get user's daily scan streak details and milestone targets
 * @route GET /api/v1/rewards/streak
 * @access Consumer, Admin
 */
const getStreak = async (req, res, next) => {
  try {
    const user = req.user;
    const campaign = await rewardService.getCampaignSettings();
    const streak = user.scanStreak || { currentStreak: 0, lastScanDate: null, longestStreak: 0 };

    const threshold = campaign.streakDaysThreshold || 5;
    const currentStreak = streak.currentStreak || 0;
    const daysUntilMilestone = currentStreak === 0 ? threshold : threshold - (currentStreak % threshold);

    return successResponse(res, {
      currentStreak,
      longestStreak: streak.longestStreak || 0,
      lastScanDate: streak.lastScanDate,
      streakMilestoneTarget: threshold,
      daysUntilMilestone: daysUntilMilestone === 0 ? threshold : daysUntilMilestone,
      streakBonusPoints: campaign.streakBonus || 25,
      isStreakActive: streak.lastScanDate ? (Date.now() - new Date(streak.lastScanDate).getTime()) < 48 * 60 * 60 * 1000 : false,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get user's referral code and referral stats
 * @route GET /api/v1/rewards/referral
 * @access Consumer, Admin
 */
const getReferralInfo = async (req, res, next) => {
  try {
    const user = req.user;
    const campaign = await rewardService.getCampaignSettings();

    const referredUsers = await User.find({ referredBy: user._id }).select('name phone createdAt');

    return successResponse(res, {
      referralCode: user.referralCode,
      referralLink: `${config.frontendUrl}/register?ref=${user.referralCode}`,
      referralBonus: campaign.referralBonus || 50,
      totalReferred: referredUsers.length,
      totalEarnedFromReferrals: referredUsers.length * (campaign.referralBonus || 50),
      referredUsers,
      hasAppliedReferral: !!user.referredBy,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Apply a friend's referral code to receive bonus points
 * @route POST /api/v1/rewards/referral/apply
 * @access Consumer, Admin
 */
const applyReferral = async (req, res, next) => {
  try {
    const { code } = req.body;
    const result = await rewardService.applyReferralCode(req.user, code);
    return successResponse(res, result);
  } catch (err) {
    return errorResponse(res, err.message, 400, 'REFERRAL_ERROR');
  }
};

/**
 * @desc Get Rewards Store catalogue of redeemable offers
 * @route GET /api/v1/rewards/store
 * @access Public / Authenticated
 */
const getRewardsStore = async (req, res, next) => {
  try {
    // Seed initial offers if store is empty
    await rewardService.seedInitialOffers();

    const category = req.query.category;
    const query = { isActive: true };
    if (category) {
      query.category = category;
    }

    const offers = await RewardOffer.find(query).sort({ pointsRequired: 1 });

    return successResponse(res, {
      count: offers.length,
      offers,
      userBalance: req.user ? req.user.pointsBalance || 0 : null,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Redeem points for a reward offer (burns on-chain & generates coupon code)
 * @route POST /api/v1/rewards/redeem
 * @access Consumer, Admin
 */
const redeemReward = async (req, res, next) => {
  try {
    const { offerId } = req.body;
    if (!offerId) {
      return errorResponse(res, 'Offer ID is required for redemption.', 400, 'OFFER_ID_REQUIRED');
    }

    const result = await rewardService.redeemOffer(req.user, offerId);
    return successResponse(res, {
      redemptionId: result.redemption.redemptionId,
      couponCode: result.couponCode,
      pointsSpent: result.pointsSpent,
      remainingBalance: result.remainingBalance,
      txHash: result.txHash,
      terms: result.redemption.terms,
      expiresAt: result.redemption.expiresAt,
      message: `Successfully redeemed offer! Your coupon code is: ${result.couponCode}`,
    }, 201);
  } catch (err) {
    return errorResponse(res, err.message, 400, 'REDEMPTION_FAILED');
  }
};

/**
 * @desc Get user's redemption coupons history
 * @route GET /api/v1/rewards/redemptions
 * @access Consumer, Admin
 */
const getMyRedemptions = async (req, res, next) => {
  try {
    const redemptions = await Redemption.find({ user: req.user._id })
      .populate('offer', 'title category image partner')
      .sort({ createdAt: -1 });

    return successResponse(res, {
      count: redemptions.length,
      redemptions,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Manufacturer sets campaign values (points per scan, streak bonus, referral bonus, fake-report bonus)
 * @route POST /api/v1/rewards/campaign
 * @access Manufacturer, Admin
 */
const setCampaignValues = async (req, res, next) => {
  try {
    const {
      pointsPerScan,
      streakBonus,
      streakDaysThreshold,
      referralBonus,
      fakeReportBonus,
      dailyCap,
    } = req.body;

    const manufacturerId = req.user._id;

    let campaign = await RewardCampaign.findOne({ manufacturer: manufacturerId });
    if (!campaign) {
      campaign = new RewardCampaign({
        manufacturer: manufacturerId,
      });
    }

    if (pointsPerScan !== undefined) campaign.pointsPerScan = parseInt(pointsPerScan, 10);
    if (streakBonus !== undefined) campaign.streakBonus = parseInt(streakBonus, 10);
    if (streakDaysThreshold !== undefined) campaign.streakDaysThreshold = parseInt(streakDaysThreshold, 10);
    if (referralBonus !== undefined) campaign.referralBonus = parseInt(referralBonus, 10);
    if (fakeReportBonus !== undefined) campaign.fakeReportBonus = parseInt(fakeReportBonus, 10);
    if (dailyCap !== undefined) campaign.dailyCap = parseInt(dailyCap, 10);
    campaign.isActive = true;

    await campaign.save();

    return successResponse(res, {
      campaign,
      message: 'Reward campaign rules updated successfully.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get active campaign values
 * @route GET /api/v1/rewards/campaign
 * @access Authenticated
 */
const getCampaignValues = async (req, res, next) => {
  try {
    const manufacturerId = req.user.role === ROLES.MANUFACTURER ? req.user._id : null;
    const campaign = await rewardService.getCampaignSettings(manufacturerId);

    return successResponse(res, {
      campaign,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBalance,
  getHistory,
  getStreak,
  getReferralInfo,
  applyReferral,
  getRewardsStore,
  redeemReward,
  getMyRedemptions,
  setCampaignValues,
  getCampaignValues,
};
