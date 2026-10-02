const express = require('express');
const { getBalance, topupCredits, getHistory } = require('../controllers/credit.controller');
const authenticate = require('../middleware/auth');
const { requireRoles } = require('../middleware/rbac');
const validate = require('../middleware/validate');
const { topupCreditsSchema } = require('../validators/credit.validator');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.get('/balance', authenticate, requireRoles(ROLES.MANUFACTURER, ROLES.ADMIN), getBalance);
router.post('/topup', authenticate, requireRoles(ROLES.MANUFACTURER, ROLES.ADMIN), validate(topupCreditsSchema), topupCredits);
router.get('/history', authenticate, requireRoles(ROLES.MANUFACTURER, ROLES.ADMIN), getHistory);

module.exports = router;
