const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  preferredCategories: {
    type: [String],
    default: [],
  },
  preferredRating: {
    type: Number,
    default: 4,  // default rating filter of 4
  },
});

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);
