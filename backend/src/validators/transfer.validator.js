const { z } = require('zod');

const createTransferSchema = z.object({
  batchId: z.string().min(1, 'Batch ID or number is required'),
  toPartnerId: z.string().optional(),
  toUserId: z.string().optional(),
  toWallet: z.string().optional(),
  quantity: z.coerce.number().int().positive('Transfer quantity must be at least 1 unit'),
  notes: z.string().optional(),
}).refine(data => data.toPartnerId || data.toUserId || data.toWallet, {
  message: 'Recipient partner must be specified (toPartnerId, toUserId, or toWallet)',
  path: ['toPartnerId'],
});

const respondTransferSchema = z.object({
  accept: z.boolean({ required_error: 'Accept parameter (boolean) is required' }),
  reason: z.string().optional(),
  notes: z.string().optional(),
}).refine(data => {
  if (data.accept === false) {
    return typeof data.reason === 'string' && data.reason.trim().length >= 3;
  }
  return true;
}, {
  message: 'A rejection reason (min 3 characters) is required when rejecting a transfer.',
  path: ['reason'],
});

module.exports = {
  createTransferSchema,
  initiateTransferSchema: createTransferSchema, // backward compatibility alias
  respondTransferSchema,
};
