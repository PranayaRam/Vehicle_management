const mongoose = require('mongoose');

const serviceTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide service type name'],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide service type description'],
      trim: true
    },
    basePrice: {
      type: Number,
      required: [true, 'Please provide base price'],
      min: [0, 'Base price cannot be negative']
    },
    estimatedDuration: {
      type: String,
      required: [true, 'Please provide estimated duration (e.g. 3-4 Hours)'],
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ServiceType', serviceTypeSchema);
