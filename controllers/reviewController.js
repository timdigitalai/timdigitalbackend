const Review = require('../models/Review');

// Add a review
exports.addReview = async (req, res) => {
  const { businessId, rating, comment } = req.body;
  try {
    const review = new Review({ user: req.user.id, business: businessId, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get reviews for a business
exports.getReviews = async (req, res) => {
  const { businessId } = req.params;
  try {
    const reviews = await Review.find({ business: businessId }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};