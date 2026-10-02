const { z } = require('zod');

const updateCompanyProfileSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters').trim().optional(),
  legalName: z.string().trim().optional(),
  gst: z.string().trim().optional(),
  cin: z.string().trim().optional(),
  pan: z.string().trim().optional(),
  website: z.string().trim().optional(),
  supportEmail: z.string().email('Please provide a valid support email address').optional(),
  supportPhone: z.string().trim().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  brandLogoUrl: z.string().trim().optional(),
  description: z.string().trim().optional(),
});

const inviteTeamMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.string().email('Please enter a valid email address').trim().toLowerCase(),
  phone: z.string().trim().optional(),
  role: z.enum(['Admin', 'Manager', 'Operator', 'Viewer', 'Compliance']).default('Operator'),
});

const updateTeamMemberSchema = z.object({
  role: z.enum(['Admin', 'Manager', 'Operator', 'Viewer', 'Compliance']).optional(),
  status: z.enum(['Active', 'Invited', 'Suspended']).optional(),
});

const updateNotificationPreferencesSchema = z.object({
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  lowCreditWarning: z.boolean().optional(),
  lowCreditThreshold: z.number().min(0).optional(),
  counterfeitAlerts: z.boolean().optional(),
  transferUpdates: z.boolean().optional(),
  dailyDigest: z.boolean().optional(),
  webhookUrl: z.string().trim().optional(),
});

module.exports = {
  updateCompanyProfileSchema,
  inviteTeamMemberSchema,
  updateTeamMemberSchema,
  updateNotificationPreferencesSchema,
};
