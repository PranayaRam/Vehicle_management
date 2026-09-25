const mongoose = require('mongoose');

const inspectionItemSchema = new mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
      enum: [
        'Engine',
        'Brakes',
        'Tyres',
        'Battery',
        'Engine Oil',
        'AC',
        'Lights',
        'Exterior'
      ]
    },
    condition: {
      type: String,
      required: true,
      enum: ['GOOD', 'NEEDS_ATTENTION', 'CRITICAL'],
      default: 'GOOD'
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { _id: false }
);

const inspectionSchema = new mongoose.Schema(
  {
    serviceJobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceJob',
      required: true,
      unique: true
    },
    inspectionItems: {
      type: [inspectionItemSchema],
      required: true,
      validate: [
        (val) => val.length > 0,
        'Inspection must include evaluation points'
      ]
    },
    overallNotes: {
      type: String,
      trim: true,
      default: ''
    },
    inspectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    inspectionDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

inspectionSchema.index({ serviceJobId: 1 });

module.exports = mongoose.model('Inspection', inspectionSchema);
