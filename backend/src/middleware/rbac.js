const { errorResponse } = require('../utils/response');

/**
 * Role-Based Access Control Middleware
 * Supports single string, array of strings, or variadic arguments:
 * requireRole('admin')
 * requireRole(['manufacturer', 'admin'])
 * requireRoles('admin', 'distributor')
 */
const requireRole = (...roles) => {
  const allowedRoles = roles.flat();

  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required before checking permissions.', 401, 'UNAUTHORIZED');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Access denied. Requires role: [${allowedRoles.join(', ')}], but current user has role: "${req.user.role}".`,
        403,
        'FORBIDDEN'
      );
    }

    next();
  };
};

const requireRoles = requireRole;

module.exports = {
  requireRole,
  requireRoles,
};
