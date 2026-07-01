const express = require('express');
const { query, queryOne } = require('../database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

async function calculateTrustScore(workerId) {
  const stats = await queryOne(
    `SELECT
      COALESCE(AVG(r.rating), 0) as avg_rating,
      COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_count,
      COUNT(CASE WHEN b.status = 'cancelled' AND b.worker_id IS NOT NULL THEN 1 END) as cancelled_count,
      COUNT(CASE WHEN b.worker_id IS NOT NULL THEN 1 END) as total_assigned
    FROM workers w
    LEFT JOIN bookings b ON b.worker_id = w.id
    LEFT JOIN reviews r ON r.worker_id = w.id
    WHERE w.id = ?`,
    workerId
  );

  if (!stats || stats.total_assigned === 0) return 50;

  const avgRating = stats.avg_rating || 0;
  const onTimeRate = stats.total_assigned > 0
    ? (stats.completed_count / stats.total_assigned) * 100
    : 0;
  const cancelRate = stats.total_assigned > 0
    ? (stats.cancelled_count / stats.total_assigned) * 100
    : 0;

  const score = Math.round(
    (avgRating / 5) * 50 +
    (onTimeRate / 100) * 30 -
    (cancelRate / 100) * 20
  );

  return Math.max(0, Math.min(100, score));
}

router.get('/:workerId', async (req, res) => {
  try {
    const score = await calculateTrustScore(req.params.workerId);
    const worker = await queryOne('SELECT trust_score, rating, reviews_count FROM workers WHERE id = ?', req.params.workerId);
    res.json({
      trustScore: score,
      storedTrustScore: worker?.trust_score || 0,
      avgRating: worker?.rating || 0,
      reviewsCount: worker?.reviews_count || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/recalculate-all', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }
    const workers = await query('SELECT id FROM workers');
    for (const w of workers) {
      await calculateTrustScore(w.id);
    }
    res.json({ message: `Recalculated trust scores for ${workers.length} workers` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
