const express = require('express');
const {
  createInvite,
  joinViaInvite,
  selfApply,
  approvePartner,
  rejectPartner,
  getPartners,
  getPartnerById,
  getPartnerReputation,
  getPartnersReputationList,
} = require('../controllers/partner.controller');
const { getPartnerInventory } = require('../controllers/transfer.controller');
const authenticate = require('../middleware/auth');
const { requireRoles } = require('../middleware/rbac');
const validate = require('../middleware/validate');
const {
  createInviteSchema,
  joinInviteSchema,
  selfApplySchema,
  rejectPartnerSchema,
} = require('../validators/partner.validator');
const { ROLES } = require('../constants/roles');

const router = express.Router();

// 1. Public Partner Onboarding Endpoints
router.post('/join-invite', validate(joinInviteSchema), joinViaInvite);
router.post('/self-apply', validate(selfApplySchema), selfApply);

// 2. Protected Partner Management Endpoints
router.use(authenticate);

// Invite a partner (manufacturer, distributor, admin)
router.post(
  '/invite',
  requireRoles(ROLES.MANUFACTURER, ROLES.DISTRIBUTOR, ROLES.ADMIN),
  validate(createInviteSchema),
  createInvite
);

// Partner network reputation leaderboard (must be before /:id)
router.get(
  '/reputation',
  requireRoles(ROLES.MANUFACTURER, ROLES.DISTRIBUTOR, ROLES.ADMIN),
  getPartnersReputationList
);

// List partners for manufacturer or upstream distributor
router.get(
  '/',
  requireRoles(ROLES.MANUFACTURER, ROLES.DISTRIBUTOR, ROLES.ADMIN),
  getPartners
);

// Partner inventory endpoint grouped by batch
router.get('/inventory', getPartnerInventory);

// Specific partner reputation breakdown
router.get('/:id/reputation', getPartnerReputation);

// Get single partner detail
router.get('/:id', getPartnerById);

// Approve partner (creates custodial wallet and authorizes on-chain)
router.post(
  '/:id/approve',
  requireRoles(ROLES.MANUFACTURER, ROLES.DISTRIBUTOR, ROLES.ADMIN),
  approvePartner
);

// Reject partner application
router.post(
  '/:id/reject',
  requireRoles(ROLES.MANUFACTURER, ROLES.DISTRIBUTOR, ROLES.ADMIN),
  validate(rejectPartnerSchema),
  rejectPartner
);

module.exports = router;
