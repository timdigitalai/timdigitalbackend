const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log('Review route accessed:', {
    method: req.method,
    url: req.url,
    params: req.params,
    path: req.path
  });
  next();
});

// Admin routes should come first to avoid conflict with :businessId parameter
// Get all reported reviews (admin only)
router.get('/admin/reported', authenticate, isAdmin, reviewController.getReportedReviews);

// Remove fake/spam review (admin only)
router.delete('/admin/:reviewId', authenticate, isAdmin, reviewController.removeFakeReview);

// Regular routes
// Get reviews for a business
router.get('/:businessId', reviewController.getReviews);

// Submit a review
router.post('/:businessId', authenticate, reviewController.submitReview);

// Update a review
router.put('/:reviewId', authenticate, reviewController.updateReview);

// Delete a review
router.delete('/:reviewId', authenticate, reviewController.deleteReview);

// Reply to a review (business owner only)
router.post('/:reviewId/reply', authenticate, reviewController.replyToReview);

// Report a review
router.put('/:reviewId/report', authenticate, reviewController.reportReview);

module.exports = router;
