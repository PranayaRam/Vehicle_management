const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    default: 1000
  }
});

// Helper to get next sequential identifier starting from startAt (default 1001)
counterSchema.statics.getNextSequence = async function (counterName, startAt = 1000) {
  const counter = await this.findById(counterName);
  if (!counter) {
    const newCounter = await this.create({ _id: counterName, seq: startAt });
    return newCounter.seq;
  }
  const updated = await this.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 1 } },
    { new: true }
  );
  return updated.seq;
};

module.exports = mongoose.model('Counter', counterSchema);
