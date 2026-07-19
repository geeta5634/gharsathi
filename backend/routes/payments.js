const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const models = require('../config/modelCompatibility');
const { protect } = require('../middleware/auth');
const { createOrder, verifyPayment, isMockMode } = require('../utils/razorpay');

const router = express.Router();

const saveBooking = async (booking) => {
  const { _id, ...data } = booking;
  await models.bookings.update({ _id }, { $set: data });
};

// POST /api/payments/create-order
router.post('/create-order', protect, [
  body('bookingId').notEmpty().withMessage('Booking ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { bookingId, amount } = req.body;

    const booking = await Booking.findOne({ _id: bookingId });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.customer !== req.user._id) return res.status(403).json({ success: false, message: 'Not authorized' });

    const receipt = `booking_${bookingId}_${Date.now()}`;
    const order = await createOrder(amount, receipt);

    booking.payment = booking.payment || {};
    booking.payment.razorpayOrderId = order.id;
    booking.payment.method = 'online';
    await saveBooking(booking);

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: isMockMode() ? 'rzp_test_mock' : process.env.RAZORPAY_KEY_ID,
        mockMode: isMockMode()
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Server error while creating payment order' });
  }
});

// POST /api/payments/verify
router.post('/verify', protect, [
  body('razorpayOrderId').notEmpty().withMessage('Order ID is required'),
  body('razorpayPaymentId').notEmpty().withMessage('Payment ID is required'),
  body('razorpaySignature').notEmpty().withMessage('Signature is required'),
  body('bookingId').notEmpty().withMessage('Booking ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } = req.body;

    const booking = await Booking.findOne({ _id: bookingId });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.customer !== req.user._id) return res.status(403).json({ success: false, message: 'Not authorized' });

    const isValid = verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) return res.status(400).json({ success: false, message: 'Payment verification failed' });

    booking.payment = booking.payment || {};
    booking.payment.status = 'completed';
    booking.payment.razorpayPaymentId = razorpayPaymentId;
    booking.payment.razorpaySignature = razorpaySignature;
    await saveBooking(booking);

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: { bookingId: booking._id, amount: booking.price?.total, status: 'completed' }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: 'Server error while verifying payment' });
  }
});

// GET /api/payments/history
router.get('/history', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id });
    const completed = bookings.filter(b => b.payment?.status === 'completed');
    res.status(200).json({ success: true, count: completed.length, data: completed });
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching payment history' });
  }
});

module.exports = router;
