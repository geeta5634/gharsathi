const Razorpay = require('razorpay');
const crypto = require('crypto');

const isMockMode = () => {
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  return keyId.includes('XXXXXXXX') || process.env.RAZORPAY_MOCK === 'true';
};

let razorpay;

const getRazorpayInstance = () => {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
  return razorpay;
};

exports.createOrder = async (amount, receipt) => {
  if (isMockMode()) {
    console.log('[MOCK] Razorpay order created:', { amount, receipt });
    return {
      id: 'mock_order_' + Date.now(),
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt,
      status: 'created'
    };
  }
  try {
    const instance = getRazorpayInstance();
    const order = await instance.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: receipt
    });
    return order;
  } catch (error) {
    throw new Error(`Razorpay order creation failed: ${error.message}`);
  }
};

exports.verifyPayment = (orderId, paymentId, signature) => {
  if (isMockMode()) {
    console.log('[MOCK] Payment verified:', { orderId, paymentId });
    return true;
  }
  try {
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');
    return expectedSignature === signature;
  } catch (error) {
    throw new Error(`Payment verification failed: ${error.message}`);
  }
};

exports.isMockMode = isMockMode;
