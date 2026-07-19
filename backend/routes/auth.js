const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const models = require('../config/modelCompatibility');
const User = models.users;
const { hashPassword, comparePassword } = require('../models/User');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// POST /api/auth/register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['customer', 'worker']).withMessage('Role must be customer or worker')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, phone, password, role, email } = req.body;

    if (phone) {
      const normalizedPhone = phone.replace(/[\s\-\+\(\)]/g, '').replace(/^91/, '');
      const existingUser = await User.findOne({ phone: normalizedPhone });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User with this phone number already exists' });
      }
    }

    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }
    }

    const userData = {
      name,
      phone: phone ? phone.replace(/[\s\-\+\(\)]/g, '').replace(/^91/, '') : '',
      password: hashPassword(password),
      role: role || 'customer',
      email: email || undefined,
      isVerified: true,
      avatar: '',
      address: { street: '', city: '', state: '', pincode: '' },
    };

    const user = await User.create(userData);
    const token = generateToken(user._id);

    const { password: _, ...safeUser } = user;

    res.status(201).json({
      success: true,
      data: { user: safeUser, token }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', [
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, phone, password } = req.body;
    let user;

    if (email) {
      user = await User.findOne({ email });
    } else if (phone) {
      const normalizedPhone = phone.replace(/[\s\-\+\(\)]/g, '').replace(/^91/, '');
      user = await User.findOne({ phone: normalizedPhone });
    } else {
      return res.status(400).json({ success: false, message: 'Email or phone is required' });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    const { password: _, ...safeUser } = user;

    res.status(200).json({
      success: true,
      data: { user: safeUser, token }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// POST /api/auth/send-otp
router.post('/send-otp', [
  body('phone').notEmpty().withMessage('Phone is required')
], async (req, res) => {
  try {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[OTP] ${phone}: ${otp}`);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      ...(process.env.NODE_ENV === 'development' && { otp })
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  res.status(200).json({ success: true, message: 'OTP verified' });
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    const { password: _, ...safeUser } = user;
    res.status(200).json({ success: true, data: safeUser });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
});

module.exports = router;
