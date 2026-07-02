const Worker = require('../models/Worker');
const Booking = require('../models/Booking');

exports.getAllWorkers = async (req, res) => {
  try {
    const { service, city, minRating, sortBy } = req.query;
    const query = {};

    if (service) query.service = service;
    if (city) query.city = city;
    if (minRating) query.rating = { $gte: parseFloat(minRating) };

    let sort = { rating: -1 };
    if (sortBy === 'jobs') sort = { totalJobs: -1 };
    if (sortBy === 'price') sort = { price: 1 };

    const workers = await Worker.find(query).sort(sort);
    res.json({ success: true, count: workers.length, workers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch workers' });
  }
};

exports.getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }
    res.json({ success: true, worker });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch worker' });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      { isAvailable },
      { new: true }
    );
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }
    res.json({ success: true, worker });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update availability' });
  }
};

exports.getEarnings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      workerId: req.params.id,
      status: 'completed',
    }).select('amount createdAt');

    const totalEarnings = bookings.reduce((sum, b) => sum + b.amount, 0);

    res.json({
      success: true,
      totalEarnings,
      totalJobs: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch earnings' });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Booking.find({
      workerId: req.params.id,
      rating: { $exists: true },
    })
      .populate('customerId', 'name')
      .select('rating review createdAt');

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
};
