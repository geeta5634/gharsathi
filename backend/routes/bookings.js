const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Worker = require('../models/Worker');
const models = require('../config/modelCompatibility');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const populateBooking = async (booking) => {
  if (!booking) return booking;
  if (booking.service && typeof booking.service === 'string') {
    const svc = await Service.findOne({ _id: booking.service });
    if (svc) booking.service = svc;
  }
  if (booking.customer && typeof booking.customer === 'string') {
    const u = await models.users.findOne({ _id: booking.customer });
    if (u) { const { password, ...safe } = u; booking.customer = safe; }
  }
  if (booking.worker && typeof booking.worker === 'string') {
    const w = await Worker.findOne({ _id: booking.worker });
    if (w) {
      if (w.user && typeof w.user === 'string') {
        const u = await models.users.findOne({ _id: w.user });
        if (u) { const { password, ...safe } = u; w.user = safe; }
      }
      booking.worker = w;
    }
  }
  return booking;
};

const saveBooking = async (booking) => {
  const { _id, ...data } = booking;
  await models.bookings.update({ _id }, { $set: data });
};

// POST /api/bookings
router.post('/', protect, authorize('customer'), [
  body('service').notEmpty().withMessage('Service is required'),
  body('address.street').notEmpty().withMessage('Street address is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.pincode').notEmpty().withMessage('Pincode is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { service, address, description, scheduledDate, scheduledTime, isEmergency } = req.body;

    const serviceDoc = await Service.findOne({ _id: service });
    if (!serviceDoc) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const booking = await Booking.create({
      customer: req.user._id,
      service,
      address,
      description: description || '',
      scheduledDate: scheduledDate || undefined,
      scheduledTime: scheduledTime || undefined,
      isEmergency: isEmergency || false,
      status: 'pending',
      price: { basePrice: serviceDoc.basePrice, additionalCharges: 0, discount: 0, total: serviceDoc.basePrice },
      payment: { method: 'cash', status: 'pending' },
    });

    const populated = await populateBooking(booking);

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, message: 'Server error while creating booking' });
  }
});

// GET /api/bookings/available
router.get('/available', protect, authorize('worker'), async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user._id });
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker profile not found' });
    }

    let bookings = await Booking.find({ status: 'pending' });
    bookings = bookings.filter(b => !b.worker);

    const workerServiceIds = (worker.services || []).map(s => typeof s === 'string' ? s : (s._id || s));
    bookings = bookings.filter(b => workerServiceIds.includes(b.service));

    bookings.sort((a, b) => (b.isEmergency ? 1 : 0) - (a.isEmergency ? 1 : 0));
    const populated = await Promise.all(bookings.map(populateBooking));

    res.status(200).json({ success: true, count: populated.length, data: populated });
  } catch (error) {
    console.error('Get available bookings error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching available bookings' });
  }
});

// GET /api/bookings
router.get('/', protect, async (req, res) => {
  try {
    const { status } = req.query;
    let allBookings = await Booking.find({});

    if (req.user.role === 'customer') {
      allBookings = allBookings.filter(b => b.customer === req.user._id);
    } else if (req.user.role === 'worker') {
      const worker = await Worker.findOne({ user: req.user._id });
      if (worker) {
        allBookings = allBookings.filter(b => b.worker === worker._id);
      } else {
        allBookings = [];
      }
    }

    if (status) {
      allBookings = allBookings.filter(b => b.status === status);
    }

    allBookings.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const populated = await Promise.all(allBookings.map(populateBooking));

    res.status(200).json({
      success: true,
      count: populated.length,
      total: populated.length,
      data: populated
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching bookings' });
  }
});

// GET /api/bookings/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const populated = await populateBooking(booking);
    res.status(200).json({ success: true, data: populated });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching booking' });
  }
});

