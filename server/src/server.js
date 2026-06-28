require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { getDb, query, queryOne } = require('./database');

const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const workerRoutes = require('./routes/workers');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

const corsOrigins = process.env.CORS_ORIGINS || '*';
const corsOptions = {
  origin: corsOrigins === '*' ? '*' : corsOrigins.split(',').map(s => s.trim()),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

async function start() {
  const app = express();
  const PORT = parseInt(process.env.PORT) || 3001;

  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
  app.use(cors(corsOptions));
  app.use(express.json({ limit: '1mb' }));
  app.use(limiter);

  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '0');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  });

  await getDb();

  app.get('/api/ping', (req, res) => res.json({ ok: true, time: Date.now() }));

  app.use('/api/auth', authRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/workers', workerRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/admin', adminRoutes);

  app.get('/api/stats', (req, res) => {
    try {
      const totalWorkers = queryOne('SELECT COUNT(*) as c FROM workers').c;
      const totalCustomers = queryOne("SELECT COUNT(*) as c FROM users WHERE role = 'customer'").c;
      const totalBookings = queryOne('SELECT COUNT(*) as c FROM bookings').c;
      const totalEarnings = queryOne("SELECT COALESCE(SUM(total_amount), 0) as t FROM bookings WHERE status = 'completed'").t;

      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
      const weeklyBookings = queryOne("SELECT COUNT(*) as c FROM bookings WHERE booking_date >= ?", weekAgo).c;
      const pendingBookings = queryOne("SELECT COUNT(*) as c FROM bookings WHERE status = 'pending'").c;
      const activeBookings = queryOne("SELECT COUNT(*) as c FROM bookings WHERE status IN ('confirmed','in-progress')").c;
      const completedBookings = queryOne("SELECT COUNT(*) as c FROM bookings WHERE status = 'completed'").c;
      const cancelledBookings = queryOne("SELECT COUNT(*) as c FROM bookings WHERE status = 'cancelled'").c;
      const totalRevenue = queryOne("SELECT COALESCE(SUM(total_amount), 0) as t FROM bookings WHERE status IN ('completed','in-progress','confirmed')").t;
      const avgRating = queryOne("SELECT COALESCE(AVG(rating), 0) as avg FROM reviews").avg;
      const availableWorkers = queryOne("SELECT COUNT(*) as c FROM workers WHERE available = 1").c;

      const revenueByDay = query(
        "SELECT booking_date as date, COUNT(*) as bookings, COALESCE(SUM(total_amount), 0) as revenue FROM bookings WHERE booking_date >= ? GROUP BY booking_date ORDER BY booking_date",
        weekAgo
      );

      const distribution = query(
        'SELECT s.name, COUNT(*) as count FROM bookings b JOIN services s ON b.service_id = s.id GROUP BY s.id ORDER BY count DESC'
      );

      const workerStats = query(
        'SELECT u.name, w.rating, w.reviews_count, w.available, w.visit_charge, w.earnings_total, w.experience FROM workers w JOIN users u ON w.user_id = u.id ORDER BY w.earnings_total DESC'
      );

      res.json({
        totalWorkers, totalCustomers, totalBookings, totalEarnings,
        weeklyBookings, pendingBookings, activeBookings, completedBookings, cancelledBookings,
        totalRevenue, avgRating, availableWorkers,
        distribution, revenueByDay, workerStats
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  app.use(express.static(path.join(__dirname, '..', '..'), {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
    etag: true,
    lastModified: true,
  }));

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '..', '..', 'index.html'));
  });

  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  });

  app.listen(PORT, () => {
    console.log(`GharSathi API running at http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
