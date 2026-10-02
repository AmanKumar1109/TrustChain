const express = require('express');
const {
  sellUnit,
  claimUnit,
  getRetailSales,
} = require('../controllers/unit.controller');
const { getMyProducts } = require('../controllers/consumer.controller');
const authenticate = require('../middleware/auth');
const { requireRoles } = require('../middleware/rbac');
const validate = require('../middleware/validate');
const { sellUnitSchema, claimUnitSchema } = require('../validators/unit.validator');
const { ROLES } = require('../constants/roles');

const router = express.Router();

// 1. Retail Sale (Retailer only)
router.post(
  '/sell',
  authenticate,
  requireRoles(ROLES.RETAILER, ROLES.ADMIN),
  validate(sellUnitSchema),
  sellUnit
);

// 2. Claim Unit (Consumer only)
router.post(
  '/claim',
  authenticate,
  requireRoles(ROLES.CONSUMER, ROLES.ADMIN),
  validate(claimUnitSchema),
  claimUnit
);

// 3. Consumer's claimed products & warranties
router.get('/my-products', authenticate, getMyProducts);

// 4. Retailer's sales log
router.get(
  '/sales',
  authenticate,
  requireRoles(ROLES.RETAILER, ROLES.ADMIN),
  getRetailSales
);

module.exports = router;
