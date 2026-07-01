const express = require('express');
const { query, queryOne, execute } = require('../database');
const { authenticate } = require('../middleware/auth');
const { sanitize, sanitizeHtml, validateId, validateDate, validateAddress, validateEnum, validateRating, VALID_STATUSES, VALID_PAYMENT_METHODS } = require('../middleware/validate');

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  try {
    const { status } = req.query;
    let sql = `SELECT b.*, c.name as customer_name, c.phone as customer_phone, c.location as customer_location, 
      w.id as worker_id, w.user_id as worker_user_id, u.name as worker_name, s.name as service_name, s.icon as service_icon 
      FROM bookings b JOIN users c ON b.customer_id = c.id 
      LEFT JOIN workers w ON b.worker_id = w.id LEFT JOIN users u ON w.user_id = u.id 
      JOIN services s ON b.service_id = s.id WHERE 1=1`;
    const params = [];

    if (req.user.role === 'customer') {
      sql += ' AND b.customer_id = ?';
      params.push(req.user.id);
    } else if (req.user.role === 'worker') {
      const worker = queryOne('SELECT id FROM workers WHERE user_id = ?', req.user.id);
      if (worker) {
        sql += ' AND (b.worker_id = ? OR b.worker_id IS NULL)';
        params.push(worker.id);
      } else {
        return res.json([]);
      }
    }

    if (status && typeof status === 'string' && ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].includes(status)) {
      sql += ' AND b.status = ?';
      params.push(status);
    }
    sql += ' ORDER BY b.created_at DESC';
    res.json(query(sql, ...params));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', authenticate, (req, res) => {
  try {
    const booking = queryOne(
      `SELECT b.*, c.name as customer_name, c.phone as customer_phone, c.location as customer_location, c.avatar as customer_avatar,
       w.id as worker_id, w.user_id as worker_user_id, u.name as worker_name, u.phone as worker_phone, u.avatar as worker_avatar,
       s.name as service_name, s.icon as service_icon, s.color as service_color
       FROM bookings b JOIN users c ON b.customer_id = c.id
       LEFT JOIN workers w ON b.worker_id = w.id LEFT JOIN users u ON w.user_id = u.id
       JOIN services s ON b.service_id = s.id WHERE b.id = ?`,
      req.params.id
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    booking.reviews = query(
      'SELECT r.*, u.name as customer_name FROM reviews r JOIN users u ON r.customer_id = u.id WHERE r.booking_id = ?',
      req.params.id
    );
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, (req, res) => {
  try {
    const { worker_id, visit_charge, service_charge, platform_fee, payment_method, notes } = req.body;

    const svcId = validateId(req.body.service_id, 'Service');
    if (!svcId.valid) return res.status(400).json({ error: svcId.error });

    const bDate = validateDate(req.body.booking_date);
    if (!bDate.valid) return res.status(400).json({ error: bDate.error });

    if (!req.body.booking_time || typeof req.body.booking_time !== 'string') {
      return res.status(400).json({ error: 'Booking time is required' });
    }
    const bTime = sanitize(req.body.booking_time);

    const addr = validateAddress(req.body.address);
    if (!addr.valid) return res.status(400).json({ error: addr.error });

    const service = queryOne('SELECT id FROM services WHERE id = ?', svcId.value);
    if (!service) return res.status(400).json({ error: 'Invalid service' });

    if (worker_id) {
      const wId = validateId(worker_id, 'Worker');
      if (!wId.valid) return res.status(400).json({ error: wId.error });
      const worker = queryOne('SELECT id FROM workers WHERE id = ?', wId.value);
      if (!worker) return res.status(400).json({ error: 'Invalid worker' });

      const conflicting = queryOne(
        "SELECT id FROM bookings WHERE worker_id = ? AND booking_date = ? AND booking_time = ? AND status NOT IN ('cancelled')",
        wId.value, bDate.value, bTime
      );
      if (conflicting) return res.status(409).json({ error: 'Worker already booked at this time slot' });
    }

    const pm = payment_method ? validateEnum(payment_method, VALID_PAYMENT_METHODS, 'Payment method') : { valid: true, value: 'cash' };
    if (!pm.valid) return res.status(400).json({ error: pm.error });

    const vc = typeof visit_charge === 'number' && visit_charge > 0 ? visit_charge : 299;
    const sc = typeof service_charge === 'number' && service_charge > 0 ? service_charge : 500;
    const pf = typeof platform_fee === 'number' && platform_fee > 0 ? platform_fee : 49;
    const total = vc + sc + pf;
    const id = 'GS' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();

    execute(
      'INSERT INTO bookings (id, customer_id, worker_id, service_id, status, booking_date, booking_time, address, visit_charge, service_charge, platform_fee, total_amount, payment_method, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      id, req.user.id, worker_id || null, svcId.value, 'pending', bDate.value, bTime, sanitizeHtml(addr.value), vc, sc, pf, total, pm.value, notes ? sanitize(notes) : null
    );

    res.status(201).json(queryOne('SELECT * FROM bookings WHERE id = ?', id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/status', authenticate, (req, res) => {
  try {
    const statusCheck = validateEnum(req.body.status, VALID_STATUSES, 'Status');
    if (!statusCheck.valid) return res.status(400).json({ error: statusCheck.error });

    const booking = queryOne('SELECT * FROM bookings WHERE id = ?', req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (req.user.role === 'worker') {
      const worker = queryOne('SELECT id FROM workers WHERE user_id = ?', req.user.id);
      if (!worker || (booking.worker_id && booking.worker_id !== worker.id)) {
        return res.status(403).json({ error: 'Not authorized' });
      }
    } else if (req.user.role === 'customer' && booking.customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    execute("UPDATE bookings SET status = ?, updated_at = datetime('now') WHERE id = ?", status, req.params.id);

    if (status === 'confirmed' && req.user.role === 'worker' && !booking.worker_id) {
      const worker = queryOne('SELECT id FROM workers WHERE user_id = ?', req.user.id);
      if (worker) execute('UPDATE bookings SET worker_id = ? WHERE id = ?', worker.id, req.params.id);
    }

    if (status === 'completed') {
      const b = queryOne('SELECT * FROM bookings WHERE id = ?', req.params.id);
      if (b.worker_id) {
        const { v4: uuidv4 } = require('uuid');
        const eid = uuidv4();
        execute('INSERT INTO earnings (id, worker_id, booking_id, amount, status) VALUES (?, ?, ?, ?, ?)',
          eid, b.worker_id, req.params.id, b.visit_charge, 'pending');
        execute('UPDATE workers SET earnings_total = earnings_total + ? WHERE id = ?', b.visit_charge, b.worker_id);
      }
    }

    res.json({ message: 'Status updated', status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/review', authenticate, (req, res) => {
  try {
    const { comment } = req.body;
    const ratingCheck = validateRating(req.body.rating);
    if (!ratingCheck.valid) return res.status(400).json({ error: ratingCheck.error });

    if (comment && (typeof comment !== 'string' || comment.length > 1000)) {
      return res.status(400).json({ error: 'Comment too long (max 1000 characters)' });
    }

    const booking = queryOne('SELECT * FROM bookings WHERE id = ?', req.params.id);
    if (!booking || booking.customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    execute('INSERT INTO reviews (booking_id, customer_id, worker_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      req.params.id, req.user.id, booking.worker_id, ratingCheck.value, comment ? sanitize(comment) : null);

    if (booking.worker_id) {
      const stats = queryOne('SELECT AVG(rating) as avg, COUNT(*) as cnt FROM reviews WHERE worker_id = ?', booking.worker_id);
      execute('UPDATE workers SET rating = ?, reviews_count = ? WHERE id = ?',
        Math.round(stats.avg * 10) / 10, stats.cnt, booking.worker_id);
    }

    res.json({ message: 'Review added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, (req, res) => {
  try {
    const booking = queryOne('SELECT * FROM bookings WHERE id = ?', req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.customer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    execute('DELETE FROM bookings WHERE id = ?', req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
