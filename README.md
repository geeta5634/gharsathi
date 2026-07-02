# 🏠 GharSathi - Har Ghar Ka Sathi

A modern, responsive home services platform connecting customers with verified service professionals.

## 🚀 Quick Start

```bash
# Install dependencies
npm run install:all

# Start development (both frontend & backend)
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📂 Project Structure

```
gharsathi/
├── frontend/          # Next.js application
│   ├── pages/         # All application pages
│   ├── components/    # Reusable UI components
│   └── styles/        # Tailwind CSS styles
├── backend/           # Express API server
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API route definitions
│   ├── controllers/   # Business logic
│   └── middleware/     # Auth & validation
└── README.md
```

## 🧩 Core Modules

- **Home Page** - Brand introduction with 15-min emergency service
- **Service Selection** - Interactive service cards with icons
- **Worker Profiles** - Verified worker cards with ratings & booking
- **Booking System** - 5-step booking flow with transparent pricing
- **Membership Plans** - Basic/Premium/VIP tiers
- **Admin Dashboard** - Analytics, charts & management tables
- **Worker Portal** - Dashboard, bookings & earnings
- **Unique Features** - AI detection, trust scores, health records

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | OTP-based (Twilio/Firebase) |
| Payments | Razorpay |
| Analytics | Chart.js, D3.js |
| Real-time | Socket.IO |
| Hosting | Vercel / AWS |
