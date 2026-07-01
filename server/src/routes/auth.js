const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { query, queryOne, execute } = require('../database');
const { sanitize, sanitizeHtml, validatePhone, validateEmail, validatePassword, validateName } = require('../middleware/validate');
const {
  generateAccessToken,
  generateRefreshToken,
  authenticate,
  verifyRefreshToken,
  revokeSession,
  revokeAllUserTokens,
  checkLoginLockout,
  recordFailedAttempt,
  clearLoginAttempts,
} = require('../middleware/auth');

const router = express.Router();

function sanitizeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

async function createSession(user, req) {
  const accessToken = generateAccessToken(user);
  const refresh = await generateRefreshToken(user, req);
  return { accessToken, refreshToken: refresh.id, sessionId: refresh.sessionId };
}

router.post('/register', async (req, res) => {
  try {
    const { password, role, email } = req.body;

    const nameCheck = validateName(req.body.name);
    if (!nameCheck.valid) return res.status(400).json({ error: nameCheck.error });

    const phoneCheck = validatePhone(req.body.phone);
    if (!phoneCheck.valid) return res.status(400).json({ error: phoneCheck.error });

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) return res.status(400).json({ error: passwordCheck.error });

    if (role && !['customer', 'worker', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) return res.status(400).json({ error: emailCheck.error });

    const existing = await queryOne('SELECT id FROM users WHERE phone = ?', phoneCheck.value);
    if (existing) return res.status(409).json({ error: 'Phone number already registered' });

    const id = uuidv4();
    const hashed = await bcrypt.hash(passwordCheck.value, 10);
    const avatar = `https://i.pravatar.cc/200?u=${id}`;
    await execute(
      'INSERT INTO users (id, name, phone, email, password, role, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
      id, sanitizeHtml(nameCheck.value), phoneCheck.value, emailCheck.value, hashed, role || 'customer', avatar
    );
    const user = await queryOne('SELECT id, name, phone, email, role, location, avatar, firebase_uid FROM users WHERE id = ?', id);
    const session = await createSession(user, req);
    res.status(201).json({ user, ...session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    const phoneCheck = validatePhone(req.body.phone);
    if (!phoneCheck.valid) return res.status(400).json({ error: phoneCheck.error });
    if (!password) return res.status(400).json({ error: 'Password is required' });

    const lockout = checkLoginLockout(phoneCheck.value);
    if (lockout) {
      return res.status(429).json({ error: `Too many failed attempts. Try again in ${lockout} minute(s).` });
    }
    const user = await queryOne('SELECT * FROM users WHERE phone = ?', phoneCheck.value);
    if (!user) {
      recordFailedAttempt(phoneCheck.value);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      recordFailedAttempt(phoneCheck.value);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    clearLoginAttempts(phoneCheck.value);
    const session = await createSession(user, req);
    res.json({ user: sanitizeUser(user), ...session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token is required' });
    const result = await verifyRefreshToken(refreshToken);
    if (!result) return res.status(401).json({ error: 'Invalid or expired refresh token' });
    await revokeSession(result.session.id);
    const session = await createSession(result.user, req);
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/logout', authenticate, async (req, res) => {
  try {
    const { refreshToken, allDevices } = req.body;
    if (refreshToken) {
      const result = await verifyRefreshToken(refreshToken);
      if (result) await revokeSession(result.session.id);
    }
    if (allDevices) {
      await revokeAllUserTokens(req.user.id, null);
    }
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/logout-all', authenticate, async (req, res) => {
  try {
    await revokeAllUserTokens(req.user.id, null);
    res.json({ message: 'Logged out from all devices' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword } = req.body;
    if (!currentPassword) return res.status(400).json({ error: 'Current password is required' });

    const passwordCheck = validatePassword(req.body.newPassword);
    if (!passwordCheck.valid) return res.status(400).json({ error: passwordCheck.error });

    const user = await queryOne('SELECT * FROM users WHERE id = ?', req.user.id);
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

    const hashed = await bcrypt.hash(passwordCheck.value, 10);
    await execute("UPDATE users SET password = ?, updated_at = datetime('now') WHERE id = ?", hashed, req.user.id);
    await revokeAllUserTokens(req.user.id, null);
    const session = await createSession(req.user, req);
    res.json({ message: 'Password changed successfully. Please login again on other devices.', ...session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/sessions', authenticate, async (req, res) => {
  try {
    const sessions = await query(
      "SELECT id, user_agent, ip, created_at, expires_at FROM sessions WHERE user_id = ? AND revoked = 0 AND expires_at > datetime('now') ORDER BY created_at DESC",
      req.user.id
    );
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/sessions/:sessionId', authenticate, async (req, res) => {
  try {
    const session = await queryOne('SELECT * FROM sessions WHERE id = ? AND user_id = ?', req.params.sessionId, req.user.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    await revokeSession(req.params.sessionId);
    res.json({ message: 'Session revoked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = req.user;
    if (user.role === 'worker') {
      const worker = await queryOne(
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

router.put('/me', authenticate, async (req, res) => {
  try {
    const { name, email, location } = req.body;
    const updates = [];
    const values = [];
    if (name !== undefined) {
      const nameCheck = validateName(name);
      if (!nameCheck.valid) return res.status(400).json({ error: nameCheck.error });
      updates.push('name = ?'); values.push(sanitizeHtml(nameCheck.value));
    }
    if (email !== undefined) {
      const emailCheck = validateEmail(email);
      if (!emailCheck.valid) return res.status(400).json({ error: emailCheck.error });
      updates.push('email = ?'); values.push(emailCheck.value);
    }
    if (location !== undefined) {
      const loc = sanitize(String(location));
      if (loc.length < 2) return res.status(400).json({ error: 'Location must be at least 2 characters' });
      updates.push('location = ?'); values.push(loc);
    }
    if (updates.length === 0) return res.status(400).json({ error: 'Nothing to update' });
    updates.push("updated_at = datetime('now')");
    values.push(req.user.id);
    await execute(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, ...values);
    const user = await queryOne('SELECT id, name, phone, email, role, location, avatar, firebase_uid FROM users WHERE id = ?', req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
