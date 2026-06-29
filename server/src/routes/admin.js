const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { query, queryOne, execute } = require('../database');
const { authenticate, requireRole } = require('../middleware/auth');
const { sanitize, sanitizeHtml, validatePhone, validateName, validateNumber } = require('../middleware/validate');

const router = express.Router();

router.get('/users', authenticate, requireRole('admin'), (req, res) => {
  try {
    const users = query('SELECT id, name, phone, email, role, location, avatar, created_at FROM users ORDER BY created_at DESC');
    for (const u of users) {
      if (u.role === 'worker') {
        const worker = queryOne('SELECT id, service_id, experience, rating, available FROM workers WHERE user_id = ?', u.id);
        u.worker = worker;
      }
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users/customers', authenticate, requireRole('admin'), (req, res) => {
  try {
    const customers = query("SELECT id, name, phone, email, location, avatar, created_at FROM users WHERE role = 'customer' ORDER BY created_at DESC");
    for (const c of customers) {
      const bookingCount = queryOne("SELECT COUNT(*) as c FROM bookings WHERE customer_id = ?", c.id);
      c.total_bookings = bookingCount ? bookingCount.c : 0;
    }
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/workers', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { service_id, experience, visit_charge, about, skills } = req.body;

    const nameCheck = validateName(req.body.name);
    if (!nameCheck.valid) return res.status(400).json({ error: nameCheck.error });

    const phoneCheck = validatePhone(req.body.phone);
    if (!phoneCheck.valid) return res.status(400).json({ error: phoneCheck.error });

    if (!service_id || typeof service_id !== 'string') {
      return res.status(400).json({ error: 'Service is required' });
    }

    let user = queryOne('SELECT * FROM users WHERE phone = ?', phoneCheck.value);
    if (!user) {
      const id = uuidv4();
      const hashed = await bcrypt.hash(phoneCheck.value + Date.now(), 10);
      const avatar = `https://i.pravatar.cc/200?u=${id}`;
      execute('INSERT INTO users (id, name, phone, password, role, avatar) VALUES (?, ?, ?, ?, ?, ?)',
        id, sanitizeHtml(nameCheck.value), phoneCheck.value, hashed, 'worker', avatar);
      user = queryOne('SELECT * FROM users WHERE id = ?', id);
    }

    const existing = queryOne('SELECT id FROM workers WHERE user_id = ?', user.id);
    if (existing) return res.status(409).json({ error: 'Worker already exists for this user' });

    const wid = 'w' + uuidv4().substring(0, 8);
    execute('INSERT INTO workers (id, user_id, service_id, experience, visit_charge, about) VALUES (?, ?, ?, ?, ?, ?)',
      wid, user.id, service_id, experience || '5 Years', visit_charge || 299, about ? sanitize(about) : null);

    if (skills && Array.isArray(skills)) {
      for (const skill of skills) {
        if (typeof skill === 'string' && skill.trim()) {
          execute('INSERT INTO worker_skills (worker_id, skill) VALUES (?, ?)', wid, skill.trim());
        }
      }
    }

    const worker = queryOne('SELECT w.*, u.name, u.phone, u.avatar, s.name as service_name FROM workers w JOIN users u ON w.user_id = u.id JOIN services s ON w.service_id = s.id WHERE w.id = ?', wid);
    res.status(201).json(worker);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/export/:type', authenticate, requireRole('admin'), (req, res) => {
  try {
    const { type } = req.params;
    let data, filename, headers;

    if (type === 'workers') {
      data = query('SELECT w.id, u.name, u.phone, u.email, s.name as service, w.experience, w.rating, w.reviews_count, w.visit_charge, w.available, w.earnings_total, w.trust_score FROM workers w JOIN users u ON w.user_id = u.id JOIN services s ON w.service_id = s.id');
      filename = 'workers.csv';
      headers = ['ID,Name,Phone,Email,Service,Experience,Rating,Reviews,VisitCharge,Available,Earnings,TrustScore'];
    } else if (type === 'customers') {
      data = query("SELECT id, name, phone, email, location, created_at FROM users WHERE role = 'customer'");
      filename = 'customers.csv';
      headers = ['ID,Name,Phone,Email,Location,Joined'];
    } else if (type === 'bookings') {
      data = query('SELECT b.id, c.name as customer, u.name as worker, s.name as service, b.booking_date, b.booking_time, b.total_amount, b.status, b.payment_method, b.created_at FROM bookings b JOIN users c ON b.customer_id = c.id LEFT JOIN workers w ON b.worker_id = w.id LEFT JOIN users u ON w.user_id = u.id JOIN services s ON b.service_id = s.id');
      filename = 'bookings.csv';
      headers = ['ID,Customer,Worker,Service,Date,Time,Amount,Status,Payment,Created'];
    } else if (type === 'earnings') {
      data = query('SELECT e.id, u.name as worker, e.amount, e.status, e.payout_date, e.created_at FROM earnings e JOIN workers w ON e.worker_id = w.id JOIN users u ON w.user_id = u.id');
      filename = 'earnings.csv';
      headers = ['ID,Worker,Amount,Status,PayoutDate,Created'];
    } else {
      return res.status(400).json({ error: 'Invalid export type' });
    }

    const csv = headers.join('\n') + '\n' + data.map(row =>
      Object.values(row).map(v => v === null || v === undefined ? '' : String(v).replace(/,/g, ' ')).join(',')
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
