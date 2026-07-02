const User = require('../models/User');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalCustomers, totalWorkers, totalBookings, totalRevenue] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Worker.countDocuments(),
      Booking.countDocuments(),
      Booking.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    const recentBookings = await Booking.find()
      .populate('customerId', 'name')
      .populate('workerId', 'name service')
      .sort({ createdAt: -1 })
      .limit(10);

    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const revenueByMonth = await Booking.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      stats: {
        totalCustomers,
        totalWorkers,
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentBookings,
        bookingsByStatus,
        revenueByMonth,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};

exports.getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().populate('userId', 'name phone').sort({ createdAt: -1 });
    res.json({ success: true, count: workers.length, workers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch workers' });
  }
};

exports.verifyWorker = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });
    res.json({ success: true, worker });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to verify worker' });
  }
};

exports.suspendWorker = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      { isAvailable: false },
      { new: true }
    );
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });
    res.json({ success: true, message: 'Worker suspended', worker });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to suspend worker' });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).sort({ createdAt: -1 });
    res.json({ success: true, count: customers.length, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch customers' });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('customerId', 'name phone')
      .populate('workerId', 'name service')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.json({ success: true, count: bookings.length, total, page, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
};

exports.getRevenueAnalytics = async (req, res) => {
  try {
    const revenue = await Booking.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const totalRevenue = revenue.reduce((sum, r) => sum + r.total, 0);

    res.json({ success: true, totalRevenue, revenue });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch revenue analytics' });
  }
};

exports.getServiceAnalytics = async (req, res) => {
  try {
    const serviceStats = await Booking.aggregate([
      {
        $group: {
          _id: '$service',
          totalBookings: { $sum: 1 },
          completedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          totalRevenue: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] },
          },
        },
      },
      { $sort: { totalBookings: -1 } },
    ]);

    res.json({ success: true, services: serviceStats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch service analytics' });
  }
};
