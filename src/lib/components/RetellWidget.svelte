<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import {
    PUBLIC_RETELL_PUBLIC_KEY,
    PUBLIC_RETELL_AGENT_ID,
    PUBLIC_RETELL_PHONE_NUMBER,
    PUBLIC_RETELL_WIDGET_TITLE,
    PUBLIC_RETELL_ENABLED
  } from '$env/static/public';

  /**
   * Retell AI Widget Component
   *
   * This component loads the Retell AI floating "Call Me Back" widget.
   * Perfect for course demonstrations and temporary integrations.
   *
   * Features:
   * - Floating button in bottom-right corner
   * - "Call Me Back" functionality - users enter their number and AI calls them
   * - Easy to enable/disable via environment variables
   * - Runs alongside existing Vapi integration without conflicts
   *
   * To enable: Set PUBLIC_RETELL_ENABLED=true in your .env file
   * To disable: Set PUBLIC_RETELL_ENABLED=false or remove from .env
   */

  // Only load if enabled and we have the required credentials
  const isEnabled = PUBLIC_RETELL_ENABLED === 'true';
  const hasCredentials = PUBLIC_RETELL_PUBLIC_KEY &&
                         PUBLIC_RETELL_AGENT_ID &&
                         PUBLIC_RETELL_PHONE_NUMBER &&
                         PUBLIC_RETELL_PUBLIC_KEY !== 'your-retell-public-key-here';

  onMount(() => {
    if (!browser || !isEnabled || !hasCredentials) {
      if (!isEnabled) {
        console.log('Retell widget is disabled. Set PUBLIC_RETELL_ENABLED=true to enable.');
      } else if (!hasCredentials) {
        console.warn('Retell widget is enabled but missing credentials. Please check your .env file.');
      }
      return;
    }

    // Check if script already exists
    if (document.getElementById('retell-widget')) {
      console.log('Retell widget script already loaded');
      return;
    }

    try {
      // Add custom CSS to position widget next to chatbot
      const style = document.createElement('style');
      style.id = 'retell-widget-positioning';
      style.innerHTML = `
        /* Position Retell widget to the left of chatbot */
        #retell-fab,
        .retell-fab {
          right: 100px !important;
          bottom: 24px !important;
        }
      `;
      document.head.appendChild(style);

      // Create and append the Retell widget script
      const script = document.createElement('script');
      script.id = 'retell-widget';
      script.src = 'https://dashboard.retellai.com/retell-widget.js';
      script.type = 'module';
      script.setAttribute('data-public-key', PUBLIC_RETELL_PUBLIC_KEY);
      script.setAttribute('data-agent-id', PUBLIC_RETELL_AGENT_ID);
      script.setAttribute('data-widget', 'callback'); // "callback" for Call Me Back widget
      script.setAttribute('data-phone-number', PUBLIC_RETELL_PHONE_NUMBER);
      script.setAttribute('data-title', PUBLIC_RETELL_WIDGET_TITLE || 'Talk to Our AI Agent');

      // Append to body
      document.body.appendChild(script);

      console.log('Retell AI Widget loaded successfully');

      // Use MutationObserver to watch for Retell widget and reposition it
      const observer = new MutationObserver(() => {
        const retellFab = document.getElementById('retell-fab') || document.querySelector('.retell-fab');
        if (retellFab) {
          // Force position to the left of chatbot
          retellFab.style.setProperty('right', '100px', 'important');
          retellFab.style.setProperty('bottom', '24px', 'important');
          console.log('Retell widget repositioned to the left of chatbot');
        }
      });

      // Start observing the body for changes
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Also try to reposition immediately and with intervals as fallback
      const repositionRetell = () => {
        const retellFab = document.getElementById('retell-fab') || document.querySelector('.retell-fab');
        if (retellFab) {
          retellFab.style.setProperty('right', '100px', 'important');
          retellFab.style.setProperty('bottom', '24px', 'important');
          return true;
        }
        return false;
      };

      // Try repositioning every 100ms for 5 seconds
      let attempts = 0;
      const maxAttempts = 50;
      const repositionInterval = setInterval(() => {
        if (repositionRetell() || attempts >= maxAttempts) {
          clearInterval(repositionInterval);
          if (attempts < maxAttempts) {
            console.log('Retell widget successfully repositioned');
          }
        }
        attempts++;
      }, 100);

      // Cleanup function
      return () => {
        observer.disconnect();
        clearInterval(repositionInterval);
        const existingScript = document.getElementById('retell-widget');
        const existingStyle = document.getElementById('retell-widget-positioning');
        if (existingScript) {
          existingScript.remove();
        }
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    } catch (error) {
      console.error('Failed to load Retell widget:', error);
    }
  });
</script>

<!--
  This component doesn't render any visible HTML -
  the Retell script creates its own floating widget
-->

{#if isEnabled && !hasCredentials}
  <!-- Optional: Show warning in development mode -->
  <div class="fixed bottom-4 left-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 max-w-sm shadow-lg z-50">
    <p class="font-semibold">Retell Widget Configuration Needed</p>
    <p class="mt-1">Add your Retell credentials to .env to enable the widget.</p>
  </div>
{/if}

<style>
  /* Position Retell widget to the left of the chatbot widget */
  /* Target the specific Retell FAB (Floating Action Button) */
  :global(#retell-fab),
  :global(.retell-fab) {
    right: 100px !important;
    bottom: 24px !important;
  }
</style>
