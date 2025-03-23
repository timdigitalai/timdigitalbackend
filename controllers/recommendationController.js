const UserPreferences = require('../models/userPreferencesModel');  // Your model for user preferences
const { getRecommendations } = require('../services/aiRecommendationService');  // Your AI recommendation service
const Business = require('../models/Business');  // Your model for businesses
const Recommendation = require('../models/Recommendation');
const Review = require('../models/Review');

// Set user preferences for recommendations
exports.setPreferences = async (req, res) => {
  try {
    const { preferredCategories, location, preferredRating } = req.body;

    // Check if the user has already set preferences
    let preferences = await UserPreferences.findOne({ userId: req.user.id });

    if (preferences) {
      // If preferences already exist, update them
      preferences.preferredCategories = preferredCategories;
      preferences.location = location;
      preferences.preferredRating = preferredRating;
    } else {
      // If preferences do not exist, create a new entry
      preferences = new UserPreferences({
        userId: req.user.id,
        preferredCategories,
        location,
        preferredRating,
      });
    }

    // Save or update the user preferences
    await preferences.save();

    res.status(200).json({
      message: 'Preferences updated successfully',
      preferences,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating preferences', error: error.message });
  }
};

// Get AI-based recommendations for user based on preferences
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, limit = 10 } = req.query;

    // Build query
    const query = { userId };
    if (category) {
      query.category = category;
    }

    // Get recommendations
    const recommendations = await Recommendation.find(query)
      .sort('-score')
      .limit(parseInt(limit))
      .populate('businessId', 'name description location category rating images');

    // Filter out null businessIds (in case some businesses were deleted)
    const validRecommendations = recommendations.filter(rec => rec.businessId != null);

    res.status(200).json({
      success: true,
      count: validRecommendations.length,
      recommendations: validRecommendations
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get recommendations by category
exports.getRecommendationsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;
    const userId = req.user.id;

    const recommendations = await Recommendation.find({
      userId,
      category
    })
      .sort('-score')
      .limit(parseInt(limit))
      .populate('businessId', 'name description location category rating images');

    const validRecommendations = recommendations.filter(rec => rec.businessId != null);

    res.status(200).json({
      success: true,
      category,
      count: validRecommendations.length,
      recommendations: validRecommendations
    });
  } catch (error) {
    console.error('Get category recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get category recommendations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get trending recommendations (high scores across all users)
exports.getTrendingRecommendations = async (req, res) => {
  try {
    const { limit = 10, category } = req.query;

    const query = category ? { category } : {};

    const recommendations = await Recommendation.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$businessId',
          averageScore: { $avg: '$score' },
          count: { $sum: 1 }
        }
      },
      { $sort: { averageScore: -1, count: -1 } },
      { $limit: parseInt(limit) }
    ]);

    // Populate business details
    const populatedRecommendations = await Business.populate(recommendations, {
      path: '_id',
      select: 'name description location category rating images'
    });

    // Filter out null businesses and format response
    const validRecommendations = populatedRecommendations
      .filter(rec => rec._id != null)
      .map(rec => ({
        business: rec._id,
        averageScore: rec.averageScore,
        recommendationCount: rec.count
      }));

    res.status(200).json({
      success: true,
      count: validRecommendations.length,
      recommendations: validRecommendations
    });
  } catch (error) {
    console.error('Get trending recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get trending recommendations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Generate recommendations for a user
exports.generateRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's reviews and preferences
    const userReviews = await Review.find({ userId });
    
    // Get all businesses
    const businesses = await Business.find();

    // Simple recommendation algorithm based on category matching
    const recommendations = [];
    
    for (const business of businesses) {
      // Skip businesses the user has already reviewed
      if (userReviews.some(review => review.businessId.toString() === business._id.toString())) {
        continue;
      }

      // Calculate a simple score based on category matching
      const score = Math.random(); // Replace with actual scoring logic
      const reason = 'Based on your interests'; // Replace with actual reason

      recommendations.push({
        userId,
        businessId: business._id,
        score,
        reason,
        category: business.category
      });
    }

    // Save recommendations
    await Recommendation.deleteMany({ userId }); // Clear old recommendations
    await Recommendation.insertMany(recommendations);

    res.status(200).json({
      success: true,
      message: 'Recommendations generated successfully',
      count: recommendations.length
    });
  } catch (error) {
    console.error('Generate recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get trending businesses based on user activity (or other criteria)
exports.getTrendingBusinesses = async (req, res) => {
  try {
    // Fetch businesses sorted by rating or any other criteria to determine trends
    const trendingBusinesses = await Business.find().sort({ rating: -1 }).limit(5);

    res.status(200).json(trendingBusinesses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching trending businesses', error: error.message });
  }
};
