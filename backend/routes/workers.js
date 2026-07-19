const express = require('express');
const { body, validationResult } = require('express-validator');
const Worker = require('../models/Worker');
const User = require('../models/User');
const Booking = require('../models/Booking');
const models = require('../config/modelCompatibility');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const populateWorker = async (worker) => {
  if (!worker) return worker;
  if (worker.user) {
    const userDoc = await User.findOne({ _id: worker.user });
    if (userDoc) {
      const { password, ...safe } = userDoc;
      worker.user = safe;
    }
  }
  if (worker.services && Array.isArray(worker.services)) {
    const svc = models.services;
    worker.services = await Promise.all(worker.services.map(async (sId) => {
      if (typeof sId === 'string') {
        const svcDoc = await svc.findOne({ _id: sId });
        return svcDoc || sId;
      }
      return sId;
    }));
  }
  return worker;
};

// GET /api/workers
router.get('/', async (req, res) => {
  try {
    const { service } = req.query;
    let workers = await Worker.find({ isApproved: true });

    if (service) {
      workers = workers.filter(w => {
        const svcs = w.services || [];
        return svcs.some(s => typeof s === 'object' ? s.name === service : s === service);
      });
    }

    const sorted = workers.sort((a, b) => (b.trustScore || 0) - (a.trustScore || 0));
    const populated = await Promise.all(sorted.map(populateWorker));

    res.status(200).json({ success: true, count: populated.length, data: populated });
  } catch (error) {
    console.error('Get workers error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching workers' });
  }
});

// GET /api/workers/dashboard/stats
router.get('/dashboard/stats', protect, authorize('worker'), async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user._id });
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker profile not found' });
    }

    const allBookings = await Booking.find({ worker: worker._id });
    const pendingBookings = allBookings.filter(b => ['assigned', 'accepted'].includes(b.status)).length;
    const activeBookings = allBookings.filter(b => ['en_route', 'in_progress'].includes(b.status)).length;
    const completedThisMonth = allBookings.filter(b =>
      b.status === 'completed' &&
      new Date(b.createdAt).getMonth() === new Date().getMonth() &&
      new Date(b.createdAt).getFullYear() === new Date().getFullYear()
    ).length;

    res.status(200).json({
      success: true,
      data: {
        totalJobs: worker.totalJobs || 0,
        completedJobs: worker.completedJobs || 0,
        trustScore: worker.trustScore || 0,
        rating: worker.rating || 0,
        totalRatings: worker.totalRatings || 0,
        earnings: worker.earnings || { total: 0, thisMonth: 0, lastPayout: 0 },
        pendingBookings,
        activeBookings,
        completedThisMonth
      }
    });
  } catch (error) {
    console.error('Worker dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching dashboard stats' });
  }
});

// GET /api/workers/:id
router.get('/:id', async (req, res) => {
  try {
    const worker = await Worker.findOne({ _id: req.params.id });
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }
    const populated = await populateWorker(worker);
    res.status(200).json({ success: true, data: populated });
  } catch (error) {
    console.error('Get worker error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching worker' });
  }
});

// POST /api/workers/register
router.post('/register', protect, async (req, res) => {
  try {
    const existingWorker = await Worker.findOne({ user: req.user._id });
    if (existingWorker) {
      return res.status(400).json({ success: false, message: 'You are already registered as a worker' });
    }

    const { services, experience, bio } = req.body;
    const worker = await Worker.create({
      user: req.user._id,
      services: services || [],
      experience: experience || 0,
      bio: bio || '',
      trustScore: 75,
      totalJobs: 0,
      completedJobs: 0,
      rating: 0,
      totalRatings: 0,
      isApproved: false,
      serviceAreas: [],
      availability: { isAvailable: true, slots: [] },
      earnings: { total: 0, thisMonth: 0, lastPayout: 0 },
      documents: {}
    });

    await User.findByIdAndUpdate(req.user._id, { role: 'worker' });

    res.status(201).json({
      success: true,
      message: 'Worker registration successful. Awaiting admin approval.',
      data: worker
    });
  } catch (error) {
    console.error('Register worker error:', error);
    res.status(500).json({ success: false, message: 'Server error during worker registration' });
  }
});

// PUT /api/workers/profile
router.put('/profile', protect, authorize('worker'), async (req, res) => {
  try {
    const { services, experience, bio, serviceAreas } = req.body;
    const updateData = {};
    if (services !== undefined) updateData.services = services;
    if (experience !== undefined) updateData.experience = experience;
    if (bio !== undefined) updateData.bio = bio;
    if (serviceAreas !== undefined) updateData.serviceAreas = serviceAreas;

    let worker = await Worker.findOne({ user: req.user._id });
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker profile not found' });
    }
    worker = await Worker.findByIdAndUpdate(worker._id, updateData);
    const populated = await populateWorker(worker);

    res.status(200).json({ success: true, data: populated });
  } catch (error) {
    console.error('Update worker profile error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating worker profile' });
  }
});

// PUT /api/workers/availability
router.put('/availability', protect, authorize('worker'), async (req, res) => {
  try {
    const { isAvailable, slots } = req.body;
    let worker = await Worker.findOne({ user: req.user._id });
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker profile not found' });
    }
    const updateData = {
      availability: {
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        slots: slots || []
      }
    };
    worker = await Worker.findByIdAndUpdate(worker._id, updateData);
    res.status(200).json({ success: true, data: worker.availability });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating availability' });
  }
});

// PUT /api/workers/approve/:id
router.put('/approve/:id', protect, authorize('admin'), async (req, res) => {
  try {
    let worker = await Worker.findByIdAndUpdate(req.params.id, { isApproved: true });
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }
    const populated = await populateWorker(worker);
    res.status(200).json({ success: true, message: 'Worker approved successfully', data: populated });
  } catch (error) {
    console.error('Approve worker error:', error);
    res.status(500).json({ success: false, message: 'Server error while approving worker' });
  }
});

module.exports = router;
