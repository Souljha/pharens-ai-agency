# Email Notifications Setup Guide

This guide will help you set up automated email notifications for successful payments using Resend.

## Overview

When a payment is successful, your system will automatically send:
1. **Payment confirmation email to the customer** - Beautiful receipt with payment details
2. **New payment notification to you** - Alert with customer details and next actions

---

## Step 1: Create a Resend Account

### 1.1 Sign Up for Resend
1. Go to https://resend.com
2. Click **"Start Building"** or **"Sign Up"**
3. Sign up with your email (or GitHub account)
4. Verify your email address

### 1.2 Why Resend?
- ✅ **3,000 free emails per month** (perfect for starting out)
- ✅ Simple API and great documentation
- ✅ High deliverability rates
- ✅ Beautiful email templates support
- ✅ Works seamlessly with custom domains

---

## Step 2: Get Your API Key

### 2.1 Create API Key
1. Log in to your Resend Dashboard
2. Go to **API Keys** in the sidebar
3. Click **"Create API Key"**
4. Give it a name: "Pharens AI Production" (or "Pharens AI Development")
5. Select permissions: **Full Access** (or "Sending access" if you want to be more restrictive)
6. Click **Create**
7. **Copy the API key** - it starts with `re_`
   - ⚠️ **Important**: Save this immediately! You won't be able to see it again

### 2.2 Add to Environment Variables

**For Development (.env file):**
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**For Production (Vercel):**
1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - Name: `RESEND_API_KEY`
   - Value: `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
5. Select **Production, Preview, and Development**
6. Click **Save**
7. **Redeploy** your application

---

## Step 3: Verify Your Domain (Required for Production)

To send emails from your custom domain (`pharen@pharensaiagency.online`), you need to verify your domain with Resend.

### 3.1 Add Domain to Resend
1. In Resend Dashboard, go to **Domains**
2. Click **"Add Domain"**
3. Enter your domain: `pharensaiagency.online`
4. Click **Add**

### 3.2 Add DNS Records
Resend will show you DNS records to add. You need to add these in **Namecheap**:

**Records you'll need to add** (Resend will show the exact values):

1. **TXT Record** (for SPF):
   ```
   Type: TXT
   Host: @
   Value: v=spf1 include:resend.com ~all
   ```

2. **CNAME Records** (for DKIM, usually 2-3 records):
   ```
   Type: CNAME
   Host: resend._domainkey
   Value: [value from Resend]

   Type: CNAME
   Host: resend1._domainkey
   Value: [value from Resend]
   ```

3. **MX Records** (optional, only if you want to receive emails through Resend):
   - You can skip these since you're already using Zoho for receiving emails

### 3.3 Add Records in Namecheap
1. Log in to Namecheap
2. Go to your domain → **Advanced DNS**
3. Add each record shown by Resend
4. **Important**: Keep your existing Zoho MX records! Don't replace them
5. Save changes

### 3.4 Verify in Resend
1. Go back to Resend Dashboard → **Domains**
2. Click **"Verify"** next to your domain
3. Wait for verification (usually 5-30 minutes, can take up to 48 hours)
4. Once verified, you'll see a green checkmark ✅

---

## Step 4: Test the Email System

### 4.1 Using Test Mode
While your domain is being verified, you can test with Resend's test email address:

1. The emails will be sent from: `onboarding@resend.dev` (Resend's verified domain)
2. Make a test payment on your site
3. Check your inbox for the payment confirmation

### 4.2 After Domain Verification
Once your domain is verified:
1. Emails will be sent from: `noreply@pharensaiagency.online`
2. This looks more professional and builds trust
3. Better deliverability rates

### 4.3 Test Payment Flow
1. Go to your website
2. Click any **"Get Started"** or **"Choose Plan"** button
3. Fill in the payment form with your email
4. Use Paystack test card:
   - Card: `4084 0840 8408 4081`
   - CVV: `408`
   - Expiry: `12/26`
   - PIN: `0000`
5. Complete the payment

### 4.4 Check Your Emails
You should receive **TWO emails**:

**1. Customer Confirmation Email** (sent to the customer email you entered):
- Subject: "Payment Confirmation - [Plan Name]"
- Beautiful receipt with payment details
- Next steps information
- Contact information

**2. Business Notification Email** (sent to pharen@pharensaiagency.online):
- Subject: "New Payment Received - ZAR [Amount]"
- Customer details (name, email, phone)
- Payment details
- Action items for onboarding
- Quick action buttons

---

## Email Templates Overview

### Customer Confirmation Email Includes:
- ✅ Success icon and confirmation message
- ✅ Payment details (plan, amount, date, transaction ID)
- ✅ Next steps (what happens after payment)
- ✅ Contact information (your email and phone)
- ✅ Professional branding (purple theme matching your website)

### Business Notification Email Includes:
- ✅ Alert header with payment amount
- ✅ Customer information (name, email, phone)
- ✅ Payment details
- ✅ Action items checklist for you
- ✅ Quick action buttons (View in Paystack, Email Customer)

---

## Troubleshooting

### Emails Not Sending

**Issue**: No emails are being received

**Solutions**:
1. Check your Resend API key is correctly set in `.env` or Vercel
2. Restart your development server after adding the API key
3. Check Resend Dashboard → **Logs** to see if emails were sent
4. Check spam/junk folders
5. Make sure you've installed the Resend package: `npm install resend`

### Domain Verification Failing

**Issue**: Domain verification in Resend is stuck

**Solutions**:
1. Wait at least 30 minutes after adding DNS records
2. Use DNS checker tool: https://dnschecker.org
3. Make sure DNS records are added exactly as shown by Resend
4. Don't remove your existing Zoho DNS records
5. Contact Resend support if it's been more than 48 hours

### Emails Going to Spam

**Issue**: Emails are landing in spam folders

**Solutions**:
1. **Verify your domain** in Resend (most important!)
2. Add SPF and DKIM records correctly
3. Use your verified domain (`@pharensaiagency.online`) instead of test domain
4. Warm up your domain (send to a few test emails first)
5. Ask recipients to mark as "Not Spam" and add to contacts

### Wrong "From" Address

**Issue**: Emails show wrong sender

**Solutions**:
1. Make sure your domain is verified in Resend
2. Update `src/lib/utils/email.js` if you want different sender:
   ```javascript
   from: 'Your Name <noreply@pharensaiagency.online>'
   ```
3. Can also use: `hello@pharensaiagency.online` or any email from your verified domain

---

## Customizing Email Templates

### Changing Email Content

Edit `src/lib/utils/email.js` to customize:
- Email subject lines
- Email body content
- Colors and styling
- Add your logo
- Change wording

### Adding Your Logo

1. Upload your logo to your website's `static` folder
2. Get the full URL: `https://pharensaiagency.online/logo.png`
3. Add to email template:
   ```html
   <img src="https://pharensaiagency.online/logo.png" alt="Logo" style="width: 150px;">
   ```

