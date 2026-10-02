const { z } = require('zod');
const { ALL_ROLES } = require('../constants/roles');

// Consumer Schemas (Phone + Mock OTP)
const consumerRequestOtpSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

const consumerVerifyOtpSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  otp: z.string().min(4, 'OTP code is required'),
  name: z.string().optional(),
});

const consumerSignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  otp: z.string().min(4, 'OTP code is required'),
});

const consumerLoginSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  otp: z.string().min(4, 'OTP code is required'),
});

// Business Role Schemas (Manufacturer, Distributor, Retailer, Admin - Email + Password)
const businessSignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email address is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['manufacturer', 'distributor', 'retailer', 'admin'], {
    errorMap: () => ({ message: 'Role must be one of: manufacturer, distributor, retailer, admin' }),
  }),
  companyName: z.string().optional(),
  gst: z.string().optional(),
  cin: z.string().optional(),
  phone: z.string().optional(),
  licenseNumber: z.string().optional(),
});

const businessLoginSchema = z.object({
  email: z.string().email('Valid email address is required'),
  password: z.string().min(1, 'Password is required'),
});

// Password Reset Schemas (Stub)
const forgotPasswordSchema = z.object({
  email: z.string().email('Valid email address is required'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

// Legacy / General schemas for backwards compatibility
const sendOtpSchema = consumerRequestOtpSchema;
const verifyOtpSchema = consumerVerifyOtpSchema;
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(ALL_ROLES),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  companyName: z.string().optional(),
  licenseNumber: z.string().optional(),
});

module.exports = {
  consumerRequestOtpSchema,
  consumerVerifyOtpSchema,
  consumerSignupSchema,
  consumerLoginSchema,
  businessSignupSchema,
  businessLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  sendOtpSchema,
  verifyOtpSchema,
  registerSchema,
};
