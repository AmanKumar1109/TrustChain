const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
      default: null,
      index: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      default: null,
      index: true,
    },
    batchId: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },
    ip: {
      type: String,
      default: '127.0.0.1',
    },
    city: {
      type: String,
      trim: true,
      default: 'Unknown',
      index: true,
    },
    geo: {
      city: { type: String, default: 'Unknown' },
      country: { type: String, default: 'India' },
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    result: {
      type: String,
      required: true,
      enum: [
        'genuine',
        'soldAwaitingClaim',
        'suspicious',
        'recalled',
        'expired',
        'fake',
        'notFound',
        // Also support legacy/uppercase variants if needed
        'GENUINE',
        'SUSPICIOUS',
        'RECALLED',
        'SOLD_UNCLAIMED',
        'INVALID',
      ],
      index: true,
    },
    reason: {
      type: String,
      default: null,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for high performance clone detection across time windows
scanSchema.index({ code: 1, createdAt: -1 });
scanSchema.index({ code: 1, timestamp: -1 });

module.exports = mongoose.model('Scan', scanSchema);
