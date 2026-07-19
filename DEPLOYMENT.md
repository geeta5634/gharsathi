# GharSathi Production Deployment Guide

## Architecture

```
User's Browser
      │
      ▼
┌─────────────────┐     ┌─────────────────────┐     ┌────────────────┐
│   Vercel        │────▶│   Render (Backend)   │────▶│  MongoDB Atlas │
│   gharsathi.    │     │   gharsathi-api.     │     │  (Database)    │
│   vercel.app    │     │   onrender.com       │     │                │
│   (Next.js)     │     │   (Express API)      │     │                │
└─────────────────┘     └─────────────────────┘     └────────────────┘
         │
         ▼
┌─────────────────┐
│   Supabase      │
│   (Auth + DB)   │
│   (optional)    │
└─────────────────┘
```

---

## Prerequisites

| Account | Sign Up Link | Free Tier |
|---------|-------------|-----------|
| GitHub | github.com | ✅ Yes |
| Vercel | vercel.com | ✅ Yes (Hobby) |
| Render | render.com | ✅ Yes (Free) |
| MongoDB Atlas | mongodb.com/atlas | ✅ Yes (M0 - 512MB) |
| Supabase | supabase.com | ✅ Yes (Free - 500MB) |
| Razorpay | razorpay.com | ✅ Test mode |

---

## Step 1: Push Code to GitHub

```bash
# From the gharsathi directory
git add .
git commit -m "chore: prepare for production deployment"
git push origin main
```

> Your repo URL should be: `https://github.com/geeta5634/gharsathi`

---

## Step 2: Set Up MongoDB Atlas (Database)

### 2.1 Create Cluster

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Sign in / Create account
3. Click **Create** → Select **M0 Free** cluster
4. Choose any cloud provider & region (e.g., AWS, Mumbai)
5. Click **Create Cluster** (takes 1-3 minutes)

### 2.2 Create Database User

1. In the left sidebar, click **Database Access**
2. Click **Add New Database User**
3. Username: `gharsathi_user`
4. Password: click **Autogenerate Secure Password** → **Copy** it (save somewhere safe)
5. Role: **Atlas Admin**
6. Click **Add User**

### 2.3 Configure Network Access

1. In the left sidebar, click **Network Access**
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** (= `0.0.0.0/0`)
4. Click **Confirm**

### 2.4 Get Connection String

1. Click **Database** in the left sidebar
2. Click **Connect** on your cluster
3. Select **Drivers**
4. Copy the connection string:

```
mongodb+srv://gharsathi_user:<password>@cluster0.xxxxx.mongodb.net/gharsathi?retryWrites=true&w=majority
```

5. Replace `<password>` with the password you saved in step 2.2
6. Save this string — you'll need it for Render

---

## Step 3: Set Up Supabase (PostgreSQL + Auth)

### 3.1 Create Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in → Click **New Project**
3. Organization: Your personal org
4. Name: `gharsathi`
5. Database Password: **Create a strong password** → save it
6. Region: Choose nearest (e.g., Mumbai)
7. Pricing Plan: **Free**
8. Click **Create New Project** (takes 1-2 minutes)

### 3.2 Run Schema

1. After project is ready, click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Open the file `frontend/supabase/schema.sql` from your project
4. Copy-paste the entire contents into the SQL Editor
5. Click **Run** (or **Ctrl+Enter**)
6. You should see: `CREATE TABLE`, `ALTER TABLE`, `CREATE POLICY` etc. — no errors

### 3.3 Get API Keys

