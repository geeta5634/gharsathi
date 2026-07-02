const express = require('express');
const router = express.Router();
const workerController = require('../controllers/workerController');

// Get all workers
router.get('/', workerController.getAllWorkers);

// Get single worker
router.get('/:id', workerController.getWorkerById);

// Update worker availability
router.put('/:id/availability', workerController.updateAvailability);

// Get worker earnings
router.get('/:id/earnings', workerController.getEarnings);

// Get worker reviews
router.get('/:id/reviews', workerController.getReviews);

module.exports = router;
