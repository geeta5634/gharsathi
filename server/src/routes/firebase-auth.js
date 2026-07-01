const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { queryOne, execute } = require('../database');
const firebaseService = require('../services/firebase');
const { verifyIdToken } = firebaseService;
const {
  generateAccessToken,
  generateRefreshToken,
  authenticate,
  revokeAllUserTokens,
} = require('../middleware/auth');
const { sanitizeHtml, validateName, validatePhone } = require('../middleware/validate');

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

router.post('/firebase', async (req, res) => {
  try {
    const { idToken, name, role } = req.body;
    if (!idToken) return res.status(400).json({ error: 'ID token is required' });

    const decoded = await verifyIdToken(idToken);
    const firebaseUid = decoded.uid;
    const phone = decoded.phone_number || '';
    const email = decoded.email || '';
    const firebaseName = decoded.name || name || '';

    let user = await queryOne('SELECT * FROM users WHERE firebase_uid = ?', firebaseUid);

    if (!user) {
      const id = uuidv4();
      const hashed = await bcrypt.hash(firebaseUid + Date.now(), 10);
      const avatar = `https://i.pravatar.cc/200?u=${id}`;
      const displayName = firebaseName || `User_${firebaseUid.slice(-6)}`;
      const userRole = role && ['customer', 'worker', 'admin'].includes(role) ? role : 'customer';

      if (phone) {
        const existing = await queryOne('SELECT id FROM users WHERE phone = ?', phone);
        if (existing) {
          await execute('UPDATE users SET firebase_uid = ? WHERE id = ?', firebaseUid, existing.id);
          user = await queryOne('SELECT * FROM users WHERE id = ?', existing.id);
          const session = await createSession(user, req);
          return res.json({ user: sanitizeUser(user), ...session, isNew: false });
        }
      }

      await execute(
        'INSERT INTO users (id, name, phone, email, password, role, avatar, firebase_uid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        id, sanitizeHtml(displayName), phone, email, hashed, userRole, avatar, firebaseUid
      );
      user = await queryOne('SELECT * FROM users WHERE id = ?', id);
      return res.status(201).json({ user: sanitizeUser(user), ...(await createSession(user, req)), isNew: true });
    }

    const session = await createSession(user, req);
    res.json({ user: sanitizeUser(user), ...session, isNew: false });
  } catch (err) {
    if (err.message?.includes('Firebase not initialized')) {
      return res.status(500).json({ error: 'Firebase authentication not configured on server' });
    }
    res.status(401).json({ error: err.message || 'Invalid Firebase token' });
  }
});

router.post('/firebase/link-phone', authenticate, async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: 'ID token is required' });

    const decoded = await verifyIdToken(idToken);
    const phone = decoded.phone_number;
    if (!phone) return res.status(400).json({ error: 'No phone number in Firebase token' });

    const existing = await queryOne('SELECT id FROM users WHERE phone = ? AND id != ?', phone, req.user.id);
    if (existing) return res.status(409).json({ error: 'Phone already linked to another account' });

    await execute('UPDATE users SET phone = ?, firebase_uid = ? WHERE id = ?', phone, decoded.uid, req.user.id);
    res.json({ message: 'Phone linked successfully', phone });
  } catch (err) {
    res.status(401).json({ error: 'Invalid Firebase token' });
  }
});

router.get('/firebase-config', (req, res) => {
  res.json({
    apiKey: process.env.FIREBASE_API_KEY || '',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.FIREBASE_APP_ID || '',
    adminInitialized: firebaseService.adminInitialized,
  });
});

router.post('/firebase/unlink', authenticate, async (req, res) => {
  try {
    await execute('UPDATE users SET firebase_uid = NULL WHERE id = ?', req.user.id);
    res.json({ message: 'Firebase account unlinked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
