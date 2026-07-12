const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Worker = require('../models/Worker');
const Review = require('../models/Review');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

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

    const serviceDoc = await Service.findById(service);
    if (!serviceDoc) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const booking = await Booking.create({
      customer: req.user.id,
      service,
      address,
      description,
      scheduledDate,
      scheduledTime,
      isEmergency: isEmergency || false,
      price: {
        basePrice: serviceDoc.basePrice,
        total: serviceDoc.basePrice
      }
    });

    await booking.populate([
      { path: 'service', select: 'name icon basePrice' },
      { path: 'customer', select: 'name phone email' }
    ]);

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating booking'
    });
  }
});

// GET /api/bookings/available
router.get('/available', protect, authorize('worker'), async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user.id });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker profile not found'
      });
    }

    const bookings = await Booking.find({
      status: 'pending',
      service: { $in: worker.services },
      worker: { $exists: false }
    })
      .populate('service', 'name icon basePrice')
      .populate('customer', 'name phone address')
      .sort({ isEmergency: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get available bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching available bookings'
    });
  }
});

// GET /api/bookings
router.get('/', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (req.user.role === 'customer') {
      filter.customer = req.user.id;
    } else if (req.user.role === 'worker') {
      const worker = await Worker.findOne({ user: req.user.id });
      if (worker) {
        filter.worker = worker._id;
      }
    }

    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(filter)
      .populate('service', 'name icon basePrice')
      .populate('customer', 'name phone')
      .populate({
        path: 'worker',
        populate: { path: 'user', select: 'name phone avatar' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings'
    });
  }
});

// GET /api/bookings/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service', 'name icon basePrice description')
      .populate('customer', 'name phone email address')
      .populate({
        path: 'worker',
        populate: { path: 'user', select: 'name phone avatar' }
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.customer._id.toString() !== req.user.id &&
        req.user.role !== 'admin') {
      const worker = await Worker.findOne({ user: req.user.id });
      if (!worker || booking.worker?._id.toString() !== worker._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this booking'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking'
    });
  }
});

// PUT /api/bookings/:id/accept
router.put('/:id/accept', protect, authorize('worker'), async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user.id });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker profile not found'
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'pending' && booking.status !== 'assigned') {
      return res.status(400).json({
        success: false,
        message: `Cannot accept booking in '${booking.status}' status`
      });
    }

    booking.worker = worker._id;
    booking.status = 'accepted';
    await booking.save();

    await booking.populate([
      { path: 'service', select: 'name icon basePrice' },
      { path: 'customer', select: 'name phone' },
      { path: 'worker', populate: { path: 'user', select: 'name phone' } }
    ]);

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Accept booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while accepting booking'
    });
  }
});

// PUT /api/bookings/:id/start
router.put('/:id/start', protect, authorize('worker'), async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user.id });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker profile not found'
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.worker.toString() !== worker._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to start this booking'
      });
    }

    if (booking.status !== 'accepted' && booking.status !== 'en_route') {
      return res.status(400).json({
        success: false,
        message: `Cannot start booking in '${booking.status}' status`
      });
    }

    booking.status = 'in_progress';
    booking.actualStartTime = new Date();
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Start booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while starting booking'
    });
  }
});

// PUT /api/bookings/:id/complete
router.put('/:id/complete', protect, authorize('worker'), async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user.id });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker profile not found'
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.worker.toString() !== worker._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this booking'
      });
    }

    if (booking.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: `Cannot complete booking in '${booking.status}' status`
      });
    }

    const { additionalCharges } = req.body;

    booking.status = 'completed';
    booking.actualEndTime = new Date();

    if (additionalCharges) {
      booking.price.additionalCharges = additionalCharges;
      booking.price.total = booking.price.basePrice + additionalCharges - booking.price.discount;
    }

    await booking.save();

    worker.completedJobs += 1;
    worker.totalJobs += 1;

    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthlyCompleted = await Booking.countDocuments({
      worker: worker._id,
      status: 'completed',
      createdAt: { $gte: monthStart }
    });
    worker.earnings.thisMonth = monthlyCompleted * booking.price.total;
    worker.earnings.total += booking.price.total;

    await worker.save();

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Complete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while completing booking'
    });
  }
});

// PUT /api/bookings/:id/cancel
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (!['pending', 'assigned', 'accepted'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel booking in '${booking.status}' status`
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling booking'
    });
  }
});

// PUT /api/bookings/:id/rate
router.put('/:id/rate', protect, authorize('customer'), [
  body('score').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to rate this booking'
      });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed bookings'
      });
    }

    if (booking.rating && booking.rating.score) {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been rated'
      });
    }

    const { score, review } = req.body;

    booking.rating = {
      score,
      review: review || '',
      createdAt: new Date()
    };
    await booking.save();

    if (booking.worker) {
      const existingReviews = await Review.find({ worker: booking.worker });

      let newTotalRating = 0;
      existingReviews.forEach(r => newTotalRating += r.rating);
      newTotalRating += score;

      const newTotalCount = existingReviews.length + 1;
      const newAverageRating = newTotalRating / newTotalCount;

      await Worker.findByIdAndUpdate(booking.worker, {
        rating: Math.round(newAverageRating * 10) / 10,
        totalRatings: newTotalCount
      });

      await Review.create({
        booking: booking._id,
        customer: req.user.id,
        worker: booking.worker,
        rating: score,
        comment: review || ''
      });
    }

    res.status(200).json({
      success: true,
      message: 'Rating submitted successfully',
      data: booking
    });
  } catch (error) {
    console.error('Rate booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while rating booking'
    });
  }
});

module.exports = router;
