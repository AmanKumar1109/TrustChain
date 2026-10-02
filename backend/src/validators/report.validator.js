const { z } = require('zod');

const submitReportSchema = z.object({
  shopName: z.string().min(2, 'Shop or establishment name is required (min 2 characters)'),
  comment: z.string().min(3, 'Detailed observation comment is required (min 3 characters)'),
  code: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  address: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  guestName: z.string().optional(),
  guestPhone: z.string().optional(),
  guestEmail: z.string().email().optional().or(z.literal('')),
});

const reviewReportSchema = z.object({
  status: z.enum(['Submitted', 'UnderReview', 'Valid', 'Invalid'], {
    required_error: 'Review status is required (Submitted, UnderReview, Valid, Invalid)',
  }),
  notes: z.string().optional(),
});

module.exports = {
  submitReportSchema,
  reviewReportSchema,
};
