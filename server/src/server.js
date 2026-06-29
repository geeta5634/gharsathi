require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const path = require('path');
const http = require('http');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { getDb, query, queryOne, execute, persistSync } = require('./database');

const authRoutes = require('./routes/auth');
const oauthRoutes = require('./routes/oauth');
const serviceRoutes = require('./routes/services');
const workerRoutes = require('./routes/workers');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');
const locationRoutes = require('./routes/location');
const trustScoreRoutes = require('./routes/trustscore');
const healthRecordRoutes = require('./routes/healthrecord');
const detectRoutes = require('./routes/detect');

const { setupSocket } = require('./services/socket');
const { setupCronJobs } = require('./services/cron');

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth requests, please try again later.' },
});

const corsOrigins = process.env.CORS_ORIGINS || '*';
const corsOptions = {
  origin: corsOrigins === '*' ? '*' : corsOrigins.split(',').map(s => s.trim()),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

async function start() {
  console.log('[Server] Starting GharSathi server...');
  console.log('[Server] Node version:', process.version);
  console.log('[Server] CWD:', process.cwd());
  console.log('[Server] PORT env:', process.env.PORT);
  console.log('[Server] NODE_ENV:', process.env.NODE_ENV);

  const app = express();
  const server = http.createServer(app);
  const PORT = parseInt(process.env.PORT) || 3001;

  const io = setupSocket(server);

  const CSP_DIRECTIVES = {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'",
      'https://cdn.tailwindcss.com', 'https://unpkg.com',
      'https://cdn.jsdelivr.net', 'https://cdn.socket.io',
      'https://cdnjs.cloudflare.com'],
    styleSrc: ["'self'", "'unsafe-inline'",
      'https://fonts.googleapis.com', 'https://unpkg.com',
      'https://cdn.jsdelivr.net'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    imgSrc: ["'self'", 'data:', 'https://i.pravatar.cc',
      'https://*.tile.openstreetmap.org', 'https://unpkg.com'],
    connectSrc: ["'self'", 'https://nominatim.openstreetmap.org',
      'wss://*.opencode.ai'],
    frameAncestors: ["'none'"],
    formAction: ["'self'"],
    baseUri: ["'self'"],
  };

  app.use(helmet({
    contentSecurityPolicy: { directives: CSP_DIRECTIVES },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    noSniff: true,
    frameguard: { action: 'deny' },
    xssFilter: true,
    hidePoweredBy: true,
    ieNoOpen: true,
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  }));

  app.use(cors(corsOptions));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false, limit: '1mb' }));
  app.use(limiter);
  app.use(hpp());

  app.use(passport.initialize());

  app.use((req, res, next) => {
    res.setHeader('Permissions-Policy', 'geolocation=(self "https://*.tile.openstreetmap.org"), camera=(), microphone=(), payment=()');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    if (req.path.startsWith('/api/')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    }
    next();
  });

  app.use((req, res, next) => {
    res.setTimeout(30000, () => {
      res.status(408).json({ error: 'Request timeout' });
    });
    next();
  });

  try {
    await getDb();
    console.log('[Server] Database initialized successfully');
  } catch (err) {
    console.error('[Server] Database initialization FAILED:', err.message);
    console.error(err.stack);
    process.exit(1);
  }

  try {
    const count = queryOne('SELECT COUNT(*) as c FROM services');
    if (!count || count.c === 0) {
      console.log('[Server] Database empty — seeding...');
      await seedIfEmpty();
      console.log('[Server] Seeding complete');
    }
  } catch (err) {
    console.error('[Server] Seed check failed:', err.message);
  }

  setupCronJobs();
  app.set('io', io);

  app.get('/api/ping', (req, res) => res.json({ ok: true, time: Date.now() }));

  app.use('/api/auth', authLimiter, authRoutes);
  app.use('/api/auth', authLimiter, oauthRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/workers', workerRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/location', locationRoutes);
  app.use('/api/trust-score', trustScoreRoutes);
  app.use('/api/health-record', healthRecordRoutes);
  app.use('/api/detect-issue', detectRoutes);

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

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] GharSathi API running on port ${PORT}`);
  });
}

async function seedIfEmpty() {
  console.log('Database empty — seeding...');
  const SEED_PASSWORD = process.env.SEED_PASSWORD || 'password123';

  const svc = [
    ['s1', 'Plumber', 'droplet', 'blue', 'Pipe fitting, leak, blockage etc.'],
    ['s2', 'Electrician', 'zap', 'yellow', 'Wiring, repair, fan, light etc.'],
    ['s3', 'Driver', 'car', 'green', 'Personal driver, outstation etc.'],
    ['s4', 'Maid / Bai', 'user', 'pink', 'Cooking, cleaning, washing etc.'],
    ['s5', 'Carpenter', 'hammer', 'orange', 'Furniture, door, window etc.'],
    ['s6', 'House Painter', 'paintbrush', 'purple', 'Wall painting, texture etc.'],
    ['s7', 'Cleaning', 'sparkles', 'teal', 'Home, office, deep cleaning etc.'],
  ];
  for (const s of svc) execute('INSERT INTO services (id, name, icon, color, description) VALUES (?, ?, ?, ?, ?)', ...s);

  const pwd = await bcrypt.hash(SEED_PASSWORD, 10);
  const users = [
    ['u1', 'Amit Sharma', '9876543210', pwd, 'customer'],
    ['u2', 'Priya Singh', '9876543211', pwd, 'customer'],
    ['u3', 'Ramesh Kumar', '9876543212', pwd, 'worker'],
    ['u4', 'Mahendra Singh', '9876543213', pwd, 'worker'],
    ['u5', 'Suresh Prajapat', '9876543214', pwd, 'worker'],
    ['u6', 'Admin', '9876543200', pwd, 'admin'],
  ];
  for (const u of users) {
    execute('INSERT INTO users (id, name, phone, password, role, location, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
      u[0], u[1], u[2], u[3], u[4], 'Jodhpur, Rajasthan', `https://i.pravatar.cc/200?u=${u[0]}`);
  }

  execute('INSERT INTO workers (id, user_id, service_id, experience, rating, reviews_count, visit_charge, about, trust_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    'w1', 'u3', 's1', '8 Years', 4.8, 120, 299, 'I have 8 years of experience in plumbing work.', 98);
  execute('INSERT INTO workers (id, user_id, service_id, experience, rating, reviews_count, visit_charge, about, trust_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    'w2', 'u4', 's1', '6 Years', 4.6, 85, 299, 'Expert in pipe fitting and water tank installation.', 95);
  execute('INSERT INTO workers (id, user_id, service_id, experience, rating, reviews_count, visit_charge, about, trust_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    'w3', 'u5', 's1', '10 Years', 4.7, 95, 299, 'Senior plumber with expertise in all plumbing systems.', 97);

  const skills = [
    ['w1', 'Pipe Fitting'], ['w1', 'Leakage Fixing'], ['w1', 'Bathroom Fitting'],
    ['w2', 'Pipe Fitting'], ['w2', 'Water Tank Installation'],
    ['w3', 'Pipe Fitting'], ['w3', 'Leakage Fixing'],
  ];
  for (const sk of skills) execute('INSERT INTO worker_skills (worker_id, skill) VALUES (?, ?)', ...sk);

  execute('INSERT INTO bookings (id, customer_id, worker_id, service_id, status, booking_date, booking_time, address, visit_charge, service_charge, platform_fee, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    'GSABC001', 'u1', 'w1', 's1', 'completed', '2024-05-25', '10:00 AM', 'Shastri Nagar, Jodhpur', 299, 500, 49, 848);
  execute('INSERT INTO bookings (id, customer_id, worker_id, service_id, status, booking_date, booking_time, address, visit_charge, service_charge, platform_fee, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    'GSABC002', 'u2', null, 's2', 'pending', '2024-05-28', '11:00 AM', 'Ratanada, Jodhpur', 299, 400, 49, 748);

  const eid = uuidv4();
  execute('INSERT INTO earnings (id, worker_id, booking_id, amount, status) VALUES (?, ?, ?, ?, ?)', eid, 'w1', 'GSABC001', 299, 'paid');
  execute('UPDATE workers SET earnings_total = earnings_total + ? WHERE id = ?', 299, 'w1');

  execute('INSERT INTO reviews (booking_id, customer_id, worker_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
    'GSABC001', 'u1', 'w1', 5, 'Very professional and quick.');
  execute('INSERT INTO reviews (booking_id, customer_id, worker_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
    'GSABC001', 'u1', 'w1', 4, 'Knowledgeable and polite.');

  persistSync();
  console.log('Database seeded successfully!');
  console.log('--- Test Credentials ---');
  console.log(`Customer: 9876543210 / ${SEED_PASSWORD}`);
  console.log(`Worker:   9876543212 / ${SEED_PASSWORD}`);
  console.log(`Admin:    9876543200 / ${SEED_PASSWORD}`);
  console.log('------------------------');
}

start().catch(err => {
  console.error('[Server] Fatal startup error:', err.message);
  console.error(err.stack);
  process.exit(1);
});
