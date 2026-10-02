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
      enum: ['Standard', 'HighValue', 'High-Value'],
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
      enum: ['active', 'recalled', 'expired', 'Active', 'Recalled', 'Expired'],
      default: 'active',
      index: true,
    },
    isRecalled: {
      type: Boolean,
      default: false,
      index: true,
    },
    recalled: {
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

// Pre-save hook to ensure batchId, batchNumber, bytes32, and timestamps stay in sync
batchSchema.pre('validate', function (next) {
  if (this.batchNumber && !this.batchId) {
    this.batchId = this.batchNumber;
  } else if (this.batchId && !this.batchNumber) {
    this.batchNumber = this.batchId;
  }
  if (!this.batchIdBytes32 && (this.batchId || this.batchNumber)) {
    const { ethers } = require('ethers');
    this.batchIdBytes32 = ethers.id(this.batchId || this.batchNumber);
  }
  if (this.expiryDate && !this.expiryTimestamp) {
    this.expiryTimestamp = Math.floor(new Date(this.expiryDate).getTime() / 1000);
  } else if (this.expiryTimestamp && !this.expiryDate) {
    this.expiryDate = new Date(this.expiryTimestamp * 1000);
  }
  if (this.status) {
    this.status = this.status.toLowerCase();
  }
  if (this.recalled || this.status === 'recalled') {
    this.isRecalled = true;
    this.status = 'recalled';
  }
  if (!this.manufacturerWallet) {
    this.manufacturerWallet = '0x0000000000000000000000000000000000000000';
  }
  next();
});

module.exports = mongoose.model('Batch', batchSchema);
