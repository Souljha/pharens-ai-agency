<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { trackPageView, initScrollTracking } from '$lib/utils/analytics.js';

  // Environment variable for Google Analytics ID
  const GA_ID = import.meta.env.PUBLIC_GA_MEASUREMENT_ID;

  onMount(() => {
    // Initialize Google Analytics if ID is provided
    if (GA_ID && typeof window !== 'undefined') {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', GA_ID, {
        send_page_view: false // We'll handle page views manually
      });

      // Store the measurement ID globally
      window.GA_MEASUREMENT_ID = GA_ID;
    }

    // Initialize scroll tracking
    const cleanupScrollTracking = initScrollTracking();

    // Track initial page view
    trackPageView($page.url.pathname);

    // Track page views on navigation
    const unsubscribe = page.subscribe((value) => {
      if (value.url) {
        trackPageView(value.url.pathname);
      }
    });

    // Cleanup
    return () => {
      unsubscribe();
      if (cleanupScrollTracking) cleanupScrollTracking();
    };
  });
</script>

<!-- No visual output, this component just handles analytics -->
