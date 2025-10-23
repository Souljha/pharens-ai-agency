# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run SvelteKit sync and type checking
- `npm run check:watch` - Run type checking in watch mode

## Project Architecture

This is a SvelteKit application for Pharens AI Agency, a beauty industry marketing website. The project follows SvelteKit's file-based routing and component architecture.

### Key Structure
- **Routes**: Single-page application with all content on the homepage (`src/routes/+page.svelte`)
- **Components**: Modular sections in `src/lib/components/` (Header, Hero, Services, About, Pricing, Contact, Footer, VoiceAgent)
- **State Management**: Svelte stores in `src/lib/stores/ui.js` for UI state (mobile menu, form states, active service tabs, voice call state)
- **Backend Integration**: Supabase client in `src/lib/utils/supabase.js` for contact form and newsletter subscriptions
- **AI Voice Agent**: Vapi integration in `src/lib/utils/vapi.js` for voice communication features

### Data Flow
- Contact forms submit to Supabase `leads` table
- Newsletter subscriptions go to `newsletter_subscriptions` table
- UI state managed through centralized Svelte stores
- Form states include loading, success, and error handling
- Voice Agent automatically triggers after successful form submission
- Voice call state managed through dedicated stores (call status, duration, mute state)

### Styling & Theming
- TailwindCSS with custom theme configuration
- Brand colors: primary (#460070), secondary-dark (#532969), secondary-light (#804297)
- Custom fonts: Poppins (sans), Lora (serif)
- Custom animations: fade-in, slide-up

### Environment Setup
- Requires Supabase environment variables: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`
- Requires Vapi credentials: `PUBLIC_VAPI_PUBLIC_KEY`, `PUBLIC_VAPI_ASSISTANT_ID`
- Configured for Vercel deployment with SPA routing
- Development server runs on localhost:3000 with host access enabled

### Component Architecture
Components are self-contained sections of the landing page, each handling their own state and interactions. The main page orchestrates all components in sequence to create the marketing website flow.

### AI Voice Agent Integration
- **VoiceAgent Component** (`src/lib/components/VoiceAgent.svelte`): Handles real-time voice interactions with Vapi AI
- **Automatic Triggering**: Initiates voice call 2 seconds after successful contact form submission
- **Manual Activation**: Users can manually trigger voice calls from the Contact section
- **Call Features**: Real-time status, duration tracking, mute/unmute, call controls
- **Pricing Tiers**: Integrated across all service packages with call volume limits (100/500/2000 calls per month)
- **Documentation**: See `docs/AI_VOICE_AGENT_INTEGRATION.md` for detailed setup and usage instructions

### Services & Pricing
The application offers three main service categories:
1. **Medical Aesthetic Clinics**: Targeted patient acquisition and booking automation
2. **Beauty E-commerce Brands**: Full-funnel ad campaigns and creative optimization
3. **AI Voice Agent**: 24/7 automated voice communication for inquiries and booking

Each service has three pricing tiers (Starter/Pro/Enterprise) with varying feature sets and AI Voice Agent call volumes.