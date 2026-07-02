const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Get all services
router.get('/', serviceController.getAllServices);

// Get single service
router.get('/:id', serviceController.getServiceById);

// Create service (admin)
router.post('/', serviceController.createService);

// Update service (admin)
router.put('/:id', serviceController.updateService);

// Delete service (admin)
router.delete('/:id', serviceController.deleteService);

module.exports = router;
