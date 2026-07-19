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

## Deployment (Production)

### 1. MongoDB Atlas

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Create free M0 cluster
2. Create database user → copy connection string
3. Network access → Add IP `0.0.0.0/0` (allow all) for Render/Vercel
4. Replace `<password>` in the connection string

### 2. Supabase (PostgreSQL for auth)

1. Go to [supabase.com](https://supabase.com) → Create free project
2. In SQL Editor → paste & run `frontend/supabase/schema.sql`
3. Copy `Project URL` and `anon public key` from Settings → API
4. Go to Authentication → Settings → confirm email redirects/providers

### 3. Backend (Render)

1. Push repo to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo → Set **Root Directory** to `backend`
4. Use these settings:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free
5. Add environment variables:

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | (generate: `openssl rand -base64 32`) |
| `JWT_EXPIRE` | `7d` |
| `RAZORPAY_KEY_ID` | Your Razorpay key |
| `RAZORPAY_KEY_SECRET` | Your Razorpay secret |
| `OTP_EXPIRY` | `300000` |

6. Deploy → Note the URL: `https://gharsathi-api.onrender.com`

### 4. Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo → Set **Root Directory** to `frontend`
3. Vercel auto-detects Next.js — keep defaults
4. Add environment variables:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://gharsathi-api.onrender.com/api` |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Your Razorpay key |
| `NEXT_PUBLIC_SITE_URL` | `https://gharsathi.vercel.app` |

5. Deploy → Your site is live at `https://gharsathi.vercel.app`

### 5. CI/CD (GitHub Actions)

1. Go to GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:

| Secret | Value |
|--------|-------|
| `VERCEL_TOKEN` | [Vercel Account → Settings → Tokens → Create](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | From `frontend/.vercel/project.json` → `orgId` |
| `VERCEL_PROJECT_ID` | From `frontend/.vercel/project.json` → `projectId` |
| `RENDER_API_KEY` | [Render Dashboard → Account Settings → API Keys](https://dashboard.render.com/account/api-keys) |
| `RENDER_SERVICE_ID` | Render dashboard → your service → copy from URL |

3. After adding secrets, push to `main` → CI/CD auto-deploys

### 6. Custom Domain

- **Vercel**: Go to project → **Domains** → add your domain → update DNS
- **Render**: Go to service → **Settings** → **Custom Domain**

### 7. Razorpay Live Keys

1. Go to [razorpay.com](https://razorpay.com) → **Settings** → **API Keys**
2. Generate live keys → update `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET` in:
   - Render (backend env vars)
   - Vercel (frontend env var `NEXT_PUBLIC_RAZORPAY_KEY_ID`)

### Docker (Local Dev)
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
