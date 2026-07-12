# GharSathi - Home Services Marketplace

> "GharSathi ke saath, har ghar ki tension khatam!"  
> Safe | Trusted | Verified | On Time

A full-stack multi-platform service marketplace connecting verified workers (plumbers, electricians, cleaners, etc.) with customers who need quick, reliable home services.

## Features

### Customer App
- Browse & book home services
- Worker profiles with trust scores & ratings
- Real-time booking tracking
- Online payment via Razorpay
- Membership plans (Basic ₹99, Premium ₹199, VIP ₹299)

### Worker App
- Accept/decline bookings
- Manage schedule & availability
- Track earnings & payouts
- Build trust score

### Admin Dashboard
- Analytics with charts (bookings, revenue, users)
- Worker approval & management
- Service management
- Booking & payment tracking

## Tech Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Frontend | Next.js 14, Tailwind CSS      |
| Backend  | Node.js, Express              |
| Database | MongoDB with Mongoose         |
| Auth     | JWT + OTP                     |
| Payment  | Razorpay                      |
| Deploy   | Docker, Vercel, Render, GCR   |

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Razorpay test account

### Backend Setup

```bash
cd backend
npm install

# Update .env with your MongoDB URI and Razorpay keys
npm run seed    # Populate sample data
npm run dev     # Start on port 5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev     # Start on port 3000
```

### Docker Setup

```bash
docker-compose up --build
```

## Demo Credentials

| Role     | Phone        | Password     |
|----------|-------------|--------------|
| Admin    | 9999999999  | admin123     |
| Worker   | 8888888801  | worker123    |
| Customer | 7777777701  | customer123  |

## API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `GET /api/auth/me` - Current user

### Services
- `GET /api/services` - List services
- `POST /api/services` - Create (admin)

### Workers
- `GET /api/workers` - List workers
- `POST /api/workers/register` - Register as worker
- `PUT /api/workers/approve/:id` - Approve (admin)

### Bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/accept` - Accept (worker)
- `PUT /api/bookings/:id/complete` - Complete (worker)
- `PUT /api/bookings/:id/rate` - Rate (customer)

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment

### Memberships
- `POST /api/memberships/subscribe` - Subscribe
- `GET /api/memberships/plans` - List plans

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/bookings` - All bookings
- `GET /api/admin/workers` - All workers

## Deployment

### Vercel (Frontend)
1. Push to GitHub
2. Import on vercel.com
3. Set env vars
4. Deploy

### Render (Full Stack)
1. Push to GitHub
2. Create two services on render.com
3. Use `render.yaml` config
4. Set env vars

### Docker
```bash
docker-compose up -d --build
```

## Project Structure

```
gharsathi/
├── backend/
│   ├── config/         # DB config
│   ├── middleware/      # Auth middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── utils/          # Helpers (Razorpay, OTP)
│   ├── server.js       # Entry point
│   └── seed.js         # Sample data
├── frontend/
│   ├── app/
│   │   ├── customer/   # Customer portal
│   │   ├── worker/     # Worker portal
│   │   ├── admin/      # Admin dashboard
│   │   ├── login/      # Auth pages
│   │   └── register/
│   ├── components/     # Reusable components
│   └── lib/            # API & auth helpers
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
├── render.yaml
└── vercel.json
```

## Razorpay Integration

1. Create account at [razorpay.com](https://razorpay.com)
2. Get test API keys from Dashboard
3. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env`
4. For production, use live keys

## License

MIT
