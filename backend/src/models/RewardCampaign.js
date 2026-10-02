const mongoose = require('mongoose');

const rewardCampaignSchema = new mongoose.Schema(
  {
    manufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      default: null,
    },
    pointsPerScan: {
      type: Number,
      default: 10,
      min: 1,
    },
    streakBonus: {
      type: Number,
      default: 25,
      min: 1,
    },
    streakDaysThreshold: {
      type: Number,
      default: 5,
      min: 2,
    },
    referralBonus: {
      type: Number,
      default: 50,
      min: 1,
    },
    fakeReportBonus: {
      type: Number,
      default: 100,
      min: 1,
    },
    dailyCap: {
      type: Number,
      default: 50, // maximum reward points a consumer can earn per day from scans
      min: 10,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Global or manufacturer-specific campaign lookup
rewardCampaignSchema.index({ manufacturer: 1, isActive: 1 });

module.exports = mongoose.model('RewardCampaign', rewardCampaignSchema);
