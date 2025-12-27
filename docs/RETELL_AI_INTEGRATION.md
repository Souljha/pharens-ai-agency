# Retell AI Voice Agent Integration Guide

This document explains how the Retell AI Voice Agent is integrated into the Pharens AI website for Udemy course demonstration purposes.

## Overview

The Retell AI widget provides a floating "Call Me Back" button that allows website visitors to request a callback from an AI voice agent. This integration demonstrates:

- How to embed third-party voice AI widgets into modern web applications
- Running multiple voice AI services (Vapi + Retell) simultaneously without conflicts
- Environment-based configuration for easy enable/disable
- Best practices for temporary/demonstration integrations

## Architecture

### Components

1. **RetellWidget.svelte** (`src/lib/components/RetellWidget.svelte`)
   - Dynamically loads the Retell widget script
   - Uses environment variables for configuration
   - Can be easily enabled/disabled
   - Runs independently from the Vapi integration

2. **Environment Configuration** (`.env` file)
   - Stores Retell credentials securely
   - Allows quick toggling via `PUBLIC_RETELL_ENABLED` flag

3. **Layout Integration** (`src/routes/+layout.svelte`)
   - Widget loads globally across all pages
   - Appears as floating button in bottom-right corner

## Setup Instructions

### Step 1: Get Your Retell Credentials

