const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema(
  {
    unitCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      index: true,
    },
    batchNumber: {
      type: String,
      required: true,
      index: true,
    },
    batchId: {
      type: String,
      trim: true,
      index: true,
      default: function () { return this.batchNumber || ''; },
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      index: true,
    },
    productName: {
      type: String,
      default: '',
    },
    leafHash: {
      type: String,
      index: true,
      default: function () {
        if (!this.unitCode) return '';
        try {
          const { leafHash } = require('../utils/merkle');
          return leafHash(this.unitCode);
        } catch (_) {
          return '';
        }
      },
    },
    proof: {
      type: [String],
      default: [],
    },
    merkleProof: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['inStock', 'allocated', 'inTransit', 'sold', 'claimed', 'recalled', 'soldAwaitingClaim', 'sold_awaiting_claim'],
      default: 'inStock',
      index: true,
    },
    protectionLevel: {
      type: String,
      enum: ['Standard', 'HighValue'],
      default: 'Standard',
      index: true,
    },
    scratchCodeHash: {
      type: String,
      default: null, // SHA-256 hash of the secret scratch code (for HighValue)
      index: true,
    },
    soldState: {
      type: Number,
      enum: [0, 1, 2], // 0: Unsold, 1: Sold, 2: Claimed
      default: 0,
      index: true,
    },
    currentOwnerWallet: {
      type: String,
      default: null,
    },
    retailer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    claimToken: {
      type: String,
      default: null,
      index: true,
    },
    sale: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sale',
      default: null,
    },
    soldAt: {
      type: Date,
      default: null,
    },
    warrantyExpiryDate: {
      type: Date,
      default: null,
    },
    claimedAt: {
      type: Date,
      default: null,
    },
    scanCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to ensure batchId and batchNumber stay in sync
unitSchema.pre('validate', function (next) {
  if (this.batchNumber && !this.batchId) {
    this.batchId = this.batchNumber;
  } else if (this.batchId && !this.batchNumber) {
    this.batchNumber = this.batchId;
  }
  next();
});

module.exports = mongoose.model('Unit', unitSchema);
