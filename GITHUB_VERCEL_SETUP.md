# 🚀 GitHub & Vercel Setup Guide

Complete guide to push your code to GitHub and connect it to Vercel for automatic deployments.

---

## ✅ What We've Done So Far

- [x] Initialized Git repository
- [x] Created `.gitignore` (protects your `.env` file)
- [x] Created initial commit with all code
- [x] Confirmed `.env` is NOT being tracked by Git (your API keys are safe!)

---

## Step 1: Create GitHub Repository

### Option A: Using GitHub Website (Recommended)

1. **Go to GitHub** and log in: https://github.com

2. **Create New Repository:**
   - Click the "+" icon in top right
   - Select "New repository"

3. **Repository Settings:**
   ```
   Repository name: pharens-ai-website
   Description: AI-powered marketing website for beauty industry - Pharens AI Agency
   Visibility: Private (recommended) or Public

   ⚠️ IMPORTANT: Do NOT initialize with README, .gitignore, or license
   (We already have these files!)
   ```

4. **Click "Create repository"**

5. **Copy the repository URL** shown on the next page
   - It will look like: `https://github.com/YOUR-USERNAME/pharens-ai-website.git`

### Option B: Using GitHub Desktop

1. Download GitHub Desktop: https://desktop.github.com
2. Sign in with your GitHub account
3. File > Add Local Repository
4. Select your project folder
5. Click "Publish repository"

---

## Step 2: Push Code to GitHub

Once you have your repository URL from Step 1, run these commands:

```bash
# Add GitHub as remote (replace with YOUR repository URL)
git remote add origin https://github.com/YOUR-USERNAME/pharens-ai-website.git

# Push code to GitHub
git push -u origin main
```

**Example with actual username:**
```bash
git remote add origin https://github.com/pharensai/pharens-ai-website.git
git push -u origin main
```

**If prompted for credentials:**
- Use your GitHub username
- Use a **Personal Access Token** as password (not your GitHub password)
  - Get token at: https://github.com/settings/tokens
  - Select scope: `repo` (full control of private repositories)

---

## Step 3: Connect Repository to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel:** https://vercel.com/dashboard

2. **Import Project:**
   - Click "Add New..." button
   - Select "Project"

3. **Import Git Repository:**
   - Click "Continue with GitHub"
   - Authorize Vercel to access your GitHub
   - Select "pharens-ai-website" repository
   - Click "Import"

4. **Configure Project:**
   ```
   Project Name: pharens-ai-website
   Framework Preset: SvelteKit (auto-detected)
   Root Directory: ./
   Build Command: npm run build (auto-detected)
   Output Directory: (leave as default)
   Install Command: npm install (auto-detected)
   ```

5. **Add Environment Variables:**

   **Before deploying, click "Environment Variables" and add:**

   **Required:**
   ```
   PUBLIC_SUPABASE_URL = https://qarwiaturzrknnvaiwgt.supabase.co
   PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhcndpYXR1cnpya25udmFpd2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NjUyMzgsImV4cCI6MjA3MDI0MTIzOH0.UZUUyv7xKU8y_XTsNAGl35yEqy5Lt-J9ZIlprwuVnIM
   ```

   **Optional but Recommended:**
   ```
   PUBLIC_GA_MEASUREMENT_ID = (your Google Analytics ID)
   ```

   Select environments: **Production, Preview, Development**

6. **Click "Deploy"**

   Vercel will:
   - Clone your repository
   - Install dependencies
   - Build your project
   - Deploy to production
   - Give you a live URL!

### Option B: Via Vercel CLI

```bash
# Login to Vercel
vercel login

# Link to GitHub repository
vercel link

# Add environment variables
vercel env add PUBLIC_SUPABASE_URL production
vercel env add PUBLIC_SUPABASE_ANON_KEY production

# Deploy
vercel --prod
```

---

## Step 4: Verify Deployment

Once deployment completes (usually 2-3 minutes):

1. **Visit your production URL:** `https://pharens-ai-website.vercel.app`

2. **Test Everything:**
   - [ ] Homepage loads
   - [ ] All images display
   - [ ] Navigation works
   - [ ] Contact form submits (check Supabase)
   - [ ] Chatbot responds
   - [ ] Mobile responsive
   - [ ] No console errors

3. **Check Deployment Logs:**
   - Go to Vercel dashboard
   - Click your project
   - Click "Deployments"
   - Click latest deployment
   - Review build and function logs

---

## Step 5: Automatic Deployments (The Magic!)

Now that GitHub is connected to Vercel, every time you push code:

**Main Branch:**
```bash
git add .
git commit -m "Update homepage design"
git push origin main
```
→ **Automatically deploys to PRODUCTION** 🚀

**Other Branches:**
```bash
git checkout -b feature/new-service
git add .
git commit -m "Add new service section"
git push origin feature/new-service
```
→ **Automatically creates a PREVIEW deployment** 🔍

**Pull Requests:**
- Create PR on GitHub
- Vercel automatically comments with preview URL
- Test changes before merging
- Merge PR → Auto-deploys to production!

---

## Workflow Benefits

### Before (Manual):
1. Make changes
2. Run `vercel --prod`
3. Wait for deployment
4. Hope nothing breaks

