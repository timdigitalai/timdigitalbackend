const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/isAdmin');

router.use((req, res, next) => {
  console.log(`[Notifications] ${req.method} ${req.url}`, req.query);
  next();
});

router.use(authMiddleware.authenticate);
router.get('/', notificationController.getUserNotifications);
router.put('/:id/read', notificationController.markAsRead);
router.post('/admin/broadcast', isAdmin, notificationController.sendNotification);
router.post('/', notificationController.sendNotification);

module.exports = router;