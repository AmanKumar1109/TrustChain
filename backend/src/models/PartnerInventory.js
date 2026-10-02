const mongoose = require('mongoose');

const partnerInventorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner',
      default: null,
      index: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
      index: true,
    },
    batchNumber: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
      index: true,
    },
    productName: {
      type: String,
      default: '',
      trim: true,
    },
    productSku: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    totalReceived: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalTransferredOut: {
      type: Number,
      default: 0,
      min: 0,
    },
    protectionLevel: {
      type: String,
      enum: ['Standard', 'HighValue'],
      default: 'Standard',
    },
    mfgDate: {
      type: Date,
      default: null,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    lastReceivedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index ensuring one inventory holding record per user per batch
partnerInventorySchema.index({ user: 1, batchNumber: 1 }, { unique: true });

const PartnerInventory =
  mongoose.models.PartnerInventory || mongoose.model('PartnerInventory', partnerInventorySchema);

module.exports = PartnerInventory;
