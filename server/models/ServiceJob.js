const mongoose = require('mongoose');

const serviceJobSchema = new mongoose.Schema(
  {
    jobNumber: {
      type: String,
      required: true,
      unique: true
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
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
    assignedStaffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: [
        'INSPECTION',
        'ESTIMATE_PENDING',
        'APPROVED',
        'IN_SERVICE',
        'QUALITY_CHECK',
        'READY_FOR_DELIVERY',
        'COMPLETED',
        'CANCELLED'
      ],
      default: 'INSPECTION'
    },
    reportedProblem: {
      type: String,
      required: true,
      trim: true
    },
    serviceNotes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

serviceJobSchema.index({ customerId: 1 });
serviceJobSchema.index({ vehicleId: 1 });
serviceJobSchema.index({ assignedStaffId: 1 });
serviceJobSchema.index({ status: 1 });

module.exports = mongoose.model('ServiceJob', serviceJobSchema);
