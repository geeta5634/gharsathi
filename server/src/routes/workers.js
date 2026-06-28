const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { query, queryOne, execute } = require('../database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const { service_id, available } = req.query;
    let sql = `SELECT w.*, u.name, u.phone, u.avatar, u.location, s.name as service_name, s.icon as service_icon, s.color as service_color FROM workers w JOIN users u ON w.user_id = u.id JOIN services s ON w.service_id = s.id WHERE 1=1`;
    const params = [];
    if (service_id && typeof service_id === 'string') { sql += ' AND w.service_id = ?'; params.push(service_id); }
    if (available !== undefined) { sql += ' AND w.available = ?'; params.push(available === 'true' ? 1 : 0); }
    sql += ' ORDER BY w.rating DESC, w.reviews_count DESC';

    const workers = query(sql, ...params);
    for (const w of workers) {
      w.skills = query('SELECT skill FROM worker_skills WHERE worker_id = ?', w.id).map(s => s.skill);
    }
    res.json(workers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const worker = queryOne(
      'SELECT w.*, u.name, u.phone, u.avatar, u.email, u.location, s.name as service_name, s.icon as service_icon, s.color as service_color FROM workers w JOIN users u ON w.user_id = u.id JOIN services s ON w.service_id = s.id WHERE w.id = ?',
      req.params.id
    );
    if (!worker) return res.status(404).json({ error: 'Worker not found' });
    worker.skills = query('SELECT skill FROM worker_skills WHERE worker_id = ?', req.params.id).map(s => s.skill);
    res.json(worker);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, (req, res) => {
  try {
    const userId = req.user.id;
    const existing = queryOne('SELECT id FROM workers WHERE user_id = ?', userId);
    if (existing) return res.status(409).json({ error: 'Worker profile already exists' });

    const { service_id, experience, visit_charge, about, skills } = req.body;
    if (!service_id || typeof service_id !== 'string') return res.status(400).json({ error: 'Service ID is required' });

    const service = queryOne('SELECT id FROM services WHERE id = ?', service_id);
    if (!service) return res.status(400).json({ error: 'Invalid service ID' });

    if (visit_charge && (typeof visit_charge !== 'number' || visit_charge < 0 || visit_charge > 99999)) {
      return res.status(400).json({ error: 'Invalid visit charge' });
    }

    const id = uuidv4();
    execute('INSERT INTO workers (id, user_id, service_id, experience, visit_charge, about) VALUES (?, ?, ?, ?, ?, ?)',
      id, userId, service_id, experience || '5 Years', visit_charge || 299, about || null);

    if (skills && Array.isArray(skills)) {
      for (const skill of skills) {
        if (typeof skill === 'string' && skill.trim().length > 0) {
          execute('INSERT INTO worker_skills (worker_id, skill) VALUES (?, ?)', id, skill.trim());
        }
      }
    }

    const worker = queryOne('SELECT w.*, u.name, u.avatar, s.name as service_name FROM workers w JOIN users u ON w.user_id = u.id JOIN services s ON w.service_id = s.id WHERE w.id = ?', id);
    res.status(201).json(worker);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, (req, res) => {
  try {
    const worker = queryOne('SELECT * FROM workers WHERE id = ?', req.params.id);
    if (!worker) return res.status(404).json({ error: 'Worker not found' });
    if (req.user.role !== 'admin' && worker.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    execute('DELETE FROM worker_skills WHERE worker_id = ?', req.params.id);
    execute('DELETE FROM workers WHERE id = ?', req.params.id);
    res.json({ message: 'Worker deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authenticate, (req, res) => {
  try {
    const worker = queryOne('SELECT * FROM workers WHERE id = ?', req.params.id);
    if (!worker) return res.status(404).json({ error: 'Worker not found' });

    if (worker.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { experience, visit_charge, available, about, skills } = req.body;

    if (visit_charge !== undefined && (typeof visit_charge !== 'number' || visit_charge < 0 || visit_charge > 99999)) {
      return res.status(400).json({ error: 'Invalid visit charge' });
    }

    execute('UPDATE workers SET experience = ?, visit_charge = ?, available = ?, about = ? WHERE id = ?',
      experience || worker.experience,
      visit_charge !== undefined ? visit_charge : worker.visit_charge,
      available !== undefined ? (available ? 1 : 0) : worker.available,
      about !== undefined ? about : worker.about, req.params.id);

    if (skills && Array.isArray(skills)) {
      execute('DELETE FROM worker_skills WHERE worker_id = ?', req.params.id);
      for (const skill of skills) {
        if (typeof skill === 'string' && skill.trim().length > 0) {
          execute('INSERT INTO worker_skills (worker_id, skill) VALUES (?, ?)', req.params.id, skill.trim());
        }
      }
    }
    res.json({ message: 'Worker updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
