const mongoose = require('mongoose');

const rewardOfferSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Discounts', 'Gift Cards', 'Vouchers', 'Merchandise', 'Cashback'],
      default: 'Discounts',
      index: true,
    },
    pointsRequired: {
      type: Number,
      required: true,
      min: 1,
      index: true,
    },
    couponPrefix: {
      type: String,
      default: 'TPTS',
      uppercase: true,
      trim: true,
    },
    partner: {
      type: String,
      default: 'TrustChain Rewards',
      trim: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: '',
    },
    stock: {
      type: Number,
      default: -1, // -1 means unlimited
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    terms: {
      type: String,
      default: 'Valid for 30 days from redemption. Non-transferable and cannot be exchanged for cash.',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RewardOffer', rewardOfferSchema);
