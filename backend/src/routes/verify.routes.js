const express = require('express');
const { verifyProduct } = require('../controllers/verify.controller');
const optionalAuth = require('../middleware/optionalAuth');
const validate = require('../middleware/validate');
const { verifyUnitSchema } = require('../validators/unit.validator');

const router = express.Router();

// 1. Public Verification endpoint (no login required, optional auth for rewards)
router.get('/:code', optionalAuth, verifyProduct);

// 2. POST endpoint for barcode scanner payload or legacy clients
router.post('/', optionalAuth, validate(verifyUnitSchema), verifyProduct);

module.exports = router;
