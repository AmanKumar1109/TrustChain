const express = require('express');
const {
  getMyBrand,
  uploadKybDocuments,
  updateKybDetails,
} = require('../controllers/brand.controller');
const authenticate = require('../middleware/auth');
const { requireRoles } = require('../middleware/rbac');
const { uploadKybDocs } = require('../middleware/upload');
const validate = require('../middleware/validate');
const { submitKybSchema } = require('../validators/brand.validator');
const { ROLES } = require('../constants/roles');

const router = express.Router();

// Get current manufacturer's brand & KYB details
router.get(
  '/me',
  authenticate,
  requireRoles(ROLES.MANUFACTURER, ROLES.ADMIN),
  getMyBrand
);

// Upload KYB documents (PDF, JPG, PNG)
router.post(
  '/me/documents',
  authenticate,
  requireRoles(ROLES.MANUFACTURER, ROLES.ADMIN),
  uploadKybDocs.array('documents', 5),
  uploadKybDocuments
);

// Update KYB info (GST, CIN, company name)
router.put(
  '/me',
  authenticate,
  requireRoles(ROLES.MANUFACTURER, ROLES.ADMIN),
  validate(submitKybSchema),
  updateKybDetails
);

module.exports = router;
