const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');
const authenticate = require('../middleware/auth');
const { requireRoles } = require('../middleware/rbac');
const { requireApprovedBrand } = require('../middleware/brand.middleware');
const { uploadProductImages } = require('../middleware/upload');
const validate = require('../middleware/validate');
const { createProductSchema, updateProductSchema } = require('../validators/product.validator');
const { ROLES } = require('../constants/roles');

const router = express.Router();

// Apply authentication to all product routes
router.use(authenticate);

// List products (search, filter, pagination: manufacturer sees only their own)
router.get(
  '/',
  requireRoles(ROLES.MANUFACTURER, ROLES.ADMIN),
  getProducts
);

// Get single product detail
router.get(
  '/:id',
  requireRoles(ROLES.MANUFACTURER, ROLES.ADMIN),
  getProductById
);

// Create product (with images upload & brand approval requirement)
router.post(
  '/',
  requireRoles(ROLES.MANUFACTURER, ROLES.ADMIN),
  requireApprovedBrand,
  uploadProductImages.array('images', 5),
  validate(createProductSchema),
  createProduct
);

// Update product (with optional new images)
router.put(
  '/:id',
  requireRoles(ROLES.MANUFACTURER, ROLES.ADMIN),
  requireApprovedBrand,
  uploadProductImages.array('images', 5),
  validate(updateProductSchema),
  updateProduct
);

// Delete product
router.delete(
  '/:id',
  requireRoles(ROLES.MANUFACTURER, ROLES.ADMIN),
  requireApprovedBrand,
  deleteProduct
);

module.exports = router;
