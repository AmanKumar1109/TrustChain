const mongoose = require('mongoose');
const { PARTNER_ROLES } = require('../constants/roles');

const locationSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    country: {
      type: String,
      default: 'India',
      trim: true,
    },
  },
  { _id: false }
);

const businessDetailsSchema = new mongoose.Schema(
  {
    storeType: {
      type: String,
      trim: true,
      default: 'General Store',
    },
    tradeLicense: {
      type: String,
      trim: true,
      default: '',
    },
    pan: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const partnerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    role: {
      type: String,
      enum: PARTNER_ROLES, // 'distributor', 'retailer'
      required: true,
      index: true,
    },
    gst: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    businessDetails: {
      type: businessDetailsSchema,
      default: () => ({}),
    },
    location: {
      type: locationSchema,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    walletAddress: {
      type: String,
      default: null,
      trim: true,
    },
    onboardingMethod: {
      type: String,
      enum: ['invite', 'self-apply'],
      required: true,
      index: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    upstream: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    inviteToken: {
      type: String,
      default: null,
      index: true,
    },
    inviteExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for search
partnerSchema.index({
  businessName: 'text',
  name: 'text',
  email: 'text',
  gst: 'text',
  'location.city': 'text',
});

module.exports = mongoose.model('Partner', partnerSchema);
