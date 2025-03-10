const UserPreferences = require('../models/userPreferencesModel');
const { getRecommendations } = require('../services/aiRecommendationService');
const Business = require('../models/Business');

// Set user preferences for recommendations
exports.setPreferences = async (req, res) => {
  try {
    const { preferredCategories, location, preferredRating } = req.body;
    let preferences = await UserPreferences.findOne({ userId: req.user.id });

    if (preferences) {
      preferences.preferredCategories = preferredCategories;
      preferences.location = location;
      preferences.preferredRating = preferredRating;
    } else {
      preferences = new UserPreferences({
        userId: req.user.id,
        preferredCategories,
        location,
        preferredRating
      });
    }

    await preferences.save();
    res.status(200).json({ message: 'Preferences updated successfully', preferences });
  } catch (error) {
    res.status(500).json({ message: 'Error updating preferences', error: error.message });
  }
};

// Get AI-based recommendations for user based on preferences
exports.getRecommendations = async (req, res) => {
  try {
    const preferences = await UserPreferences.findOne({ userId: req.user.id });
    if (!preferences) return res.status(404).json({ message: 'User preferences not set' });

    const recommendations = getRecommendations(preferences);
    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Error getting recommendations', error: error.message });
  }
};

// Get trending businesses based on user activity
exports.getTrendingBusinesses = async (req, res) => {
  try {
    // In a real-world scenario, you can track user activity such as views, clicks, etc.
    // For now, let's assume we just fetch the most popular businesses based on some criteria
    const trendingBusinesses = await Business.find().sort({ rating: -1 }).limit(5);
    res.status(200).json(trendingBusinesses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trending businesses', error: error.message });
  }
};
