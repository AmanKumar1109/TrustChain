const { z } = require('zod');

const createBatchSchema = z.object({
  product: z.string().min(1, 'Product ID is required'),
  batchNumber: z.string().min(3, 'Batch number must be at least 3 characters').optional(),
  batchId: z.string().min(3, 'Batch ID must be at least 3 characters').optional(),
  quantity: z.coerce.number().int().positive('Quantity must be at least 1 unit'),
  mfgDate: z.coerce.date().optional(),
  expiryDate: z.coerce.date().optional(),
  expiryDays: z.coerce.number().int().positive().optional(),
  protectionLevel: z.preprocess(
    val => {
      if (val === 0 || val === '0' || val === 'standard' || val === 'Standard') return 'Standard';
      if (val === 1 || val === '1' || val === 'highvalue' || val === 'HighValue') return 'HighValue';
      return val || 'Standard';
    },
    z.enum(['Standard', 'HighValue']).default('Standard')
  ),
  description: z.string().optional(),
  category: z.string().optional(),
}).refine(data => data.batchNumber || data.batchId, {
  message: 'Either batchNumber or batchId is required',
  path: ['batchNumber'],
}).refine(data => data.expiryDate || data.expiryDays, {
  message: 'Either expiryDate or expiryDays is required',
  path: ['expiryDate'],
});

const recallBatchSchema = z.object({
  reason: z.string().min(3, 'Recall reason is required (min 3 characters)'),
});

module.exports = {
  createBatchSchema,
  recallBatchSchema,
};
