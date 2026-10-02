const mongoose = require('mongoose');

const unitTransferSchema = new mongoose.Schema(
  {
    transferId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    transferIdBytes32: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
      required: true,
      index: true,
    },
    unitCode: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    unitHash: {
      type: String,
      required: true,
      trim: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      index: true,
    },
    batchId: {
      type: String,
      trim: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      index: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sellerName: {
      type: String,
      default: '',
    },
    sellerPhone: {
      type: String,
      default: '',
    },
    sellerWallet: {
      type: String,
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    buyerName: {
      type: String,
      default: '',
    },
    buyerPhone: {
      type: String,
      required: true,
      index: true,
    },
    buyerWallet: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    txHash: {
      type: String,
      default: null,
    },
    respondTxHash: {
      type: String,
      default: null,
    },
    timeline: [
      {
        status: { type: String, required: true },
        action: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        actorName: { type: String, default: '' },
        actorRole: { type: String, default: 'consumer' },
        note: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

unitTransferSchema.index({ seller: 1, status: 1 });
unitTransferSchema.index({ buyer: 1, status: 1 });
unitTransferSchema.index({ unitCode: 1, status: 1 });

module.exports = mongoose.model('UnitTransfer', unitTransferSchema);
