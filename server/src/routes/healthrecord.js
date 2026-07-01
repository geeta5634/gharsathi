const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { query, queryOne, execute } = require('../database');
const { authenticate } = require('../middleware/auth');
const { sanitize } = require('../middleware/validate');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const assets = await query('SELECT * FROM home_assets WHERE user_id = ? ORDER BY next_service_date ASC', req.user.id);
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { name, category, last_service_date, next_service_date, notes } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Asset name is required (min 2 characters)' });
    }
    if (!category || typeof category !== 'string') {
      return res.status(400).json({ error: 'Category is required' });
    }

    const id = uuidv4();
    await execute(
      'INSERT INTO home_assets (id, user_id, name, category, last_service_date, next_service_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      id, req.user.id, name.trim(), category, last_service_date || null, next_service_date || null, notes || null
    );

    const asset = await queryOne('SELECT * FROM home_assets WHERE id = ?', id);
    res.status(201).json(asset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const asset = await queryOne('SELECT * FROM home_assets WHERE id = ? AND user_id = ?', req.params.id, req.user.id);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });

    const { name, category, last_service_date, next_service_date, notes } = req.body;

    await execute(
      "UPDATE home_assets SET name = ?, category = ?, last_service_date = ?, next_service_date = ?, notes = ?, updated_at = datetime('now') WHERE id = ?",
      name || asset.name,
      category || asset.category,
      last_service_date !== undefined ? last_service_date : asset.last_service_date,
      next_service_date !== undefined ? next_service_date : asset.next_service_date,
      notes !== undefined ? notes : asset.notes,
      req.params.id
    );

    const updated = await queryOne('SELECT * FROM home_assets WHERE id = ?', req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const asset = await queryOne('SELECT * FROM home_assets WHERE id = ? AND user_id = ?', req.params.id, req.user.id);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });
    await execute('DELETE FROM home_assets WHERE id = ?', req.params.id);
    res.json({ message: 'Asset deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
