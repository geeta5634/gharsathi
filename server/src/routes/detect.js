const express = require('express');
const { query } = require('../database');

const router = express.Router();

const KEYWORD_MAP = [
  { keywords: ['leak', 'pipe', 'tap', 'faucet', 'drain', 'toilet', 'sink', 'water'], service: 'Plumber', serviceId: 's1' },
  { keywords: ['wire', 'switch', 'light', 'fan', 'power', 'socket', 'fuse', 'circuit', 'short'], service: 'Electrician', serviceId: 's2' },
  { keywords: ['furniture', 'wood', 'door', 'cabinet', 'shelf', 'drawer', 'hinge'], service: 'Carpenter', serviceId: 's5' },
  { keywords: ['paint', 'wall', 'color', 'texture', 'plaster', 'roller'], service: 'House Painter', serviceId: 's6' },
  { keywords: ['clean', 'dust', 'mop', 'vacuum', 'bathroom clean', 'kitchen clean'], service: 'Cleaning', serviceId: 's7' },
  { keywords: ['car', 'drive', 'pickup', 'drop', 'outstation'], service: 'Driver', serviceId: 's3' },
  { keywords: ['cook', 'clean', 'wash', 'dish', 'utensil', 'sweep'], service: 'Maid / Bai', serviceId: 's4' },
];

router.post('/', async (req, res) => {
  try {
    const { image, description } = req.body;

    if (!description && !image) {
      return res.status(400).json({ error: 'Provide a description or image URL of the issue' });
    }

    const text = (description || '').toLowerCase();

    let matched = null;
    let maxScore = 0;

    for (const entry of KEYWORD_MAP) {
      let score = 0;
      for (const kw of entry.keywords) {
        if (text.includes(kw)) {
          score += kw.length;
        }
      }
      if (score > maxScore) {
        maxScore = score;
        matched = entry;
      }
    }

    const allServices = query('SELECT * FROM services');
    const confidence = maxScore > 0 ? Math.min(100, Math.round((maxScore / text.length) * 100)) : 0;

    if (!matched || confidence < 20) {
      return res.json({
        detected: false,
        confidence: 0,
        suggestedService: null,
        allServices,
        message: 'Could not confidently identify the issue. Please select a service manually.',
      });
    }

    res.json({
      detected: true,
      confidence,
      suggestedService: {
        id: matched.serviceId,
        name: matched.service,
      },
      allServices,
      message: `This appears to be a ${matched.service} issue (${confidence}% confidence).`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
