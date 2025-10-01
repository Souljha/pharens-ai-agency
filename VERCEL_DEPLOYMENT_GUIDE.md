# 🚀 Vercel Deployment Guide - Step by Step

Complete guide to deploy your Pharens AI website to Vercel.

---

## Prerequisites ✅

- [x] Vercel CLI installed (v48.1.6)
- [x] Production build tested and working
- [x] All high-priority issues fixed
- [ ] Vercel account (free tier works fine)
- [ ] Git repository (optional but recommended)

---

## Step-by-Step Deployment

### Step 1: Login to Vercel

First, authenticate with your Vercel account:

```bash
vercel login
```

This will:
- Open your browser
- Ask you to log in with GitHub, GitLab, Bitbucket, or Email
- Authenticate your CLI

### Step 2: Initial Deployment (Preview)

Run this command to create a preview deployment:

```bash
vercel
```

**What this does:**
- Creates a new Vercel project (or links to existing one)
- Asks you configuration questions
- Deploys a preview version
- Gives you a preview URL

**Answer the prompts:**
```
? Set up and deploy "pharens-ai-svelte"? [Y/n] Y
? Which scope do you want to deploy to? [Your Account]
? Link to existing project? [y/N] N
? What's your project's name? pharens-ai-svelte
? In which directory is your code located? ./
```

Vercel will auto-detect SvelteKit and configure everything.

### Step 3: Configure Environment Variables

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to https://vercel.com/dashboard
2. Click on your project (pharens-ai-svelte)
3. Go to Settings > Environment Variables
4. Add these variables:

**Required:**
```
PUBLIC_SUPABASE_URL = your-supabase-url-here
PUBLIC_SUPABASE_ANON_KEY = your-supabase-anon-key-here
```

**Optional but Recommended:**
```
PUBLIC_GA_MEASUREMENT_ID = G-XXXXXXXXXX
```

**Optional (for Ollama):**
```
OLLAMA_BASE_URL = (leave empty or add hosted Ollama URL)
```

5. Select environments: Production, Preview, and Development
6. Click "Save"

**Option B: Via CLI**

```bash
# For production
vercel env add PUBLIC_SUPABASE_URL production
vercel env add PUBLIC_SUPABASE_ANON_KEY production
vercel env add PUBLIC_GA_MEASUREMENT_ID production

# For preview (optional)
vercel env add PUBLIC_SUPABASE_URL preview
vercel env add PUBLIC_SUPABASE_ANON_KEY preview
```

### Step 4: Deploy to Production

Once environment variables are set, deploy to production:

```bash
vercel --prod
```

This will:
- Build your application
- Deploy to production
- Assign your production domain
- Give you the live URL

**Expected output:**
```
🔍 Inspect: https://vercel.com/your-account/pharens-ai-svelte/xxxxxxx
✅ Production: https://pharens-ai-svelte.vercel.app [deployed]
```

---

## Post-Deployment Checklist

### Immediate Testing:

1. **Visit your production URL** and check:
   - [ ] Homepage loads correctly
   - [ ] All sections visible (Hero, Services, About, Pricing, Contact)
   - [ ] Images load properly
   - [ ] Mobile menu works
   - [ ] Animations work

2. **Test Contact Form:**
   - [ ] Fill out all fields
   - [ ] Submit form
   - [ ] Verify success message
   - [ ] Check Supabase database for entry

3. **Test Chatbot:**
   - [ ] Open chatbot
   - [ ] Send a message
   - [ ] Verify response (should use fallback if no Ollama)
   - [ ] Close chatbot

4. **Test on Mobile:**
   - [ ] Open on phone
   - [ ] Check responsive design
   - [ ] Test forms
   - [ ] Test navigation

5. **Check SEO:**
   - [ ] View page source and verify meta tags
   - [ ] Test social share preview: https://www.opengraph.xyz
   - [ ] Verify robots.txt: `https://your-domain/robots.txt`
   - [ ] Verify sitemap: `https://your-domain/sitemap.xml`

### Analytics Setup:

6. **Google Analytics:**
   - [ ] Go to https://analytics.google.com
   - [ ] Create property for your domain
   - [ ] Get Measurement ID (G-XXXXXXXXXX)
   - [ ] Add to Vercel environment variables
   - [ ] Redeploy: `vercel --prod`
   - [ ] Test in Real-Time view

---

## Custom Domain Setup (Optional)

To use your own domain (e.g., pharensai.com):

### Via Vercel Dashboard:

1. Go to your project settings
2. Click "Domains" tab
3. Click "Add Domain"
4. Enter your domain: `pharensai.com`
5. Follow DNS configuration instructions
6. Add these DNS records at your domain registrar:

