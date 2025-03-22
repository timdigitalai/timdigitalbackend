const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  preferredCategories: {
    type: [String],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  preferredRating: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);
