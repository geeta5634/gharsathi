const express = require('express');
const { body, validationResult } = require('express-validator');
const Service = require('../models/Service');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    const sorted = services.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    res.status(200).json({
      success: true,
      count: sorted.length,
      data: sorted
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching services' });
  }
});

// GET /api/services/:id
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findOne({ _id: req.params.id });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching service' });
  }
});

// POST /api/services
router.post('/', protect, authorize('admin'), [
  body('name').trim().notEmpty().withMessage('Service name is required'),
  body('basePrice').isNumeric().withMessage('Base price must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, icon, description, basePrice, category } = req.body;

    const existingService = await Service.findOne({ name });
    if (existingService) {
      return res.status(400).json({ success: false, message: 'Service with this name already exists' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const service = await Service.create({ name, icon, description, basePrice, category, slug });

    res.status(201).json({ success: true, data: service });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ success: false, message: 'Server error while creating service' });
  }
});

// PUT /api/services/:id
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating service' });
  }
});

// DELETE /api/services/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting service' });
  }
});

module.exports = router;
