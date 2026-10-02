const express = require('express');
const {
  createBatch,
  getBatches,
  getBatchById,
  recallBatch,
  getRecallsList,
  downloadBatchQrZip,
  downloadBatchQrPdf,
} = require('../controllers/batch.controller');
const authenticate = require('../middleware/auth');
const { requireRoles } = require('../middleware/rbac');
const { requireApprovedBrand } = require('../middleware/brand.middleware');
const validate = require('../middleware/validate');
const { createBatchSchema, recallBatchSchema } = require('../validators/batch.validator');
const { ROLES } = require('../constants/roles');

const router = express.Router();

// Create new batch (manufacturer with approved brand)
router.post(
  '/',
  authenticate,
  requireRoles(ROLES.MANUFACTURER, ROLES.ADMIN),
  requireApprovedBrand,
  validate(createBatchSchema),
  createBatch
);

// List past recalled batches (with reasons, dates & affected units)
router.get(
  '/recalls',
  authenticate,
  requireRoles(ROLES.MANUFACTURER, ROLES.ADMIN),
  getRecallsList
);

// List batches
router.get('/', authenticate, getBatches);

// Get single batch detail & stats
router.get('/:batchId', authenticate, getBatchById);

// Download all batch QR codes as ZIP of PNGs (streamed)
router.get(
  '/:batchId/qr/zip',
  authenticate,
  requireRoles(ROLES.MANUFACTURER, ROLES.ADMIN),
  downloadBatchQrZip
);
router.get(
  '/:batchId/qr-zip',
  authenticate,
  requireRoles(ROLES.MANUFACTURER, ROLES.ADMIN),
  downloadBatchQrZip
);

// Download all batch QR codes as printable A4 PDF sheet (streamed)
router.get(
  '/:batchId/qr/pdf',
  authenticate,
  requireRoles(ROLES.MANUFACTURER, ROLES.ADMIN),
  downloadBatchQrPdf
);
router.get(
  '/:batchId/qr-pdf',
  authenticate,
  requireRoles(ROLES.MANUFACTURER, ROLES.ADMIN),
  downloadBatchQrPdf
);

// Emergency product recall
router.post(
  '/:batchId/recall',
  authenticate,
  requireRoles(ROLES.MANUFACTURER, ROLES.ADMIN),
  validate(recallBatchSchema),
  recallBatch
);

module.exports = router;