1. Sign up at [retellai.com](https://retellai.com)
2. Create a new agent in the Retell dashboard
3. Generate a Public API Key (important: not a Secret Key!)
4. Copy your Agent ID from the dashboard URL (e.g., `agent_b3e69fc167353d5120093847e`)
5. Configure your Retell phone number for callbacks

### Step 2: Configure Environment Variables

Open your `.env` file and add:

```env
# Retell AI Voice Agent Configuration
PUBLIC_RETELL_PUBLIC_KEY=key_xxxxxxxxxxxxxxxxxxxxx
PUBLIC_RETELL_AGENT_ID=agent_b3e69fc167353d5120093847e
PUBLIC_RETELL_PHONE_NUMBER=+15550000000
PUBLIC_RETELL_WIDGET_TITLE=Talk to Sarah
PUBLIC_RETELL_ENABLED=true
```

**Important Configuration Notes:**

- `PUBLIC_RETELL_PUBLIC_KEY`: Your public API key from Retell (starts with `key_...`)
- `PUBLIC_RETELL_AGENT_ID`: Your agent ID (starts with `agent_...`)
- `PUBLIC_RETELL_PHONE_NUMBER`: Your Retell phone number in E.164 format (e.g., `+15550000000`)
- `PUBLIC_RETELL_WIDGET_TITLE`: Custom text for the widget button (e.g., "Talk to Sarah", "Call Me Back")
- `PUBLIC_RETELL_ENABLED`: Set to `true` to show the widget, `false` to hide it

### Step 3: Restart Your Development Server

After updating the `.env` file, restart your dev server:

```bash
npm run dev
```

The Retell widget should now appear as a floating button in the bottom-right corner of your website.

## How It Works

### Widget Type: "Call Me Back"

The integration uses Retell's "callback" widget type, which:

1. Shows a floating button on your website
2. When clicked, prompts the user to enter their phone number
3. Initiates an outbound AI phone call to the user's number
4. The AI agent (configured in your Retell dashboard) handles the conversation

This is perfect for demonstrating:
- Outbound calling capabilities
- Lead capture through voice
- Integration with n8n workflows (covered in your course)

### Comparison with Vapi Integration

| Feature | Vapi (Existing) | Retell (New) |
|---------|----------------|--------------|
| **Type** | Web-based voice calls | Phone-based callbacks |
| **Integration** | Custom React-like component | Simple script widget |
| **Trigger** | Auto-triggers after form submission + manual button | Manual floating button |
| **Use Case** | Immediate web conversations | Scheduled/callback conversations |
| **Complexity** | Higher (full SDK integration) | Lower (simple embed) |
| **Course Demo** | Advanced integration example | Quick embed example |

## Usage for Your Udemy Course

### For Course Demonstrations:

1. **Enable the widget** before recording:
   ```env
   PUBLIC_RETELL_ENABLED=true
   ```

2. **Show students**:
   - How to get Retell credentials
   - How to configure environment variables
   - How the floating widget appears and works
   - How users request callbacks

3. **Demonstrate n8n integration** (covered in your course):
   - Show webhook triggers from Retell
   - Process callback requests through n8n
   - Send data to CRM/database

### After Course Recording:

**To disable** the widget (while keeping Vapi active):
```env
PUBLIC_RETELL_ENABLED=false
```

**To completely remove** (if using Retell permanently for outbound only):
1. Keep the component for outbound calling
2. Just toggle `PUBLIC_RETELL_ENABLED` as needed

## Testing Both Voice Agents

### Testing Scenario:

1. **Vapi (Web Call)**:
   - Fill out the contact form on the homepage
   - Wait 2 seconds - Vapi auto-triggers
   - Or click "Talk to Our AI Agent" in the Contact section
   - Speak directly through your browser

2. **Retell (Phone Callback)**:
   - Click the floating Retell button (bottom-right)
   - Enter your phone number
   - Receive a callback from the AI agent
   - Conversation happens over the phone

Both can run simultaneously without conflicts!

## Troubleshooting

### Widget Not Appearing?

1. **Check `.env` file**:
   - Is `PUBLIC_RETELL_ENABLED=true`?
   - Are all credentials filled in correctly?
   - Did you restart the dev server after changes?

2. **Check browser console**:
   - Look for: "Retell AI Widget loaded successfully"
   - Or: "Retell widget is disabled..." messages

3. **Verify credentials**:
   - Public key should start with `key_`
   - Agent ID should start with `agent_`
   - Phone number should be in E.164 format (`+1...`)

### Widget Appearing But Not Working?

1. **Check Retell dashboard**:
   - Is your agent configured correctly?
   - Is your phone number verified?
   - Do you have calling credits?

2. **Check browser permissions**:
   - Some browsers block third-party scripts
   - Try in Chrome/Firefox

## File Structure

```
pharens-ai-svelte/
├── src/
│   ├── lib/
│   │   └── components/
│   │       ├── RetellWidget.svelte     # Retell widget component
│   │       └── VoiceAgent.svelte       # Existing Vapi component
│   └── routes/
│       └── +layout.svelte              # Layout includes RetellWidget
├── docs/
│   ├── RETELL_AI_INTEGRATION.md        # This file
│   └── AI_VOICE_AGENT_INTEGRATION.md   # Vapi integration docs
└── .env.example                         # Example config with Retell vars
```

## Removing the Integration

When your course demonstration is complete and you want to remove Retell:

### Option 1: Just Disable (Recommended)
```env
PUBLIC_RETELL_ENABLED=false
```
This keeps the code but hides the widget.

### Option 2: Complete Removal

1. Remove from layout:
   ```svelte
   // src/routes/+layout.svelte
   // Remove: import RetellWidget from '$lib/components/RetellWidget.svelte';
   // Remove: <RetellWidget />
   ```

2. Delete files:
   ```bash
   rm src/lib/components/RetellWidget.svelte
   rm docs/RETELL_AI_INTEGRATION.md
   ```

3. Clean up `.env`:
   ```
   # Remove all PUBLIC_RETELL_* variables
   ```

## Best Practices for Course Teaching

1. **Start with the simple approach** (Retell widget):
   - Show how easy it is to embed
   - Just copy/paste script tag
   - Great for beginners

2. **Progress to advanced integration** (Vapi SDK):
   - Show full programmatic control
   - Custom UI/UX
   - Event handling

3. **Explain the tradeoffs**:
   - Widget = Fast but limited customization
   - SDK = More work but full control

4. **Live demonstration**:
   - Test both on your actual website
   - Show real conversations
   - Debug issues in real-time (great teaching moments!)

## Support

For Retell-specific issues:
- Documentation: https://docs.retellai.com
- Dashboard: https://dashboard.retellai.com
- Support: support@retellai.com

For integration issues with this codebase:
- Check browser console for errors
- Verify environment variables
- Test with minimal configuration first

---

**Note**: This integration is designed for flexibility - perfect for course demonstrations, A/B testing, or running multiple voice AI services for different use cases (web vs. phone).
