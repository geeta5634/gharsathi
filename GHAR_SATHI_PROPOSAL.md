# 🏠 GharSathi — Developer Proposal

## Har Ghar Ka Sathi

---

## 1. Project Overview

**GharSathi** is a full-stack, mobile-responsive web platform that connects customers with verified home service professionals including plumbers, electricians, drivers, maids, carpenters, painters, and cleaners. The platform delivers trust, transparency, and speed — with a promise of 15-minute emergency response.

### Vision
To become India's most trusted home services marketplace by combining technology, transparency, and community-driven quality assurance.

---

## 2. Key Objectives

- Build a responsive web application serving **customers**, **workers**, and **administrators**
- Enable **real-time booking**, **secure payments**, and **location-based service availability**
- Integrate **AI-powered features**: photo-based problem detection, worker trust scoring
- Implement **membership tiers** (Basic/Premium/VIP) with recurring revenue
- Provide **real-time tracking** and **notifications** via Socket.IO

---

## 3. Architecture & Modules

### 3.1 Customer Portal
- Browse & search services with filters
- View verified worker profiles with ratings, experience, pricing
- 5-step booking flow: Service → Details → Schedule → Payment → Confirm
- Real-time booking tracking and status updates
- Rate & review completed services

### 3.2 Worker Portal
- OTP-based login with phone verification
- Dashboard with active bookings, earnings, and schedule
- Profile management (skills, availability, pricing)
- Real-time job notifications

### 3.3 Admin Dashboard
- Interactive analytics with Chart.js (revenue, bookings, services)
- Worker verification and management
- Customer management
- Booking oversight with status filters
- Revenue and service analytics

### 3.4 Membership System

| Plan | Price | Key Features |
|------|-------|-------------|
| Basic | ₹99/mo | 2 bookings/month, standard response, phone support |
| Premium | ₹199/mo | 5 bookings/month, priority response, AI diagnosis, health records |
| VIP | ₹299/mo | Unlimited bookings, 15-min emergency, dedicated manager, network access |

### 3.5 Unique Features
- **AI Problem Detection** — Image-based diagnosis using computer vision
- **Worker Trust Score** — Dynamic scoring from verification, ratings, and community feedback
- **Health Record System** — Digital health tracking for domestic workers
- **Neighborhood Network** — Community recommendations and group discounts

---

## 4. Technical Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Customer │ │  Worker  │ │  Admin   │ │  Auth    │   │
│  │  Portal  │ │  Portal  │ │Dashboard │ │  Pages   │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│              Tailwind CSS · Chart.js · Socket.IO          │
└──────────────────────────────────────────────────────────┘
                        │ REST API + WebSocket
┌──────────────────────────────────────────────────────────┐
│                 Backend (Express.js)                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │   Auth   │ │ Bookings │ │ Payments │ │  Admin   │   │
│  │  Routes  │ │  Routes  │ │  Routes  │ │  Routes  │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│          JWT · Twilio OTP · Razorpay · Socket.IO          │
└──────────────────────────────────────────────────────────┘
                        │ Mongoose ODM
┌──────────────────────────────────────────────────────────┐
│                  MongoDB Database                         │
│  Users · Workers · Bookings · Payments · Memberships     │
└──────────────────────────────────────────────────────────┘
```

---

## 5. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 + React 18 | SSR, routing, component architecture |
| **Styling** | Tailwind CSS 3 | Utility-first responsive design |
| **Charts** | Chart.js + react-chartjs-2 | Admin analytics visualizations |
| **Icons** | React Icons (Heroicons) | UI iconography |
| **Backend** | Node.js + Express 4 | REST API server |
| **Database** | MongoDB + Mongoose 8 | Document data store |
| **Auth** | Twilio OTP + JWT | Phone-based authentication |
| **Payments** | Razorpay | Payment gateway integration |
| **Real-time** | Socket.IO | Live tracking & notifications |
| **Hosting** | Vercel (Frontend) / AWS (Backend) | Deployment |

---

## 6. Design Guidelines

### Color Palette
- **Primary Blue**: `#1e40af` — Trust, professionalism, reliability
- **Accent Orange**: `#f97316` — Energy, urgency, call-to-action
- **White**: `#ffffff` — Clean, minimal, open

### Typography
- **Font**: Inter (sans-serif)
- **Scale**: Responsive typography using Tailwind defaults

### UX Principles
- Mobile-first responsive layout
- Flat icons with consistent visual language
- Transparent pricing displayed upfront
- Trust badges (Verified, Safe, On Time) on all worker cards
- Clear progress indicators in booking flow

---

## 7. Database Schema (MongoDB Collections)

### Users
- `name`, `phone` (unique), `email`, `role` (customer/worker/admin)
- `address`, `city`, `isVerified`, `membership`

### Workers
- `userId` (ref), `name`, `phone`, `service`, `experience`
- `rating`, `totalJobs`, `price`, `location`, `isAvailable`
- `isVerified`, `trustScore`, `earnings`

