const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create booking
router.post('/', bookingController.createBooking);

// Get user bookings (customer)
router.get('/my', bookingController.getMyBookings);

// Get worker bookings
router.get('/worker/:workerId', bookingController.getWorkerBookings);

// Get single booking
router.get('/:id', bookingController.getBookingById);

// Update booking status
router.put('/:id/status', bookingController.updateBookingStatus);

// Cancel booking
router.put('/:id/cancel', bookingController.cancelBooking);

// Rate and review
router.post('/:id/review', bookingController.addReview);

module.exports = router;
