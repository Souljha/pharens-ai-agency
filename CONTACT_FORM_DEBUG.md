# 🔍 Contact Form Error - Debug Steps

## Quick Diagnosis

Let's figure out what's wrong with the contact form.

### Step 1: Check Browser Console for Detailed Error

1. **Open your live website:** https://pharens-ai-agency.vercel.app
2. **Open Developer Tools:**
   - Press **F12** (or right-click → Inspect)
   - Click on the **"Console"** tab
3. **Try submitting the form again**
4. **Look for error messages** (usually in red)

**Common errors you might see:**
- `new row violates row level security policy`
- `permission denied for table leads`
- `relation "leads" does not exist`
- `Failed to fetch`

**Please share the exact error message from the console!**

---

## Most Likely Issue: RLS Policy Problem

The issue is likely with Row Level Security. Let's fix it properly.

### Solution A: Update RLS Policies (Recommended)

Go to Supabase Dashboard and run this SQL:

```sql
-- First, drop any existing policies that might conflict
DROP POLICY IF EXISTS "Allow anonymous inserts on leads" ON leads;
DROP POLICY IF EXISTS "Allow authenticated users to read leads" ON leads;

-- Create the correct policy for anonymous inserts
CREATE POLICY "Enable insert for anon users" ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy for authenticated users to read
CREATE POLICY "Enable read for authenticated users" ON leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Also fix newsletter table
DROP POLICY IF EXISTS "Allow anonymous inserts on newsletter" ON newsletter_subscriptions;
CREATE POLICY "Enable insert for anon users" ON newsletter_subscriptions
  FOR INSERT
  TO anon
  WITH CHECK (true);
```

### Solution B: Temporarily Disable RLS (Quick Test)

**WARNING: Only for testing!**

To test if RLS is the issue:

```sql
-- Temporarily disable RLS on leads table
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
```

Try the form. If it works, RLS is the issue. Then re-enable it:

```sql
-- Re-enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
```

Then use Solution A to fix the policies properly.

---

## Step 2: Verify Table Structure

Run this in Supabase SQL Editor:

```sql
-- Check if table exists and view structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;

-- Check RLS status
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'leads';

-- Check existing policies
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE tablename = 'leads';
```

Share the results!

---

## Step 3: Check Environment Variables in Vercel

Ensure your Supabase credentials are correct:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Verify these exist:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`

3. Compare with your Supabase dashboard:
   - Go to **Supabase** → **Project Settings** → **API**
   - Check that the URL and anon key match exactly

---

## Step 4: Test Supabase Connection Directly

Run this in Supabase SQL Editor to test insert:

```sql
-- Try inserting test data directly
INSERT INTO leads (name, email, phone, business, interest, challenge)
VALUES ('Test User', 'test@example.com', '+27123456789', 'Test Business', 'Social Media', 'Testing');

-- Check if it was inserted
SELECT * FROM leads ORDER BY created_at DESC LIMIT 5;
```

If this works, the table is fine - it's a permissions issue.

---

## Step 5: Alternative - Use Service Role (Not Recommended for Production)

**Only if nothing else works - less secure:**

1. In Supabase Dashboard → **Settings** → **API**
2. Copy the **service_role** key (not the anon key)
3. Add to Vercel environment variables:
   - Key: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: [paste service role key]

Then update `src/lib/utils/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// For form submissions, you might need to use service role
// Only if RLS policies don't work
export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
```

---

## Most Common Solutions

### Solution 1: Fix RLS Policy (Run in Supabase SQL Editor)

```sql
-- Clear all policies
DROP POLICY IF EXISTS "Allow anonymous inserts on leads" ON leads;
DROP POLICY IF EXISTS "Enable insert for anon users" ON leads;

-- Create fresh policy with correct syntax
CREATE POLICY "anon_insert_leads"
ON leads
FOR INSERT
TO anon
WITH CHECK (true);

-- Verify it was created
SELECT * FROM pg_policies WHERE tablename = 'leads';
```

### Solution 2: Grant Direct Permissions (If RLS doesn't work)

```sql
-- Grant insert permission to anon role
GRANT INSERT ON leads TO anon;
GRANT INSERT ON newsletter_subscriptions TO anon;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
```

---

## Debug Checklist

Before we proceed, please check:

- [ ] Browser console shows the exact error
- [ ] Supabase table `leads` exists (check Table Editor)
- [ ] RLS is enabled on `leads` table
- [ ] Policy exists for anon inserts
- [ ] Supabase URL and key are correct in Vercel
- [ ] Direct SQL insert works in Supabase

---

## Next Steps

Please do this:

1. **Open browser console** (F12) on your live site
2. **Try submitting the form**
3. **Share the exact error message** from console
4. **Run Solution A SQL** (the RLS policy fix)
5. **Try the form again**

Let me know what the console error says and I'll help you fix it immediately!
