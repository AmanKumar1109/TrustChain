const express = require('express');
const {
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
} = require('../controllers/admin.controller');
const {
  getBrandById,
  approveBrand,
  rejectBrand,
  requestMoreInfo,
} = require('../controllers/brand.controller');
const {
  getAdminReports,
  getReportById: getAdminReportById,
  reviewReport,
} = require('../controllers/report.controller');
const authenticate = require('../middleware/auth');
const { requireRoles } = require('../middleware/rbac');
const validate = require('../middleware/validate');
const { rejectBrandSchema, requestInfoBrandSchema } = require('../validators/brand.validator');
const { reviewReportSchema } = require('../validators/report.validator');
const {
  suspendEntitySchema,
  rewardOfferAdminSchema,
  updateRewardOfferAdminSchema,
} = require('../validators/admin.validator');
const { ROLES } = require('../constants/roles');

const router = express.Router();

// Apply admin authentication to all admin routes
router.use(authenticate, requireRoles(ROLES.ADMIN));

// 1. Platform Telemetry & Analytics
router.get('/analytics', getPlatformAnalytics);
router.get('/stats', getStats);

// 2. User Governance (Search, Roles, Suspend, Activate, Verify)
router.get('/users', getUsers);
router.patch('/users/:userId/suspend', validate(suspendEntitySchema), suspendUser);
router.patch('/users/:userId/activate', activateUser);
router.patch('/users/:userId/verify', verifyUser);

// 3. Brand KYB & Governance (Search, Suspend, Activate, Approve, Reject)
router.get('/brands', getBrands);
router.get('/brands/:id', getBrandById);
router.post('/brands/:id/approve', approveBrand);
router.post('/brands/:id/reject', validate(rejectBrandSchema), rejectBrand);
router.post('/brands/:id/request-info', validate(requestInfoBrandSchema), requestMoreInfo);
router.patch('/brands/:id/suspend', validate(suspendEntitySchema), suspendBrand);
router.patch('/brands/:id/activate', activateBrand);

// 4. Reward Offers & Partners Management (Full CRUD)
router.get('/rewards/offers', getAdminRewardOffers);
router.post('/rewards/offers', validate(rewardOfferAdminSchema), createRewardOffer);
router.get('/rewards/offers/:id', getRewardOfferById);
router.patch('/rewards/offers/:id', validate(updateRewardOfferAdminSchema), updateRewardOffer);
router.delete('/rewards/offers/:id', deleteRewardOffer);
router.patch('/rewards/offers/:id/toggle', toggleRewardOfferStatus);
router.get('/rewards/partners', getRewardPartners);

// 5. Counterfeit Report Management
router.get('/reports', getAdminReports);
router.get('/reports/:id', getAdminReportById);
router.patch('/reports/:id/review', validate(reviewReportSchema), reviewReport);
router.post('/reports/:id/review', validate(reviewReportSchema), reviewReport);

// 6. System Health, Relayer Gas Credits & Transaction Queue
router.get('/health', getAdminSystemHealth);
router.post('/transactions/retry-all', retryAllFailedTransactions);
router.post('/transactions/:id/retry', retryFailedTransaction);

// 7. On-Chain Event Listener & Safety-Net Reconciliation
router.get('/listener', getListenerTelemetry);
router.post('/listener/reconcile', reconcileOnChainEvents);

module.exports = router;
