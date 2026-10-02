const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
  {
    saleId: {
      type: String,
      required: true,
      unique: true,
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
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
      index: true,
    },
    batchId: {
      type: String,
      required: true,
      trim: true,
      index: true,
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
    retailer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    retailerName: {
      type: String,
      default: '',
    },
    retailerWallet: {
      type: String,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    customerPhone: {
      type: String,
      required: true,
      index: true,
    },
    customerWallet: {
      type: String,
      required: true,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    warranty: {
      durationMonths: {
        type: Number,
        default: 12,
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      expiryDate: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ['Active', 'Claimed', 'Expired'],
        default: 'Active',
      },
      terms: {
        type: String,
        default: 'Standard manufacturer warranty against manufacturing defects.',
      },
    },
    claimToken: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    claimTokenExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
    claimLink: {
      type: String,
      required: true,
    },
    isClaimed: {
      type: Boolean,
      default: false,
      index: true,
    },
    claimedAt: {
      type: Date,
      default: null,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    txHash: {
      type: String,
      default: null,
    },
    claimTxHash: {
      type: String,
      default: null,
    },
    price: {
      type: Number,
      default: 0,
    },
    invoiceNumber: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Sale', saleSchema);
