const Booking = require('../models/Booking');
const Worker = require('../models/Worker');

exports.createBooking = async (req, res) => {
  try {
    const {
      customerId, workerId, service, description,
      address, city, scheduledDate, scheduledTime,
      isEmergency, amount,
    } = req.body;

    const booking = await Booking.create({
      customerId, workerId, service, description,
      address, city, scheduledDate, scheduledTime,
      isEmergency, amount,
    });

    // Update worker total jobs count
    await Worker.findByIdAndUpdate(workerId, { $inc: { totalJobs: 1 } });

    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(`worker_${workerId}`).emit('new_booking', booking);
    }

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, message: 'Failed to create booking' });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const { customerId } = req.query;
    const bookings = await Booking.find({ customerId })
      .populate('workerId', 'name phone service')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
};

exports.getWorkerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ workerId: req.params.workerId })
      .populate('customerId', 'name phone address')
      .sort({ scheduledDate: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerId', 'name phone')
      .populate('workerId', 'name phone service price');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch booking' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Emit status change
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${booking.customerId}`).emit('booking_status', { bookingId: booking._id, status });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update booking' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled', updatedAt: new Date() },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel booking' });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { rating, review, updatedAt: new Date() },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Update worker average rating
    const allRatings = await Booking.find({
      workerId: booking.workerId,
      rating: { $exists: true },
    }).select('rating');

    const avgRating = allRatings.reduce((sum, b) => sum + b.rating, 0) / allRatings.length;
    await Worker.findByIdAndUpdate(booking.workerId, { rating: Math.round(avgRating * 10) / 10 });

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add review' });
  }
};
