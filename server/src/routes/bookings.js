const express = require('express');
const { query, queryOne, execute } = require('../database');
const { authenticate } = require('../middleware/auth');

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
    const { service_id, worker_id, booking_date, booking_time, address, visit_charge, service_charge, platform_fee, payment_method, notes } = req.body;

    if (!service_id || typeof service_id !== 'string') return res.status(400).json({ error: 'Service is required' });
    if (!booking_date || typeof booking_date !== 'string') return res.status(400).json({ error: 'Booking date is required' });
    if (!booking_time || typeof booking_time !== 'string') return res.status(400).json({ error: 'Booking time is required' });
    if (!address || typeof address !== 'string' || address.trim().length < 5) {
      return res.status(400).json({ error: 'Valid address (min 5 characters) is required' });
    }

    const service = queryOne('SELECT id FROM services WHERE id = ?', service_id);
    if (!service) return res.status(400).json({ error: 'Invalid service' });

    if (worker_id) {
      const worker = queryOne('SELECT id FROM workers WHERE id = ?', worker_id);
      if (!worker) return res.status(400).json({ error: 'Invalid worker' });
    }

    if (payment_method && !['cash', 'online'].includes(payment_method)) {
      return res.status(400).json({ error: 'Payment method must be cash or online' });
    }

    const vc = visit_charge || 299;
    const sc = service_charge || 500;
    const pf = platform_fee || 49;
    const total = vc + sc + pf;
    const id = 'GS' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();

    execute(
      'INSERT INTO bookings (id, customer_id, worker_id, service_id, status, booking_date, booking_time, address, visit_charge, service_charge, platform_fee, total_amount, payment_method, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      id, req.user.id, worker_id || null, service_id, 'pending', booking_date, booking_time, address.trim(), vc, sc, pf, total, payment_method || 'cash', notes || null
    );

    res.status(201).json(queryOne('SELECT * FROM bookings WHERE id = ?', id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/status', authenticate, (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

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
    const { rating, comment } = req.body;
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
    }
    if (comment && (typeof comment !== 'string' || comment.length > 1000)) {
      return res.status(400).json({ error: 'Comment too long (max 1000 characters)' });
    }

    const booking = queryOne('SELECT * FROM bookings WHERE id = ?', req.params.id);
    if (!booking || booking.customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    execute('INSERT INTO reviews (booking_id, customer_id, worker_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      req.params.id, req.user.id, booking.worker_id, rating, comment || null);

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
