# Deployment Guide

## Step 1: Create a GitHub Repository

```bash
# Initialize git in the frontend directory
cd frontend
git init
git add .
git commit -m "Initial commit"
```

Create a new repository on GitHub (e.g., `gharsathi`), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/gharsathi.git
git branch -M main
git push -u origin main
```

---

## Step 2: Set Up Supabase

### 2.1 Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **New project**
3. Enter:
   - **Name**: `gharsathi`
   - **Database Password**: Generate a strong password (save it)
   - **Region**: Choose closest to you (e.g., `Singapore` or `Mumbai`)
4. Wait ~2 minutes for the project to provision

### 2.2 Enable Email Auth
1. In your Supabase dashboard, go to **Authentication → Providers**
2. Make sure **Email** is enabled
3. Under **Confirm email** - you can disable this for testing (turn off "Confirm email" toggle)
4. Click **Save**

### 2.3 Run the Database Schema
1. Go to **SQL Editor** in Supabase dashboard
2. Click **New query**
3. Open the file `supabase/schema.sql` from the project
4. Copy the entire contents and paste into the SQL Editor
5. Click **Run** (this creates all tables, RLS policies, seed data, and triggers)

### 2.4 Get API Keys
1. Go to **Project Settings → API**
2. Copy these two values:
   - **Project URL** (looks like `https://xxxxxxxxxxxx.supabase.co`)
   - **anon public key** (looks like `eyJhbGciOiJIUzI1NiIs...`)
3. Keep these for the next step

---

## Step 3: Deploy to Vercel

### 3.1 Connect Repository
1. Go to [vercel.com](https://vercel.com) and sign up/login (use GitHub account)
2. Click **Add New → Project**
3. Import your `gharsathi` GitHub repository
4. Select the `frontend` directory as the **Root Directory**
   - If Vercel doesn't auto-detect, set **Framework Preset** to `Next.js`

### 3.2 Set Environment Variables
In the Vercel project dashboard, go to **Settings → Environment Variables** and add:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon public key |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel domain (e.g., `https://gharsathi.vercel.app`) |

### 3.3 Deploy
1. Click **Deploy**
2. Wait for the build to complete (~2 minutes)
3. Your site will be live at `https://gharsathi.vercel.app`

### 3.4 Custom Domain (Optional)
1. Go to **Project → Settings → Domains**
2. Add your custom domain (e.g., `gharsathi.com`)
3. Update DNS records at your domain provider

---

## Step 4: Verify Deployment

1. Visit your Vercel URL
2. Test signup at `/register` - create a new account
3. Check Supabase **Authentication → Users** to see the new user
4. Test login at `/login`
5. Check Supabase **Table Editor → `profiles`** - the trigger should have created a profile
6. Browse `/listings` to see seed data (if any)
7. Test the contact form at `/contact` - check the `contact_messages` table
8. For admin access, manually set a user's role to `admin` in Supabase Table Editor

---

## Step 5: Set Up Admin Access

1. In Supabase dashboard, go to **Table Editor → `profiles`**
2. Find your user's row
3. Change the `role` column from `customer` to `admin`
4. Save - now that user can access `/admin`

---

## Environment Variables Summary

| Variable | Where to Get It | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project Settings → API | Connects frontend to Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Project Settings → API | Public API key for client |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel domain | Used for OG meta tags |

---

## Troubleshooting

### "Failed to load data" on homepage
- Check that the Supabase tables exist (run schema.sql again)
- Verify environment variables are set correctly in Vercel

### Login/Register not working
- Check that Email auth provider is enabled in Supabase
- If "Confirm email" is on, check the user's email for confirmation link
- Check Supabase Auth logs for errors

### 404 on pages
- Ensure the `NEXT_PUBLIC_SITE_URL` env var matches your actual domain
- Redeploy after changing env vars

### Database errors
- Open Supabase SQL Editor and run `SELECT * FROM information_schema.tables WHERE table_schema = 'public'` to verify tables exist
- Check RLS policies in the schema.sql file
