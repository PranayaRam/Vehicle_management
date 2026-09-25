const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    serviceJobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceJob',
      required: true,
      unique: true
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    deliveredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recipientName: {
      type: String,
      trim: true,
      required: [true, 'Please record recipient name receiving the vehicle']
    },
    deliveryDate: {
      type: Date,
      default: Date.now
    },
    deliveryNotes: {
      type: String,
      trim: true,
      default: 'Vehicle handed over in clean and tested condition'
    },
    status: {
      type: String,
      enum: ['DELIVERED'],
      default: 'DELIVERED'
    }
  },
  {
    timestamps: true
  }
);

deliverySchema.index({ serviceJobId: 1 });
deliverySchema.index({ vehicleId: 1 });
deliverySchema.index({ customerId: 1 });

module.exports = mongoose.model('Delivery', deliverySchema);
