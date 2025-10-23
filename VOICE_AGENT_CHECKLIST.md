# AI Voice Agent Setup Checklist

Use this checklist to ensure your AI Voice Agent is properly configured and working.

## 📋 Pre-Launch Checklist

### Phase 1: Vapi Account Setup
- [ ] Created Vapi account at https://vapi.ai
- [ ] Created new AI assistant in Vapi dashboard
- [ ] Configured assistant system prompt
- [ ] Selected voice for assistant
- [ ] Tested assistant in Vapi playground
- [ ] Obtained Public Key (starts with `pk_`)
- [ ] Obtained Assistant ID

### Phase 2: Local Configuration
- [ ] Added `PUBLIC_VAPI_PUBLIC_KEY` to `.env` file
- [ ] Added `PUBLIC_VAPI_ASSISTANT_ID` to `.env` file
- [ ] Restarted development server
- [ ] Confirmed no console errors on startup

### Phase 3: Local Testing
- [ ] Navigate to http://localhost:3000
- [ ] Scroll to Contact section
- [ ] See "Talk to Our AI Agent" button
- [ ] Click button - VoiceAgent interface appears
- [ ] Click "Talk to Our AI Agent" in interface
- [ ] Call connects successfully
- [ ] Can hear AI assistant speaking
- [ ] AI assistant can hear you speaking
- [ ] Mute button works
- [ ] End call button works
- [ ] Call duration timer displays correctly

### Phase 4: Automatic Call Testing
- [ ] Fill out contact form completely
- [ ] Submit form successfully
- [ ] See success message
- [ ] VoiceAgent interface appears after ~2 seconds
- [ ] Call automatically initiates
- [ ] Can interact with AI assistant

### Phase 5: UI Verification
- [ ] AI Voice Agent card appears in Services section
- [ ] Service card links to Contact section
- [ ] All pricing tiers show correct call volumes:
  - [ ] Med Spa Essential Boost: 100 calls/mo
  - [ ] Med Spa Professional Growth: 500 calls/mo
  - [ ] Med Spa Elite Domination: 2000 calls/mo
  - [ ] E-commerce Starter Kit: 100 calls/mo
  - [ ] E-commerce Growth Accelerator: 500 calls/mo
  - [ ] E-commerce Scale-Up Pro: 2000 calls/mo

### Phase 6: Edge Cases
- [ ] Test on Chrome browser
- [ ] Test on Firefox browser
- [ ] Test on Safari browser (if Mac)
- [ ] Test on mobile device
- [ ] Test with microphone denied - error message shows
- [ ] Test with poor internet - graceful handling
- [ ] Test clicking button multiple times - no duplicate calls
- [ ] Test ending call early - cleanup works correctly

### Phase 7: Production Deployment
- [ ] Added environment variables to hosting platform:
  - [ ] `PUBLIC_VAPI_PUBLIC_KEY`
  - [ ] `PUBLIC_VAPI_ASSISTANT_ID`
- [ ] Deployed to production
- [ ] Verified production site loads without errors
- [ ] Tested voice call on production site
- [ ] Tested automatic call trigger on production
- [ ] Confirmed all features work in production

### Phase 8: Monitoring Setup
- [ ] Access Vapi dashboard analytics
- [ ] Set up call volume alerts
- [ ] Configure usage notifications
- [ ] Test webhook integrations (if any)
- [ ] Review call logs
- [ ] Check call quality metrics

### Phase 9: Documentation Review
- [ ] Read `AI_VOICE_AGENT_SUMMARY.md`
- [ ] Review `VAPI_SETUP_QUICKSTART.md`
- [ ] Understand `docs/AI_VOICE_AGENT_INTEGRATION.md`
- [ ] Familiarize with troubleshooting section
- [ ] Bookmark Vapi documentation

### Phase 10: Client Presentation
- [ ] Prepared demo of voice agent
- [ ] Created explanation of pricing tiers
- [ ] Documented call volume limits
- [ ] Prepared ROI calculations
- [ ] Ready to showcase automatic call feature
- [ ] Have backup plan if demo fails

## 🔍 Common Issues & Solutions

### Issue: Call doesn't connect
**Check:**
- [ ] Environment variables are set correctly
- [ ] Public key starts with `pk_`
- [ ] Assistant ID is correct
- [ ] Browser has microphone permission
- [ ] Internet connection is stable

### Issue: No audio from AI
**Check:**
- [ ] Assistant has voice configured in Vapi
- [ ] System volume is not muted
- [ ] Browser audio is not blocked
- [ ] Try different browser

### Issue: AI can't hear user
**Check:**
- [ ] Microphone permission granted
- [ ] Correct microphone selected in browser
- [ ] Microphone not muted
- [ ] Microphone works in other apps

### Issue: Automatic call doesn't trigger
**Check:**
- [ ] Form submission completes successfully
- [ ] Check browser console for errors
- [ ] VoiceAgent component renders
- [ ] Environment variables are accessible

## 📊 Success Metrics

Track these to measure success:
- [ ] Call connection rate > 95%
- [ ] Average call duration 1-3 minutes
- [ ] User satisfaction with AI responses
- [ ] Conversion rate from call to booking
- [ ] Call volume per client per month
- [ ] Cost per successful call
- [ ] ROI per pricing tier

## 🎯 Optimization Tasks

After launch, optimize:
- [ ] Refine assistant prompts based on actual conversations
- [ ] Adjust call timing (currently 2 seconds after form)
- [ ] Add more conversation paths
- [ ] Integrate with CRM system
- [ ] Set up call recording (if needed)
- [ ] Add call transcripts
- [ ] Implement callback scheduling
- [ ] Add multilingual support

## 📞 Support Resources

If you need help:
- [ ] Check `docs/AI_VOICE_AGENT_INTEGRATION.md`
- [ ] Visit https://docs.vapi.ai
- [ ] Join Vapi Discord community
- [ ] Contact Vapi support
- [ ] Review this project's documentation

## ✅ Final Verification

Before going live:
- [ ] All items above are checked
- [ ] Production testing complete
- [ ] Team trained on features
- [ ] Backup plan ready
- [ ] Monitoring in place
- [ ] Documentation accessible
- [ ] Support contacts available

---

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete

**Date Completed**: _______________

**Completed By**: _______________

**Notes**:
_________________________________________
_________________________________________
_________________________________________
