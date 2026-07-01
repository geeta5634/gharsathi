const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { query, queryOne, execute } = require('../database');
const { authenticate } = require('../middleware/auth');
const { validateEnum, VALID_PAYMENT_METHODS } = require('../middleware/validate');

const router = express.Router();

function generateReceiptNo() {
  const d = new Date();
  const y = d.getFullYear().toString().slice(2);
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `GSR-${y}${m}-${seq}`;
}

function generateInvoiceHtml(booking, payment, receiptNo) {
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #fff; border: 1px solid #e5e7eb; border-radius: 16px;">
      <div style="text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 16px; margin-bottom: 20px;">
        <div style="background: #1e40af; color: white; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 24px;">&#x2302;</div>
        <h1 style="font-size: 22px; margin: 0; color: #1e40af;">GharSathi</h1>
        <p style="font-size: 12px; color: #6b7280; margin: 2px 0;">Har Ghar Ka Sathi</p>
        <p style="font-size: 13px; color: #374151; margin-top: 8px;"><strong>Payment Receipt</strong></p>
      </div>
      <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
        <tr><td style="padding: 6px 0; color: #6b7280;">Receipt No.</td><td style="padding: 6px 0; text-align: right; font-weight: 600;">${receiptNo}</td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Date</td><td style="padding: 6px 0; text-align: right;">${date}</td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Booking ID</td><td style="padding: 6px 0; text-align: right; font-family: monospace;">#${booking.id}</td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Service</td><td style="padding: 6px 0; text-align: right;">${booking.service_name}</td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Worker</td><td style="padding: 6px 0; text-align: right;">${booking.worker_name || 'N/A'}</td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Date of Service</td><td style="padding: 6px 0; text-align: right;">${booking.booking_date} at ${booking.booking_time}</td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Payment Method</td><td style="padding: 6px 0; text-align: right; text-transform: capitalize;">${payment.method}</td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Transaction ID</td><td style="padding: 6px 0; text-align: right; font-family: monospace; font-size: 11px;">${payment.transaction_id || 'N/A'}</td></tr>
      </table>
      <div style="border-top: 2px solid #e5e7eb; margin-top: 16px; padding-top: 16px;">
        <table style="width: 100%; font-size: 14px;">
          <tr><td style="padding: 4px 0; color: #6b7280;">Visit Charge</td><td style="padding: 4px 0; text-align: right;">&#x20B9;${booking.visit_charge}</td></tr>
          <tr><td style="padding: 4px 0; color: #6b7280;">Service Charge</td><td style="padding: 4px 0; text-align: right;">&#x20B9;${booking.service_charge}</td></tr>
          <tr><td style="padding: 4px 0; color: #6b7280;">Platform Fee</td><td style="padding: 4px 0; text-align: right;">&#x20B9;${booking.platform_fee}</td></tr>
          <tr style="border-top: 1px solid #d1d5db;"><td style="padding: 8px 0; font-weight: 700; font-size: 16px;">Total Amount</td><td style="padding: 8px 0; text-align: right; font-weight: 700; font-size: 16px;">&#x20B9;${booking.total_amount}</td></tr>
        </table>
      </div>
      <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af;">
        <p>GharSathi Home Services Platform</p>
        <p>Jodhpur, Rajasthan</p>
        <p style="margin-top: 4px;">Thank you for choosing GharSathi!</p>
      </div>
    </div>
  `;
}

// ─── Initiate Payment ───
router.post('/initiate', authenticate, (req, res) => {
  try {
    const { booking_id, method } = req.body;
    if (!booking_id) return res.status(400).json({ error: 'Booking ID is required' });

    const pm = method ? validateEnum(method, VALID_PAYMENT_METHODS, 'Payment method') : { valid: true, value: 'online' };
    if (!pm.valid) return res.status(400).json({ error: pm.error });

    const booking = queryOne(
      `SELECT b.*, s.name as service_name, u.name as worker_name FROM bookings b 
       JOIN services s ON b.service_id = s.id 
       LEFT JOIN workers w ON b.worker_id = w.id 
       LEFT JOIN users u ON w.user_id = u.id 
       WHERE b.id = ? AND b.customer_id = ?`,
      booking_id, req.user.id
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.payment_status === 'paid') return res.status(400).json({ error: 'Already paid' });

    if (pm.value === 'cash') {
      execute("UPDATE bookings SET payment_method = 'cash', payment_status = 'pending' WHERE id = ?", booking_id);
      return res.json({ message: 'Cash on service selected', booking_id, method: 'cash', status: 'pending' });
    }

    // Simulated online payment
    const paymentId = 'PAY-' + uuidv4().slice(0, 8).toUpperCase();
    const transactionId = 'TXN' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

    execute("UPDATE bookings SET payment_method = 'online', payment_status = 'pending' WHERE id = ?", booking_id);
    execute(
      'INSERT INTO payments (id, booking_id, customer_id, amount, method, transaction_id, gateway, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      paymentId, booking_id, req.user.id, booking.total_amount, 'online', transactionId, 'simulated', 'pending'
    );

    res.json({
      message: 'Payment initiated',
      payment_id: paymentId,
      transaction_id: transactionId,
      booking_id,
      amount: booking.total_amount,
      method: 'online',
      status: 'pending',
      gateway: 'simulated',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Verify / Complete Payment (simulated success) ───
router.post('/verify', authenticate, (req, res) => {
  try {
    const { booking_id, payment_id } = req.body;
    if (!booking_id) return res.status(400).json({ error: 'Booking ID is required' });

    const booking = queryOne(
      `SELECT b.*, s.name as service_name, u.name as worker_name FROM bookings b 
       JOIN services s ON b.service_id = s.id 
       LEFT JOIN workers w ON b.worker_id = w.id 
       LEFT JOIN users u ON w.user_id = u.id 
       WHERE b.id = ?`,
      booking_id
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    let payment;
    if (payment_id) {
      payment = queryOne('SELECT * FROM payments WHERE id = ? AND booking_id = ?', payment_id, booking_id);
    } else {
      payment = queryOne("SELECT * FROM payments WHERE booking_id = ? AND status = 'pending' ORDER BY created_at DESC LIMIT 1", booking_id);
    }

    if (!payment) {
      // Create payment record if it doesn't exist yet
      const pId = 'PAY-' + uuidv4().slice(0, 8).toUpperCase();
      const txnId = 'TXN' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
      execute(
        'INSERT INTO payments (id, booking_id, customer_id, amount, method, transaction_id, gateway, status, paid_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        pId, booking_id, req.user.id, booking.total_amount, booking.payment_method, txnId, 'simulated', 'success', new Date().toISOString()
      );
      payment = queryOne('SELECT * FROM payments WHERE id = ?', pId);
    } else {
      execute("UPDATE payments SET status = 'success', paid_at = ? WHERE id = ?", new Date().toISOString(), payment.id);
      payment.status = 'success';
    }

    execute("UPDATE bookings SET payment_status = 'paid', updated_at = datetime('now') WHERE id = ?", booking_id);

    // Generate receipt
    let receipt = queryOne('SELECT * FROM payment_receipts WHERE booking_id = ?', booking_id);
    if (!receipt) {
      const receiptId = uuidv4();
      const receiptNo = generateReceiptNo();
      const invoiceHtml = generateInvoiceHtml(booking, payment, receiptNo);
      execute(
        'INSERT INTO payment_receipts (id, booking_id, payment_id, receipt_no, invoice_html) VALUES (?, ?, ?, ?, ?)',
        receiptId, booking_id, payment.id, receiptNo, invoiceHtml
      );
      receipt = queryOne('SELECT * FROM payment_receipts WHERE id = ?', receiptId);
    }

    res.json({
      message: 'Payment successful',
      booking_id,
      status: 'success',
      payment,
      receipt: {
        receipt_no: receipt.receipt_no,
        id: receipt.id,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Get Payment Status ───
router.get('/status/:bookingId', authenticate, (req, res) => {
  try {
    const booking = queryOne('SELECT id, payment_method, payment_status, total_amount FROM bookings WHERE id = ?', req.params.bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const payment = queryOne("SELECT * FROM payments WHERE booking_id = ? AND status = 'success' ORDER BY created_at DESC LIMIT 1", req.params.bookingId);
    const receipt = queryOne('SELECT * FROM payment_receipts WHERE booking_id = ?', req.params.bookingId);

    res.json({ booking, payment, receipt: receipt || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Get Payment Receipt ───
router.get('/receipt/:bookingId', authenticate, (req, res) => {
  try {
    const receipt = queryOne('SELECT * FROM payment_receipts WHERE booking_id = ?', req.params.bookingId);
    if (!receipt) return res.status(404).json({ error: 'Receipt not found' });
    res.json(receipt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Payment History ───
router.get('/history', authenticate, (req, res) => {
  try {
    const payments = query(
      `SELECT p.*, b.booking_date, b.booking_time, s.name as service_name, u.name as worker_name,
              pr.receipt_no
       FROM payments p 
       JOIN bookings b ON p.booking_id = b.id 
       JOIN services s ON b.service_id = s.id 
       LEFT JOIN workers w ON b.worker_id = w.id 
       LEFT JOIN users u ON w.user_id = u.id 
       LEFT JOIN payment_receipts pr ON pr.payment_id = p.id
       WHERE p.customer_id = ? 
       ORDER BY p.created_at DESC`,
      req.user.id
    );
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
