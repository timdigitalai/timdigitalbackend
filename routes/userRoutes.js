const express = require('express');
const { signup, login, logout, getMe, updateProfile, changePassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.put('/update', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);

module.exports = router;