1. In the left sidebar, click **Project Settings** → **API**
2. Copy these two values:
   - **Project URL** (looks like `https://abcxyz.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
3. Save these — you'll need them for Vercel

### 3.4 Configure Auth (Optional)

1. In the left sidebar, click **Authentication** → **Settings**
2. Under **Email Auth**, ensure it's enabled
3. Under **Site URL**, set it to your Vercel URL (e.g., `https://gharsathi.vercel.app` — set this after Step 6)
4. Under **Redirect URLs**, add:
   - `https://gharsathi.vercel.app/**`
   - `http://localhost:3000/**`

---

## Step 4: Get Razorpay Keys

### 4.1 Test Keys

1. Go to [razorpay.com](https://razorpay.com)
2. Sign in → **Dashboard** → **Settings** → **API Keys**
3. Click **Generate Test Key**
4. Copy:
   - **Key ID**: `rzp_test_xxxxxxxxxxxx`
   - **Key Secret**: `xxxxxxxxxxxxxxxxxxxxxxxx`

### 4.2 Production Keys (for live launch)

> Use test keys for initial deployment. Switch to live keys when ready.

1. Go to **Settings** → **API Keys** → **Generate Live Key**
2. You'll need to complete KYC / business verification first

---

## Step 5: Deploy Backend to Render

### 5.1 Create Web Service

1. Go to [render.com](https://render.com)
2. Sign in → Click **New +** → **Web Service**
3. Connect your GitHub account (if not already)
4. Select the repo: `geeta5634/gharsathi`
5. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `gharsathi-api` |
| **Region** | Singapore (closest to Nepal) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Plan** | **Free** |

### 5.2 Add Environment Variables

Scroll down to **Environment Variables** and add these one by one:

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `MONGODB_URI` | Your MongoDB Atlas connection string from Step 2.4 |
| `JWT_SECRET` | Run this in terminal: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `JWT_EXPIRE` | `7d` |
| `RAZORPAY_KEY_ID` | `rzp_test_xxxxxxxxxxxx` (from Step 4) |
| `RAZORPAY_KEY_SECRET` | Your Razorpay key secret |
| `OTP_EXPIRY` | `300000` |

### 5.3 Deploy

1. Click **Create Web Service**
2. Wait for build + deploy (2-5 minutes)
3. When done, you'll see a URL like: `https://gharsathi-api.onrender.com`
4. Test it:

```bash
curl https://gharsathi-api.onrender.com/api/health
```

Expected response:
```json
{"success": true, "message": "GharSathi API is running", "timestamp": "2026-..."}
```

> **Note:** If MongoDB is unreachable, the API will fall back to the in-memory NeDB store with demo data. You'll see `MongoDB not available, using in-memory store` in the logs.

---

## Step 6: Deploy Frontend to Vercel

### 6.1 Import Project

1. Go to [vercel.com](https://vercel.com)
2. Sign in → Click **Add New...** → **Project**
3. Connect your GitHub account
4. Find and select `geeta5634/gharsathi`
5. Configure:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js (auto-detected) |
| **Root Directory** | `frontend` |
| **Build Command** | `next build` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |

> ⚠️ **Important:** Set Root Directory to `frontend` — NOT the repo root.

### 6.2 Add Environment Variables

Click **Environment Variables** and add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://gharsathi-api.onrender.com/api` (from Step 5.3) |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL from Step 3.3 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key from Step 3.3 |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_test_xxxxxxxxxxxx` (from Step 4) |
| `NEXT_PUBLIC_SITE_URL` | `https://gharsathi.vercel.app` |

### 6.3 Deploy

1. Click **Deploy**
2. Wait for build (1-2 minutes)
3. 🎉 **Your site is live at:** `https://gharsathi.vercel.app`

### 6.4 Verify

Open `https://gharsathi.vercel.app` in your browser. You should see:
- Home page with "GharSathi" branding
- Services listed (Plumber, Electrician, etc.)
- Login/Register working (connects to your Render backend)

---

## Step 7: Test the Full Flow

### 7.1 Login Credentials (Demo Data)

| Role | Phone | Password |
|------|-------|----------|
| Admin | `9999999999` | `admin123` |
| Worker | `8888888801` | `worker123` |
| Customer | `7777777701` | `customer123` |

### 7.2 Test Checklist

- [ ] Home page loads with services
- [ ] Click on a service → redirected to login
- [ ] Login as customer (`7777777701` / `customer123`)
- [ ] Browse workers
- [ ] Book a service
- [ ] Login as worker (`8888888801` / `worker123`)
- [ ] See new bookings → accept → start → complete
- [ ] Login as admin (`9999999999` / `admin123`)
- [ ] Dashboard shows stats
- [ ] Manage workers, bookings, services

---

## Step 8: Set Up CI/CD (GitHub Actions)

### 8.1 Generate Vercel Token

1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click **Create** → Name: `gharsathi-github-actions`
3. Copy the token (starts with `qFc...` or similar)

### 8.2 Get Vercel Project & Org IDs

1. In Vercel dashboard, go to your project (`gharsathi`)
2. Go to **Settings** → **General**
3. Copy **Project ID**
4. Copy **Org ID** (from URL or team settings)

OR read from local file:
```bash
cat frontend/.vercel/project.json
```
```json
{"projectId":"prj_Pp4eSyMmBZ0MEKvdjWN6lEyhNtsf","orgId":"team_xqjLCJ3byrHYfrc3WIVwJ00T"}
```

### 8.3 Get Render API Key

1. Go to [dashboard.render.com/account/api-keys](https://dashboard.render.com/account/api-keys)
2. Click **Create API Key** → Name: `gharsathi-github-actions`
3. Copy the key

### 8.4 Get Render Service ID

1. Go to dashboard.render.com
2. Click on your `gharsathi-api` service
3. The URL is: `https://dashboard.render.com/web/srv-xxxxxxxxxxxx`
4. The part after `/web/` is your **Service ID** (`srv-xxxxxxxxxxxx`)

### 8.5 Add Secrets to GitHub

1. Go to your repo: `https://github.com/geeta5634/gharsathi/settings/secrets/actions`
2. Click **New repository secret** and add each one:

| Secret Name | Value |
|-------------|-------|
| `VERCEL_TOKEN` | Your Vercel token from Step 8.1 |
| `VERCEL_ORG_ID` | `team_xqjLCJ3byrHYfrc3WIVwJ00T` |
| `VERCEL_PROJECT_ID` | Vercel Project ID from Step 8.2 |
| `RENDER_API_KEY` | Your Render API key from Step 8.3 |
| `RENDER_SERVICE_ID` | Render Service ID from Step 8.4 |

### 8.6 Push to Trigger Auto-Deploy

```bash
git add .
git commit -m "ci: add production deployment"
git push origin main
```

After push:
1. Go to **Actions** tab in GitHub
2. You'll see the workflow running:
   - `test` → installs deps + builds frontend
   - `deploy-vercel` → deploys frontend to Vercel
   - `deploy-render` → deploys backend to Render
3. Both deploy in parallel after tests pass

---

## Step 9: Set Up Custom Domain

### 9.1 Vercel Domain

1. In Vercel dashboard → your project → **Domains**
2. Enter your domain: e.g., `gharsathi.com`
3. Follow Vercel's instructions to update DNS (add CNAME / nameservers)
4. Wait for DNS propagation (5 minutes to 24 hours)

### 9.2 Update Supabase Site URL

After setting up the custom domain:
1. Go to Supabase → **Authentication** → **Settings**
2. Update **Site URL** to your custom domain: `https://gharsathi.com`
3. Add to **Redirect URLs**: `https://gharsathi.com/**`

### 9.3 Update Vercel Environment Variable

1. In Vercel → your project → **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_SITE_URL` to your custom domain
3. Re-deploy

---

## Step 10: Go Live with Production Keys

### 10.1 Switch to Razorpay Live Keys

1. Complete KYC at razorpay.com
2. Generate live API keys
3. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in:
   - **Render**: Dashboard → Environment
   - **Vercel**: `NEXT_PUBLIC_RAZORPAY_KEY_ID`
4. Re-deploy both services

### 10.2 Enable MongoDB Atlas Production

- Consider upgrading from M0 (free) to M2/M5 ($9-$15/mo) for better performance
- Set up backups (Atlas automated backups)

---

## Step 11: Monitoring

### Render Logs
- Dashboard → `gharsathi-api` → **Logs** tab
- See real-time Node.js logs

### Vercel Analytics
- Dashboard → project → **Analytics** tab
- See page views, errors, performance

### MongoDB Atlas Monitoring
- Dashboard → **Monitoring** tab
- See connections, operations, memory usage

---

## Troubleshooting

### Backend not starting
- Check Render logs: `MongoDB not available, using in-memory store` means connection string is wrong
- Verify `MONGODB_URI` in Render environment variables
- Make sure MongoDB Atlas IP whitelist includes `0.0.0.0/0`

### Frontend shows blank / errors
- Open browser DevTools → Console
- Check if `NEXT_PUBLIC_API_URL` is correct
- CORS issue? Backend Render URL might need trailing `/api`
- Verify all env vars are set in Vercel

### Login not working
- Check `JWT_SECRET` is set in Render
- Verify `RAZORPAY_KEY_ID` is same in both Vercel and Render
- Check Render logs for auth errors

### Supabase errors
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Run the schema again: Supabase → SQL Editor
- If you see "relation does not exist", re-run `schema.sql`

### CI/CD failing
- Check GitHub Actions → click failing job → see error
- Common: missing secrets → go to Settings → Secrets → add missing one
- Vercel token expired → generate new one

---

## Quick Reference: All URLs

| Service | URL |
|---------|-----|
| Live Site | `https://gharsathi.vercel.app` |
| API Health | `https://gharsathi-api.onrender.com/api/health` |
| GitHub Repo | `https://github.com/geeta5634/gharsathi` |
| GitHub Actions | `https://github.com/geeta5634/gharsathi/actions` |
| MongoDB Atlas | `https://cloud.mongodb.com` |
| Supabase | `https://supabase.com/dashboard/project/xxxxx` |
| Razorpay | `https://dashboard.razorpay.com` |
| Vercel | `https://vercel.com/geeta5634/gharsathi` |
| Render | `https://dashboard.render.com/web/srv-xxxxx` |
