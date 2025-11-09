# Paystack Payment Integration Setup Guide

This guide will walk you through setting up Paystack payment integration for your Pharens AI Agency application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Paystack Account Setup](#paystack-account-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Webhook Configuration](#webhook-configuration)
6. [Testing](#testing)
7. [Going Live](#going-live)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js and npm installed
- Supabase account and project
- Paystack account (sign up at https://paystack.com)
- Access to your production server/Vercel deployment

## Paystack Account Setup

### 1. Create a Paystack Account

1. Visit https://paystack.com
2. Click "Sign Up" and complete the registration
3. Verify your email address
4. Complete your business profile

### 2. Get Your API Keys

1. Log in to your Paystack Dashboard
2. Navigate to **Settings** > **API Keys & Webhooks**
3. Copy your **Public Key** (starts with `pk_`)
4. Copy your **Secret Key** (starts with `sk_`)
   - **IMPORTANT**: Never expose your secret key in client-side code!

### 3. Test Mode vs Live Mode

- Paystack provides separate keys for testing and production
- Start with **Test Keys** for development
- Switch to **Live Keys** only after thorough testing

## Environment Configuration

### 1. Update Your `.env` File

Copy `.env.example` to `.env` and add your Paystack credentials:

```bash
# Paystack Configuration
PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx  # Use pk_live_ for production
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxx         # Use sk_live_ for production
```

### 2. Verify Environment Variables Are Loaded

The application uses:
- `PUBLIC_PAYSTACK_PUBLIC_KEY` - Client-side payment popup (safe to expose)
- `PAYSTACK_SECRET_KEY` - Server-side verification (keep secret!)

## Database Setup

### 1. Create the Payments Table in Supabase

1. Open your Supabase Dashboard
2. Go to the **SQL Editor**
3. Run the SQL script from `supabase-schema.sql`:

```sql
-- Copy and paste the entire content of supabase-schema.sql
```

This creates:
- `payments` table with proper indexes
- Row Level Security policies
- Automatic timestamp updates
- A view for successful payments

### 2. Verify Table Creation

1. Navigate to **Table Editor** in Supabase
2. Confirm the `payments` table exists with all columns
3. Check that indexes are created

## Webhook Configuration

Webhooks allow Paystack to notify your application about payment events in real-time.

### 1. Deploy Your Application First

You need a live URL for webhooks. Deploy to Vercel or your hosting platform:

```bash
npm run build
# Deploy to Vercel
vercel --prod
```

### 2. Configure Paystack Webhook

1. In Paystack Dashboard, go to **Settings** > **API Keys & Webhooks**
2. Scroll to the **Webhooks** section
3. Add your webhook URL:
   ```
   https://yourdomain.com/api/paystack-webhook
   ```
4. Paystack will send a test webhook to verify the URL

### 3. Webhook Events

Your webhook endpoint handles these events:
- `charge.success` - Payment completed successfully
- `charge.failed` - Payment failed

## Testing

### 1. Test Mode Cards

In test mode, use these Paystack test cards:

**Successful Transaction:**
- Card Number: `4084084084084081`
- CVV: `408`
- Expiry: Any future date
- PIN: `0000`

**Failed Transaction:**
- Card Number: `4084084084084081`
- CVV: `408`
- Expiry: Any future date
- PIN: `1111`

### 2. Test the Payment Flow

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Pricing section
3. Click on any "Get Started" or "Choose Plan" button
4. Fill in the payment form:
   - Use a valid email
   - Use a real phone number format
5. Click "Proceed to Payment"
6. Click "Pay" button to open Paystack popup
7. Use test card details above
8. Verify payment success message

### 3. Verify in Supabase

1. Go to Supabase Table Editor
2. Check the `payments` table
3. Verify your test payment was recorded

### 4. Check Paystack Dashboard

1. Go to **Transactions** in Paystack Dashboard
2. Verify the test transaction appears
3. Check the transaction details match your test

## Going Live

### 1. Complete Paystack Business Verification

Before going live, complete:
- Business verification
- Bank account setup
- Settlement preferences

### 2. Switch to Live API Keys

1. Get your live API keys from Paystack Dashboard
2. Update your production environment variables:
   ```bash
   PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx
   PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxx
   ```

3. Update in Vercel (if using):
   - Go to Vercel Dashboard
   - Navigate to your project > Settings > Environment Variables
   - Update the Paystack variables
   - Redeploy your application

### 3. Update Webhook to Live Mode

1. In Paystack Dashboard, switch to **Live Mode**
2. Add your production webhook URL
3. Verify the webhook is working

### 4. Test with Real Card

Before announcing to customers:
1. Make a real test purchase with a real card
2. Verify payment is processed
3. Check funds appear in your Paystack balance
4. Test refund process (if needed)

## Pricing Plans

The integration supports all your pricing tiers:

**Med Spa Marketing:**
- Essential Boost: R6,500/month
- Professional Growth: R12,500/month
- Elite Domination: R25,000/month

**E-commerce:**
- Starter Kit: R5,500/month
- Growth Accelerator: R10,500/month
- Scale-Up Pro: R18,000/month

## Security Best Practices

1. **Never expose your Secret Key**
   - Keep it in environment variables only
   - Never commit it to version control
   - Rotate keys if accidentally exposed

2. **Verify Webhook Signatures**
   - The webhook endpoint verifies Paystack's signature
   - This prevents fraudulent webhook calls

3. **Use HTTPS Only**
   - Paystack requires HTTPS for webhooks
   - Ensure your domain has a valid SSL certificate

4. **Monitor Transactions**
   - Regularly check Paystack Dashboard
   - Set up email alerts for payments
   - Review failed transactions

## Troubleshooting

### Payment Modal Not Opening

**Issue**: Clicking "Get Started" doesn't open payment modal

**Solutions**:
1. Check browser console for errors
2. Verify `PUBLIC_PAYSTACK_PUBLIC_KEY` is set
3. Ensure svelte-paystack is installed:
   ```bash
   npm install svelte-paystack
   ```

### Payment Verification Failed

**Issue**: Payment completes but shows "verification failed"

**Solutions**:
1. Check API endpoint is accessible: `/api/verify-payment`
2. Verify `PAYSTACK_SECRET_KEY` is set correctly
3. Check server logs for errors
4. Ensure webhook URL is configured in Paystack

### Webhook Not Receiving Events

**Issue**: Payments don't appear in database

**Solutions**:
1. Verify webhook URL in Paystack Dashboard
2. Check URL is publicly accessible (use https://webhook.site to test)
3. Ensure `/api/paystack-webhook` endpoint is deployed
4. Check Supabase RLS policies allow inserts

### Database Insert Errors

**Issue**: "Permission denied" or insert fails

**Solutions**:
1. Verify `payments` table exists in Supabase
2. Check RLS policies allow public inserts
3. Verify Supabase credentials in environment variables
4. Check column names match exactly

### "Invalid Public Key" Error

**Issue**: Paystack shows "Invalid public key"

**Solutions**:
1. Ensure you're using the correct key format (pk_test_ or pk_live_)
2. Check for extra spaces in environment variable
3. Restart development server after changing .env
4. Verify key is from the correct Paystack account

## Support and Resources

- **Paystack Documentation**: https://paystack.com/docs
- **Paystack Support**: support@paystack.com
- **Supabase Documentation**: https://supabase.com/docs
- **SvelteKit Documentation**: https://kit.svelte.dev/docs

## Architecture Overview

```
User clicks "Get Started"
    ↓
Payment Modal opens (PaymentModal.svelte)
    ↓
User fills form (name, email, phone)
    ↓
Paystack popup opens (svelte-paystack)
    ↓
User enters card details
    ↓
Paystack processes payment
    ↓
Payment verified (/api/verify-payment)
    ↓
Webhook receives confirmation (/api/paystack-webhook)
    ↓
Payment stored in Supabase
    ↓
Success message shown to user
```

## Files Modified/Created

- `src/lib/utils/paystack.js` - Payment utility functions
- `src/lib/components/PaymentModal.svelte` - Payment modal component
- `src/lib/stores/ui.js` - Payment state management (added)
- `src/lib/components/Pricing.svelte` - Updated with payment buttons
- `src/routes/api/verify-payment/+server.js` - Payment verification endpoint
- `src/routes/api/paystack-webhook/+server.js` - Webhook handler
- `supabase-schema.sql` - Database schema
- `.env.example` - Environment variables template

## Next Steps

1. Set up your Paystack account
2. Add API keys to `.env`
3. Run the Supabase SQL schema
4. Test in development mode
5. Deploy to production
6. Configure webhook
7. Switch to live keys
8. Monitor your first transactions!

---

**Need Help?** If you encounter issues not covered here, check:
1. Browser console for client-side errors
2. Server logs for backend errors
3. Paystack Dashboard for transaction details
4. Supabase logs for database issues
