const { z } = require('zod');

const topupBillingSchema = z.object({
  amountINR: z.number().min(50, 'Minimum top-up amount is ₹50 INR'),
  paymentMethod: z.enum(['UPI', 'CARD', 'NETBANKING', 'WALLET']).default('UPI'),
  upiId: z.string().trim().optional(),
  cardNumber: z.string().trim().optional(),
  cardLast4: z.string().trim().optional(),
  cardNetwork: z.string().trim().optional(),
  bankName: z.string().trim().optional(),
  referenceId: z.string().trim().optional(),
});

const updatePlanSchema = z.object({
  planCode: z.enum(['STARTER', 'GROWTH', 'ENTERPRISE']),
  billingCycle: z.enum(['monthly', 'annual']).default('monthly'),
});

module.exports = {
  topupBillingSchema,
  updatePlanSchema,
};
