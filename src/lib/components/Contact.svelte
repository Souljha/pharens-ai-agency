<script>
  import { onMount } from 'svelte';
  import { formSubmitting, formSuccess, formError, resetFormState, voiceCallActive } from '$lib/stores/ui.js';
  import { submitContactForm } from '$lib/utils/supabase.js';
  import { trackFormSubmission, trackServiceInterest } from '$lib/utils/analytics.js';
  import VoiceAgent from '$lib/components/VoiceAgent.svelte';
  import { startCall } from '$lib/utils/vapi.js';
  import { PUBLIC_VAPI_ASSISTANT_ID } from '$env/static/public';
  import { formatPhoneToE164, isValidPhoneNumber, getPhoneValidationError } from '$lib/utils/phoneValidation.js';

  let contactElement;
  let isVisible = false;

  let formData = {
    name: '',
    email: '',
    phone: '',
    business_name: '',
    service_interest: '',
    challenge: ''
  };

  let showVoiceAgent = false;
  let autoCallTriggered = false;
  let outboundCallInitiated = false;
  let phoneValidationError = null;
  
  async function handleSubmit() {
    try {
      formSubmitting.set(true);
      formError.set(null);
      phoneValidationError = null;

      // Validate phone number before submission
      const phoneError = getPhoneValidationError(formData.phone);
      if (phoneError) {
        phoneValidationError = phoneError;
        formError.set(phoneError);
        formSubmitting.set(false);
        return;
      }

      // Track service interest if selected
      if (formData.service_interest) {
        trackServiceInterest(formData.service_interest);
      }

      const { success, error } = await submitContactForm(formData);

      // Track form submission
      trackFormSubmission('contact_form', success);

      if (success) {
        formSuccess.set(true);

        // Store form data before resetting (needed for outbound call)
        const submittedFormData = { ...formData };
        resetForm();

        // Trigger automatic outbound phone call after successful submission
        setTimeout(() => {
          triggerOutboundCall(submittedFormData);
        }, 2000); // Wait 2 seconds before initiating call

        setTimeout(() => {
          formSuccess.set(false);
          outboundCallInitiated = false;
        }, 10000);
      } else {
        formError.set(error || 'Failed to submit form. Please try again.');
      }
    } catch (err) {
      trackFormSubmission('contact_form', false);
      formError.set('An unexpected error occurred. Please try again or contact us directly.');
      console.error('Form submission error:', err);
    } finally {
      formSubmitting.set(false);
    }
  }
  
  function resetForm() {
    formData = {
      name: '',
      email: '',
      phone: '',
      business_name: '',
      service_interest: '',
      challenge: ''
    };
  }

  async function triggerOutboundCall(submittedData) {
    if (autoCallTriggered) {
      return; // Prevent duplicate calls
    }

    try {
      autoCallTriggered = true;
      outboundCallInitiated = true;

      // Format phone number to E.164 format
      const formattedPhone = formatPhoneToE164(submittedData.phone);

      console.log('Initiating outbound call to:', formattedPhone);

      // Call the serverless function to trigger outbound call
      const response = await fetch('/api/vapi-outbound-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          customerName: submittedData.name,
          metadata: {
            email: submittedData.email,
            business: submittedData.business_name,
            interest: submittedData.service_interest,
            challenge: submittedData.challenge,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('Outbound call initiated successfully:', result.data);
      } else {
        console.error('Failed to initiate outbound call:', result.error);
        // Don't show error to user - they can still use web-based call
      }
    } catch (error) {
      console.error('Error triggering outbound call:', error);
      // Don't show error to user - they can still use web-based call
    }

    // Show the web-based VoiceAgent as a backup option
    showVoiceAgent = true;
  }
  
  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    
    if (contactElement) {
      observer.observe(contactElement);
    }
    
    return () => {
      if (contactElement) {
        observer.unobserve(contactElement);
      }
      resetFormState();
    };
  });
</script>

