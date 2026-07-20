const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const auth = require("../middleware/auth");

const router = express.Router();

let razorpay;

function getRazorpay() {
  if (!razorpay) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || keyId.includes("XXXX")) {
      return null;
    }

    razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return razorpay;
}

router.post("/create-order", auth, async (req, res) => {
  try {
    const { bookingId } = req.body;
    const prisma = req.app.locals.prisma;

    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId: req.user.userId },
      include: { payment: true },
    });

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.payment && booking.payment.razorpayOrderId) {
      return res.json({
        orderId: booking.payment.razorpayOrderId,
        amount: booking.payment.amount,
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    }

    const rp = getRazorpay();

    if (!rp) {
      const mockOrderId = "order_mock_" + Date.now();
      await prisma.payment.update({
        where: { bookingId },
        data: { razorpayOrderId: mockOrderId, status: "CREATED" },
      });
      return res.json({
        orderId: mockOrderId,
        amount: booking.servicePrice,
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID,
        mock: true,
      });
    }

    const order = await rp.orders.create({
      amount: booking.servicePrice * 100,
      currency: "INR",
      receipt: `booking_${booking.id}`,
    });

    await prisma.payment.update({
      where: { bookingId },
      data: { razorpayOrderId: order.id, status: "CREATED" },
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Failed to create payment order" });
  }
});

router.post("/verify", auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const prisma = req.app.locals.prisma;

    const rp = getRazorpay();

    if (rp) {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSig = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

      if (expectedSig !== razorpay_signature) {
        return res.status(400).json({ error: "Payment verification failed" });
      }
    }

    await prisma.payment.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "SUCCESS",
      },
    });

    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (payment) {
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: "CONFIRMED" },
      });
    }

    res.json({ success: true, message: "Payment verified successfully" });
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({ error: "Payment verification failed" });
  }
});

module.exports = router;
