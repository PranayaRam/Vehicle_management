const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    currentMileage: {
      type: Number,
      required: [true, 'Please record current mileage at intake'],
      min: [0, 'Mileage cannot be negative']
    },
    fuelLevel: {
      type: String,
      required: [true, 'Please record fuel level'],
      enum: ['10%', '25%', '40%', '50%', '75%', '100%']
    },
    exteriorCondition: {
      type: String,
      required: [true, 'Please note exterior condition'],
      trim: true,
      default: 'Good condition'
    },
    existingDamage: {
      type: String,
      trim: true,
      default: 'None reported'
    },
    customerComplaint: {
      type: String,
      required: [true, 'Please record verified customer complaint'],
      trim: true
    },
    checkInDateTime: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

checkInSchema.index({ bookingId: 1 });
checkInSchema.index({ vehicleId: 1 });

module.exports = mongoose.model('CheckIn', checkInSchema);
