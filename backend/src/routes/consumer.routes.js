const express = require('express');
const {
  getMyProducts,
  getProductDetail,
  initiateResale,
  getResaleTransfers,
  respondResale,
  getMyScans,
  exportWallet,
} = require('../controllers/consumer.controller');
const authenticate = require('../middleware/auth');
const { requireRoles } = require('../middleware/rbac');
const validate = require('../middleware/validate');
const {
  initiateResaleSchema,
  respondResaleSchema,
} = require('../validators/consumer.validator');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use(authenticate);

// 1. My Products List (with status: Pending Claim, Claimed)
router.get(
  '/products',
  requireRoles(ROLES.CONSUMER, ROLES.ADMIN),
  getMyProducts
);

// 2. Product Detail with Warranty info, Purchase Proof & Ownership Timeline
router.get(
  '/products/:code',
  requireRoles(ROLES.CONSUMER, ROLES.ADMIN),
  getProductDetail
);

// 3. Resale: Owner initiates transfer to buyer phone number
router.post(
  '/resale/transfer',
  requireRoles(ROLES.CONSUMER, ROLES.ADMIN),
  validate(initiateResaleSchema),
  initiateResale
);

// 4. Resale: List consumer's incoming & outgoing unit transfers
router.get(
  '/resale/transfers',
  requireRoles(ROLES.CONSUMER, ROLES.ADMIN),
  getResaleTransfers
);

// 5. Resale: Buyer responds (accept or reject)
router.post(
  '/resale/transfers/:id/respond',
  requireRoles(ROLES.CONSUMER, ROLES.ADMIN),
  validate(respondResaleSchema),
  respondResale
);

// 6. Scan History of the Logged-in User
router.get('/scans', getMyScans);

// 7. Export non-custodial wallet credentials behind verified OTP
router.post(
  '/export-wallet',
  requireRoles(ROLES.CONSUMER, ROLES.ADMIN),
  exportWallet
);

module.exports = router;
