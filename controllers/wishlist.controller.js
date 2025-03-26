const Wishlist = require('../models/Wishlist');
const Business = require('../models/model.business');

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { businessId } = req.body;
    const userId = req.user.id;

    // Validate business exists
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Check if already in wishlist
    const existingItem = await Wishlist.findOne({ userId, businessId });
    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Business already in wishlist'
      });
    }

    // Create new wishlist item
    const wishlistItem = await Wishlist.create({
      userId,
      businessId
    });

    res.status(201).json({
      success: true,
      message: 'Added to wishlist successfully',
      wishlistItem
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.find({ userId })
      .populate('businessId', 'name description location category')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      wishlist
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { businessId } = req.params;
    const userId = req.user.id;

    const deletedItem = await Wishlist.findOneAndDelete({ userId, businessId });

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in wishlist'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Removed from wishlist successfully'
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Check if business is in user's wishlist
exports.checkWishlist = async (req, res) => {
  try {
    const { businessId } = req.params;
    const userId = req.user.id;

    const wishlistItem = await Wishlist.findOne({ userId, businessId });

    res.status(200).json({
      success: true,
      isInWishlist: !!wishlistItem
    });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check wishlist status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
