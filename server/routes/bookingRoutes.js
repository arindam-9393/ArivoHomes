const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createBooking, getUserBookings, updateBookingStatus, vacateProperty } = require('../controllers/bookingController');

router.post('/', protect, createBooking);
router.get('/', protect, getUserBookings);

// MAKE SURE THIS LINE EXISTS AND MATCHES THE FRONTEND URL
router.put('/vacate', protect, vacateProperty); 

router.put('/:id', protect, updateBookingStatus);

module.exports = router;