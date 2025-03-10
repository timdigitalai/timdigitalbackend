const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const authMiddleware = require('../middleware/authMiddleware');

// Set user preferences for recommendations
router.post('/preferences', authMiddleware.authenticate, recommendationController.setPreferences);

// Get AI-based recommendations for user based on preferences
router.post('/recommendations', authMiddleware.authenticate, recommendationController.getRecommendations);

// Get trending businesses based on user activity
router.get('/trending', recommendationController.getTrendingBusinesses);

module.exports = router;