### Changing Colors

The emails use your brand colors:
- Primary purple: `#460070`
- Secondary light: `#804297`
- Success green: `#10B981`

Edit these in the HTML templates in `email.js`.

---

## Cost & Limits

### Resend Free Tier:
- ✅ **3,000 emails/month FREE**
- ✅ 100 emails/day
- ✅ 10 MB attachment size
- ✅ Domain verification included
- ✅ Email logs for 30 days

### When to Upgrade:
If you exceed 3,000 emails/month, Resend has affordable paid plans:
- **$20/month**: 50,000 emails
- **$80/month**: 300,000 emails

### Expected Usage:
- Each payment = 2 emails (customer + business)
- 100 payments/month = 200 emails
- You're well within the free tier! ✅

---

## Going Live Checklist

Before switching to live payments:

- [ ] Create Resend account
- [ ] Get API key and add to `.env` and Vercel
- [ ] Add domain to Resend
- [ ] Add DNS records in Namecheap
- [ ] Verify domain in Resend
- [ ] Test with test payment
- [ ] Check both customer and business emails arrive
- [ ] Check emails don't go to spam
- [ ] Switch Paystack to live keys
- [ ] Test with real small payment
- [ ] Monitor Resend Dashboard logs

---

## Monitoring & Analytics

### Check Email Delivery:
1. Go to Resend Dashboard → **Logs**
2. See all sent emails
3. Check delivery status
4. View open rates (if enabled)
5. Debug any issues

### Email Metrics to Track:
- **Sent**: Total emails sent
- **Delivered**: Successfully delivered
- **Bounced**: Failed deliveries
- **Opens**: How many customers opened (optional tracking)

---

## Support

### Resend Support:
- **Documentation**: https://resend.com/docs
- **Support Email**: support@resend.com
- **Discord Community**: https://resend.com/discord

### Need Help?
If you encounter issues:
1. Check Resend Dashboard logs first
2. Verify your DNS records with dnschecker.org
3. Test with a different email address
4. Contact Resend support (they're very responsive!)

---

## Email Examples

### What Customers Will See:
A beautiful, professional email with:
- Purple branding matching your website
- Clear payment details in a table
- Next steps outlined
- Your contact information
- Professional footer

### What You'll Receive:
An alert email with:
- Big green header announcing the payment
- All customer details you need
- Action items checklist
- Quick links to Paystack and email customer
- All info needed to start onboarding

---

## Success! 🎉

Once set up, you'll have:
- ✅ Automatic payment confirmations
- ✅ Instant payment notifications
- ✅ Professional branded emails
- ✅ Better customer experience
- ✅ Streamlined onboarding process

Your customers will love the immediate confirmation, and you'll never miss a payment notification!