### After (Automated):
1. Make changes
2. `git push`
3. ✨ **Automatic deployment!**
4. Preview URLs for testing
5. Rollback with one click if needed

---

## Managing Your Project

### Update Code (Local → GitHub → Vercel):
```bash
# Make your changes to files

# Stage changes
git add .

# Commit with message
git commit -m "Add new feature"

# Push to GitHub (triggers auto-deploy)
git push origin main
```

### Create Feature Branch:
```bash
# Create new branch
git checkout -b feature/pricing-update

# Make changes, commit
git add .
git commit -m "Update pricing tiers"

# Push branch (creates preview deployment)
git push origin feature/pricing-update

# Create Pull Request on GitHub
# Review preview deployment
# Merge when ready → auto-deploys to production
```

### Update Environment Variables:
```bash
# Via dashboard (recommended):
# Vercel Dashboard → Project → Settings → Environment Variables

# Or via CLI:
vercel env add VARIABLE_NAME production
vercel env rm VARIABLE_NAME production
```

### View Logs:
```bash
# Deployment logs
vercel logs --prod

# Or in dashboard:
# Project → Deployments → Click deployment → View logs
```

### Rollback Deployment:
```bash
# Via dashboard (easiest):
# Project → Deployments → Find working version → "..." → Promote to Production

# Or via CLI:
vercel rollback
```

---

## Custom Domain Setup

Once deployed, add your custom domain:

1. **In Vercel Dashboard:**
   - Go to Project → Settings → Domains
   - Click "Add Domain"
   - Enter: `pharensai.com` and `www.pharensai.com`

2. **In Your Domain Registrar** (e.g., Namecheap, GoDaddy):

   Add these DNS records:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: Automatic

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: Automatic
   ```

3. **Wait for DNS propagation** (5-60 minutes)

4. **Vercel auto-issues SSL certificate** ✅

---

## Monitoring & Analytics

### Vercel Analytics (Built-in):
- Go to Project → Analytics
- View page views, performance metrics
- Track Core Web Vitals
- Free on all plans!

### Google Analytics:
1. Create GA4 property: https://analytics.google.com
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to Vercel environment variables:
   ```
   PUBLIC_GA_MEASUREMENT_ID = G-XXXXXXXXXX
   ```
4. Redeploy or wait for next push
5. View real-time data in GA dashboard

### Error Monitoring:
- Check Vercel function logs
- Set up error tracking (Sentry recommended)
- Monitor Supabase dashboard for database errors

---

## Troubleshooting

### Issue: Git Push Fails

**Error:** "Permission denied"

**Solution:**
```bash
# Use HTTPS with Personal Access Token
# Get token at: https://github.com/settings/tokens
# Use token as password when prompted
```

### Issue: Deployment Fails on Vercel

**Solution:**
1. Check build logs in Vercel dashboard
2. Ensure `npm run build` works locally
3. Verify environment variables are set
4. Check Node.js version compatibility

### Issue: Environment Variables Not Working

**Solution:**
1. Ensure variable names start with `PUBLIC_` for client-side
2. Redeploy after adding variables
3. Clear build cache in Vercel settings
4. Verify variables in Project → Settings → Environment Variables

### Issue: Changes Not Deploying

**Solution:**
```bash
# Check if push was successful
git log --oneline

# Check Vercel deployments
# Dashboard → Project → Deployments
# Should see new deployment for each push

# Force new deployment
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

---

## Security Best Practices

### ✅ Current Security:
- [x] `.env` in `.gitignore` (API keys protected)
- [x] Supabase RLS enabled
- [x] OpenAI key rotated
- [x] Environment variables in Vercel (not in code)

### 🔒 Additional Recommendations:
- [ ] Enable 2FA on GitHub account
- [ ] Use deploy hooks for sensitive operations
- [ ] Regularly rotate API keys
- [ ] Monitor Vercel deployment logs
- [ ] Set up branch protection rules on GitHub
- [ ] Review Supabase auth policies

---

## Cost Breakdown

**GitHub:**
- Private repositories: FREE (unlimited)
- Public repositories: FREE

**Vercel:**
- Free tier includes:
  - 100 GB bandwidth/month
  - Serverless functions
  - SSL certificates
  - Custom domains
  - Automatic deployments

**Total Monthly Cost: $0** (using free tiers) 🎉

---

## Quick Reference Commands

```bash
# Clone repository (on another machine)
git clone https://github.com/YOUR-USERNAME/pharens-ai-website.git
cd pharens-ai-website
npm install

# Update code
git add .
git commit -m "Your message"
git push origin main

# Create feature branch
git checkout -b feature/name
git push origin feature/name

# Switch branches
git checkout main
git checkout feature/name

# Pull latest changes
git pull origin main

# View commit history
git log --oneline

# View remote URL
git remote -v
```

---

## 🎉 You're All Set!

With GitHub and Vercel connected:
- ✅ Code is safely backed up on GitHub
- ✅ Every push automatically deploys
- ✅ Preview deployments for testing
- ✅ One-click rollbacks
- ✅ Collaboration ready
- ✅ Professional workflow

**Next: Push your code to GitHub and watch the magic happen!**
