const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const { authenticate } = require('../middleware/authMiddleware');

// Register a new business
router.post('/', authenticate, businessController.registerBusiness);

// Get all businesses (with filters)
router.get('/', businessController.getBusinesses);

// Get specific business details
router.get('/:id', businessController.getBusinessDetails);

// Update business details
router.put('/:id', authenticate, businessController.updateBusiness);

// Delete a business
router.delete('/:id', authenticate, businessController.deleteBusiness);

// Upload images for business
router.post('/:id/images', authenticate, businessController.uploadBusinessImages);

// Add contact details to a business
router.post('/:id/contact', authenticate, businessController.addContactDetails);

module.exports = router;
