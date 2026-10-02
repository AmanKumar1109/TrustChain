const { errorResponse } = require('../utils/response');

/**
 * Zod validation middleware
 * @param {import('zod').ZodSchema} schema Zod schema object
 * @param {'body' | 'query' | 'params'} source Property of request to validate (default: 'body')
 */
const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync(req[source]);
      req[source] = parsed;
      next();
    } catch (err) {
      if (err.errors) {
        const errorDetails = err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        return errorResponse(
          res,
          `Validation failed: ${errorDetails.map(d => `${d.field}: ${d.message}`).join(', ')}`,
          400,
          'VALIDATION_ERROR',
          errorDetails
        );
      }
      return errorResponse(res, err.message, 400, 'VALIDATION_ERROR');
    }
  };
};

module.exports = validate;
