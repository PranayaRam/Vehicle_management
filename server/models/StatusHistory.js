const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  serviceJobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceJob',
    required: true
  },
  oldStatus: {
    type: String,
    required: true
  },
  newStatus: {
    type: String,
    required: true
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  remarks: {
    type: String,
    trim: true,
    default: ''
  },
  changedAt: {
    type: Date,
    default: Date.now
  }
});

statusHistorySchema.index({ serviceJobId: 1, changedAt: 1 });

module.exports = mongoose.model('StatusHistory', statusHistorySchema);
