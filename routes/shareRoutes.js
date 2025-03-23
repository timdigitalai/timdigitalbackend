const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');
const authMiddleware = require('../middleware/authMiddleware');

// Debug middleware
router.use((req, res, next) => {
  console.log(`[Share] ${req.method} ${req.url}`, req.query);
  next();
});

// Apply authentication to all routes
router.use(authMiddleware.authenticate);

// Share business on social media
router.post('/', shareController.shareBusiness);

module.exports = router; 