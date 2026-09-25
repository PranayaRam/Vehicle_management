const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true
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
    serviceTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceType',
      required: true
    },
    preferredDate: {
      type: Date,
      required: [true, 'Please select a preferred service date']
    },
    preferredTime: {
      type: String,
      required: [true, 'Please select a preferred time slot'],
      trim: true
    },
    problemDescription: {
      type: String,
      required: [true, 'Please provide problem description or service remarks'],
      trim: true,
      maxlength: [1000, 'Problem description cannot exceed 1000 characters']
    },
    status: {
      type: String,
      enum: ['BOOKED', 'CONFIRMED', 'CHECKED_IN', 'CANCELLED'],
      default: 'BOOKED'
    },
    cancellationReason: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

bookingSchema.index({ customerId: 1 });
bookingSchema.index({ vehicleId: 1 });
bookingSchema.index({ status: 1 });


module.exports = mongoose.model('Booking', bookingSchema);
