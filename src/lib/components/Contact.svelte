<script>
  import { onMount } from 'svelte';
  import { formSubmitting, formSuccess, formError, resetFormState } from '$lib/stores/ui.js';
  import { submitContactForm } from '$lib/utils/supabase.js';
  import { trackFormSubmission, trackServiceInterest } from '$lib/utils/analytics.js';
  
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
  
  async function handleSubmit() {
    try {
      formSubmitting.set(true);
      formError.set(null);

      // Track service interest if selected
      if (formData.service_interest) {
        trackServiceInterest(formData.service_interest);
      }

      const { success, error } = await submitContactForm(formData);

      // Track form submission
      trackFormSubmission('contact_form', success);

      if (success) {
        formSuccess.set(true);
        resetForm();
        setTimeout(() => formSuccess.set(false), 6000);
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
            <p class="font-bold">Thank you for your interest!</p>
            <p>We've received your information and will be in touch within 24 business hours to schedule your free consultation.</p>
          </div>
        {/if}
        
        {#if $formError}
          <div class="mt-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg animate-fade-in">
            <p class="font-bold">Something went wrong.</p>
            <p>{$formError}</p>
          </div>
        {/if}
      </form>
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
