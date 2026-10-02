const Brand = require('../models/Brand');
const { ROLES } = require('../constants/roles');
const { errorResponse } = require('../utils/response');

/**
 * Middleware: Blocks manufacturer from protected routes until brand KYB is approved by admin.
 */
const requireApprovedBrand = async (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, 'Authentication required before checking brand status.', 401, 'UNAUTHORIZED');
  }

  // Only enforces brand approval on manufacturers
  if (req.user.role === ROLES.MANUFACTURER) {
    if (req.user.brandStatus === 'approved') {
      return next();
    }

    try {
      const brand = await Brand.findOne({ manufacturer: req.user._id });
      const currentStatus = brand ? brand.status : req.user.brandStatus || 'pending';

      if (currentStatus !== 'approved') {
        const statusMessages = {
          pending: 'Your brand KYB onboarding application is currently pending admin review.',
          rejected: `Your brand onboarding application was rejected. Reason: ${brand?.rejectionReason || 'Non-compliant documents'}.`,
          infoRequested: `Additional KYB information is required. Details: ${brand?.requestedInfoDetails || 'Please re-upload required documents'}.`,
        };

        return errorResponse(
          res,
          `Access restricted: Manufacturer brand is not approved. ${statusMessages[currentStatus] || 'Approval is required.'}`,
          403,
          'BRAND_NOT_APPROVED',
          {
            brandStatus: currentStatus,
            rejectionReason: brand?.rejectionReason || null,
            requestedInfoDetails: brand?.requestedInfoDetails || null,
          }
        );
      }
    } catch (err) {
      console.warn(`[Brand Middleware Warning] Failed to check brand status: ${err.message}`);
    }
  }

  next();
};

module.exports = {
  requireApprovedBrand,
};
