// Analytics utility functions
// Supports Google Analytics, Vercel Analytics, and custom event tracking

/**
 * Track page view
 * @param {string} url - The page URL
 */
export function trackPageView(url) {
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', window.GA_MEASUREMENT_ID, {
      page_path: url
    });
  }

  // Vercel Analytics (automatically tracked)
  // No additional code needed if @vercel/analytics is installed
}

/**
 * Track custom event
 * @param {string} eventName - Name of the event
 * @param {Object} eventData - Additional event data
 */
export function trackEvent(eventName, eventData = {}) {
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventData);
  }

  // Console log for development
  if (import.meta.env.DEV) {
    console.log('Analytics Event:', eventName, eventData);
  }
}

/**
 * Track form submission
 * @param {string} formName - Name of the form
 * @param {boolean} success - Whether submission was successful
 */
export function trackFormSubmission(formName, success) {
  trackEvent('form_submission', {
    form_name: formName,
    success: success
  });
}

/**
 * Track button click
 * @param {string} buttonName - Name/label of the button
 * @param {string} location - Where on the page the button is located
 */
export function trackButtonClick(buttonName, location) {
  trackEvent('button_click', {
    button_name: buttonName,
    location: location
  });
}

/**
 * Track chatbot interaction
 * @param {string} action - The action taken (open, close, send_message)
 */
export function trackChatbotInteraction(action) {
  trackEvent('chatbot_interaction', {
    action: action
  });
}

/**
 * Track service interest
 * @param {string} serviceName - Name of the service user is interested in
 */
export function trackServiceInterest(serviceName) {
  trackEvent('service_interest', {
    service_name: serviceName
  });
}

/**
 * Track scroll depth
 * @param {number} percentage - Scroll depth percentage (25, 50, 75, 100)
 */
export function trackScrollDepth(percentage) {
  trackEvent('scroll_depth', {
    percentage: percentage
  });
}

/**
 * Track outbound link click
 * @param {string} url - The destination URL
 */
export function trackOutboundLink(url) {
  trackEvent('outbound_link_click', {
    url: url
  });
}

// Scroll depth tracker
let scrollDepthTracked = {
  25: false,
  50: false,
  75: false,
  100: false
};

/**
 * Initialize scroll tracking
 */
export function initScrollTracking() {
  if (typeof window === 'undefined') return;

  const handleScroll = () => {
    const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

    Object.keys(scrollDepthTracked).forEach(depth => {
      const depthNum = parseInt(depth);
      if (scrollPercentage >= depthNum && !scrollDepthTracked[depth]) {
        scrollDepthTracked[depth] = true;
        trackScrollDepth(depthNum);
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}
