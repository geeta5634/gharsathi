const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Send OTP
router.post('/send-otp', authController.sendOtp);

// Verify OTP
router.post('/verify-otp', authController.verifyOtp);

// Get current user profile
router.get('/profile', authController.getProfile);

// Update user profile
router.put('/profile', authController.updateProfile);

module.exports = router;
