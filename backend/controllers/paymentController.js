const Payment = require('../models/Payment');

exports.createOrder = async (req, res) => {
  try {
    const { amount, bookingId, customerId } = req.body;

    // In production, create Razorpay order:
    // const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    // const order = await razorpay.orders.create({ amount: amount * 100, currency: 'INR', receipt: bookingId });

    const payment = await Payment.create({
      bookingId,
      customerId,
      amount,
      method: 'razorpay',
      status: 'pending',
      razorpayOrderId: `order_${Date.now()}`,
    });

    res.json({
      success: true,
      payment,
      razorpayKey: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
      amount: amount * 100,
      currency: 'INR',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, paymentId } = req.body;

    // In production: verify signature with Razorpay SDK

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        status: 'success',
        razorpayPaymentId,
        transactionId: razorpayPaymentId,
      },
      { new: true }
    );

    res.json({ success: true, message: 'Payment verified', payment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ customerId: req.params.userId })
      .populate('bookingId', 'service amount status')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: payments.length, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payment history' });
  }
};
