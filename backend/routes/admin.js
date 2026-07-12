const express = require('express');
const User = require('../models/User');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Membership = require('../models/Membership');
const Review = require('../models/Review');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/dashboard
router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalWorkers = await Worker.countDocuments();
    const approvedWorkers = await Worker.countDocuments({ isApproved: true });
    const pendingApprovals = await Worker.countDocuments({ isApproved: false });
    const totalServices = await Service.countDocuments({ isActive: true });

    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const activeBookings = await Booking.countDocuments({
      status: { $in: ['assigned', 'accepted', 'en_route', 'in_progress'] }
    });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayBookings = await Booking.countDocuments({
      createdAt: { $gte: today }
    });

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          status: 'completed',
          'payment.status': 'completed',
          createdAt: { $gte: monthStart }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$price.total' }
        }
      }
    ]);

    const totalRevenue = await Booking.aggregate([
      {
        $match: {
          status: 'completed',
          'payment.status': 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$price.total' }
        }
      }
    ]);

    const activeMemberships = await Membership.countDocuments({
      isActive: true,
      endDate: { $gte: new Date() }
    });

    res.status(200).json({
      success: true,
      data: {
        users: { total: totalUsers, customers: totalCustomers, workers: totalWorkers },
        workers: { total: totalWorkers, approved: approvedWorkers, pendingApprovals },
        services: { total: totalServices },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          active: activeBookings,
          completed: completedBookings,
          cancelled: cancelledBookings,
          today: todayBookings
        },
        revenue: {
          thisMonth: monthlyRevenue[0]?.total || 0,
          total: totalRevenue[0]?.total || 0
        },
        memberships: { active: activeMemberships }
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard'
    });
  }
});

// GET /api/admin/bookings
router.get('/bookings', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(filter)
      .populate('service', 'name')
      .populate('customer', 'name phone')
      .populate({
        path: 'worker',
        populate: { path: 'user', select: 'name phone' }
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
    console.error('Admin bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings'
    });
  }
});

// GET /api/admin/users
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const filter = {};

    if (role) {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: users
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
});

// GET /api/admin/workers
router.get('/workers', protect, authorize('admin'), async (req, res) => {
  try {
    const { approved, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (approved !== undefined) {
      filter.isApproved = approved === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const workers = await Worker.find(filter)
      .populate('user', 'name phone email avatar')
      .populate('services', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Worker.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: workers.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: workers
    });
  } catch (error) {
    console.error('Admin workers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching workers'
    });
  }
});

// GET /api/admin/revenue
router.get('/revenue', protect, authorize('admin'), async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;

    let groupBy;
    const now = new Date();

    if (period === 'daily') {
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      };
    } else if (period === 'monthly') {
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      };
    } else {
      groupBy = {
        year: { $year: '$createdAt' }
      };
    }

    const revenue = await Booking.aggregate([
      {
        $match: {
          status: 'completed',
          'payment.status': 'completed'
        }
      },
      {
        $group: {
          _id: groupBy,
          totalRevenue: { $sum: '$price.total' },
          bookingCount: { $sum: 1 },
          avgOrderValue: { $avg: '$price.total' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
      { $limit: 12 }
    ]);

    const topServices = await Booking.aggregate([
      {
        $match: {
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$service',
          totalRevenue: { $sum: '$price.total' },
          bookingCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: '_id',
          foreignField: '_id',
          as: 'service'
        }
      },
      { $unwind: '$service' },
      {
        $project: {
          serviceName: '$service.name',
          totalRevenue: 1,
          bookingCount: 1
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        revenue,
        topServices
      }
    });
  } catch (error) {
    console.error('Admin revenue error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching revenue'
    });
  }
});

module.exports = router;
