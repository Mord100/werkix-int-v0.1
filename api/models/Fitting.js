const mongoose = require('mongoose');

const fittingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['swing-analysis', 'club-fitting'],
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    trim: true
  },
  comments: String,
  status: {
    type: String,
    enum: [
      'Fitting Request Submitted',
      'Fitting Being Prepped',
      'Fitting Scheduled',
      'Fitting Canceled',
      'Fitting Completed'
    ],
    default: 'Fitting Request Submitted'
  },
  statusHistory: [{
    status: {
      type: String,
      enum: [
        'Fitting Request Submitted',
        'Fitting Being Prepped',
        'Fitting Scheduled',
        'Fitting Canceled',
        'Fitting Completed'
      ]
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  measurements: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Fitting', fittingSchema);