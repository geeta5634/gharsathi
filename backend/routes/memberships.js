const express = require('express');
const { body, validationResult } = require('express-validator');
const Membership = require('../models/Membership');
const models = require('../config/modelCompatibility');
const { protect } = require('../middleware/auth');
const { createOrder, verifyPayment } = require('../utils/razorpay');

const router = express.Router();

const saveMembership = async (m) => {
  const { _id, ...data } = m;
  await models.memberships.update({ _id }, { $set: data });
};

const PLANS = {
  basic: { name: 'basic', amount: 99, duration: 30, benefits: ['Priority customer support', '5% discount on all services', 'Free service consultation'] },
  premium: { name: 'premium', amount: 299, duration: 30, benefits: ['Priority customer support', '15% discount on all services', 'Free service consultation', 'Emergency service within 30 mins', 'Extended warranty on services'] },
  vip: { name: 'vip', amount: 599, duration: 30, benefits: ['24/7 Priority customer support', '25% discount on all services', 'Free service consultation', 'Emergency service within 15 mins', 'Extended warranty on services', 'Dedicated account manager', 'Free monthly maintenance check'] }
};

router.get('/plans', (req, res) => {
  res.status(200).json({ success: true, data: Object.values(PLANS) });
});

router.get('/current', protect, async (req, res) => {
  try {
    const memberships = await Membership.find({ user: req.user._id, isActive: true });
    const active = memberships.filter(m => new Date(m.endDate) >= new Date()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json({ success: true, data: active[0] || null });
  } catch (error) {
    console.error('Get membership error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/subscribe', protect, [
  body('plan').isIn(['basic', 'premium', 'vip']).withMessage('Invalid plan type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { plan, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
    const planDetails = PLANS[plan];
    if (!planDetails) return res.status(400).json({ success: false, message: 'Invalid plan' });

    await models.memberships.updateMany({ user: req.user._id, isActive: true }, { $set: { isActive: false } });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + planDetails.duration);

    const membership = await Membership.create({
      user: req.user._id,
      plan,
      amount: planDetails.amount,
      startDate,
      endDate,
      isActive: true,
      paymentId: razorpayPaymentId || 'cash',
      benefits: planDetails.benefits
    });

    res.status(201).json({ success: true, message: `Subscribed to ${plan} plan`, data: membership });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
