# 🔧 Fix Vercel Environment Variables - URGENT

## The Problem

The error "Failed to execute 'set' on 'Headers': Invalid value" means your Supabase keys in Vercel have **quotes** around them, which makes them invalid.

## The Fix (5 minutes)

### Step 1: Go to Vercel Environment Variables

1. Go to: https://vercel.com/dashboard
2. Click on your **"pharens-ai-agency"** project
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in the left sidebar

### Step 2: Update Each Variable (Remove Quotes!)

You'll see your current variables. We need to **edit** them to remove the quotes.

#### Fix PUBLIC_SUPABASE_URL:

1. Find `PUBLIC_SUPABASE_URL`
2. Click the **"..."** menu → **"Edit"**
3. **Current value (WRONG - has quotes):**
   ```
   "https://qarwiaturzrknnvaiwgt.supabase.co"
   ```
4. **Change to (CORRECT - no quotes):**
   ```
   https://qarwiaturzrknnvaiwgt.supabase.co
   ```
5. Click **"Save"**

#### Fix PUBLIC_SUPABASE_ANON_KEY:

1. Find `PUBLIC_SUPABASE_ANON_KEY`
2. Click the **"..."** menu → **"Edit"**
3. **Current value (WRONG - has quotes):**
   ```
   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhcndpYXR1cnpya25udmFpd2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NjUyMzgsImV4cCI6MjA3MDI0MTIzOH0.UZUUyv7xKU8y_XTsNAGl35yEqy5Lt-J9ZIlprwuVnIM"
   ```
4. **Change to (CORRECT - no quotes):**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhcndpYXR1cnpya25udmFpd2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NjUyMzgsImV4cCI6MjA3MDI0MTIzOH0.UZUUyv7xKU8y_XTsNAGl35yEqy5Lt-J9ZIlprwuVnIM
   ```
5. Click **"Save"**

### Step 3: Redeploy

After updating both variables:

1. Go to **"Deployments"** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**

OR just click the **"Redeploy"** button at the top

**Wait 2-3 minutes for deployment to complete.**

### Step 4: Test Contact Form

1. Go to: https://pharens-ai-agency.vercel.app
2. Clear your browser cache (Ctrl + Shift + R or Cmd + Shift + R)
3. Scroll to contact form
4. Fill it out and submit
5. Should work now! ✅

---

## Visual Guide

**WRONG (with quotes):**
```
Variable: PUBLIC_SUPABASE_URL
Value: "https://qarwiaturzrknnvaiwgt.supabase.co"  ❌ Has quotes!
```

**CORRECT (no quotes):**
```
Variable: PUBLIC_SUPABASE_URL
Value: https://qarwiaturzrknnvaiwgt.supabase.co  ✅ No quotes!
```

---

## Alternative: Delete and Re-add Variables

If editing doesn't work, you can delete and recreate:

### Delete Old Variables:
1. Find `PUBLIC_SUPABASE_URL`
2. Click **"..."** → **"Delete"**
3. Confirm deletion
4. Repeat for `PUBLIC_SUPABASE_ANON_KEY`

### Add Fresh Variables (Without Quotes):

**Add Variable 1:**
```
Name: PUBLIC_SUPABASE_URL
Value: https://qarwiaturzrknnvaiwgt.supabase.co
```
✅ Select: Production, Preview, Development
Click **"Save"**

**Add Variable 2:**
```
Name: PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhcndpYXR1cnpya25udmFpd2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NjUyMzgsImV4cCI6MjA3MDI0MTIzOH0.UZUUyv7xKU8y_XTsNAGl35yEqy5Lt-J9ZIlprwuVnIM
```
✅ Select: Production, Preview, Development
Click **"Save"**

Then **Redeploy**.

---

## How to Verify Values Are Correct

### Check in Supabase Dashboard:

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Compare:
   - **Project URL** should match `PUBLIC_SUPABASE_URL` (no quotes)
   - **anon public** key should match `PUBLIC_SUPABASE_ANON_KEY` (no quotes)

### The values should be:
```
URL: https://qarwiaturzrknnvaiwgt.supabase.co
Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhcndpYXR1cnpya25udmFpd2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NjUyMzgsImV4cCI6MjA3MDI0MTIzOH0.UZUUyv7xKU8y_XTsNAGl35yEqy5Lt-J9ZIlprwuVnIM
```

(No quotes, no extra spaces, exact match)

---

## After Fix - Test Again

Once redeployed:

1. ✅ Visit your site
2. ✅ Open browser console (F12)
3. ✅ Submit contact form
4. ✅ Should see success message!
5. ✅ Check Supabase → Table Editor → leads for the entry

---

## Why This Happened

When you copied the values from your `.env` file, they had quotes like:
```
PUBLIC_SUPABASE_URL="https://..."
```

Vercel took the quotes literally, making the actual value:
```
"https://..."  (with the quotes as part of the string!)
```

This causes the HTTP Headers to be invalid because quotes aren't allowed in header values.

**The fix:** Remove the quotes in Vercel (not in your local `.env` file - quotes are fine there).

---

## Summary

**Quick Steps:**
1. Vercel Dashboard → Settings → Environment Variables
2. Edit `PUBLIC_SUPABASE_URL` - remove quotes from value
3. Edit `PUBLIC_SUPABASE_ANON_KEY` - remove quotes from value
4. Redeploy
5. Test form - should work! 🎉

**This should fix your contact form immediately!**
