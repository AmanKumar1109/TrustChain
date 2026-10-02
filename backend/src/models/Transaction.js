const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    txHash: {
      type: String,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'failed'],
      default: 'pending',
      required: true,
      index: true,
    },
    contractName: {
      type: String,
      required: true,
    },
    contractAddress: {
      type: String,
      required: true,
    },
    functionName: {
      type: String,
      required: true,
    },
    args: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    relatedEntity: {
      entityType: {
        type: String, // e.g., 'Batch', 'Unit', 'CustodyTransfer', 'User'
        required: true,
      },
      entityId: {
        type: String,
        required: true,
      },
    },
    error: {
      type: String,
      default: null,
    },
    attempts: {
      type: Number,
      default: 1,
    },
    maxAttempts: {
      type: Number,
      default: 3,
    },
    blockNumber: {
      type: Number,
      default: null,
    },
    gasUsed: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
