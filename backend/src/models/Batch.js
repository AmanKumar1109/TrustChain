const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema(
  {
    batchNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    batchId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    batchIdBytes32: {
      type: String,
      required: true,
      trim: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productSku: {
      type: String,
      trim: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      default: null,
    },
    brandName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    manufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    manufacturerWallet: {
      type: String,
      required: true,
    },
    merkleRoot: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    protectionLevel: {
      type: String,
      enum: ['Standard', 'HighValue'],
      default: 'Standard',
      index: true,
    },
    protectionLevelCode: {
      type: Number,
      enum: [0, 1], // 0: Standard, 1: HighValue
      default: 0,
    },
    mfgDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    expiryTimestamp: {
      type: Number,
      required: true,
    },
    inrCost: {
      type: Number,
      default: 0,
    },
    txHash: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'recalled', 'expired'],
      default: 'active',
      index: true,
    },
    isRecalled: {
      type: Boolean,
      default: false,
      index: true,
    },
    recallReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to ensure batchId and batchNumber stay in sync
batchSchema.pre('validate', function (next) {
  if (this.batchNumber && !this.batchId) {
    this.batchId = this.batchNumber;
  } else if (this.batchId && !this.batchNumber) {
    this.batchNumber = this.batchId;
  }
  next();
});

module.exports = mongoose.model('Batch', batchSchema);
