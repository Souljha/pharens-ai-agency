# AI Voice Agent Integration Guide

This document provides comprehensive instructions for setting up and using the Vapi AI Voice Agent integration in the Pharens AI website.

## Overview

The AI Voice Agent is powered by Vapi (https://vapi.ai) and Twilio, providing real-time voice communication capabilities. It automatically calls customers after they submit the contact form to provide immediate service information and answer questions.

## Features

- **24/7 Availability**: AI agent available round-the-clock
- **Automatic Call Triggering**: Initiates calls automatically after contact form submission
- **Manual Activation**: Users can also manually start a voice call
- **Real-time Voice Interaction**: Natural conversation with the AI assistant
- **Call Controls**: Mute/unmute and end call functionality
- **Call Duration Tracking**: Real-time display of call length
- **Service Information**: Provides details about pricing tiers and services

## Pricing Tiers with Call Volumes

### Med Spa Marketing
- **Essential Boost** (R6,500/mo): 100 calls/month
- **Professional Growth** (R12,500/mo): 500 calls/month
- **Elite Domination** (R25,000/mo): 2000 calls/month

### E-commerce Ads
- **Starter Kit** (R5,500/mo): 100 calls/month
- **Growth Accelerator** (R10,500/mo): 500 calls/month
- **Scale-Up Pro** (R18,000/mo): 2000 calls/month

## Setup Instructions

### 1. Get Vapi Credentials

1. Sign up for a Vapi account at https://vapi.ai
2. Create a new AI assistant in the Vapi dashboard
3. Configure your assistant with the appropriate prompts and behavior
4. Note down your:
   - **Public Key** (starts with `pk_`)
   - **Assistant ID** (unique identifier for your assistant)

### 2. Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Vapi credentials to the `.env` file:
   ```env
   PUBLIC_VAPI_PUBLIC_KEY=pk_your_actual_public_key_here
   PUBLIC_VAPI_ASSISTANT_ID=your_actual_assistant_id_here
   ```

3. **Important**: Never commit the `.env` file to version control. It should already be in `.gitignore`.

### 3. Install Dependencies

The Vapi SDK is already installed. If you need to reinstall:

```bash
npm install @vapi-ai/web
```

### 4. Deploy to Production

When deploying to Vercel or another platform:

1. Add the environment variables in your deployment platform's settings:
   - `PUBLIC_VAPI_PUBLIC_KEY`
   - `PUBLIC_VAPI_ASSISTANT_ID`

2. Redeploy your application

## Architecture

### Components

#### 1. **VoiceAgent Component** (`src/lib/components/VoiceAgent.svelte`)
- Main UI component for voice interactions
- Manages call state (idle, connecting, active, ending)
- Provides call controls (mute, end call)
- Displays call duration and status

#### 2. **Vapi Utility** (`src/lib/utils/vapi.js`)
- Handles Vapi SDK initialization
- Provides wrapper functions for common operations
- Manages event listeners and callbacks
- Abstracts Vapi API complexity

#### 3. **UI Stores** (`src/lib/stores/ui.js`)
- Centralized state management for voice calls
- Tracks call status, duration, mute state, and errors
- Provides reactive updates to components

### Integration Points

#### Contact Form Integration
The Voice Agent is integrated into the Contact component (`src/lib/components/Contact.svelte`):

1. **Automatic Trigger**: After successful form submission, the system waits 2 seconds and automatically initiates a voice call
2. **Manual Trigger**: Users can click "Talk to Our AI Agent" button at any time
3. **Smart Prevention**: Prevents duplicate calls if one is already active

#### Service Cards
The AI Voice Agent is featured as a service in the Services section with:
- Dedicated service card highlighting key features
- Direct link to try the agent in the Contact section

#### Pricing Tables
Voice Agent features are included in all pricing tiers:
- Clearly shows call volume limits for each tier
- Differentiates between starter, professional, and enterprise levels

## User Flow

### Automatic Call Flow
1. User fills out and submits contact form
2. Form data is saved to Supabase
3. Success message displays
4. After 2-second delay, Voice Agent component renders
5. Call automatically initiates
6. User receives voice call and can interact with AI

### Manual Call Flow
1. User navigates to Contact section
2. User clicks "Talk to Our AI Agent" button
3. Voice Agent interface appears
4. User clicks "Talk to Our AI Agent" in the interface
5. Call connects and conversation begins

## Customization

### Adjusting Call Timing
To change when the automatic call triggers after form submission, edit `Contact.svelte`:

```javascript
setTimeout(() => {
  triggerAutoCall();
}, 2000); // Change this value (in milliseconds)
```

### Customizing the Assistant
Modify the assistant's behavior in the Vapi dashboard:
- System prompts
- Voice selection
- Language settings
- Conversation flow
- Integration with external APIs

### Styling the Voice Agent
The VoiceAgent component uses TailwindCSS classes. Modify styles in `VoiceAgent.svelte`:
- Button colors and sizes
- Container layouts
- Animation effects
- Icon designs

## Event Handling

The Vapi integration listens to several events:

- **call-start**: Triggered when call successfully connects
- **call-end**: Triggered when call terminates
- **speech-start**: User starts speaking
- **speech-end**: User stops speaking
- **message**: Messages received from the assistant
- **error**: Error occurs during the call
- **volume-level**: Audio volume changes

Add custom handlers in `VoiceAgent.svelte` or `vapi.js` as needed.

## Troubleshooting

### Call Doesn't Start
- Verify environment variables are set correctly
- Check browser console for errors
- Ensure Vapi credentials are valid
- Confirm assistant is active in Vapi dashboard

### Audio Issues
- Check browser permissions for microphone access
- Verify microphone is not muted
- Test with different browsers
- Check Vapi assistant audio settings

### Automatic Call Not Triggering
- Verify form submission completes successfully
- Check browser console for JavaScript errors
- Ensure `PUBLIC_VAPI_ASSISTANT_ID` is configured
- Confirm VoiceAgent component renders after submission

### Environment Variable Not Found
- Ensure variables are prefixed with `PUBLIC_` for client-side access
- Restart development server after adding environment variables
- Verify `.env` file is in the project root
- Check for typos in variable names

## Best Practices

### 1. Test Thoroughly
- Test automatic call triggering
- Test manual call activation
- Verify call controls (mute, end)
- Test on multiple devices and browsers

### 2. Monitor Usage
- Track call volumes per pricing tier
- Monitor call completion rates
- Review conversation quality
- Analyze user feedback

### 3. Optimize Assistant
- Regularly update assistant prompts
- Add new conversation paths
- Improve response accuracy
- Handle edge cases

### 4. User Experience
- Keep call connection times short
- Provide clear status indicators
- Allow easy call termination
- Handle errors gracefully

## Security Considerations

- **API Keys**: Never expose private Vapi keys in client-side code
- **Rate Limiting**: Implement rate limiting to prevent abuse
- **Input Validation**: Validate all form inputs before triggering calls
- **Error Handling**: Never expose sensitive error details to users
- **Privacy**: Inform users about voice recording and data handling

## Cost Management

Based on the tiered model:

| Tier | Calls/Month | Cost | Client Price | Profit Margin |
|------|-------------|------|--------------|---------------|
| Starter | 100 | $35 | $99 | ~65% |
| Pro | 500 | $150 | $299 | ~50% |
| Enterprise | 2000 | $600 | $999 | ~40% |

**Tips:**
- Monitor actual call volumes per client
- Set up alerts for approaching limits
- Consider overage pricing for exceeding limits
- Track ROI for each tier

## Future Enhancements

Potential improvements to consider:

1. **Call Recording**: Save call transcripts for quality assurance
2. **Analytics Dashboard**: Track call metrics and insights
3. **Callback Scheduling**: Allow users to schedule calls for later
4. **Multi-language Support**: Add support for multiple languages
5. **CRM Integration**: Sync call data with CRM systems
6. **SMS Fallback**: Send SMS if call fails
7. **Call Queuing**: Handle multiple simultaneous call requests
8. **Custom Greetings**: Personalize greetings based on form data

## Support

For issues or questions:

1. Check Vapi documentation: https://docs.vapi.ai
2. Review Vapi Discord community
3. Check this documentation
4. Contact the development team

## Changelog

### Version 1.0.0 (2025-10-23)
- Initial AI Voice Agent integration
- Automatic call triggering after form submission
- Manual call activation option
- Call controls (mute, end call)
- Duration tracking
- Service cards and pricing integration
- Comprehensive documentation

---

Last Updated: October 23, 2025
