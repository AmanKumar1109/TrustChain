const { z } = require('zod');

const suspendEntitySchema = z.object({
  reason: z.string().min(3, 'Suspension reason must be at least 3 characters long').trim(),
});

const rewardOfferAdminSchema = z.object({
  title: z.string().min(2, 'Title is required').trim(),
  description: z.string().min(5, 'Description is required').trim(),
  category: z.enum(['Discounts', 'Gift Cards', 'Vouchers', 'Merchandise', 'Cashback']).default('Discounts'),
  pointsRequired: z.number().positive('Points required must be greater than 0'),
  couponPrefix: z.string().min(2).max(10).trim().default('TPTS'),
  partner: z.string().min(2, 'Partner name is required').trim(),
  discountAmount: z.number().min(0).default(0),
  discountPercentage: z.number().min(0).max(100).default(0),
  stock: z.number().default(-1), // -1 unlimited
  terms: z.string().trim().optional(),
  image: z.string().trim().optional(),
  isActive: z.boolean().default(true),
});

const updateRewardOfferAdminSchema = rewardOfferAdminSchema.partial();

module.exports = {
  suspendEntitySchema,
  rewardOfferAdminSchema,
  updateRewardOfferAdminSchema,
};
