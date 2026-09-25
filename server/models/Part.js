const mongoose = require('mongoose');

const partSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide spare part name'],
      trim: true
    },
    partNumber: {
      type: String,
      required: [true, 'Please provide part number'],
      unique: true,
      uppercase: true,
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please provide part category'],
      enum: ['Brakes', 'Fluids & Lubricants', 'Filters', 'Engine Components', 'Electricals', 'Suspension', 'Tyres', 'Body & Exterior', 'General'],
      default: 'General'
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Please provide current stock quantity'],
      min: [0, 'Stock quantity cannot be negative']
    },
    minimumStock: {
      type: Number,
      required: [true, 'Please provide minimum stock warning threshold'],
      default: 5,
      min: [0, 'Minimum stock cannot be negative']
    },
    unitPrice: {
      type: Number,
      required: [true, 'Please provide unit price'],
      min: [0, 'Unit price cannot be negative']
    },
    supplier: {
      type: String,
      trim: true,
      default: 'Authorized OEM Supplier'
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

partSchema.index({ category: 1 });
partSchema.index({ stockQuantity: 1 });

module.exports = mongoose.model('Part', partSchema);
