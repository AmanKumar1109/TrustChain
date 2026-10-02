const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ALL_ROLES, ROLES } = require('../constants/roles');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Phone is primary for consumers, optional for business roles
    phone: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
    },
    // Email is primary for manufacturer, partner, admin; optional for consumers
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      unique: true,
    },
    // Hashed with bcryptjs for manufacturer, partner, admin
    password: {
      type: String,
      select: false, // Don't return password in queries by default
    },
    role: {
      type: String,
      enum: ALL_ROLES,
      default: ROLES.CONSUMER,
      required: true,
    },
    // Internal Ethereum wallet address assigned for on-chain identity tracking.
    // The blockchain is invisible to users; gas and signatures are handled by the Relayer.
    walletAddress: {
      type: String,
      trim: true,
      default: null,
    },
    // AES-encrypted private key (stored securely with ENCRYPTION_KEY, invisible to user)
    encryptedPrivateKey: {
      type: String,
      select: false,
    },
    companyName: {
      type: String,
      trim: true,
    },
    gst: {
      type: String,
      trim: true,
      uppercase: true,
    },
    cin: {
      type: String,
      trim: true,
      uppercase: true,
    },
    licenseNumber: {
      type: String,
      trim: true,
    },
    // Brand approval status for manufacturers
    brandStatus: {
      type: String,
      enum: ['none', 'pending', 'approved', 'rejected', 'infoRequested'],
      default: 'none',
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // INR-based prepaid credit balance for manufacturers (1 Credit = 1 INR)
    creditBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Cached TPTS loyalty token balance
    pointsBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Referral system
    referralCode: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Daily scan streak tracking
    scanStreak: {
      currentStreak: { type: Number, default: 0 },
      lastScanDate: { type: Date, default: null },
      longestStreak: { type: Number, default: 0 },
    },
    // Stub token for password reset
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED'],
      default: 'ACTIVE',
    },
    // Billing Plan for Manufacturers
    plan: {
      name: { type: String, default: 'Growth' },
      code: { type: String, default: 'GROWTH' },
      unitRateStandard: { type: Number, default: 1 },
      unitRateHighValue: { type: Number, default: 2 },
      monthlyAllowance: { type: Number, default: 1000 },
      billingCycle: { type: String, enum: ['monthly', 'annual'], default: 'monthly' },
      renewalDate: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      status: { type: String, default: 'ACTIVE' },
    },
    // Extended Company Profile Settings
    companyProfile: {
      legalName: { type: String, trim: true, default: '' },
      pan: { type: String, trim: true, uppercase: true, default: '' },
      website: { type: String, trim: true, default: '' },
      supportEmail: { type: String, trim: true, lowercase: true, default: '' },
      supportPhone: { type: String, trim: true, default: '' },
      address: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        pincode: { type: String, default: '' },
        country: { type: String, default: 'India' },
      },
      brandLogoUrl: { type: String, default: '' },
      description: { type: String, default: '' },
    },
    // Notification & Alert Preferences
    notificationPreferences: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: true },
      lowCreditWarning: { type: Boolean, default: true },
      lowCreditThreshold: { type: Number, default: 500 },
      counterfeitAlerts: { type: Boolean, default: true },
      transferUpdates: { type: Boolean, default: true },
      dailyDigest: { type: Boolean, default: false },
      webhookUrl: { type: String, default: '' },
    },
    // Administrative Suspension Audit
    suspension: {
      suspendedAt: { type: Date, default: null },
      suspendedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      reason: { type: String, default: null },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to ensure referralCode exists
userSchema.pre('validate', function (next) {
  if (!this.referralCode) {
    const crypto = require('crypto');
    const prefix = this.name ? this.name.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'TC') : 'TC';
    const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
    this.referralCode = `${prefix}-${rand}`;
  }
  next();
});

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Helper method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
