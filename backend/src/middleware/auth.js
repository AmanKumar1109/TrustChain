const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');
const { errorResponse } = require('../utils/response');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication token missing or invalid.', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);

    const user = await User.findById(decoded.id);
    if (!user) {
      return errorResponse(res, 'User associated with token no longer exists.', 401, 'USER_NOT_FOUND');
    }

    if (user.status === 'SUSPENDED') {
      return errorResponse(res, 'Account is suspended. Please contact administrator.', 403, 'ACCOUNT_SUSPENDED');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'Session token has expired. Please log in again.', 401, 'TOKEN_EXPIRED');
    }
    return errorResponse(res, 'Invalid authentication token.', 401, 'INVALID_TOKEN');
  }
};

module.exports = authenticate;
