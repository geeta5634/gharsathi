const express = require('express');
const { body, validationResult } = require('express-validator');
const Membership = require('../models/Membership');
const { protect } = require('../middleware/auth');
const { createOrder, verifyPayment } = require('../utils/razorpay');

const router = express.Router();

const PLANS = {
  basic: {
    name: 'basic',
    amount: 99,
    duration: 30,
    benefits: [
      'Priority customer support',
      '5% discount on all services',
      'Free service consultation'
    ]
  },
  premium: {
    name: 'premium',
    amount: 299,
    duration: 30,
    benefits: [
      'Priority customer support',
      '15% discount on all services',
      'Free service consultation',
      'Emergency service within 30 mins',
      'Extended warranty on services'
    ]
  },
  vip: {
    name: 'vip',
    amount: 599,
    duration: 30,
    benefits: [
      '24/7 Priority customer support',
      '25% discount on all services',
      'Free service consultation',
      'Emergency service within 15 mins',
      'Extended warranty on services',
      'Dedicated account manager',
      'Free monthly maintenance check'
    ]
  }
};

// GET /api/memberships/plans
router.get('/plans', (req, res) => {
  res.status(200).json({
    success: true,
    data: Object.values(PLANS)
  });
});

// GET /api/memberships/current
router.get('/current', protect, async (req, res) => {
  try {
    const membership = await Membership.findOne({
      user: req.user.id,
      isActive: true,
      endDate: { $gte: new Date() }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: membership || null
    });
  } catch (error) {
    console.error('Get current membership error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching membership'
    });
  }
});

// POST /api/memberships/subscribe
router.post('/subscribe', protect, [
  body('plan').isIn(['basic', 'premium', 'vip']).withMessage('Invalid plan type'),
  body('razorpayPaymentId').optional().isString(),
  body('razorpayOrderId').optional().isString(),
  body('razorpaySignature').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { plan, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
    const planDetails = PLANS[plan];

    if (!planDetails) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan selected'
      });
    }

    // If online payment, verify it
    if (razorpayPaymentId && razorpayOrderId && razorpaySignature) {
      const isValid = verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed'
        });
      }
    }

    // Deactivate any existing membership
    await Membership.updateMany(
      { user: req.user.id, isActive: true },
      { isActive: false }
    );

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + planDetails.duration);

    const membership = await Membership.create({
      user: req.user.id,
      plan,
      amount: planDetails.amount,
      startDate,
      endDate,
      isActive: true,
      paymentId: razorpayPaymentId || 'cash',
      benefits: planDetails.benefits
    });

    res.status(201).json({
      success: true,
      message: `Successfully subscribed to ${plan} plan`,
      data: membership
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during subscription'
    });
  }
});

module.exports = router;
