const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reportId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
    guestContact: {
      name: { type: String, default: 'Anonymous Guest' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    photos: {
      type: [String],
      default: [],
    },
    geo: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
      city: { type: String, default: 'Unknown', index: true },
      state: { type: String, default: '' },
      address: { type: String, default: '' },
    },
    shopName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
      default: '',
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
    batchNumber: {
      type: String,
      trim: true,
      default: '',
      index: true,
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
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      default: null,
      index: true,
    },
    brandName: {
      type: String,
      default: '',
      index: true,
    },
    manufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ['Submitted', 'UnderReview', 'Valid', 'Invalid'],
      default: 'Submitted',
      index: true,
    },
    adminReview: {
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      reviewedAt: { type: Date, default: null },
      reviewNotes: { type: String, default: '' },
      pointsAwarded: { type: Number, default: 0 },
      txHash: { type: String, default: null },
    },
    notifiedBrand: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ 'geo.city': 1, status: 1 });
reportSchema.index({ manufacturer: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
