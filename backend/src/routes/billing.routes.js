const express = require('express');
const {
  getBillingOverview,
  getPlanDetails,
  updatePlan,
  getInvoices,
  getInvoiceById,
  topupCreditsWithMockPayment,
  getUsageHistory,
} = require('../controllers/billing.controller');
const authenticate = require('../middleware/auth');
const { requireRoles } = require('../middleware/rbac');
const validate = require('../middleware/validate');
const { topupBillingSchema, updatePlanSchema } = require('../validators/billing.validator');
const { ROLES } = require('../constants/roles');

const router = express.Router();

// Protected by Manufacturer and Admin roles
router.use(authenticate, requireRoles(ROLES.MANUFACTURER, ROLES.ADMIN));

// Overview: Plan, credit balance, summary, recent invoices & usage
router.get('/overview', getBillingOverview);

// Subscription Plan management
router.get('/plan', getPlanDetails);
router.patch('/plan', validate(updatePlanSchema), updatePlan);

// Invoices & Receipts (INR with 18% GST breakdown)
router.get('/invoices', getInvoices);
router.get('/invoices/:id', getInvoiceById);

// Mock Top-Up: Simulates successful UPI or Card payment & generates invoice
router.post('/topup', validate(topupBillingSchema), topupCreditsWithMockPayment);

// Detailed CreditLedger usage history
router.get('/usage', getUsageHistory);

module.exports = router;
