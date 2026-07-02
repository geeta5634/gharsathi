const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');

const projectId = process.env.FIREBASE_PROJECT_ID;
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : null;

let initialized = false;

if (serviceAccount) {
  admin.initializeApp({ credential: admin.cert(serviceAccount) });
  initialized = true;
  console.log('[Firebase] Admin SDK initialized (service account)');
} else if (projectId) {
  try {
    admin.initializeApp({ projectId });
    initialized = true;
    console.log('[Firebase] Admin SDK initialized (project ID only)');
  } catch (e) {
    console.warn('[Firebase] Could not initialize with projectId:', e.message);
  }
} else {
  console.warn('[Firebase] No FIREBASE_PROJECT_ID or FIREBASE_SERVICE_ACCOUNT set');
}

async function verifyIdToken(idToken) {
  if (!initialized) {
    throw new Error('Firebase not initialized on server');
  }
  const auth = getAuth();
  const decoded = await auth.verifyIdToken(idToken);
  return decoded;
}

async function getUserByUid(uid) {
  if (!initialized) return null;
  try {
    const auth = getAuth();
    return await auth.getUser(uid);
  } catch {
    return null;
  }
}

module.exports = { admin, verifyIdToken, getUserByUid, adminInitialized: initialized };

