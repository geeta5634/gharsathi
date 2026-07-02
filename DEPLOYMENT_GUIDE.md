# 🚀 GharSathi — Complete Deployment Guide

## Overview

| Component | Service | URL |
|-----------|---------|-----|
| Frontend | Vercel (Free) | `https://gharsathi.vercel.app` |
| Backend | Render.com (Free) | `https://gharsathi-api.onrender.com` |
| Database | MongoDB Atlas (Free) | `mongodb+srv://...` |
| Payments | Razorpay (Test/Live) | Dashboard at `https://dashboard.razorpay.com` |
| OTP | Twilio (Pay-as-you-go) | Dashboard at `https://console.twilio.com` |
| Domain | Any registrar | e.g., `gharsathi.in` |
| Source | GitHub | Your private/public repo |

---

## Step 1: Push Code to GitHub

```bash
# In the project root directory
cd C:\Users\Shusma\AppData\Local\Temp\opencode\gharsathi

git init
git add .
git commit -m "Initial commit: GharSathi full-stack platform"

# Create a repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/gharsathi.git
git branch -M main
git push -u origin main
```

---

## Step 2: MongoDB Atlas — Database Setup

1. Go to **https://www.mongodb.com/atlas** → Sign up (free tier)
2. Create a **Shared Cluster** (M0 Sandbox — free)
3. Set:
   - Cloud Provider: AWS
   - Region: `ap-south-1` (Mumbai — closest to India)
4. Create database user:
   ```
   Username: gharsathi_admin
   Password: <generate a strong password>
   ```
5. **Network Access** → Add IP `0.0.0.0/0` (allow all — required for Render)
6. **Clusters** → Click "Connect" → "Connect your application" → Copy connection string:
   ```
   mongodb+srv://gharsathi_admin:<password>@cluster0.xxxxx.mongodb.net/gharsathi?retryWrites=true&w=majority
   ```
7. Save this string — you'll need it for Step 3.

---

## Step 3: Render — Backend Deployment

### 3a. Create a Web Service

1. Go to **https://dashboard.render.com** → Sign up (free)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo → select `gharsathi`
4. Configure:
   - **Name**: `gharsathi-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 3b. Add Environment Variables

In the Render dashboard under your service → **Environment** → Add the following:

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `MONGODB_URI` | Your MongoDB Atlas connection string (from Step 2) |
| `JWT_SECRET` | `gharsathi_jwt_<random_string_40_chars>` |
| `NODE_ENV` | `production` |

*(Twilio and Razorpay vars can be added later — they're optional for testing)*

### 3c. Deploy

Click **"Create Web Service"**. Render will build and deploy. Once done, you'll get a URL like:
```
https://gharsathi-api.onrender.com
```

Test it:
```bash
curl https://gharsathi-api.onrender.com/api/health
# → {"status":"ok","message":"GharSathi API is running"}
```

---

## Step 4: Vercel — Frontend Deployment

### 4a. Two Options

**Option A — Monorepo (Easiest):**

1. Go to **https://vercel.com** → Sign up with GitHub
2. Click **"Add New Project"** → Import `gharsathi` repo
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

4. **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_URL` | `https://gharsathi-api.onrender.com/api` |

5. Click **"Deploy"**

**Option B — Standalone (if you have separate repos):**

Same steps, but import only the `frontend/` directory as its own project.

### 4b. Custom Domain (Optional)

1. In your Vercel project → **Settings** → **Domains**
2. Add `gharsathi.in` (or your domain)
3. Update DNS records at your registrar to point to Vercel's nameservers

---

## Step 5: Razorpay — Payment Gateway (Test Mode)

1. Go to **https://razorpay.com** → Sign up (free test account)
2. Navigate to **Dashboard** → **Settings** → **API Keys**
3. Generate a **Test Key** pair:
   - `Key ID`: `rzp_test_xxxxxxxxxxxx`
   - `Key Secret`: `xxxxxxxxxxxxxxxx`
4. Add these to your Render backend env vars:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
5. Also add to Vercel frontend env:
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`

### Test Cards (Razorpay Test Mode)

| Card | Details |
|------|---------|
| **Success** | `4111 1111 1111 1111` · Any future date · Any CVV |
| **Failure** | `4000 0000 0000 0002` · Any future date · Any CVV |
| **UPI** | `success@razorpay` |

> ⚠️ Switch to **Live Mode** only after full testing. Live requires business documents (GST, PAN, bank account).

---

## Step 6: Twilio — OTP Service (Optional)

1. Go to **https://console.twilio.com** → Sign up
2. Get a phone number (costs ~$1/month + $0.0079/SMS)
3. Note your credentials:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`
4. Add these to Render env vars

