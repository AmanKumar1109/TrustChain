const { z } = require('zod');

const topupCreditsSchema = z.object({
  amountINR: z.number().positive('Top-up amount must be a positive number in INR'),
  referenceId: z.string().optional(),
});

module.exports = {
  topupCreditsSchema,
};
