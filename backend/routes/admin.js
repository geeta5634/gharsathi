const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Dashboard stats
router.get('/stats', adminController.getDashboardStats);

// Manage workers
router.get('/workers', adminController.getAllWorkers);
router.put('/workers/:id/verify', adminController.verifyWorker);
router.put('/workers/:id/suspend', adminController.suspendWorker);

// Manage customers
router.get('/customers', adminController.getAllCustomers);

// Manage bookings
router.get('/bookings', adminController.getAllBookings);

// Revenue analytics
router.get('/revenue', adminController.getRevenueAnalytics);

// Service analytics
router.get('/service-analytics', adminController.getServiceAnalytics);

module.exports = router;
