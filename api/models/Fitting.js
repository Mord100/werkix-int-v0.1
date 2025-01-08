const mongoose = require('mongoose');

const fittingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Swing Analysis', 'Club Fitting'],
    required: true
  },
  status: {
    type: String,
    enum: [
      'Fitting Request Submitted',
      'Fitting being Prepped',
      'Fitting Scheduled',
      'Fitting Canceled',
      'Fitting Completed'
    ],
    default: 'Fitting Request Submitted'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  comments: String,
  statusHistory: [{
    status: {
      type: String,
      enum: [
        'Fitting Request Submitted',
        'Fitting being Prepped',
        'Fitting Scheduled',
        'Fitting Canceled',
        'Fitting Completed'
      ]
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  measurements: {
    swingSpeed: Number,
    launchAngle: Number,
    spinRate: Number,
    clubRecommendations: [String]
  }
}, {
  timestamps: true
});

fittingSchema.index({ customer: 1, scheduledDate: 1 });

const Fitting = mongoose.model('Fitting', fittingSchema);
module.exports = Fitting;