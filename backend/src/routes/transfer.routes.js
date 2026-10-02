const express = require('express');
const {
  createTransfer,
  initiateTransfer,
  respondTransfer,
  getTransfers,
  getIncomingTransfers,
  getTransferById,
  getPartnerInventory,
} = require('../controllers/transfer.controller');
const authenticate = require('../middleware/auth');
const { requireRoles } = require('../middleware/rbac');
const validate = require('../middleware/validate');
const {
  createTransferSchema,
  respondTransferSchema,
} = require('../validators/transfer.validator');
const { ROLES } = require('../constants/roles');

const router = express.Router();

// Require authentication on all transfer endpoints
router.use(authenticate);

// 1. Initiate / Create Transfer
// Allowed: Manufacturer (to Distributor or Retailer), Distributor (to Retailer), Admin
router.post(
  '/',
  requireRoles(ROLES.MANUFACTURER, ROLES.DISTRIBUTOR, ROLES.ADMIN),
  validate(createTransferSchema),
  createTransfer
);

router.post(
  '/initiate',
  requireRoles(ROLES.MANUFACTURER, ROLES.DISTRIBUTOR, ROLES.ADMIN),
  validate(createTransferSchema),
  initiateTransfer
);

// 2. Incoming Shipments for Partners
router.get('/incoming', getIncomingTransfers);

// 3. Partner Inventory Grouped by Batch
router.get('/inventory', getPartnerInventory);

// 4. List Transfers (with tabs counts for Pending, Accepted, Rejected, All)
router.get('/', getTransfers);

// 5. Transfer Detail with Status Timeline
router.get('/:id', getTransferById);

// 6. Accept or Reject Transfer (reject requires mandatory reason)
router.post(
  '/:id/respond',
  requireRoles(ROLES.DISTRIBUTOR, ROLES.RETAILER, ROLES.MANUFACTURER, ROLES.ADMIN),
  validate(respondTransferSchema),
  respondTransfer
);

// Backward-compatibility alias with :transferId
router.post(
  '/:transferId/respond',
  requireRoles(ROLES.DISTRIBUTOR, ROLES.RETAILER, ROLES.MANUFACTURER, ROLES.ADMIN),
  validate(respondTransferSchema),
  respondTransfer
);

module.exports = router;