**For apex domain (pharensai.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

7. Wait for DNS propagation (5-60 minutes)
8. Vercel will auto-issue SSL certificate

### Via CLI:

```bash
vercel domains add pharensai.com
vercel domains add www.pharensai.com
```

---

## Common Issues & Solutions

### Issue: Build Fails

**Error:** "Build failed"

**Solution:**
```bash
# Test build locally first
npm run build

# Check logs in Vercel dashboard
# Go to Deployments > Click failed deployment > View logs
```

### Issue: Environment Variables Not Working

**Error:** "Cannot read Supabase URL"

**Solution:**
- Ensure variables start with `PUBLIC_` for client-side access
- Redeploy after adding variables
- Check variable names match exactly in code

### Issue: Images Not Loading

**Error:** 404 on images

**Solution:**
- Images in `/static` folder should load from root
- Use `/logo.png` not `./logo.png` in code
- Check file names (case-sensitive)

### Issue: 404 on Routes

**Error:** 404 on page refresh

**Solution:**
- Should be fixed by Vercel adapter
- Check `vercel.json` rewrites configuration
- Ensure `@sveltejs/adapter-vercel` is installed

### Issue: Chatbot Not Responding

**Error:** Chatbot loads but doesn't respond

**Solution:**
- This is expected if no Ollama URL configured
- Chatbot should use fallback responses
- Check browser console for errors
- Verify API routes deployed: `https://your-domain/api/chat`

---

## Monitoring & Maintenance

### View Deployment Logs:

```bash
vercel logs pharens-ai-svelte --prod
```

Or via dashboard:
1. Go to project
2. Click "Deployments"
3. Click on a deployment
4. View "Build Logs" and "Function Logs"

### View Analytics:

**Vercel Analytics (Free):**
1. Go to project
2. Click "Analytics" tab
3. View page views, performance metrics

**Google Analytics:**
- Go to https://analytics.google.com
- Select your property
- View Real-Time, Audience, Behavior reports

### Rollback if Needed:

If something breaks:
1. Go to "Deployments" in Vercel dashboard
2. Find previous working deployment
3. Click "..." menu
4. Click "Promote to Production"

Or via CLI:
```bash
vercel rollback
```

---

## Important Reminders

### 🔐 Security (Critical!):

Before deploying, you MUST:
- [ ] Rotate exposed OpenAI API key (see `SECURITY_NOTICE.md`)
- [ ] Verify `.env` is in `.gitignore`
- [ ] Never commit API keys to git
- [ ] Enable Supabase Row Level Security (RLS)

### 📊 After Deployment:

- [ ] Update domain in SEO meta tags if using custom domain
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics property
- [ ] Monitor error logs for first 24 hours
- [ ] Test all forms and features
- [ ] Share with team/stakeholders

---

## Continuous Deployment (Optional)

### Connect to Git Repository:

For automatic deployments on every push:

1. Push your code to GitHub/GitLab/Bitbucket:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/pharens-ai-svelte.git
git push -u origin main
```

2. In Vercel Dashboard:
   - Go to project settings
   - Click "Git"
   - Connect your repository

3. Now every push to `main` branch auto-deploys to production!

**Branch deployments:**
- Push to `main` → Production
- Push to other branches → Preview deployments
- Pull requests → Automatic preview URLs

---

## Cost Estimate

**Vercel Free Tier Includes:**
- 100 GB bandwidth/month
- Serverless function executions
- Unlimited team members
- SSL certificates
- Global CDN
- **Perfect for your use case!**

**Supabase Free Tier Includes:**
- 500 MB database
- 1 GB file storage
- 50,000 monthly active users
- **More than enough to start!**

**Total Monthly Cost:** $0 (using free tiers)

---

## Support & Resources

**Vercel Documentation:**
- https://vercel.com/docs
- https://vercel.com/docs/frameworks/sveltekit

**Troubleshooting:**
- Vercel Community: https://github.com/vercel/vercel/discussions
- SvelteKit Discord: https://svelte.dev/chat

**Need Help?**
- Check deployment logs first
- Search Vercel docs
- Ask in project issues/discussions

---

## Quick Reference Commands

```bash
# Login
vercel login

# Preview deployment
vercel

# Production deployment
vercel --prod

# View logs
vercel logs --prod

# List projects
vercel projects ls

# Remove project
vercel remove pharens-ai-svelte

# View domains
vercel domains ls

# Add environment variable
vercel env add VARIABLE_NAME production
```

---

## 🎉 You're Ready to Deploy!

Follow the steps above and your site will be live in minutes!

**Next steps:**
1. Run `vercel login`
2. Run `vercel` for preview
3. Add environment variables in dashboard
4. Run `vercel --prod` for production
5. Test everything
6. Celebrate! 🎊
