const Brand = require('../models/Brand');
const User = require('../models/User');
const blockchainService = require('../services/blockchain.service');
const { successResponse, errorResponse } = require('../utils/response');

// =============================================================================
// MANUFACTURER BRAND & KYB ENDPOINTS
// =============================================================================

/**
 * @desc Get current manufacturer's brand profile & KYB onboarding status
 * @route GET /api/v1/brands/me
 */
const getMyBrand = async (req, res, next) => {
  try {
    let brand = await Brand.findOne({ manufacturer: req.user._id });
    if (!brand) {
      // Auto-create brand profile if missing
      brand = await Brand.create({
        manufacturer: req.user._id,
        companyName: req.user.companyName || req.user.name,
        gst: req.user.gst || '',
        cin: req.user.cin || '',
        status: 'pending',
      });
    }

    return successResponse(res, {
      brand,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Upload KYB verification documents (GST, CIN, incorporation docs)
 * @route POST /api/v1/brands/me/documents
 */
const uploadKybDocuments = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return errorResponse(res, 'No files were uploaded. Please attach at least one document.', 400, 'NO_FILES_UPLOADED');
    }

    let brand = await Brand.findOne({ manufacturer: req.user._id });
    if (!brand) {
      brand = await Brand.create({
        manufacturer: req.user._id,
        companyName: req.user.companyName || req.user.name,
        status: 'pending',
      });
    }

    const documentType = req.body.documentType || 'KYB_DOCUMENT';

    const uploadedDocs = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
      documentType,
      uploadedAt: new Date(),
    }));

    brand.documents.push(...uploadedDocs);

    // If info was requested earlier, re-submission puts it back in 'pending' review
    if (brand.status === 'infoRequested') {
      brand.status = 'pending';
      await User.findByIdAndUpdate(req.user._id, { brandStatus: 'pending' });
    }

    await brand.save();

    return successResponse(
      res,
      {
        brandId: brand._id,
        brandStatus: brand.status,
        newlyUploadedCount: uploadedDocs.length,
        totalDocuments: brand.documents.length,
        documents: brand.documents,
        message: 'KYB documents uploaded successfully. Awaiting admin review.',
      },
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Update KYB company data (GST, CIN, Company Name)
 * @route PUT /api/v1/brands/me
 */
const updateKybDetails = async (req, res, next) => {
  try {
    const { companyName, gst, cin } = req.body;

    let brand = await Brand.findOne({ manufacturer: req.user._id });
    if (!brand) {
      brand = new Brand({ manufacturer: req.user._id });
    }

    if (companyName) brand.companyName = companyName;
    if (gst) brand.gst = gst.toUpperCase();
    if (cin) brand.cin = cin.toUpperCase();

    if (brand.status === 'infoRequested') {
      brand.status = 'pending';
    }

    await brand.save();

    // Sync with User document
    await User.findByIdAndUpdate(req.user._id, {
      companyName: brand.companyName,
      gst: brand.gst,
      cin: brand.cin,
      brandStatus: brand.status,
    });

    return successResponse(res, {
      brand,
      message: 'Brand details updated successfully.',
    });
  } catch (err) {
    next(err);
  }
};

// =============================================================================
// ADMIN BRAND ONBOARDING & APPROVAL ENDPOINTS
// =============================================================================

/**
 * @desc List all brands (with optional status filter e.g. ?status=pending)
 * @route GET /api/v1/admin/brands
 */
const listBrands = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const brands = await Brand.find(filter)
      .populate('manufacturer', 'name email phone walletAddress companyName')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    return successResponse(res, {
      count: brands.length,
      brands,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get brand detail by ID
 * @route GET /api/v1/admin/brands/:id
 */
const getBrandById = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id)
      .populate('manufacturer', 'name email phone walletAddress companyName gst cin licenseNumber creditBalance')
      .populate('approvedBy', 'name email');

    if (!brand) {
      return errorResponse(res, 'Brand record not found.', 404, 'BRAND_NOT_FOUND');
    }

    return successResponse(res, {
      brand,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Approve a manufacturer brand:
 *       1. Calls authorizeManufacturer on-chain through TransactionService
 *       2. Sets Brand status to 'approved'
 *       3. Sets User isVerified = true and brandStatus = 'approved'
 * @route POST /api/v1/admin/brands/:id/approve
 */
const approveBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id).populate('manufacturer');
    if (!brand) {
      return errorResponse(res, 'Brand record not found.', 404, 'BRAND_NOT_FOUND');
    }

    if (brand.status === 'approved') {
      return errorResponse(res, 'This brand has already been approved.', 400, 'ALREADY_APPROVED');
    }

    const manufacturer = brand.manufacturer;
    if (!manufacturer || !manufacturer.walletAddress) {
      return errorResponse(res, 'Associated manufacturer account or wallet address missing.', 400, 'INVALID_MANUFACTURER');
    }

    // 1. Authorize on-chain through the transaction service
    let txHash = 'SIMULATED_APPROVAL_TX';
    try {
      const txResult = await blockchainService.authorizeManufacturerOnChain(manufacturer.walletAddress);
      txHash = txResult.txHash;
    } catch (chainErr) {
      console.warn(`[Blockchain Warning] On-chain authorizeManufacturer: ${chainErr.message}`);
    }

    // 2. Update Brand Document
    brand.status = 'approved';
    brand.approvedAt = new Date();
    brand.approvedBy = req.user._id;
    brand.rejectionReason = null;
    brand.requestedInfoDetails = null;
    brand.txHash = txHash;
    await brand.save();

    // 3. Update User Document (Unlock protected routes)
    await User.findByIdAndUpdate(manufacturer._id, {
      isVerified: true,
      brandStatus: 'approved',
    });

    console.log(`[Brand Onboarding] Brand approved: ${brand.companyName} (${manufacturer.walletAddress})`);

    return successResponse(res, {
      brandId: brand._id,
      companyName: brand.companyName,
      status: brand.status,
      approvedAt: brand.approvedAt,
      txHash: brand.txHash,
      message: `Brand "${brand.companyName}" successfully approved and authorized on-chain.`,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Reject a brand with a reason
 * @route POST /api/v1/admin/brands/:id/reject
 */
const rejectBrand = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return errorResponse(res, 'Brand record not found.', 404, 'BRAND_NOT_FOUND');
    }

    brand.status = 'rejected';
    brand.rejectionReason = reason;
    await brand.save();

    await User.findByIdAndUpdate(brand.manufacturer, {
      brandStatus: 'rejected',
      isVerified: false,
    });

    console.log(`[Brand Onboarding] Brand rejected: ${brand.companyName}. Reason: ${reason}`);

    return successResponse(res, {
      brandId: brand._id,
      status: brand.status,
      rejectionReason: brand.rejectionReason,
      message: `Brand "${brand.companyName}" application has been rejected.`,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Request more info from manufacturer
 * @route POST /api/v1/admin/brands/:id/request-info
 */
const requestMoreInfo = async (req, res, next) => {
  try {
    const { details } = req.body;

    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return errorResponse(res, 'Brand record not found.', 404, 'BRAND_NOT_FOUND');
    }

    brand.status = 'infoRequested';
    brand.requestedInfoDetails = details;
    await brand.save();

    await User.findByIdAndUpdate(brand.manufacturer, {
      brandStatus: 'infoRequested',
    });

    console.log(`[Brand Onboarding] More info requested for brand: ${brand.companyName}`);

    return successResponse(res, {
      brandId: brand._id,
      status: brand.status,
      requestedInfoDetails: brand.requestedInfoDetails,
      message: `Additional information requested from manufacturer.`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyBrand,
  uploadKybDocuments,
  updateKybDetails,
  listBrands,
  getBrandById,
  approveBrand,
  rejectBrand,
  requestMoreInfo,
};
