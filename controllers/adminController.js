const Business = require('../models/Business');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const Review = require('../models/Review');
const Analytics = require('../models/Analytics');

// Setup multer for image uploading
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/business_images');
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    cb(null, `${Date.now()}${fileExtension}`);
  },
});

const upload = multer({ storage: storage }).array('images', 5); 

// Get all businesses awaiting approval
exports.getPendingBusinesses = async (req, res) => {
  try {
    const pendingBusinesses = await Business.find({ status: 'pending' });
    res.status(200).json(pendingBusinesses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending businesses', error: error.message });
  }
};

// Approve a business registration
exports.approveBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    res.status(200).json({ message: 'Business approved successfully', business });
  } catch (error) {
    res.status(500).json({ message: 'Error approving business', error: error.message });
  }
};

// Reject a business registration
exports.rejectBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    res.status(200).json({ message: 'Business rejected successfully', business });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting business', error: error.message });
  }
};

// Remove a business listing
exports.removeBusiness = async (req, res) => {
  try {
    await Business.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Business removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing business', error: error.message });
  }
};

// Add images to the business profile
exports.uploadBusinessImages = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading images', error: err.message });
    }

    try {
      const business = await Business.findById(req.params.id);
      if (!business) return res.status(404).json({ message: 'Business not found' });

      const images = req.files.map(file => file.path); 
      business.images.push(...images);
      await business.save();

      res.status(200).json({ message: 'Images uploaded successfully', images: business.images });
    } catch (error) {
      res.status(500).json({ message: 'Error saving images', error: error.message });
    }
  });
};

// Add contact details (phone, website, social links)
exports.addContactDetails = async (req, res) => {
  const { phone, website, socialLinks } = req.body;
  
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ message: 'Business not found' });

    // Add or update contact details
    business.contact = { phone, website, socialLinks };
    await business.save();

    res.status(200).json({ message: 'Contact details added successfully', contact: business.contact });
  } catch (error) {
    res.status(500).json({ message: 'Error adding contact details', error: error.message });
  }
};

// Register a new business
exports.registerBusiness = async (req, res) => {
  const { name, category, location, description } = req.body;

  try {
    const business = new Business({
      owner: req.user.id,
      name,
      category,
      location,
      description,
      status: 'pending',
    });

    await business.save();
    res.status(201).json({ message: 'Business registered successfully', business });
  } catch (error) {
    res.status(500).json({ message: 'Error registering business', error: error.message });
  }
};

// Get list of all users (tourists & business owners)
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const query = {};

    // Filter by role if provided
    if (role) {
      query.role = role;
    }

    // Search by name or email if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalUsers: count
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Ban a user
exports.banUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isBanned = true;
    user.banReason = req.body.reason || 'Violated terms of service';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User banned successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isBanned: user.isBanned,
        banReason: user.banReason
      }
    });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error banning user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Unban a user
exports.unbanUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isBanned = false;
    user.banReason = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User unbanned successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isBanned: user.isBanned
      }
    });
  } catch (error) {
    console.error('Unban user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error unbanning user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get popular places analytics
exports.getPopularPlaces = async (req, res) => {
  try {
    const { timeframe = '7d', limit = 10 } = req.query;
    
    // Calculate date range based on timeframe
    const date = new Date();
    date.setDate(date.getDate() - parseInt(timeframe));

    const popularPlaces = await Business.aggregate([
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'businessId',
          as: 'reviews'
        }
      },
      {
        $project: {
          name: 1,
          category: 1,
          location: 1,
          rating: 1,
          reviewCount: { $size: '$reviews' },
          averageRating: { $avg: '$reviews.rating' }
        }
      },
      {
        $sort: {
          reviewCount: -1,
          averageRating: -1
        }
      },
      {
        $limit: parseInt(limit)
      }
    ]);

    res.status(200).json({
      success: true,
      timeframe,
      popularPlaces
    });
  } catch (error) {
    console.error('Get popular places error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching popular places',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user activity insights
exports.getUserActivity = async (req, res) => {
  try {
    const { timeframe = '7d' } = req.query;
    
    // Calculate date range based on timeframe
    const date = new Date();
    date.setDate(date.getDate() - parseInt(timeframe));

    // Get new user registrations
    const newUsers = await User.countDocuments({
      createdAt: { $gte: date }
    });

    // Get review activity
    const reviewActivity = await Review.aggregate([
      {
        $match: {
          createdAt: { $gte: date }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get active users (users who posted reviews)
    const activeUsers = await Review.distinct('userId', {
      createdAt: { $gte: date }
    });

    res.status(200).json({
      success: true,
      timeframe,
      statistics: {
        newUsers,
        totalReviews: reviewActivity.reduce((sum, day) => sum + day.count, 0),
        activeUsers: activeUsers.length,
        dailyActivity: reviewActivity
      }
    });
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user activity',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
