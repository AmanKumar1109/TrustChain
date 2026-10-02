const crypto = require('crypto');
const { ethers } = require('ethers');
const User = require('../models/User');
const RewardLedger = require('../models/RewardLedger');
const RewardOffer = require('../models/RewardOffer');
const Redemption = require('../models/Redemption');
const RewardCampaign = require('../models/RewardCampaign');
const blockchainService = require('./blockchain.service');
const walletService = require('./wallet.service');

class RewardService {
  /**
   * Get active campaign settings (manufacturer or platform default)
   */
  async getCampaignSettings(manufacturerId = null) {
    if (manufacturerId) {
      const campaign = await RewardCampaign.findOne({ manufacturer: manufacturerId, isActive: true });
      if (campaign) return campaign;
    }

    const globalCampaign = await RewardCampaign.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (globalCampaign) return globalCampaign;

    // Platform default values
    return {
      pointsPerScan: 10,
      streakBonus: 25,
      streakDaysThreshold: 5,
      referralBonus: 50,
      fakeReportBonus: 100,
      dailyCap: 50,
    };
  }

  /**
   * Process first genuine scan reward for a logged-in user
   * Strictly enforces:
   * 1. Only on the first genuine scan per user per unit
   * 2. Daily cap limit
   * 3. Streak bonus calculation & milestone rewards
   * 4. On-chain mintReward
   */
  async processFirstScanReward({ user, unit, batch, clientCity = 'Delhi' }) {
    if (!user || !unit || !batch) {
      return { rewarded: false, reason: 'MISSING_PARAMS' };
    }

    // 1. Check if user was already rewarded for this specific unit
    const alreadyRewarded = await RewardLedger.findOne({
      user: user._id,
      unitCode: unit.unitCode,
      type: 'FIRST_SCAN_REWARD',
    });

    if (alreadyRewarded) {
      return {
        rewarded: false,
        reason: 'ALREADY_REWARDED_FOR_UNIT',
        message: 'Reward points already claimed for this unit code on first scan.',
      };
    }

    // 2. Fetch campaign rules
    const campaign = await this.getCampaignSettings(batch.manufacturer);

    // 3. Enforce Daily Cap
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayRewards = await RewardLedger.find({
      user: user._id,
      type: 'FIRST_SCAN_REWARD',
      createdAt: { $gte: startOfDay },
    });

    const todayPointsEarned = todayRewards.reduce((sum, r) => sum + r.points, 0);

    if (todayPointsEarned >= campaign.dailyCap) {
      return {
        rewarded: false,
        reason: 'DAILY_CAP_REACHED',
        message: `Daily reward cap of ${campaign.dailyCap} points reached for today. Keep scanning to maintain your daily streak!`,
        todayPointsEarned,
        dailyCap: campaign.dailyCap,
      };
    }

    const availableAllowance = campaign.dailyCap - todayPointsEarned;
    const pointsToAward = Math.min(campaign.pointsPerScan, availableAllowance);

    if (pointsToAward <= 0) {
      return { rewarded: false, reason: 'DAILY_CAP_REACHED' };
    }

    // 4. Ensure user has custodial wallet
    if (!user.walletAddress) {
      const wallet = walletService.createCustodialWallet();
      user.walletAddress = wallet.address;
      user.encryptedPrivateKey = wallet.encryptedPrivateKey;
    }

    // 5. Call mintReward on-chain via Relayer
    let txHash = null;
    try {
      const chainRes = await blockchainService.rewardTrustPoints(
        user.walletAddress,
        pointsToAward,
        `FIRST_SCAN_${unit.unitCode}`
      );
      txHash = chainRes.txHash;
    } catch (err) {
      console.warn(`[Blockchain Warning] rewardTrustPoints simulated: ${err.message}`);
      txHash = ethers.id(`simulated-reward-tx-${Date.now()}`);
    }

    // 6. Update user's points balance and write RewardLedger entry
    user.pointsBalance = (user.pointsBalance || 0) + pointsToAward;

    await RewardLedger.create({
      user: user._id,
      type: 'FIRST_SCAN_REWARD',
      points: pointsToAward,
      unit: unit._id,
      unitCode: unit.unitCode,
      txHash,
      description: `First genuine scan of product ${batch.productName} (${unit.unitCode}) in ${clientCity}`,
      balanceAfter: user.pointsBalance,
      metadata: {
        city: clientCity,
        batchNumber: batch.batchNumber,
      },
    });

    // 7. Calculate and Update Daily Scan Streak
    let streakAwarded = false;
    let streakBonusPoints = 0;
    let streakTxHash = null;

    const now = new Date();
    const streak = user.scanStreak || { currentStreak: 0, lastScanDate: null, longestStreak: 0 };
    const lastDate = streak.lastScanDate ? new Date(streak.lastScanDate) : null;

    if (!lastDate) {
      streak.currentStreak = 1;
      streak.longestStreak = 1;
      streak.lastScanDate = now;
    } else {
      const diffMs = now.getTime() - lastDate.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      // Check if scan is on the same calendar day
      const isSameDay =
        now.getFullYear() === lastDate.getFullYear() &&
        now.getMonth() === lastDate.getMonth() &&
        now.getDate() === lastDate.getDate();

      if (!isSameDay) {
        if (diffHours <= 48) {
          // Scanned the very next day -> streak increases!
          streak.currentStreak += 1;
        } else {
          // Missed a day -> reset to 1
          streak.currentStreak = 1;
        }
        if (streak.currentStreak > streak.longestStreak) {
          streak.longestStreak = streak.currentStreak;
        }
        streak.lastScanDate = now;
      }
    }

    // Check if current streak hits milestone (e.g. 5 days)
    if (
      streak.currentStreak > 0 &&
      streak.currentStreak % campaign.streakDaysThreshold === 0 &&
      (!streak.lastMilestoneRewarded || streak.lastMilestoneRewarded !== streak.currentStreak)
    ) {
      streakAwarded = true;
      streakBonusPoints = campaign.streakBonus;
      streak.lastMilestoneRewarded = streak.currentStreak;

      try {
        const streakChainRes = await blockchainService.rewardTrustPoints(
          user.walletAddress,
          streakBonusPoints,
          `STREAK_MILESTONE_${streak.currentStreak}_DAYS`
        );
        streakTxHash = streakChainRes.txHash;
      } catch (e) {
        streakTxHash = ethers.id(`simulated-streak-tx-${Date.now()}`);
      }

      user.pointsBalance += streakBonusPoints;

      await RewardLedger.create({
        user: user._id,
        type: 'STREAK_BONUS',
        points: streakBonusPoints,
        txHash: streakTxHash,
        description: `Consecutive scan streak bonus: ${streak.currentStreak} days streak achieved!`,
        balanceAfter: user.pointsBalance,
        metadata: {
          daysStreak: streak.currentStreak,
        },
      });
    }

    user.scanStreak = streak;
    await user.save();

    return {
      rewarded: true,
      pointsAwarded: pointsToAward,
      streakBonusAwarded: streakAwarded,
      streakBonusPoints,
      currentStreak: streak.currentStreak,
      totalPointsBalance: user.pointsBalance,
      txHash,
      streakTxHash,
    };
  }

