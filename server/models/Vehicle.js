const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vehicle must belong to a customer']
    },
    registrationNumber: {
      type: String,
      required: [true, 'Please provide vehicle registration number'],
      unique: true,
      uppercase: true,
      trim: true
    },
    brand: {
      type: String,
      required: [true, 'Please provide vehicle brand (make)'],
      trim: true
    },
    model: {
      type: String,
      required: [true, 'Please provide vehicle model'],
      trim: true
    },
    variant: {
      type: String,
      trim: true,
      default: ''
    },
    manufacturingYear: {
      type: Number,
      required: [true, 'Please provide manufacturing year'],
      min: [1980, 'Manufacturing year cannot be older than 1980'],
      max: [new Date().getFullYear() + 1, 'Manufacturing year cannot be in the future']
    },
    fuelType: {
      type: String,
      required: [true, 'Please select fuel type'],
      enum: {
        values: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
        message: '{VALUE} is not a supported fuel type'
      }
    },
    currentMileage: {
      type: Number,
      required: [true, 'Please provide current mileage'],
      min: [0, 'Mileage cannot be negative']
    },
    vin: {
      type: String,
      uppercase: true,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Index for quick queries by customer
vehicleSchema.index({ customerId: 1 });


module.exports = mongoose.model('Vehicle', vehicleSchema);
