const mongoose = require('mongoose');

const redemptionSchema = new mongoose.Schema(
  {
    redemptionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userWallet: {
      type: String,
      default: '',
    },
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RewardOffer',
      required: true,
      index: true,
    },
    offerTitle: {
      type: String,
      required: true,
    },
    pointsSpent: {
      type: Number,
      required: true,
      min: 1,
    },
    couponCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    txHash: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['Active', 'Used', 'Expired'],
      default: 'Active',
      index: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      index: true,
    },
    usedAt: {
      type: Date,
      default: null,
    },
    terms: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

redemptionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Redemption', redemptionSchema);
