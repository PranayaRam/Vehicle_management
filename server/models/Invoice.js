const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true
    },
    serviceJobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceJob',
      required: true
    },
    estimateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Estimate'
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true
    },
    parts: [
      {
        partId: { type: mongoose.Schema.Types.ObjectId, ref: 'Part' },
        name: String,
        quantity: Number,
        unitPrice: Number,
        total: Number
      }
    ],
    labour: [
      {
        labourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Labour' },
        name: String,
        quantity: Number,
        unitCharge: Number,
        total: Number
      }
    ],
    additionalCharges: {
      type: Number,
      default: 0
    },
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    amountPaid: {
      type: Number,
      default: 0
    },
    paymentStatus: {
      type: String,
      enum: ['UNPAID', 'PARTIAL', 'PAID'],
      default: 'UNPAID'
    },
    issuedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

invoiceSchema.index({ serviceJobId: 1 });
invoiceSchema.index({ customerId: 1 });
invoiceSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Invoice', invoiceSchema);