// PUT /api/bookings/:id/accept
router.put('/:id/accept', protect, authorize('worker'), async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user._id });
    if (!worker) return res.status(404).json({ success: false, message: 'Worker profile not found' });

    let booking = await Booking.findOne({ _id: req.params.id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (!['pending', 'assigned'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: `Cannot accept booking in '${booking.status}' status` });
    }

    booking.worker = worker._id;
    booking.status = 'accepted';
    await saveBooking(booking);

    const populated = await populateBooking(booking);
    res.status(200).json({ success: true, data: populated });
  } catch (error) {
    console.error('Accept booking error:', error);
    res.status(500).json({ success: false, message: 'Server error while accepting booking' });
  }
});

// PUT /api/bookings/:id/start
router.put('/:id/start', protect, authorize('worker'), async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user._id });
    if (!worker) return res.status(404).json({ success: false, message: 'Worker profile not found' });

    let booking = await Booking.findOne({ _id: req.params.id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.worker !== worker._id) return res.status(403).json({ success: false, message: 'Not authorized' });
    if (!['accepted', 'en_route'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: `Cannot start booking in '${booking.status}' status` });
    }

    booking.status = 'in_progress';
    booking.actualStartTime = new Date();
    await saveBooking(booking);

    const populated = await populateBooking(booking);
    res.status(200).json({ success: true, data: populated });
  } catch (error) {
    console.error('Start booking error:', error);
    res.status(500).json({ success: false, message: 'Server error while starting booking' });
  }
});

// PUT /api/bookings/:id/complete
router.put('/:id/complete', protect, authorize('worker'), async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user._id });
    if (!worker) return res.status(404).json({ success: false, message: 'Worker profile not found' });

    let booking = await Booking.findOne({ _id: req.params.id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.worker !== worker._id) return res.status(403).json({ success: false, message: 'Not authorized' });
    if (booking.status !== 'in_progress') {
      return res.status(400).json({ success: false, message: `Cannot complete booking in '${booking.status}' status` });
    }

    booking.status = 'completed';
    booking.actualEndTime = new Date();
    await saveBooking(booking);

    worker.completedJobs = (worker.completedJobs || 0) + 1;
    worker.totalJobs = (worker.totalJobs || 0) + 1;
    worker.earnings.total = (worker.earnings.total || 0) + (booking.price?.total || 0);
    worker.earnings.thisMonth = (worker.earnings.thisMonth || 0) + (booking.price?.total || 0);
    await models.workers.update({ _id: worker._id }, { $set: worker });

    const populated = await populateBooking(booking);
    res.status(200).json({ success: true, data: populated });
  } catch (error) {
    console.error('Complete booking error:', error);
    res.status(500).json({ success: false, message: 'Server error while completing booking' });
  }
});

// PUT /api/bookings/:id/cancel
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    let booking = await Booking.findOne({ _id: req.params.id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (!['pending', 'assigned', 'accepted'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel booking in '${booking.status}' status` });
    }

    booking.status = 'cancelled';
    await saveBooking(booking);

    res.status(200).json({ success: true, message: 'Booking cancelled successfully', data: booking });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ success: false, message: 'Server error while cancelling booking' });
  }
});

// PUT /api/bookings/:id/rate
router.put('/:id/rate', protect, authorize('customer'), [
  body('score').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    let booking = await Booking.findOne({ _id: req.params.id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.customer !== req.user._id) return res.status(403).json({ success: false, message: 'Not authorized' });
    if (booking.status !== 'completed') return res.status(400).json({ success: false, message: 'Can only rate completed bookings' });

    const { score, review } = req.body;
    booking.rating = { score, review: review || '', createdAt: new Date() };
    await saveBooking(booking);

    if (booking.worker) {
      const allBookings = await Booking.find({ worker: booking.worker, 'rating.score': { $exists: true, $ne: null } });
      let total = 0;
      allBookings.forEach(b => { if (b.rating?.score) total += b.rating.score; });
      total += score;
      const avg = total / (allBookings.length + 1);
      await models.workers.update({ _id: booking.worker }, { $set: { rating: Math.round(avg * 10) / 10, totalRatings: allBookings.length + 1 } });
    }

    res.status(200).json({ success: true, message: 'Rating submitted successfully', data: booking });
  } catch (error) {
    console.error('Rate booking error:', error);
    res.status(500).json({ success: false, message: 'Server error while rating booking' });
  }
});

module.exports = router;
