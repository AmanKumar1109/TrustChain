const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    manufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    gst: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
    },
    cin: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
    },
    billingAddress: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      country: { type: String, default: 'India' },
    },
    items: [invoiceItemSchema],
    creditsPurchased: {
      type: Number,
      required: true,
    },
    subtotalINR: {
      type: Number,
      required: true,
    },
    gstRate: {
      type: Number,
      default: 18, // 18% standard GST on SaaS / Technology services in India
    },
    gstAmountINR: {
      type: Number,
      required: true,
    },
    totalAmountINR: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'CARD', 'NETBANKING', 'WALLET'],
      default: 'UPI',
    },
    paymentReference: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    paymentDetails: {
      upiId: { type: String, default: null },
      cardLast4: { type: String, default: null },
      cardNetwork: { type: String, default: null },
      bankName: { type: String, default: null },
      gatewayTxId: { type: String, default: null },
    },
    status: {
      type: String,
      enum: ['PAID', 'PENDING', 'FAILED', 'REFUNDED'],
      default: 'PAID',
      index: true,
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: 'Thank you for your business. Credits have been credited to your prepaid ledger immediately.',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate invoice number if not provided
invoiceSchema.pre('validate', async function (next) {
  if (!this.invoiceNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Invoice').countDocuments();
    const seq = String(count + 1001).padStart(5, '0');
    this.invoiceNumber = `INV-${year}-${seq}`;
  }
  next();
});

const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
