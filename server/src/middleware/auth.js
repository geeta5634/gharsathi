require('dotenv').config();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { queryOne, query, execute } = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'gharsathi-jwt-secret-2024';
const ACCESS_EXPIRY = '15m';
const REFRESH_EXPIRY_DAYS = 7;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 5;
const OTP_MAX_ATTEMPTS = 3;

const loginAttempts = new Map();
const otpStore = new Map();
const accessBlacklist = new Map();

function cleanExpired() {
  const now = Date.now();
  for (const [key, val] of otpStore.entries()) {
    if (val.expiresAt < now) otpStore.delete(key);
  }
  for (const [key, val] of loginAttempts.entries()) {
    if (val.lockedUntil && val.lockedUntil < now) loginAttempts.delete(key);
  }
  for (const [key, expiry] of accessBlacklist.entries()) {
    if (expiry < now) accessBlacklist.delete(key);
  }
}
setInterval(cleanExpired, 60000);

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, phone: user.phone, type: 'access' },
    JWT_SECRET,
    { expiresIn: ACCESS_EXPIRY }
  );
}

async function generateRefreshToken(user, req) {
  const id = uuidv4();
  const raw = uuidv4() + '-' + user.id + '-' + Date.now();
  const refreshHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + REFRESH_EXPIRY_DAYS * 86400000).toISOString();
  execute(
    'INSERT INTO sessions (id, user_id, refresh_hash, user_agent, ip, expires_at) VALUES (?, ?, ?, ?, ?, ?)',
    id, user.id, refreshHash, req?.headers?.['user-agent'] || '', req?.ip || ''
  );
  return { id: raw, sessionId: id };
}

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const token = header.split(' ')[1];
    const blacklisted = accessBlacklist.get(hashToken(token));
    if (blacklisted && blacklisted > Date.now()) {
      return res.status(401).json({ error: 'Token revoked' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== 'access') {
      return res.status(401).json({ error: 'Invalid token type' });
    }
    const user = queryOne('SELECT id, name, phone, role, email, location, avatar FROM users WHERE id = ?', decoded.id);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return res.status(401).json({ error: 'Token expired' });
    return res.status(401).json({ error: 'Invalid token' });
  }
}

async function verifyRefreshToken(raw) {
  const hash = hashToken(raw);
  const session = queryOne('SELECT * FROM sessions WHERE refresh_hash = ? AND revoked = 0', hash);
  if (!session) return null;
  if (new Date(session.expires_at) < new Date()) {
    execute('DELETE FROM sessions WHERE id = ?', session.id);
    return null;
  }
  const user = queryOne('SELECT id, name, phone, role, email, location, avatar FROM users WHERE id = ?', session.user_id);
  if (!user) return null;
  return { user, session };
}

function revokeSession(sessionId) {
  execute('UPDATE sessions SET revoked = 1 WHERE id = ?', sessionId);
}

function revokeAllUserTokens(userId, exceptSessionId) {
  if (exceptSessionId) {
    execute("UPDATE sessions SET revoked = 1 WHERE user_id = ? AND id != ? AND revoked = 0", userId, exceptSessionId);
  } else {
    execute("UPDATE sessions SET revoked = 1 WHERE user_id = ? AND revoked = 0", userId);
  }
}

function checkLoginLockout(phone) {
  const entry = loginAttempts.get(phone);
  if (!entry) return false;
  if (entry.lockedUntil && entry.lockedUntil > Date.now()) {
    const remaining = Math.ceil((entry.lockedUntil - Date.now()) / 60000);
    return remaining;
  }
  if (entry.lockedUntil && entry.lockedUntil <= Date.now()) {
    loginAttempts.delete(phone);
    return false;
  }
  return false;
}

function recordFailedAttempt(phone) {
  let entry = loginAttempts.get(phone);
  if (!entry) {
    entry = { attempts: 0, lockedUntil: null };
    loginAttempts.set(phone, entry);
  }
  entry.attempts++;
  if (entry.attempts >= MAX_LOGIN_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCKOUT_MINUTES * 60 * 1000;
    entry.attempts = 0;
  }
}

function clearLoginAttempts(phone) {
  loginAttempts.delete(phone);
}

function generateOtp() {
  return Math.floor(10 ** (OTP_LENGTH - 1) + Math.random() * 9 * 10 ** (OTP_LENGTH - 1)).toString();
}

function storeOtp(identifier, otp) {
  const hash = crypto.createHash('sha256').update(otp).digest('hex');
  otpStore.set(identifier, {
    hash,
    expiresAt: Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000,
    attempts: 0,
  });
}

function verifyOtp(identifier, otp) {
  const stored = otpStore.get(identifier);
  if (!stored) return { valid: false, error: 'No OTP requested' };
  if (stored.expiresAt < Date.now()) {
    otpStore.delete(identifier);
    return { valid: false, error: 'OTP expired' };
  }
  if (stored.attempts >= OTP_MAX_ATTEMPTS) {
    otpStore.delete(identifier);
    return { valid: false, error: 'Too many failed attempts' };
  }
  stored.attempts++;
  const hash = crypto.createHash('sha256').update(otp).digest('hex');
  if (hash !== stored.hash) {
    return { valid: false, error: 'Invalid OTP' };
  }
  otpStore.delete(identifier);
  return { valid: true };
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

module.exports = {
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
  requireRole,
  JWT_SECRET,
};
