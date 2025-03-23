const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { authenticate } = require('../middleware/authMiddleware');

// Debug middleware
router.use((req, res, next) => {
  console.log('Wishlist route accessed:', {
    method: req.method,
    url: req.url,
    body: req.body
  });
  next();
});

// Add to wishlist
router.post('/', authenticate, wishlistController.addToWishlist);

// Get user's wishlist
router.get('/', authenticate, wishlistController.getWishlist);

// Check if business is in wishlist
router.get('/:businessId/check', authenticate, wishlistController.checkWishlist);

// Remove from wishlist
router.delete('/:businessId', authenticate, wishlistController.removeFromWishlist);

module.exports = router;
