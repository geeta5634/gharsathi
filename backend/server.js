const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const workerRoutes = require('./routes/workers');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: allowedOrigins === '*' ? '*' : allowedOrigins.split(','),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Make io accessible to routes
app.set('io', io);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GharSathi API is running' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
  });

  socket.on('tracking_update', (data) => {
    io.to(`booking_${data.bookingId}`).emit('worker_location', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

// Connect to database then start server
if (process.env.MONGODB_URI) {
  require('./config/db')()
    .then(() => {
      server.listen(PORT, () => {
        console.log(`GharSathi server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Database connection failed:', err.message);
      // Start server anyway for development
      server.listen(PORT, () => {
        console.log(`GharSathi server running on port ${PORT} (without DB)`);
      });
    });
} else {
  server.listen(PORT, () => {
    console.log(`GharSathi server running on port ${PORT} (no DB config)`);
  });
}

module.exports = { app, server, io };
