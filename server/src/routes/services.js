const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { query, queryOne, execute } = require('../database');
const { authenticate, requireRole } = require('../middleware/auth');
const { sanitize } = require('../middleware/validate');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    res.json(query('SELECT * FROM services ORDER BY name'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    if (!req.params.id || typeof req.params.id !== 'string') {
      return res.status(400).json({ error: 'Invalid service ID' });
    }
    const service = queryOne('SELECT * FROM services WHERE id = ?', req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, requireRole('admin'), (req, res) => {
  try {
    const { name, icon, color, description } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters' });
    }
    if (!icon || typeof icon !== 'string') return res.status(400).json({ error: 'Icon is required' });
    if (!color || typeof color !== 'string') return res.status(400).json({ error: 'Color is required' });

    const id = uuidv4();
    execute('INSERT INTO services (id, name, icon, color, description) VALUES (?, ?, ?, ?, ?)',
      id, name.trim(), icon.trim(), color.trim(), description ? description.trim() : null);
    res.status(201).json(queryOne('SELECT * FROM services WHERE id = ?', id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authenticate, requireRole('admin'), (req, res) => {
  try {
    const existing = queryOne('SELECT * FROM services WHERE id = ?', req.params.id);
    if (!existing) return res.status(404).json({ error: 'Service not found' });

    const { name, icon, color, description } = req.body;
    execute('UPDATE services SET name = ?, icon = ?, color = ?, description = ? WHERE id = ?',
      name ? name.trim() : existing.name,
      icon ? icon.trim() : existing.icon,
      color ? color.trim() : existing.color,
      description !== undefined ? (description ? description.trim() : null) : existing.description,
      req.params.id);
    res.json(queryOne('SELECT * FROM services WHERE id = ?', req.params.id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, requireRole('admin'), (req, res) => {
  try {
    const existing = queryOne('SELECT * FROM services WHERE id = ?', req.params.id);
    if (!existing) return res.status(404).json({ error: 'Service not found' });
    execute('DELETE FROM services WHERE id = ?', req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