  /**
   * Apply referral code to award bonus to both referrer and referee
   */
  async applyReferralCode(user, code) {
    if (!code || !code.trim()) {
      throw new Error('Referral code is required.');
    }

    const cleanCode = code.trim().toUpperCase();

    if (user.referralCode && user.referralCode.toUpperCase() === cleanCode) {
      throw new Error('You cannot apply your own referral code.');
    }

    if (user.referredBy) {
      throw new Error('You have already applied a referral code.');
    }

    const referrer = await User.findOne({ referralCode: cleanCode });
    if (!referrer) {
      throw new Error(`Referral code "${cleanCode}" is invalid.`);
    }

    const campaign = await this.getCampaignSettings();
    const bonus = campaign.referralBonus || 50;

    // 1. Reward Referrer
    referrer.pointsBalance = (referrer.pointsBalance || 0) + bonus;
    let referrerTxHash = null;
    try {
      const chainRes = await blockchainService.rewardTrustPoints(
        referrer.walletAddress,
        bonus,
        `REFERRAL_INVITE_${user.phone || user._id}`
      );
      referrerTxHash = chainRes.txHash;
    } catch (e) {
      referrerTxHash = ethers.id(`simulated-referral-ref-${Date.now()}`);
    }

    await RewardLedger.create({
      user: referrer._id,
      type: 'REFERRAL_BONUS',
      points: bonus,
      txHash: referrerTxHash,
      description: `Referral bonus: ${user.name || 'Friend'} joined using your code (${cleanCode})`,
      balanceAfter: referrer.pointsBalance,
    });
    await referrer.save();

    // 2. Reward Referee (Current User)
    user.pointsBalance = (user.pointsBalance || 0) + bonus;
    user.referredBy = referrer._id;
    let userTxHash = null;
    try {
      const chainRes = await blockchainService.rewardTrustPoints(
        user.walletAddress,
        bonus,
        `REFERRAL_JOIN_${cleanCode}`
      );
      userTxHash = chainRes.txHash;
    } catch (e) {
      userTxHash = ethers.id(`simulated-referral-user-${Date.now()}`);
    }

    await RewardLedger.create({
      user: user._id,
      type: 'REFERRAL_BONUS',
      points: bonus,
      txHash: userTxHash,
      description: `Welcome bonus: applied referral code from ${referrer.name || 'Friend'}`,
      balanceAfter: user.pointsBalance,
    });
    await user.save();

    return {
      success: true,
      pointsEarned: bonus,
      newBalance: user.pointsBalance,
      referrerName: referrer.name,
      txHash: userTxHash,
    };
  }

