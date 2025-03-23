const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const authMiddleware = require('../middleware/authMiddleware'); // For authentication

// Debug middleware
router.use((req, res, next) => {
  console.log(`[Recommendations] ${req.method} ${req.url}`, req.query);
  next();
});

// Set user preferences for recommendations
router.post('/preferences', authMiddleware.authenticate, recommendationController.setPreferences);

// Get personalized recommendations
router.get('/', authMiddleware.authenticate, recommendationController.getRecommendations);

// Get recommendations by category
router.get('/category/:category', authMiddleware.authenticate, recommendationController.getRecommendationsByCategory);

// Get trending recommendations
router.get('/trending', recommendationController.getTrendingRecommendations);

// Generate new recommendations for a user
router.post('/generate', authMiddleware.authenticate, recommendationController.generateRecommendations);

// Get trending businesses based on user activity or other criteria
router.get('/trending-businesses', recommendationController.getTrendingBusinesses);

module.exports = router;
