const mongoose = require('mongoose');

const ShareSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  platform: {
    type: String,
    enum: ['facebook', 'twitter', 'linkedin', 'whatsapp'],
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  sharedAt: {
    type: Date,
    default: Date.now
  }
});

const Share = mongoose.model('Share', ShareSchema);

module.exports = Share;
