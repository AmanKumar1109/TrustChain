const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');

/**
 * Optional Authentication Middleware
 * If a valid JWT Bearer token is provided, attaches req.user.
 * If token is missing, expired, or invalid, silently sets req.user = null
 * and allows the request to proceed as anonymous.
 */
const optionalAuth = async (req, res, next) => {
  req.user = null;
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token && token.trim().length > 0) {
        const decoded = jwt.verify(token, config.jwtSecret);
        if (decoded && decoded.id) {
          const user = await User.findById(decoded.id);
          if (user && user.status !== 'SUSPENDED') {
            req.user = user;
          }
        }
      }
    }
  } catch (err) {
    // Non-blocking: proceed as anonymous guest
    req.user = null;
  }
  next();
};

module.exports = optionalAuth;
