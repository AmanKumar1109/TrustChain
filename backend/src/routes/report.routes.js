const express = require('express');
const {
  submitReport,
  getMyReports,
  getReportById,
  getAdminReports,
  reviewReport,
  getHotspots,
} = require('../controllers/report.controller');
const authenticate = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const { requireRoles } = require('../middleware/rbac');
const { uploadReportPhotos } = require('../middleware/upload');
const validate = require('../middleware/validate');
const { submitReportSchema, reviewReportSchema } = require('../validators/report.validator');
const { ROLES } = require('../constants/roles');

const router = express.Router();

/**
 * 1. Submit a fake/counterfeit product report
 * Public / Authenticated: Guests can submit; rewards only apply if logged in.
 * Photo upload via Multer (up to 5 photos).
 */
router.post(
  '/',
  optionalAuth,
  uploadReportPhotos.array('photos', 5),
  validate(submitReportSchema),
  submitReport
);

/**
 * 2. Get reports filed by the currently logged-in consumer
 */
router.get(
  '/my-reports',
  authenticate,
  requireRoles(ROLES.CONSUMER, ROLES.ADMIN),
  getMyReports
);

/**
 * 3. Hotspot endpoint for manufacturers & admins
 * Aggregates fake reports and suspicious scans by geographical area with filters.
 */
router.get(
  '/hotspots',
  authenticate,
  requireRoles(ROLES.MANUFACTURER, ROLES.ADMIN),
  getHotspots
);

/**
 * 4. Admin List with Filters (status, city, brand, dates) & Tab counts
 */
router.get(
  '/admin/all',
  authenticate,
  requireRoles(ROLES.ADMIN),
  getAdminReports
);

/**
 * 5. Admin Mark Report Valid or Invalid
 * Valid status automatically mints/awards fake-report bonus points on-chain if logged-in.
 */
router.patch(
  '/:id/review',
  authenticate,
  requireRoles(ROLES.ADMIN),
  validate(reviewReportSchema),
  reviewReport
);

router.post(
  '/:id/review',
  authenticate,
  requireRoles(ROLES.ADMIN),
  validate(reviewReportSchema),
  reviewReport
);

/**
 * 6. Report Detail
 * Accessible by consumer (owner), manufacturer (scoped), admin, or guest with exact reportId.
 */
router.get(
  '/:id',
  optionalAuth,
  getReportById
);

module.exports = router;
