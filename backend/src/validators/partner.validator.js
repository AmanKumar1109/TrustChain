const { z } = require('zod');
const { PARTNER_ROLES } = require('../constants/roles');

const locationSchema = z.object({
  address: z.string().min(3, 'Address must be at least 3 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(4, 'Valid postal code is required'),
  country: z.string().optional().default('India'),
});

const businessDetailsSchema = z.object({
  storeType: z.string().optional().default('General Store'),
  tradeLicense: z.string().optional().default(''),
  pan: z.string().optional().default(''),
  notes: z.string().optional().default(''),
}).optional();

// 1. Manufacturer / Distributor Invite Partner Schema
const createInviteSchema = z.object({
  email: z.string().email('Valid email is required'),
  role: z.enum(['distributor', 'retailer'], {
    errorMap: () => ({ message: 'Role must be either "distributor" or "retailer"' }),
  }),
  businessName: z.string().min(2, 'Business name is required'),
  name: z.string().optional(),
  phone: z.string().optional(),
  location: locationSchema.optional(),
});

// 2. Partner Join via Invite Link Schema
const joinInviteSchema = z.object({
  token: z.string().min(10, 'Valid invite token is required'),
  name: z.string().min(2, 'Full name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Valid phone number is required'),
  gst: z.string().min(5, 'Valid GST registration number is required'),
  businessDetails: businessDetailsSchema,
  location: locationSchema,
});

// 3. Partner Self-Apply Schema
const selfApplySchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Contact person name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  role: z.enum(['distributor', 'retailer'], {
    errorMap: () => ({ message: 'Role must be either "distributor" or "retailer"' }),
  }),
  businessName: z.string().min(2, 'Business or shop name is required'),
  gst: z.string().min(5, 'Valid GST number is required'),
  businessDetails: businessDetailsSchema,
  location: locationSchema,
  upstreamId: z.string().optional(), // ID of upstream manufacturer or distributor
});

// 4. Reject Partner Schema
const rejectPartnerSchema = z.object({
  reason: z.string().min(3, 'Rejection reason is required (min 3 characters)'),
});

module.exports = {
  createInviteSchema,
  joinInviteSchema,
  selfApplySchema,
  rejectPartnerSchema,
};
