const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/isAdmin');

// Debug middleware
router.use((req, res, next) => {
  console.log(`[Admin] ${req.method} ${req.url}`, req.query);
  next();
});

// Apply authentication and admin check to all routes
router.use(authMiddleware.authenticate, isAdmin);

// User management routes
router.get('/users', adminController.getUsers);
router.put('/users/:userId/ban', adminController.banUser);
router.put('/users/:userId/unban', adminController.unbanUser);

// Analytics routes
router.get('/analytics/popular-places', adminController.getPopularPlaces);
router.get('/analytics/user-activity', adminController.getUserActivity);

// Get all businesses awaiting approval
router.get('/businesses/pending', adminController.getPendingBusinesses);

// Approve a business registration
router.put('/businesses/:id/approve', adminController.approveBusiness);

// Reject a business registration
router.put('/businesses/:id/reject', adminController.rejectBusiness);

// Remove a business listing
router.delete('/businesses/:id', adminController.removeBusiness);

module.exports = router;
router.put('/users/:userId/ban', adminController.banUser);
router.put('/users/:userId/unban', adminController.unbanUser);

// Analytics routes
router.get('/analytics/popular-places', adminController.getPopularPlaces);
router.get('/analytics/user-activity', adminController.getUserActivity);

// Get all businesses awaiting approval
router.get('/businesses/pending', adminController.getPendingBusinesses);

// Approve a business registration
router.put('/businesses/:id/approve', adminController.approveBusiness);

// Reject a business registration
router.put('/businesses/:id/reject', adminController.rejectBusiness);

// Remove a business listing
router.delete('/businesses/:id', adminController.removeBusiness);

module.exports = router;