<section id="contact" class="py-20 md:py-24 bg-white" bind:this={contactElement}>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="text-center {isVisible ? 'animate-slide-up' : 'opacity-0'}">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 font-sans">
          Ready to Grow Your <span class="purple-accent">Beauty Business?</span>
        </h2>
        <p class="mt-6 text-xl text-gray-600 leading-relaxed">
          Let's talk. Fill out the form below for a free, no-obligation 15-minute strategy call. We'll discuss your challenges and outline a clear path to achieving your growth goals.
        </p>
        
        <!-- Contact Information -->
        <div class="mt-8 flex flex-col md:flex-row justify-center items-center gap-6 text-lg">
          <div class="flex items-center space-x-2 text-gray-700">
            <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
            </svg>
            <div class="flex flex-col md:flex-row md:space-x-4">
              <a href="tel:+27670374461" class="hover:text-primary transition-colors">+27 67 037 4461</a>
              <span class="hidden md:inline text-gray-400">|</span>
              <a href="tel:+27602785621" class="hover:text-primary transition-colors">+27 60 278 5621</a>
            </div>
          </div>
          <div class="flex items-center space-x-2 text-gray-700">
            <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
            <a href="mailto:cbd.pharen25@gmail.com" class="hover:text-primary transition-colors">cbd.pharen25@gmail.com</a>
          </div>
        </div>
      </div>

      <form 
        on:submit|preventDefault={handleSubmit}
        class="mt-12 bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-200 {isVisible ? 'animate-fade-in' : 'opacity-0'}" 
        style="animation-delay: 0.3s;"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 font-sans">Full Name</label>
            <input type="text" name="name" id="name" required bind:value={formData.name} class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary">
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 font-sans">Business Email</label>
            <input type="email" name="email" id="email" required bind:value={formData.email} class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary">
          </div>
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 font-sans">Phone Number</label>
            <input type="tel" name="phone" id="phone" bind:value={formData.phone} class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary">
          </div>
          <div>
            <label for="business_name" class="block text-sm font-medium text-gray-700 font-sans">Business Name & Website</label>
            <input type="text" name="business_name" id="business_name" bind:value={formData.business_name} class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary">
          </div>
          <div class="md:col-span-2">
            <label for="service_interest" class="block text-sm font-medium text-gray-700 font-sans">Which service are you interested in?</label>
            <select id="service_interest" name="service_interest" bind:value={formData.service_interest} class="mt-1 block w-full px-4 py-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:ring-primary focus:border-primary">
              <option value="">Please select an option</option>
              <option value="MedSpa">AI-Powered Med Spa Marketing</option>
              <option value="Ecomm">AI-Powered E-commerce Ads</option>
              <option value="Pilot">Pilot Program for Med Spas</option>
            </select>
          </div>
          <div class="md:col-span-2">
            <label for="challenge" class="block text-sm font-medium text-gray-700 font-sans">What is your single biggest marketing challenge right now?</label>
            <textarea id="challenge" name="challenge" rows="4" bind:value={formData.challenge} class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"></textarea>
          </div>
        </div>
        <div class="mt-8">
          <button type="submit" class="w-full btn-primary text-lg" disabled={$formSubmitting}>
            {#if $formSubmitting}
              <span>Submitting...</span>
            {:else}
              Request My Free Strategy Call
            {/if}
          </button>
        </div>
        
        {#if $formSuccess}
          <div class="mt-6 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg animate-fade-in">
            <p class="font-bold">✅ Thank you for your interest!</p>
            <p>We've received your information and will be in touch within 24 business hours to schedule your free consultation.</p>
            {#if outboundCallInitiated}
              <div class="mt-3 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                <p class="font-semibold text-primary flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  📞 Our AI Agent is calling you now!
                </p>
                <p class="text-sm mt-1">Please answer your phone to speak with our AI assistant. The call should arrive within the next minute.</p>
              </div>
            {/if}
            {#if showVoiceAgent}
              <p class="mt-2 text-sm text-gray-700">Or talk to our AI agent instantly through your browser below:</p>
            {/if}
          </div>
        {/if}
        
        {#if $formError}
          <div class="mt-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg animate-fade-in">
            <p class="font-bold">Something went wrong.</p>
            <p>{$formError}</p>
          </div>
        {/if}
      </form>

      <!-- AI Voice Agent Section (Web-based alternative) -->
      {#if showVoiceAgent}
        <div class="mt-8 animate-fade-in">
          <div class="bg-gradient-to-br from-primary/5 to-secondary-light/5 p-6 rounded-2xl border-2 border-primary/20">
            <div class="text-center mb-4">
              <h3 class="text-2xl font-bold text-gray-900 font-sans">
                {#if outboundCallInitiated}
                  Or Talk Through Your Browser
                {:else}
                  Talk to Our AI Agent Now
                {/if}
              </h3>
              <p class="text-gray-600 mt-2">
                {#if outboundCallInitiated}
                  Can't wait for the phone call? Start a conversation instantly through your browser.
                {:else}
                  Get instant answers about our services, pricing, and how we can help your business grow.
                {/if}
              </p>
            </div>
            <VoiceAgent />
          </div>
        </div>
      {/if}

      <!-- Manual Voice Agent Trigger (always available) -->
      {#if !showVoiceAgent && !$formSuccess}
        <div class="mt-8 text-center animate-fade-in">
          <p class="text-gray-600 mb-4">Prefer to talk right away?</p>
          <button
            on:click={() => showVoiceAgent = true}
            class="inline-flex items-center gap-2 px-6 py-3 bg-secondary-light hover:bg-primary text-white font-bold rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            Talk to Our AI Agent
          </button>
        </div>
      {/if}
    </div>
  </div>
</section>

<style>
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .animate-slide-up {
    animation: slideUp 0.8s ease-out forwards;
  }
  
  .animate-fade-in {
    animation: fadeIn 0.8s ease-out forwards;
  }
</style>
