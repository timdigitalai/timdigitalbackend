const Notification = require('../models/Notification');
const Business = require('../models/model.business');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.sendNotification = async (req, res) => {
  try {
    const { title, message, type = 'system', businessId, userIds, broadcast } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }

    if (businessId) {
      if (!mongoose.Types.ObjectId.isValid(businessId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid business ID format'
        });
      }

      const business = await Business.findById(businessId);
      if (!business) {
        return res.status(404).json({
          success: false,
          message: 'Business not found'
        });
      }
    }

    let notifications = [];

    if (broadcast) {
      // Send to all users
      const allUsers = await User.find({}, '_id');
      notifications = await Promise.all(
        allUsers.map(user => {
          return new Notification({
            userId: user._id,
            title,
            message,
            type,
            businessId,
          }).save();
        })
      );
    } else if (userIds && Array.isArray(userIds)) {
      const validUserIds = userIds.filter(id => mongoose.Types.ObjectId.isValid(id));

      if (validUserIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid user IDs provided'
        });
      }

      // Check if users exist
      const existingUsers = await User.find({ _id: { $in: validUserIds } }, '_id');
      const existingUserIds = existingUsers.map(user => user._id.toString());

      notifications = await Promise.all(
        existingUserIds.map(userId => {
          return new Notification({
            userId,
            title,
            message,
            type,
            businessId,
          }).save();
        })
      );
      if (notifications.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No valid users found'
        });
      }
    } else {
      notifications = [await new Notification({
        userId: req.user.id,
        title,
        message,
        type,
        businessId,
      }).save()];
    }


    res.status(200).json({
      success: true,
      message: 'Notifications sent successfully',
      count: notifications.length,
      notifications
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending notifications',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const query = { userId: req.user.id };

    if (type) {
      query.type = type;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('businessId', 'name description location');

    const count = await Notification.countDocuments(query);

    res.status(200).json({
      success: true,
      notifications,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalNotifications: count
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification ID format'
      });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found or you do not have permission to access it'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error('Mark notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};