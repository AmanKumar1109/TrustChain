const express = require('express');
const {
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
} = require('../controllers/reward.controller');
const authenticate = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const { requireRoles } = require('../middleware/rbac');
const { ROLES } = require('../constants/roles');

const router = express.Router();

// 1. Rewards Store Catalogue (Public / Optional Auth to show balance)
router.get('/store', optionalAuth, getRewardsStore);

// All following endpoints require authentication
router.use(authenticate);

// 2. Consumer Rewards Dashboard
router.get('/balance', getBalance);
router.get('/history', getHistory);
router.get('/streak', getStreak);
router.get('/referral', getReferralInfo);
router.post('/referral/apply', applyReferral);
router.get('/redemptions', getMyRedemptions);

// 3. Redeem Points (Consumer only)
router.post('/redeem', requireRoles(ROLES.CONSUMER, ROLES.ADMIN), redeemReward);

// 4. Campaign Configuration (Manufacturer sets campaign values)
router.post('/campaign', requireRoles(ROLES.MANUFACTURER, ROLES.ADMIN), setCampaignValues);
router.put('/campaign', requireRoles(ROLES.MANUFACTURER, ROLES.ADMIN), setCampaignValues);
router.get('/campaign', getCampaignValues);

module.exports = router;
