const mongoose = require('mongoose');

const creditLedgerSchema = new mongoose.Schema(
  {
    manufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['TOPUP', 'DEDUCTION'],
      required: true,
    },
    amountINR: {
      type: Number,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    referenceId: {
      type: String, // e.g. Batch ID, Payment ID
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const CreditLedger = mongoose.models.CreditLedger || mongoose.model('CreditLedger', creditLedgerSchema);

module.exports = CreditLedger;
