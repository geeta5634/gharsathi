const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { query, queryOne, execute } = require('../database');
const { generateToken, authenticate } = require('../middleware/auth');
const { sendOTP } = require('../services/sms');

const router = express.Router();

const otpStore = new Map();

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function cleanExpiredOtps() {
  const now = Date.now();
  for (const [phone, data] of otpStore.entries()) {
    if (data.expiresAt < now) otpStore.delete(phone);
  }
}
setInterval(cleanExpiredOtps, 60000);

router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || typeof phone !== 'string' || !/^[0-9]{10,15}$/.test(phone.trim())) {
      return res.status(400).json({ error: 'Valid phone number is required' });
    }

    const phoneClean = phone.trim();
    const otp = generateOtp();
    otpStore.set(phoneClean, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    sendOTP(phoneClean, otp).catch(err => console.warn(`[SMS] Background send failed: ${err.message}`));

    const isConsole = (process.env.SMS_PROVIDER || 'console') === 'console';
    res.json({ message: 'OTP sent successfully', ...(isConsole ? { debug: otp } : {}) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp, name } = req.body;
    if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP are required' });

    const phoneClean = phone.trim();
    const stored = otpStore.get(phoneClean);

    if (!stored || stored.expiresAt < Date.now()) {
      otpStore.delete(phoneClean);
      return res.status(401).json({ error: 'OTP expired. Please request a new one.' });
    }

    if (stored.otp !== otp.trim()) {
      return res.status(401).json({ error: 'Invalid OTP' });
    }

    otpStore.delete(phoneClean);

    let user = queryOne('SELECT * FROM users WHERE phone = ?', phoneClean);
    let isNewUser = false;

    if (!user) {
      if (!name) return res.status(400).json({ error: 'Name is required for registration' });
      isNewUser = true;
      const id = uuidv4();
      const hashed = await bcrypt.hash(phoneClean + Date.now(), 10);
      const avatar = `https://i.pravatar.cc/200?u=${id}`;
      execute('INSERT INTO users (id, name, phone, password, role, avatar) VALUES (?, ?, ?, ?, ?, ?)',
        id, name.trim(), phoneClean, hashed, 'customer', avatar);
      user = queryOne('SELECT * FROM users WHERE id = ?', id);
    }

    const { password: _, ...safeUser } = user;
    const token = generateToken(user);
    res.json({ user: safeUser, token, isNew: isNewUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, phone, password, role, email } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({ error: 'Name must be between 2 and 100 characters' });
    }
    if (!phone || typeof phone !== 'string' || !/^[0-9]{10,15}$/.test(phone.trim())) {
      return res.status(400).json({ error: 'Valid phone number (10-15 digits) is required' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (role && !['customer', 'worker', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    if (email && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const phoneClean = phone.trim();
    const existing = queryOne('SELECT id FROM users WHERE phone = ?', phoneClean);
    if (existing) return res.status(409).json({ error: 'Phone number already registered' });

    const id = uuidv4();
    const hashed = await bcrypt.hash(password, 10);
    const avatar = `https://i.pravatar.cc/200?u=${id}`;

    execute('INSERT INTO users (id, name, phone, email, password, role, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
      id, name.trim(), phoneClean, email ? email.trim().toLowerCase() : null, hashed, role || 'customer', avatar);

    const user = queryOne('SELECT id, name, phone, email, role, location, avatar FROM users WHERE id = ?', id);
    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ error: 'Phone and password are required' });

    const user = queryOne('SELECT * FROM users WHERE phone = ?', phone.trim());
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const { password: _, ...safeUser } = user;
    const token = generateToken(user);
    res.json({ user: safeUser, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', authenticate, (req, res) => {
  try {
    const user = req.user;
    if (user.role === 'worker') {
      const worker = queryOne(
        'SELECT w.*, s.name as service_name, s.icon as service_icon FROM workers w JOIN services s ON w.service_id = s.id WHERE w.user_id = ?',
        user.id
      );
      return res.json({ ...user, worker });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/me', authenticate, (req, res) => {
  try {
    const { name, email, location } = req.body;
    const updates = [];
    const values = [];

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length < 2) return res.status(400).json({ error: 'Name must be at least 2 characters' });
      updates.push('name = ?'); values.push(name.trim());
    }
    if (email !== undefined) {
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Invalid email format' });
      updates.push('email = ?'); values.push(email ? email.trim().toLowerCase() : null);
    }
    if (location !== undefined) {
      updates.push('location = ?'); values.push(location.trim());
    }

    if (updates.length === 0) return res.status(400).json({ error: 'Nothing to update' });
    updates.push("updated_at = datetime('now')");
    values.push(req.user.id);
    execute(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, ...values);

    const user = queryOne('SELECT id, name, phone, email, role, location, avatar FROM users WHERE id = ?', req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
