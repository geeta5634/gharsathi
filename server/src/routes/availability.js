const express = require('express');
const { query, queryOne, execute } = require('../database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

router.get('/worker/availability', authenticate, async (req, res) => {
  try {
    const worker = await queryOne('SELECT id FROM workers WHERE user_id = ?', req.user.id);
    if (!worker) return res.status(404).json({ error: 'Worker profile not found' });
    const slots = await query('SELECT * FROM worker_availability WHERE worker_id = ? ORDER BY day_of_week, start_time', worker.id);
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/worker/availability', authenticate, async (req, res) => {
  try {
    const worker = await queryOne('SELECT id FROM workers WHERE user_id = ?', req.user.id);
    if (!worker) return res.status(404).json({ error: 'Worker profile not found' });
    const { slots } = req.body;
    if (!Array.isArray(slots)) return res.status(400).json({ error: 'slots must be an array' });
    await execute('DELETE FROM worker_availability WHERE worker_id = ?', worker.id);
    for (const slot of slots) {
      const day = parseInt(slot.day_of_week);
      if (day < 0 || day > 6 || !slot.start_time || !slot.end_time) continue;
      const dur = parseInt(slot.slot_duration) || 30;
      await execute('INSERT INTO worker_availability (worker_id, day_of_week, start_time, end_time, slot_duration) VALUES (?, ?, ?, ?, ?)',
        worker.id, day, slot.start_time, slot.end_time, dur);
    }
    const updated = await query('SELECT * FROM worker_availability WHERE worker_id = ? ORDER BY day_of_week, start_time', worker.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/worker/blocked-dates', authenticate, async (req, res) => {
  try {
    const worker = await queryOne('SELECT id FROM workers WHERE user_id = ?', req.user.id);
    if (!worker) return res.status(404).json({ error: 'Worker profile not found' });
    const blocks = await query("SELECT * FROM worker_blocked_dates WHERE worker_id = ? AND block_date >= date('now') ORDER BY block_date, start_time", worker.id);
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/worker/blocked-dates', authenticate, async (req, res) => {
  try {
    const worker = await queryOne('SELECT id FROM workers WHERE user_id = ?', req.user.id);
    if (!worker) return res.status(404).json({ error: 'Worker profile not found' });
    const { block_date, start_time, end_time, reason } = req.body;
    if (!block_date) return res.status(400).json({ error: 'block_date is required' });
    await execute('INSERT INTO worker_blocked_dates (worker_id, block_date, start_time, end_time, reason) VALUES (?, ?, ?, ?, ?)',
      worker.id, block_date, start_time || null, end_time || null, reason || null);
    res.status(201).json({ message: 'Date blocked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/worker/blocked-dates/:id', authenticate, async (req, res) => {
  try {
    const worker = await queryOne('SELECT id FROM workers WHERE user_id = ?', req.user.id);
    if (!worker) return res.status(404).json({ error: 'Worker profile not found' });
    await execute('DELETE FROM worker_blocked_dates WHERE id = ? AND worker_id = ?', req.params.id, worker.id);
    res.json({ message: 'Block removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/worker/:workerId/slots', async (req, res) => {
  try {
    const { workerId } = req.params;
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'date query parameter required (YYYY-MM-DD)' });

    const worker = await queryOne('SELECT * FROM workers WHERE id = ?', workerId);
    if (!worker) return res.status(404).json({ error: 'Worker not found' });

    const d = new Date(date + 'T00:00:00');
    if (isNaN(d.getTime())) return res.status(400).json({ error: 'Invalid date' });
    const dayOfWeek = d.getDay();

    const availSlots = await query('SELECT * FROM worker_availability WHERE worker_id = ? AND day_of_week = ? ORDER BY start_time', workerId, dayOfWeek);
    if (!availSlots.length) return res.json([]);

    const blocks = await query("SELECT * FROM worker_blocked_dates WHERE worker_id = ? AND block_date = ?", workerId, date);

    const existingBookings = await query(
      "SELECT booking_time, status FROM bookings WHERE worker_id = ? AND booking_date = ? AND status NOT IN ('cancelled')",
      workerId, date
    );

    const bookedTimes = new Set();
    for (const b of existingBookings) {
      bookedTimes.add(b.booking_time.trim().toLowerCase());
    }

    const fullyBlocked = blocks.some(b => !b.start_time && !b.end_time);

    function parseTime(t) {
      const [h, m] = t.split(':');
      return parseInt(h) * 60 + parseInt(m);
    }

    function formatTime(minutes) {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
    }

    function formatTimeInput(minutes) {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }

    const allSlots = [];

    for (const avail of availSlots) {
      const startMin = parseTime(avail.start_time);
      const endMin = parseTime(avail.end_time);
      const duration = avail.slot_duration || 30;

      for (let m = startMin; m + duration <= endMin; m += duration) {
        const slotTime = formatTime(m);
        const slotInput = formatTimeInput(m);
        const slotKey = slotTime.toLowerCase();

        if (fullyBlocked) continue;

        const isBlocked = blocks.some(b => {
          if (!b.start_time && !b.end_time) return true;
          const bStart = b.start_time ? parseTime(b.start_time) : 0;
          const bEnd = b.end_time ? parseTime(b.end_time) : 1440;
          return m >= bStart && m < bEnd;
        });
        if (isBlocked) continue;

        if (bookedTimes.has(slotKey)) continue;

        allSlots.push({
          time: slotTime,
          timeInput: slotInput,
          minutes: m,
          available: !isBlocked && !bookedTimes.has(slotKey),
        });
      }
    }

    res.json(allSlots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
