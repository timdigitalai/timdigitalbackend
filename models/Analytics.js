const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business'
  },
  visitCount: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  userActivity: {
    type: Map,
    of: Number,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
analyticsSchema.index({ placeId: 1 });
analyticsSchema.index({ visitCount: -1 });
analyticsSchema.index({ reviewCount: -1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics; 