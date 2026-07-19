const express = require('express');
const User = require('../models/User');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Membership = require('../models/Membership');
const models = require('../config/modelCompatibility');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
  try {
    const [allUsers, allWorkers, allBookings, allServices, allMemberships] = await Promise.all([
      User.find({}), Worker.find({}), Booking.find({}), Service.find({}), Membership.find({})
    ]);

    const totalUsers = allUsers.length;
    const totalCustomers = allUsers.filter(u => u.role === 'customer').length;
    const totalWorkers = allWorkers.length;
    const approvedWorkers = allWorkers.filter(w => w.isApproved).length;
    const pendingApprovals = allWorkers.filter(w => !w.isApproved).length;
    const totalServices = allServices.filter(s => s.isActive).length;
    const totalBookings = allBookings.length;
    const pendingBookings = allBookings.filter(b => b.status === 'pending').length;
    const activeBookings = allBookings.filter(b => ['assigned', 'accepted', 'en_route', 'in_progress'].includes(b.status)).length;
    const completedBookings = allBookings.filter(b => b.status === 'completed').length;
    const cancelledBookings = allBookings.filter(b => b.status === 'cancelled').length;
    const todayBookings = allBookings.filter(b => {
      const d = new Date(b.createdAt);
      const today = new Date();
      return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    }).length;

    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthlyCompleted = allBookings.filter(b => b.status === 'completed' && new Date(b.createdAt) >= monthStart);
    const monthlyRevenue = monthlyCompleted.reduce((sum, b) => sum + (b.price?.total || 0), 0);
    const totalCompletedRevenue = allBookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.price?.total || 0), 0);

    const activeMemberships = allMemberships.filter(m => m.isActive && new Date(m.endDate) >= new Date()).length;

    res.status(200).json({
      success: true,
      data: {
        users: { total: totalUsers, customers: totalCustomers, workers: totalWorkers },
        workers: { total: totalWorkers, approved: approvedWorkers, pendingApprovals },
        services: { total: totalServices },
        bookings: { total: totalBookings, pending: pendingBookings, active: activeBookings, completed: completedBookings, cancelled: cancelledBookings, today: todayBookings },
        revenue: { thisMonth: monthlyRevenue, total: totalCompletedRevenue },
        memberships: { active: activeMemberships }
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching dashboard' });
  }
});

router.get('/bookings', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.query;
    let bookings = await Booking.find({});
    if (status) bookings = bookings.filter(b => b.status === status);
    bookings.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const populated = await Promise.all(bookings.map(async (b) => {
      if (b.service && typeof b.service === 'string') {
        const svc = await Service.findOne({ _id: b.service });
        if (svc) b.service = svc;
      }
      if (b.customer && typeof b.customer === 'string') {
        const u = await User.findOne({ _id: b.customer });
        if (u) { const { password, ...safe } = u; b.customer = safe; }
      }
      if (b.worker && typeof b.worker === 'string') {
        const w = await Worker.findOne({ _id: b.worker });
        if (w) {
          if (w.user && typeof w.user === 'string') {
            const u = await User.findOne({ _id: w.user });
            if (u) { const { password, ...safe } = u; w.user = safe; }
          }
          b.worker = w;
        }
      }
      return b;
    }));

    res.status(200).json({ success: true, count: populated.length, total: populated.length, data: populated });
  } catch (error) {
    console.error('Admin bookings error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const { role, search } = req.query;
    let users = await User.find({});
    if (role) users = users.filter(u => u.role === role);
    if (search) {
      const s = search.toLowerCase();
      users = users.filter(u => (u.name || '').toLowerCase().includes(s) || (u.phone || '').includes(s) || (u.email || '').toLowerCase().includes(s));
    }
    users.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    const safe = users.map(({ password, ...rest }) => rest);
    res.status(200).json({ success: true, count: safe.length, total: safe.length, data: safe });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/workers', protect, authorize('admin'), async (req, res) => {
  try {
    const { approved } = req.query;
    let workers = await Worker.find({});
    if (approved !== undefined) workers = workers.filter(w => w.isApproved === (approved === 'true'));
    workers.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const populated = await Promise.all(workers.map(async (w) => {
      if (w.user && typeof w.user === 'string') {
        const u = await User.findOne({ _id: w.user });
        if (u) { const { password, ...safe } = u; w.user = safe; }
      }
      return w;
    }));

    res.status(200).json({ success: true, count: populated.length, total: populated.length, data: populated });
  } catch (error) {
    console.error('Admin workers error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/revenue', protect, authorize('admin'), async (req, res) => {
  try {
    const allBookings = await Booking.find({ status: 'completed' });
    const monthlyMap = {};
    allBookings.forEach(b => {
      const d = new Date(b.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyMap[key]) monthlyMap[key] = { revenue: 0, count: 0 };
      monthlyMap[key].revenue += b.price?.total || 0;
      monthlyMap[key].count += 1;
    });

    const revenue = Object.entries(monthlyMap).slice(-12).map(([month, data]) => ({
      _id: month,
      totalRevenue: data.revenue,
      bookingCount: data.count,
      avgOrderValue: data.count > 0 ? Math.round(data.revenue / data.count) : 0
    })).reverse();

    // Top services
    const svcRevenue = {};
    for (const b of allBookings) {
      const svcId = b.service;
      if (!svcRevenue[svcId]) svcRevenue[svcId] = { revenue: 0, count: 0 };
      svcRevenue[svcId].revenue += b.price?.total || 0;
      svcRevenue[svcId].count += 1;
    }

    const topServices = [];
    for (const [svcId, data] of Object.entries(svcRevenue)) {
      const svc = await Service.findOne({ _id: svcId });
      topServices.push({ serviceName: svc?.name || 'Unknown', totalRevenue: data.revenue, bookingCount: data.count });
    }
    topServices.sort((a, b) => b.totalRevenue - a.totalRevenue);

    res.status(200).json({ success: true, data: { revenue, topServices: topServices.slice(0, 5) } });
  } catch (error) {
    console.error('Admin revenue error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
