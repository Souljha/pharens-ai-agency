# Vapi AI Voice Agent - Quick Setup Guide

This is a quick reference guide for setting up the Vapi AI Voice Agent. For comprehensive documentation, see `docs/AI_VOICE_AGENT_INTEGRATION.md`.

## Prerequisites

- Vapi account (sign up at https://vapi.ai)
- Vapi Public Key
- Vapi Assistant ID

## 5-Minute Setup

### Step 1: Get Your Credentials

1. Log in to your Vapi dashboard
2. Navigate to your assistant settings
3. Copy your **Public Key** (starts with `pk_`)
4. Copy your **Assistant ID**

### Step 2: Configure Environment Variables

Add these to your `.env` file:

```env
PUBLIC_VAPI_PUBLIC_KEY=pk_your_actual_key_here
PUBLIC_VAPI_ASSISTANT_ID=your_assistant_id_here
```

### Step 3: Restart Development Server

```bash
npm run dev
```

### Step 4: Test the Integration

1. Navigate to http://localhost:3000
2. Scroll to the Contact section
3. Click "Talk to Our AI Agent" button
4. OR fill out and submit the contact form to trigger automatic call

## Verify Integration

✅ **Voice Agent button appears** in Contact section
✅ **Clicking button shows call interface**
✅ **Call connects successfully**
✅ **Call controls work** (mute, end call)
✅ **Automatic call triggers** after form submission

## Troubleshooting

### "Failed to initialize voice service"
- Check that environment variables are set correctly
- Verify public key starts with `pk_`
- Restart dev server after adding env variables

### "Failed to start call"
- Verify Assistant ID is correct
- Check Vapi dashboard to ensure assistant is active
- Review browser console for detailed error messages

### Call connects but no audio
- Check browser microphone permissions
- Verify Vapi assistant has voice configured
- Test with a different browser

## Deployment

### Vercel

1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add:
   - `PUBLIC_VAPI_PUBLIC_KEY`
   - `PUBLIC_VAPI_ASSISTANT_ID`
4. Redeploy

### Other Platforms

Follow similar steps to add environment variables in your deployment platform's settings.

## Features Included

✨ **Automatic call triggering** after form submission
✨ **Manual call activation** from Contact section
✨ **Real-time call status** and duration
✨ **Call controls** (mute/unmute, end call)
✨ **Error handling** with user-friendly messages
✨ **Integrated pricing tiers** (100/500/2000 calls/month)
✨ **Service showcase** in Services section

## Next Steps

1. **Customize your AI assistant** in Vapi dashboard
   - Update prompts and personality
   - Configure voice settings
   - Add custom conversation flows

2. **Test different scenarios**
   - Test with different browsers
   - Test on mobile devices
   - Test automatic vs manual triggering

3. **Monitor usage**
   - Check Vapi dashboard for call analytics
   - Track call completion rates
   - Monitor customer feedback

## Support Resources

- **Full Documentation**: `docs/AI_VOICE_AGENT_INTEGRATION.md`
- **Vapi Documentation**: https://docs.vapi.ai
- **Vapi Discord**: Join for community support
- **Project CLAUDE.md**: Architecture overview

## Cost Overview

| Tier | Calls/Month | Your Cost | Client Price | Margin |
|------|-------------|-----------|--------------|--------|
| Starter | 100 | $35 | $99 | ~65% |
| Pro | 500 | $150 | $299 | ~50% |
| Enterprise | 2000 | $600 | $999 | ~40% |

---

**Need help?** Check the full documentation or contact the development team.

**Last Updated**: October 23, 2025
