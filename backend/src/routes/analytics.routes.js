const express = require('express');
const { getManufacturerAnalytics } = require('../controllers/analytics.controller');
const authenticate = require('../middleware/auth');
const { requireRoles } = require('../middleware/rbac');
const { ROLES } = require('../constants/roles');

const router = express.Router();

/**
 * Manufacturer & Admin Analytics
 * Overview stats, timeseries scans, city breakdown, genuine/fake split, batch performance
 */
router.get(
  '/manufacturer',
  authenticate,
  requireRoles(ROLES.MANUFACTURER, ROLES.ADMIN),
  getManufacturerAnalytics
);

module.exports = router;
