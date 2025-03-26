const Review = require('../models/Review');
const mongoose = require('mongoose');

// Submit a review
// In your controller
exports.submitReview = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { reviewText, rating } = req.body;

    // Log the businessId and request body
    console.log('Received review for businessId:', businessId);
    console.log('Review data:', { reviewText, rating });

    // Make sure businessId is received correctly
    if (!businessId) {
      return res.status(400).json({ message: 'Business ID is required' });
    }

    const userId = req.user.id; // Assuming the user is authenticated and their ID is in the request object

    const newReview = new Review({
      reviewText,
      rating,
      userId,
      businessId,
    });

    await newReview.save();

    res.status(201).json({
      message: 'Review submitted successfully',
      review: newReview,
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Failed to submit review', error: error.message });
  }
};


// Get reviews for a business
exports.getReviews = async (req, res) => {
  try {
    const { businessId } = req.params;
    const reviews = await Review.find({ businessId });
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get reviews', error: error.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment, rating } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { comment, rating },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update review', error: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete review', error: error.message });
  }
};

// Reply to a review
exports.replyToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reply } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.reply = reply;
    await review.save();

    res.status(200).json({ message: 'Reply added successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reply to review', error: error.message });
  }
};

// Report a review
exports.reportReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reason } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.reported = true;
    review.reportReason = reason || 'No reason provided';
    review.reportedBy = req.user.id;
    review.reportedAt = new Date();
    
    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review reported successfully',
      review: {
        id: review._id,
        reported: review.reported,
        reason: review.reportReason,
        reportedAt: review.reportedAt
      }
    });
  } catch (error) {
    console.error('Error reporting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to report review',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};



// Get reported reviews (admin only)
exports.getReportedReviews = async (req, res) => {
  try {
    const reportedReviews = await Review.find({ reported: true });

    if (reportedReviews.length === 0) {
      return res.status(404).json({ message: 'No reported reviews found' });
    }

    res.status(200).json({ message: 'Reported reviews fetched successfully', reportedReviews });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reported reviews', error: error.message });
  }
};

// Remove fake review (admin only)
exports.removeFakeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Fake review removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove fake review', error: error.message });
  }
};
