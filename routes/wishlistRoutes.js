const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const wishlistController = require('../controllers/wishlistController');

// Route to add business to wishlist
router.post('/', authenticate, wishlistController.addToWishlist);

// Route to get user's wishlist
router.get('/', authenticate, wishlistController.getWishlist);

// Route to remove business from wishlist
router.delete('/:id', authenticate, wishlistController.removeFromWishlist);

module.exports = router;