### Bookings
- `bookingId` (unique), `customerId` (ref), `workerId` (ref)
- `service`, `address`, `scheduledDate`, `scheduledTime`
- `isEmergency`, `status`, `amount`, `paymentStatus`
- `rating`, `review`, `tracking` (lat/lng)

### Services
- `name` (unique), `description`, `icon`, `basePrice`
- `visitCharge`, `discount`, `category`, `features`

### Payments
- `bookingId` (ref), `customerId` (ref), `amount`, `currency`
- `method`, `status`, `razorpayOrderId`, `razorpayPaymentId`

### Memberships
- `userId` (ref), `plan`, `price`, `startDate`, `endDate`
- `isActive`, `autoRenew`

---

## 8. Security & Compliance

- **Authentication**: OTP-based login with JWT token expiry
- **Authorization**: Role-based access control (Admin, Worker, Customer)
- **Data Encryption**: End-to-end encryption for communications
- **Payment Security**: Razorpay's PCI-compliant payment gateway
- **API Security**: Input validation, rate limiting, CORS configuration
- **Privacy**: GDPR-compliant data handling practices

---

## 9. API Endpoints

### Authentication
- `POST /api/auth/send-otp` — Send login OTP
- `POST /api/auth/verify-otp` — Verify OTP & login

### Services
- `GET /api/services` — List all services
- `POST /api/services` — Create service (admin)

### Workers
- `GET /api/workers` — List workers (with filters)
- `GET /api/workers/:id` — Worker details

### Bookings
- `POST /api/bookings` — Create booking
- `GET /api/bookings/my` — Customer's bookings
- `PUT /api/bookings/:id/status` — Update status
- `POST /api/bookings/:id/review` — Add rating & review

### Payments
- `POST /api/payments/create-order` — Create Razorpay order
- `POST /api/payments/verify` — Verify payment

### Admin
- `GET /api/admin/stats` — Dashboard statistics
- `GET /api/admin/workers` — Manage workers
- `GET /api/admin/revenue` — Revenue analytics

---

## 10. Deliverables

### Phase 1 — Foundation (Week 1-2)
- Next.js project setup with Tailwind CSS
- Express server with MongoDB connection
- OTP-based authentication flow
- Core pages: Home, Services, Workers

### Phase 2 — Core Features (Week 3-4)
- 5-step booking system
- Worker profiles with booking/chat/call
- Admin dashboard with Chart.js analytics
- Service and worker management CRUD

### Phase 3 — Advanced Features (Week 5-6)
- Membership plans with pricing comparison
- Worker portal with earnings dashboard
- Real-time notifications via Socket.IO
- Razorpay payment integration

### Phase 4 — Polish & Launch (Week 7-8)
- Responsive design QA across devices
- Performance optimization
- Security audit & compliance
- Deployment configuration (Vercel + AWS)
- API documentation & testing

---

## 11. Estimated Timeline

| Phase | Duration | Key Deliverables |
|-------|----------|-----------------|
| Foundation | 2 weeks | Project setup, auth, core pages |
| Core Features | 2 weeks | Booking, admin dashboard, worker profiles |
| Advanced | 2 weeks | Membership, payments, real-time features |
| Polish | 2 weeks | Testing, deployment, documentation |
| **Total** | **8 weeks** | **Complete platform** |

---

## 12. Cost Estimation

### Development (One-time)
| Component | Hours | Rate | Total |
|-----------|-------|------|-------|
| Frontend Development | 160 | $50/hr | $8,000 |
| Backend Development | 160 | $50/hr | $8,000 |
| API Integration | 40 | $50/hr | $2,000 |
| UI/UX Design | 40 | $50/hr | $2,000 |
| Testing & QA | 40 | $50/hr | $2,000 |
| **Subtotal** | **440** | | **$22,000** |

### Monthly Maintenance
| Service | Cost |
|---------|------|
| Server Hosting (AWS) | $150/mo |
| Database (MongoDB Atlas) | $57/mo |
| Twilio SMS | ~$100/mo |
| Domain & SSL | $15/mo |
| **Total** | **$322/mo** |

---

## 13. Success Metrics

- **Customer Acquisition**: 10,000+ registered users in first 3 months
- **Worker Onboarding**: 1,000+ verified professionals
- **Booking Volume**: 5,000+ monthly bookings by month 6
- **Response Time**: <15 minutes for emergency services
- **Customer Satisfaction**: 4.5+ average rating
- **Membership Conversion**: 20% of active users on paid plans

---

## 14. Contact

**Project**: GharSathi — Har Ghar Ka Sathi  
**Website**: [gharsathi.vercel.app](https://gharsathi.vercel.app)  
**Email**: dev@gharsathi.in  
**Tech Stack**: Next.js · Express · MongoDB · Tailwind CSS · Socket.IO · Razorpay

---

*Prepared for stakeholder review. This proposal outlines the complete technical architecture, implementation plan, and resource requirements for building the GharSathi home services platform.*
