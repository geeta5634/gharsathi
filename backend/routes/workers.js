const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Worker = require('../models/Worker');
const User = require('../models/User');
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/workers
router.get('/', async (req, res) => {
  try {
    const { service, area, rating, lat, lng, maxDistance } = req.query;
    const filter = { isApproved: true };

    if (service) {
      filter.services = service;
    }

    if (area) {
      filter.serviceAreas = { $in: [new RegExp(area, 'i')] };
    }

    if (rating) {
      filter.rating = { $gte: parseFloat(rating) };
    }

    if (lat && lng) {
      filter.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance) || 10000
        }
      };
    }

    const workers = await Worker.find(filter)
      .populate('user', 'name phone avatar address')
      .populate('services', 'name icon basePrice')
      .sort({ trustScore: -1, rating: -1 });

    res.status(200).json({
      success: true,
      count: workers.length,
      data: workers
    });
  } catch (error) {
    console.error('Get workers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching workers'
    });
  }
});

// GET /api/workers/dashboard/stats
router.get('/dashboard/stats', protect, authorize('worker'), async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user.id });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker profile not found'
      });
    }

    const pendingBookings = await Booking.countDocuments({
      worker: worker._id,
      status: { $in: ['assigned', 'accepted'] }
    });

    const activeBookings = await Booking.countDocuments({
      worker: worker._id,
      status: { $in: ['en_route', 'in_progress'] }
    });

    const completedThisMonth = await Booking.countDocuments({
      worker: worker._id,
      status: 'completed',
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalJobs: worker.totalJobs,
        completedJobs: worker.completedJobs,
        trustScore: worker.trustScore,
        rating: worker.rating,
        totalRatings: worker.totalRatings,
        earnings: worker.earnings,
        pendingBookings,
        activeBookings,
        completedThisMonth
      }
    });
  } catch (error) {
    console.error('Worker dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard stats'
    });
  }
});

// GET /api/workers/:id
router.get('/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id)
      .populate('user', 'name phone avatar address')
      .populate('services', 'name icon basePrice description');

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    res.status(200).json({
      success: true,
      data: worker
    });
  } catch (error) {
    console.error('Get worker error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching worker'
    });
  }
});

// POST /api/workers/register
router.post('/register', protect, [
  body('experience').optional().isNumeric().withMessage('Experience must be a number'),
  body('bio').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const existingWorker = await Worker.findOne({ user: req.user.id });
    if (existingWorker) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered as a worker'
      });
    }

    const { services, experience, bio, location, serviceAreas, documents } = req.body;

    const worker = await Worker.create({
      user: req.user.id,
      services: services || [],
      experience: experience || 0,
      bio: bio || '',
      location: location || { type: 'Point', coordinates: [0, 0] },
      serviceAreas: serviceAreas || [],
      documents: documents || {}
    });

    await User.findByIdAndUpdate(req.user.id, { role: 'worker' });

    res.status(201).json({
      success: true,
      message: 'Worker registration successful. Awaiting admin approval.',
      data: worker
    });
  } catch (error) {
    console.error('Register worker error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during worker registration'
    });
  }
});

// PUT /api/workers/profile
router.put('/profile', protect, authorize('worker'), async (req, res) => {
  try {
    const { services, experience, bio, location, serviceAreas, documents } = req.body;

    const updateData = {};
    if (services !== undefined) updateData.services = services;
    if (experience !== undefined) updateData.experience = experience;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (serviceAreas !== undefined) updateData.serviceAreas = serviceAreas;
    if (documents !== undefined) updateData.documents = documents;

    const worker = await Worker.findOneAndUpdate(
      { user: req.user.id },
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name phone avatar address')
      .populate('services', 'name icon basePrice');

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: worker
    });
  } catch (error) {
    console.error('Update worker profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating worker profile'
    });
  }
});

// PUT /api/workers/availability
router.put('/availability', protect, authorize('worker'), async (req, res) => {
  try {
    const { isAvailable, slots } = req.body;

    const worker = await Worker.findOneAndUpdate(
      { user: req.user.id },
      {
        availability: {
          isAvailable: isAvailable !== undefined ? isAvailable : true,
          slots: slots || []
        }
      },
      { new: true }
    );

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: worker.availability
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating availability'
    });
  }
});

// PUT /api/workers/approve/:id (admin only)
router.put('/approve/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).populate('user', 'name phone email');

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Worker approved successfully',
      data: worker
    });
  } catch (error) {
    console.error('Approve worker error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while approving worker'
    });
  }
});

module.exports = router;
