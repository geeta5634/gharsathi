const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');
const { queryOne, execute } = require('../database');

function setupSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.userId = decoded.id;
      socket.role = decoded.role;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Connected: ${socket.id} (user: ${socket.userId}, role: ${socket.role})`);

    socket.on('join-tracking', (bookingId) => {
      socket.join(`booking:${bookingId}`);
      console.log(`[Socket] ${socket.id} joined booking:${bookingId}`);
    });

    if (socket.role === 'worker') {
      socket.on('location-update', async (data) => {
        const { bookingId, lat, lng } = data;
        if (!bookingId || lat === undefined || lng === undefined) return;

        const worker = await queryOne('SELECT id FROM workers WHERE user_id = ?', socket.userId);
        if (!worker) return;

        await execute('INSERT INTO location_updates (worker_id, lat, lng) VALUES (?, ?, ?)', worker.id, lat, lng);

        io.to(`booking:${bookingId}`).emit('worker-location', {
          lat,
          lng,
          workerId: worker.id,
          updatedAt: new Date().toISOString(),
        });
      });

      socket.on('stop-tracking', (bookingId) => {
        socket.leave(`booking:${bookingId}`);
      });
    }

    if (socket.role === 'customer') {
      socket.on('request-tracking', (bookingId) => {
        socket.join(`booking:${bookingId}`);
      });
    }

    socket.on('disconnect', () => {
      console.log(`[Socket] Disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = { setupSocket };
