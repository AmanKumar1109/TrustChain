const mongoose = require('mongoose');

const rewardLedgerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'FIRST_SCAN_REWARD',
        'STREAK_BONUS',
        'REFERRAL_BONUS',
        'FAKE_REPORT_BONUS',
        'PRODUCT_CLAIM',
        'REDEMPTION',
        'MANUAL_ADJUSTMENT',
      ],
      required: true,
      index: true,
    },
    points: {
      type: Number,
      required: true,
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
      default: null,
      index: true,
    },
    unitCode: {
      type: String,
      default: null,
      index: true,
    },
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RewardOffer',
      default: null,
    },
    txHash: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      required: true,
    },
    balanceAfter: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly enforce first genuine scan per user per unit
rewardLedgerSchema.index({ user: 1, unitCode: 1, type: 1 });
rewardLedgerSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('RewardLedger', rewardLedgerSchema);
