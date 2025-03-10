const Wishlist = require('../models/wishlistModel');

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const businessId = req.body.businessId;
    const userId = req.user.id;

    // Check if the business is already in the wishlist
    const existingWishlist = await Wishlist.findOne({ user: userId, business: businessId });
    if (existingWishlist) {
      return res.status(400).json({ message: 'Business already in wishlist' });
    }

    const wishlist = new Wishlist({ user: userId, business: businessId });
    await wishlist.save();

    res.status(201).json({ message: 'Business added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
  }
};

// Get wishlist for user
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user.id }).populate('business');
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const businessId = req.params.id;
    await Wishlist.deleteOne({ user: req.user.id, business: businessId });
    res.status(200).json({ message: 'Business removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist', error: error.message });
  }
};  
