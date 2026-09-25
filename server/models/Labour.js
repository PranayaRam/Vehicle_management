const mongoose = require('mongoose');

const labourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide labour service name'],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
      trim: true
    },
    charge: {
      type: Number,
      required: [true, 'Please provide labour charge'],
      min: [0, 'Labour charge cannot be negative']
    },
    estimatedDuration: {
      type: String,
      required: [true, 'Please provide estimated duration (e.g. 1.5 Hours)'],
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

module.exports = mongoose.model('Labour', labourSchema);
