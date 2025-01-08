const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  timeSlots: [{
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    fitting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fitting'
    }
  }],
  maxDailySlots: {
    type: Number,
    default: 8
  }
}, {
  timestamps: true
});

scheduleSchema.index({ date: 1 });

const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;