const { z } = require('zod');

const initiateResaleSchema = z.object({
  code: z.string().optional(),
  unitCode: z.string().optional(),
  buyerPhone: z
    .string()
    .min(10, 'Buyer phone number must be at least 10 digits')
    .max(15, 'Buyer phone number is too long')
    .regex(/^[0-9+]+$/, 'Buyer phone must contain only digits or country code prefix'),
  price: z.coerce.number().nonnegative().optional().default(0),
  notes: z.string().optional(),
}).refine(data => data.code || data.unitCode, {
  message: 'Unit code is required to initiate resale transfer.',
  path: ['code'],
});

const respondResaleSchema = z.object({
  accept: z.boolean({ required_error: 'Accept parameter (boolean) is required' }),
  reason: z.string().optional(),
});

module.exports = {
  initiateResaleSchema,
  respondResaleSchema,
};
