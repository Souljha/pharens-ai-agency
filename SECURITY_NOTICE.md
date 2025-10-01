# 🔐 Security Notice - Action Required Before Deployment

## Critical: API Keys Exposed

Your `.env` file contains sensitive credentials that may have been exposed in version control. Please take immediate action:

### 1. Rotate Exposed API Keys

#### OpenAI API Key
- **Status**: ⚠️ EXPOSED in `.env` file
- **Action**:
  1. Go to https://platform.openai.com/api-keys
  2. Revoke the exposed key: `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`
  3. Generate a new API key
  4. Update your `.env` file with the new key

#### Supabase Keys
- **Status**: ⚠️ Exposed in both `.env` and `.env.example`
- **Note**: The anon key is public-facing and safe to expose, but check if you have Row Level Security (RLS) enabled
- **Action**:
  1. Go to your Supabase project settings
  2. Verify RLS is enabled on all tables
  3. If you've exposed the service role key (not found in current scan), rotate it immediately

### 2. Git History Cleanup

If you've already committed the `.env` file to git:

```bash
# Check if .env is in git history
git log --all --full-history -- .env

# If found, remove from history (WARNING: This rewrites history)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (coordinate with team first!)
git push origin --force --all
```

### 3. Verify .gitignore

The `.gitignore` file has been created and includes `.env`. Verify it's working:

```bash
git status
# .env should NOT appear in untracked files
```

### 4. Environment Variables for Production

For Vercel deployment, set environment variables in the Vercel dashboard:

1. Go to your project on vercel.com
2. Navigate to Settings > Environment Variables
3. Add:
   - `PUBLIC_SUPABASE_URL` (your new Supabase URL)
   - `PUBLIC_SUPABASE_ANON_KEY` (your new anon key)
   - `OPENAI_API_KEY` (your new OpenAI key - optional)
   - `OLLAMA_BASE_URL` (only if using hosted Ollama - optional)

## Deployment Checklist

Before deploying to production:

- [ ] Rotated OpenAI API key
- [ ] Verified Supabase RLS is enabled
- [ ] Removed `.env` from git history (if committed)
- [ ] Verified `.gitignore` is working
- [ ] Set environment variables in Vercel dashboard
- [ ] Tested application with new keys locally
- [ ] Removed this file from repository

## Additional Security Recommendations

1. **Enable Supabase RLS**: Ensure all database tables have Row Level Security policies
2. **Rate Limiting**: Consider implementing rate limiting on API endpoints
3. **CORS Configuration**: Verify CORS settings in Supabase match your domain
4. **Error Logging**: Set up error monitoring (Sentry, LogRocket, etc.)
5. **Regular Audits**: Run `npm audit` regularly and fix vulnerabilities

## Questions?

If you need help with any of these steps, consult:
- Supabase docs: https://supabase.com/docs/guides/auth/row-level-security
- OpenAI security: https://platform.openai.com/docs/guides/safety-best-practices
- Vercel env vars: https://vercel.com/docs/environment-variables
