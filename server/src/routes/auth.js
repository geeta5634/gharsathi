const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { query, queryOne, execute } = require('../database');
const { sendOTP } = require('../services/sms');
const {
  generateAccessToken,
  generateRefreshToken,
  authenticate,
  verifyRefreshToken,
  revokeSession,
  revokeAllUserTokens,
  generateOtp,
  storeOtp,
  verifyOtp,
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

// ─── Send OTP (Phone) ───────────────────────────────
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || typeof phone !== 'string' || !/^[0-9]{10,15}$/.test(phone.trim())) {
      return res.status(400).json({ error: 'Valid phone number is required' });
    }
    const phoneClean = phone.trim();
    const lockout = checkLoginLockout(phoneClean);
    if (lockout) {
      return res.status(429).json({ error: `Too many attempts. Try again in ${lockout} minute(s).` });
    }
    const otp = generateOtp();
    storeOtp('otp:' + phoneClean, otp);
    const result = await sendOTP(phoneClean, otp);
    const smsFailed = !result.success;
    if (smsFailed) {
      console.warn(`[SMS] Failed: ${result.error}. Showing OTP on screen.`);
    }
    res.json({
      message: smsFailed ? 'OTP generated (SMS failed). Use the code shown below.' : 'OTP sent successfully',
      ...(smsFailed ? { debug: otp } : {}),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Verify OTP (Phone) ─────────────────────────────
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp, name } = req.body;
    if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP are required' });
    const phoneClean = phone.trim();
    const result = verifyOtp('otp:' + phoneClean, otp.trim());
    if (!result.valid) {
      return res.status(401).json({ error: result.error });
    }
    let user = queryOne('SELECT * FROM users WHERE phone = ?', phoneClean);
    let isNewUser = false;
    if (!user) {
      if (!name) return res.status(400).json({ error: 'Name is required for registration' });
      isNewUser = true;
      const id = uuidv4();
      const hashed = await bcrypt.hash(phoneClean + Date.now(), 10);
      const avatar = `https://i.pravatar.cc/200?u=${id}`;
      execute(
        'INSERT INTO users (id, name, phone, password, role, avatar) VALUES (?, ?, ?, ?, ?, ?)',
        id, name.trim(), phoneClean, hashed, 'customer', avatar
      );
      user = queryOne('SELECT * FROM users WHERE id = ?', id);
    }
    clearLoginAttempts(phoneClean);
    const session = await createSession(user, req);
    res.json({ user: sanitizeUser(user), ...session, isNew: isNewUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Register (Email/Password) ──────────────────────
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
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return res.status(400).json({ error: 'Password must contain uppercase, lowercase, and a number' });
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
    execute(
      'INSERT INTO users (id, name, phone, email, password, role, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
      id, name.trim(), phoneClean, email ? email.trim().toLowerCase() : null, hashed, role || 'customer', avatar
    );
    const user = queryOne('SELECT id, name, phone, email, role, location, avatar FROM users WHERE id = ?', id);
    const session = await createSession(user, req);
    res.status(201).json({ user, ...session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Login (Phone/Password) ─────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ error: 'Phone and password are required' });
    const phoneClean = phone.trim();
    const lockout = checkLoginLockout(phoneClean);
    if (lockout) {
      return res.status(429).json({ error: `Too many failed attempts. Try again in ${lockout} minute(s).` });
    }
    const user = queryOne('SELECT * FROM users WHERE phone = ?', phoneClean);
    if (!user) {
      recordFailedAttempt(phoneClean);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      recordFailedAttempt(phoneClean);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    clearLoginAttempts(phoneClean);
    const session = await createSession(user, req);
    res.json({ user: sanitizeUser(user), ...session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Refresh Token ──────────────────────────────────
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token is required' });
    const result = await verifyRefreshToken(refreshToken);
    if (!result) return res.status(401).json({ error: 'Invalid or expired refresh token' });
    revokeSession(result.session.id);
    const session = await createSession(result.user, req);
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Logout ─────────────────────────────────────────
router.post('/logout', authenticate, async (req, res) => {
  try {
    const { refreshToken, allDevices } = req.body;
    if (refreshToken) {
      const result = await verifyRefreshToken(refreshToken);
      if (result) revokeSession(result.session.id);
    }
    if (allDevices) {
      revokeAllUserTokens(req.user.id, null);
    }
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Logout All Devices ─────────────────────────────
router.post('/logout-all', authenticate, async (req, res) => {
  try {
    revokeAllUserTokens(req.user.id, null);
    res.json({ message: 'Logged out from all devices' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Change Password ────────────────────────────────
router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      return res.status(400).json({ error: 'Password must contain uppercase, lowercase, and a number' });
    }
    const user = queryOne('SELECT * FROM users WHERE id = ?', req.user.id);
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });
    const hashed = await bcrypt.hash(newPassword, 10);
    execute("UPDATE users SET password = ?, updated_at = datetime('now') WHERE id = ?", hashed, req.user.id);
    revokeAllUserTokens(req.user.id, null);
    const session = await createSession(req.user, req);
    res.json({ message: 'Password changed successfully. Please login again on other devices.', ...session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Forgot Password (Send OTP) ─────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || typeof phone !== 'string' || !/^[0-9]{10,15}$/.test(phone.trim())) {
      return res.status(400).json({ error: 'Valid phone number is required' });
    }
    const phoneClean = phone.trim();
    const user = queryOne('SELECT id FROM users WHERE phone = ?', phoneClean);
    if (!user) return res.status(404).json({ error: 'No account found with this phone number' });
    const lockout = checkLoginLockout(phoneClean);
    if (lockout) {
      return res.status(429).json({ error: `Too many attempts. Try again in ${lockout} minute(s).` });
    }
    const otp = generateOtp();
    storeOtp('reset:' + phoneClean, otp);
    const result = await sendOTP(phoneClean, otp);
    const smsFailed = !result.success;
    if (smsFailed) {
      console.warn(`[SMS] Failed: ${result.error}. Showing OTP on screen.`);
    }
    res.json({
      message: smsFailed ? 'OTP generated (SMS failed). Use the code shown below.' : 'OTP sent successfully',
      ...(smsFailed ? { debug: otp } : {}),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Reset Password (Verify OTP + New Password) ─────
router.post('/reset-password', async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;
    if (!phone || !otp || !newPassword) {
      return res.status(400).json({ error: 'Phone, OTP, and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      return res.status(400).json({ error: 'Password must contain uppercase, lowercase, and a number' });
    }
    const phoneClean = phone.trim();
    const result = verifyOtp('reset:' + phoneClean, otp.trim());
    if (!result.valid) {
      return res.status(401).json({ error: result.error });
    }
    const user = queryOne('SELECT * FROM users WHERE phone = ?', phoneClean);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const hashed = await bcrypt.hash(newPassword, 10);
    execute("UPDATE users SET password = ?, updated_at = datetime('now') WHERE id = ?", hashed, user.id);
    revokeAllUserTokens(user.id, null);
    const session = await createSession(user, req);
    res.json({ message: 'Password reset successfully', ...session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Sessions (List active sessions) ────────────────
router.get('/sessions', authenticate, (req, res) => {
  try {
    const sessions = query(
      "SELECT id, user_agent, ip, created_at, expires_at FROM sessions WHERE user_id = ? AND revoked = 0 AND expires_at > datetime('now') ORDER BY created_at DESC",
      req.user.id
    );
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Revoke Session ─────────────────────────────────
router.delete('/sessions/:sessionId', authenticate, (req, res) => {
  try {
    const session = queryOne('SELECT * FROM sessions WHERE id = ? AND user_id = ?', req.params.sessionId, req.user.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    revokeSession(req.params.sessionId);
    res.json({ message: 'Session revoked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Get Me ─────────────────────────────────────────
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

// ─── Update Me ──────────────────────────────────────
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