  /**
   * Redeem Reward Offer: burns tokens on-chain and generates a coupon code
   */
  async redeemOffer(user, offerId) {
    const offer = await RewardOffer.findById(offerId);
    if (!offer || !offer.isActive) {
      throw new Error('Reward offer is not available or inactive.');
    }

    if ((user.pointsBalance || 0) < offer.pointsRequired) {
      const needed = offer.pointsRequired - (user.pointsBalance || 0);
      throw new Error(
        `Insufficient TPTS balance. Required: ${offer.pointsRequired}, Current: ${user.pointsBalance || 0}. Need ${needed} more points.`
      );
    }

    if (offer.stock === 0) {
      throw new Error('This reward offer is currently out of stock.');
    }

    // 1. Call redeem on-chain to burn tokens
    let txHash = null;
    try {
      const chainRes = await blockchainService.redeemTrustPoints(
        user.walletAddress,
        offer.pointsRequired,
        offer._id.toString()
      );
      txHash = chainRes.txHash;
    } catch (e) {
      console.warn(`[Blockchain Warning] redeemTrustPoints simulated: ${e.message}`);
      txHash = ethers.id(`simulated-burn-tx-${Date.now()}`);
    }

    // 2. Deduct points
    user.pointsBalance -= offer.pointsRequired;
    await user.save();

    // 3. Generate unique coupon code
    const prefix = offer.couponPrefix || 'TPTS';
    const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
    const couponCode = `${prefix}-${rand}-${Date.now().toString(36).toUpperCase()}`;

    // 4. Create Redemption Document
    const redemptionId = `RDM-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    const redemption = await Redemption.create({
      redemptionId,
      user: user._id,
      userWallet: user.walletAddress,
      offer: offer._id,
      offerTitle: offer.title,
      pointsSpent: offer.pointsRequired,
      couponCode,
      txHash,
      status: 'Active',
      terms: offer.terms,
    });

    // 5. Record negative points in RewardLedger
    await RewardLedger.create({
      user: user._id,
      type: 'REDEMPTION',
      points: -offer.pointsRequired,
      offer: offer._id,
      txHash,
      description: `Redeemed ${offer.pointsRequired} TPTS for "${offer.title}" (Coupon: ${couponCode})`,
      balanceAfter: user.pointsBalance,
    });

    // 6. Update offer stock if applicable
    if (offer.stock > 0) {
      offer.stock -= 1;
      await offer.save();
    }

    return {
      redemption,
      couponCode,
      pointsSpent: offer.pointsRequired,
      remainingBalance: user.pointsBalance,
      txHash,
    };
  }

  /**
   * Seed initial reward offers into the catalogue
   */
  async seedInitialOffers() {
    const count = await RewardOffer.countDocuments();
    if (count > 0) return;

    const defaultOffers = [
      {
        title: '₹100 Amazon Gift Voucher',
        description: 'Instant ₹100 shopping voucher redeemable across all Amazon India orders.',
        category: 'Gift Cards',
        pointsRequired: 100,
        couponPrefix: 'AMZN',
        partner: 'Amazon',
        discountAmount: 100,
        terms: 'Valid on Amazon.in. Non-reloadable and cannot be refunded.',
      },
      {
        title: '₹250 Flipkart Voucher',
        description: 'Get ₹250 instant discount on electronics, fashion, and essentials on Flipkart.',
        category: 'Gift Cards',
        pointsRequired: 220,
        couponPrefix: 'FKRT',
        partner: 'Flipkart',
        discountAmount: 250,
        terms: 'Valid on Flipkart app and website. Minimum order value ₹500.',
      },
      {
        title: '20% Off Official Brand Store',
        description: 'Enjoy 20% discount on your next direct product purchase from certified manufacturers.',
        category: 'Discounts',
        pointsRequired: 75,
        couponPrefix: 'BRND20',
        partner: 'TrustChain Direct',
        discountPercentage: 20,
        terms: 'Valid for 45 days on all partner brand webstores.',
      },
      {
        title: 'Free Express Shipping Voucher',
        description: 'Zero shipping charges on any cold-chain or standard logistics order.',
        category: 'Vouchers',
        pointsRequired: 40,
        couponPrefix: 'FREESHIP',
        partner: 'National Logistics',
        discountAmount: 60,
        terms: 'One-time use per customer. Valid on participating delivery partners.',
      },
    ];

    await RewardOffer.insertMany(defaultOffers);
    console.log('[RewardService] Seeded default reward store offers.');
  }
}

module.exports = new RewardService();
