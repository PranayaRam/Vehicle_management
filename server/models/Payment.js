const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      required: true
    },
    amount: {
      type: Number,
      required: [true, 'Please provide payment amount'],
      min: [1, 'Payment amount must be greater than zero']
    },
    paymentMethod: {
      type: String,
      required: [true, 'Please specify payment method'],
      enum: ['CASH', 'CARD', 'UPI']
    },
    transactionReference: {
      type: String,
      trim: true,
      default: () => `TXN-${Date.now().toString().slice(-6)}`
    },
    paymentDate: {
      type: Date,
      default: Date.now
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED'],
      default: 'SUCCESS'
    }
  },
  {
    timestamps: true
  }
);

paymentSchema.index({ invoiceId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
