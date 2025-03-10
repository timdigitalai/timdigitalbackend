const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Get all businesses awaiting approval
router.get('/businesses/pending', adminController.getPendingBusinesses);

// Approve a business registration
router.put('/businesses/:id/approve', adminController.approveBusiness);

// Reject a business registration
router.put('/businesses/:id/reject', adminController.rejectBusiness);

// Remove a business listing
router.delete('/businesses/:id', adminController.removeBusiness);

module.exports = router;
