const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['getting_started', 'banner_ad', 'promotion'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  validFrom: Date,
  validUntil: Date,
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

contentSchema.index({ type: 1, active: 1 });

const Content = mongoose.model('Content', contentSchema);
module.exports = Content;