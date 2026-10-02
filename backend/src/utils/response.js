/**
 * Consistent API Response Helpers
 * Standard format:
 * Success: { success: true, data: ... }
 * Error:   { success: false, error: { message: "...", code: "..." } }
 */

const successResponse = (res, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data: data !== null ? data : {},
  });
};

const errorResponse = (res, message = 'Internal Server Error', statusCode = 500, code = 'ERROR', details = null) => {
  const errorObj = {
    message,
    code,
  };

  if (details) {
    errorObj.details = details;
  }

  return res.status(statusCode).json({
    success: false,
    error: errorObj,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