### Fallback (No Twilio)

The API currently logs OTPs to console. For production without Twilio:
- Use **Firebase Phone Auth** instead
- Or build a simple SMS provider abstraction

---

## Step 7: Re-deploy After Config Changes

After adding any environment variable:

### Render (Backend)
```bash
# Automatic — just push to GitHub:
git add .
git commit -m "Update env config"
git push
# Render auto-deploys on push
```

Or manually: Render Dashboard → "Manual Deploy" → "Deploy latest commit"

### Vercel (Frontend)
```bash
# Same — push to GitHub triggers auto-deploy
git push
```

Or manually: Vercel Dashboard → "Redeploy"

---

## Step 8: Verify Everything

### Test Flow

```
1. Visit: https://gharsathi.vercel.app
2. Browse services → /services
3. View workers → /workers
4. Book a service → /booking (complete 5-step flow)
5. Admin dashboard → /admin
6. Worker login → /worker/login
7. Worker dashboard → /worker/dashboard
8. Membership → /membership
9. Features → /features
```

### API Health Check
```bash
curl https://gharsathi-api.onrender.com/api/health
# Expected: {"status":"ok","message":"GharSathi API is running"}
```

---

## Troubleshooting

### "MongoDB connection refused"
- Check your Atlas IP whitelist — must include `0.0.0.0/0`
- Verify username/password in connection string (URL-encode special chars)
- Check cluster region (should match your API region)

### "CORS error" on frontend
- Verify `NEXT_PUBLIC_API_URL` in Vercel env matches the Render URL
- Check the CORS config in `backend/server.js` (currently allows all origins)

### "SWC binary error" on build
```bash
# In frontend directory:
npm install @next/swc-win32-x64-msvc@14.2.5
```
This is a local dev issue only — Vercel builds work fine natively.

### 404 on page reload
This is a Next.js static export issue. Ensure Vercel is using the `next build` command (not `next export`).

---

## Cost Breakdown (Monthly)

| Service | Free Tier | Production |
|---------|-----------|------------|
| Vercel | Free (100GB bandwidth) | $20/mo (Pro) |
| Render | Free (750 hrs/mo) | $7/mo (Starter) |
| MongoDB Atlas | Free (512MB) | $57/mo (M10) |
| Razorpay | Free (test) | 2% + GST per transaction |
| Twilio | Pay-as-you-go | ~$0.0079/SMS |
| Domain | — | ~$10/yr |
| **Total** | **~$0/mo** | **~$100/mo** |

---

## Quick Commands Reference

```bash
# Local development
cd gharsathi/frontend && npm run dev     # → :3000
cd gharsathi/backend && npm run dev      # → :5000

# Build frontend
cd gharsathi/frontend && npm run build

# Deploy to production
git add . && git commit -m "update" && git push
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     End User                             │
│              https://gharsathi.vercel.app                │
└────────────────────────┬────────────────────────────────┘
                         │
                    HTTPS / DNS
                         │
┌────────────────────────▼────────────────────────────────┐
│                    Vercel (CDN)                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Next.js Static Pages + API Routes        │   │
│  │  /  /services  /workers  /booking  /admin  ...   │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │ REST API calls
                         │ (NEXT_PUBLIC_API_URL)
┌────────────────────────▼────────────────────────────────┐
│              Render.com (Node.js)                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Express API Server :5000                  │   │
│  │  /api/auth  /api/bookings  /api/payments  ...    │   │
│  └──────────────────────────────────────────────────┘   │
└──────┬──────────────────────────────┬───────────────────┘
       │                              │
       │ Mongoose ODM                 │ Razorpay SDK
┌──────▼──────────┐          ┌────────▼──────────┐
│  MongoDB Atlas   │          │   Razorpay         │
│  (Database)      │          │   (Payments)       │
└─────────────────┘          └───────────────────┘
```

---

## Next Steps After Deployment

1. ✅ Set up **CNAME record** for custom domain (gharsathi.in)
2. ⬜ Configure **Razorpay Webhook** for automatic payment status updates
3. ⬜ Set up **GitHub Actions** CI/CD for automated testing
4. ⬜ Add **Google Analytics** or **Plausible** for traffic tracking
5. ⬜ Set up **Sentry** for error monitoring
6. ⬜ Configure **Rate Limiting** on API endpoints
7. ⬜ Add **Redis** for session caching (if scaling up)

---

*Need help with a specific step? Let me know and I'll guide you through it.*
