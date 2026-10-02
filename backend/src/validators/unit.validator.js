const { z } = require('zod');

const verifyUnitSchema = z.object({
  code: z.string().min(1, 'Product unit code is required'),
});

const sellUnitSchema = z.object({
  code: z.string().optional(),
  unitCode: z.string().optional(),
  customerPhone: z
    .string()
    .min(10, 'Customer phone must be at least 10 digits')
    .max(15, 'Customer phone number is too long')
    .regex(/^[0-9+]+$/, 'Customer phone must contain only digits or country code prefix'),
  warrantyMonths: z.coerce.number().int().positive().optional().default(12),
  price: z.coerce.number().nonnegative().optional(),
  invoiceNumber: z.string().optional(),
  batchId: z.string().optional(),
  customerWallet: z.string().optional(),
}).refine(data => data.code || data.unitCode, {
  message: 'Product unit code is required (code or unitCode).',
  path: ['code'],
});

const claimUnitSchema = z.object({
  claimToken: z.string().optional(),
  otp: z.coerce.string().optional(),
  unitCode: z.string().optional(),
  code: z.string().optional(),
  batchId: z.string().optional(),
}).refine(data => data.claimToken || data.unitCode || data.code, {
  message: 'Claim token or unit code is required to claim product warranty and rewards.',
  path: ['claimToken'],
});

module.exports = {
  verifyUnitSchema,
  sellUnitSchema,
  claimUnitSchema,
};
