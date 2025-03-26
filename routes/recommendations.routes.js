const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendation.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use((req, res, next) => {
  console.log(`[Recommendations] ${req.method} ${req.url}`, req.query);
  next();
});

router.post('/preferences', authMiddleware.authenticate, recommendationController.setPreferences);
router.get('/', authMiddleware.authenticate, recommendationController.getRecommendations);
router.get('/category/:category', authMiddleware.authenticate, recommendationController.getRecommendationsByCategory);
router.get('/trending', recommendationController.getTrendingRecommendations);
router.post('/generate', authMiddleware.authenticate, recommendationController.generateRecommendations);
router.get('/trending-businesses', recommendationController.getTrendingBusinesses);

module.exports = router;
