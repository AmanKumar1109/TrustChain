const { z } = require('zod');

const submitKybSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters').optional(),
  gst: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i, 'Invalid Indian GSTIN format (e.g. 22AAAAA0000A1Z5)')
    .optional(),
  cin: z
    .string()
    .regex(/^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/i, 'Invalid Corporate Identification Number (CIN) format')
    .optional(),
});

const rejectBrandSchema = z.object({
  reason: z.string().min(3, 'Rejection reason is required (minimum 3 characters)'),
});

const requestInfoBrandSchema = z.object({
  details: z.string().min(3, 'Requested info details are required (minimum 3 characters)'),
});

module.exports = {
  submitKybSchema,
  rejectBrandSchema,
  requestInfoBrandSchema,
};
