const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const locationStore = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [id, data] of locationStore.entries()) {
    if (now - data.updatedAt > 120000) locationStore.delete(id);
  }
}, 60000);

router.put('/worker', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'worker') {
      return res.status(403).json({ error: 'Only workers can update location' });
    }
    const { lat, lng } = req.body;
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).json({ error: 'Valid lat and lng are required' });
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ error: 'Invalid coordinates' });
    }
    locationStore.set(req.user.id, { lat, lng, updatedAt: Date.now() });
    res.json({ message: 'Location updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/worker/:userId', authenticate, (req, res) => {
  try {
    const loc = locationStore.get(req.params.userId);
    if (!loc) return res.json({ available: false });
    res.json({ available: true, lat: loc.lat, lng: loc.lng, updatedAt: loc.updatedAt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
