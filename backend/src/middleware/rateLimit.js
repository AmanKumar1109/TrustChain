const rateLimit = require('express-rate-limit');
const { errorResponse } = require('../utils/response');

/**
 * Standard Global API Rate Limiter
 * 15 minutes window, 300 requests per window
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(
      res,
      'Too many requests from this IP address, please try again after 15 minutes.',
      429,
      'RATE_LIMIT_EXCEEDED'
    );
  },
});

/**
 * Strict Rate Limiter for Authentication & OTP endpoints
 * 15 minutes window, 20 requests per window
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(
      res,
      'Too many login/OTP attempts, please try again after 15 minutes.',
      429,
      'AUTH_RATE_LIMIT_EXCEEDED'
    );
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
};
