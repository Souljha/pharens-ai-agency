# 🔧 Database Fix - Contact Form Issue

## Issue
The contact form is failing because the `leads` table doesn't exist in your Supabase database yet.

## Quick Fix (5 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `qarwiaturzrknnvaiwgt`
3. Click on **"SQL Editor"** in the left sidebar
4. Click **"New query"**

### Step 2: Run This SQL

Copy and paste this complete SQL script:

```sql
-- Create leads table for contact form submissions
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business TEXT,
  interest TEXT,
  challenge TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);

-- Enable Row Level Security on leads table
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for contact form)
CREATE POLICY "Allow anonymous inserts on leads" ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow authenticated users to read (for admin)
CREATE POLICY "Allow authenticated users to read leads" ON leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Create newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS newsletter_email_idx ON newsletter_subscriptions(email);

-- Enable Row Level Security on newsletter_subscriptions
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for newsletter signup)
CREATE POLICY "Allow anonymous inserts on newsletter" ON newsletter_subscriptions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow authenticated users to read (for admin)
CREATE POLICY "Allow authenticated users to read newsletter" ON newsletter_subscriptions
  FOR SELECT
  TO authenticated
  USING (true);
```

### Step 3: Run the Query

1. Click the **"Run"** button (or press Ctrl+Enter)
2. Wait for "Success. No rows returned" message
3. You should see a green checkmark ✅

### Step 4: Verify Tables Created

1. Click **"Table Editor"** in the left sidebar
2. You should now see two new tables:
   - `leads`
   - `newsletter_subscriptions`

### Step 5: Test Contact Form

1. Go back to your live website: https://pharens-ai-agency.vercel.app
2. Scroll to the Contact section
3. Fill out the form
4. Click "Schedule Free Consultation"
5. You should see a success message! ✅

### Step 6: View Form Submissions

To see form submissions:
1. In Supabase Dashboard
2. Click **"Table Editor"** → **"leads"**
3. You'll see all contact form submissions here!

---

## What This Does

### Creates Two Tables:

**1. `leads` table** (for contact form):
- `id` - Unique identifier
- `name` - Contact's name
- `email` - Contact's email
- `phone` - Contact's phone
- `business` - Business name
- `interest` - Service they're interested in
- `challenge` - Their marketing challenge
- `created_at` - When they submitted

**2. `newsletter_subscriptions` table** (for newsletter):
- `id` - Unique identifier
- `email` - Subscriber's email (unique)
- `subscribed_at` - When they subscribed

### Security Settings:

**Row Level Security (RLS)** is enabled with these policies:
- ✅ Anonymous users can INSERT (submit forms)
- ✅ Authenticated users can SELECT (you can view submissions)
- ❌ Anonymous users CANNOT view other people's submissions

This is secure and follows best practices!

---

## Alternative: Use Supabase Dashboard UI

If you prefer a visual interface:

### Create `leads` table:
1. Go to **Table Editor**
2. Click **"Create a new table"**
3. Name: `leads`
4. Add columns:
   - `id` (uuid, primary key, default: gen_random_uuid())
   - `name` (text, not null)
   - `email` (text, not null)
   - `phone` (text)
   - `business` (text)
   - `interest` (text)
   - `challenge` (text)
   - `created_at` (timestamptz, default: now())
5. Enable RLS
6. Add policy: "Enable insert for anon"

### Create `newsletter_subscriptions` table:
1. Click **"Create a new table"**
2. Name: `newsletter_subscriptions`
3. Add columns:
   - `id` (uuid, primary key, default: gen_random_uuid())
   - `email` (text, not null, unique)
   - `subscribed_at` (timestamptz, default: now())
4. Enable RLS
5. Add policy: "Enable insert for anon"

---

## Troubleshooting

### Error: "relation already exists"
- This is fine! It means the table is already created
- Continue with the form test

### Error: "permission denied"
- Make sure you're running the SQL as the project owner
- Check that you're in the correct project

### Form still not working after setup:
1. Check browser console (F12) for errors
2. Verify environment variables in Vercel are correct
3. Check Supabase URL and key match
4. Try redeploying: `git commit --allow-empty -m "Redeploy" && git push`

---

## After Setup

Once the tables are created, your contact form will:
- ✅ Submit successfully
- ✅ Store data in Supabase
- ✅ Show success message to users
- ✅ Allow you to view all submissions in Supabase dashboard

You can export submissions to CSV anytime from the Table Editor!

---

## Need Help?

If you encounter any issues:
1. Check Supabase logs: Dashboard → Logs
2. Check browser console: F12 → Console tab
3. Verify RLS policies: Table Editor → leads → Policies
4. Test with SQL Editor: `SELECT * FROM leads;`
