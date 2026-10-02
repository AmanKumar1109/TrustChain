const mongoose = require('mongoose');

const timelineEventSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      required: true,
    },
    action: {
      type: String,
      enum: ['INITIATED', 'ACCEPTED', 'REJECTED'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    actorName: {
      type: String,
      default: '',
    },
    actorRole: {
      type: String,
      default: '',
    },
    note: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const transferSchema = new mongoose.Schema(
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
      trim: true,
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
    batchId: {
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
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fromPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner',
      default: null,
    },
    fromName: {
      type: String,
      default: '',
      trim: true,
    },
    fromRole: {
      type: String,
      default: '',
    },
    fromWallet: {
      type: String,
      required: true,
      trim: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    toPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner',
      default: null,
      index: true,
    },
    toName: {
      type: String,
      default: '',
      trim: true,
    },
    toRole: {
      type: String,
      default: '',
    },
    toWallet: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    rejectionReason: {
      type: String,
      default: '',
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    txHash: {
      type: String,
      default: null,
    },
    respondTxHash: {
      type: String,
      default: null,
    },
    timeline: [timelineEventSchema],
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to ensure batchId and batchNumber stay in sync
transferSchema.pre('validate', function (next) {
  if (this.batchNumber && !this.batchId) {
    this.batchId = this.batchNumber;
  } else if (this.batchId && !this.batchNumber) {
    this.batchNumber = this.batchId;
  }
  next();
});

const Transfer = mongoose.models.Transfer || mongoose.model('Transfer', transferSchema);

module.exports = Transfer;
