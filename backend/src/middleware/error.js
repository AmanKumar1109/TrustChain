const { errorResponse } = require('../utils/response');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error('[Unhandled Error]', err);

  const statusCode = err.statusCode || (err.status ? err.status : 500);
  const message = err.message || 'An unexpected internal server error occurred.';
  const code = err.code || 'INTERNAL_ERROR';

  return errorResponse(res, message, statusCode, code);
};

module.exports = errorHandler;
