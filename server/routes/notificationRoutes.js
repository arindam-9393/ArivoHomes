const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getMyNotifications, markNotificationsRead } = require('../controllers/notificationController');

router.get('/', protect, getMyNotifications);
router.put('/read', protect, markNotificationsRead);

module.exports = router;