<script>
  import { setActiveService } from '$lib/stores/ui.js';
  import { onMount } from 'svelte';
  
  let servicesElement;
  let isVisible = false;
  
  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    
    if (servicesElement) {
      observer.observe(servicesElement);
    }
    
    return () => {
      if (servicesElement) {
        observer.unobserve(servicesElement);
      }
    };
  });
  
  function handleServiceClick(service) {
    setActiveService(service);
  }
</script>

<section id="services" class="py-20 md:py-24 bg-gray-50" bind:this={servicesElement}>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center {isVisible ? 'animate-slide-up' : 'opacity-0'}">
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 font-sans">
        Stop Wasting Your Ad Spend. <br class="hidden md:block">
        <span class="purple-accent">Start Seeing Results.</span>
      </h2>
      <p class="mt-6 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
        Whether you're a medical spa or an e-commerce brand, we offer specialized AI marketing services designed for the unique challenges of the South African beauty market.
      </p>
    </div>

    <div class="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-7xl mx-auto">
      <!-- Medical Aesthetic Clinics -->
      <div class="card card-hover {isVisible ? 'animate-fade-in' : 'opacity-0'}" style="animation-delay: 0.3s;">
        <div class="text-center">
          <!-- Icon -->
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
            </svg>
          </div>
          
          <h3 class="text-2xl md:text-3xl font-bold text-gray-900 font-sans mb-4">
            For Medical Aesthetic Clinics
          </h3>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            Struggling to attract the right patients and fill your appointment book? We build systems to bring high-value clients to your door.
          </p>
          
          <!-- Features -->
          <div class="space-y-3 mb-8">
            <div class="flex items-center justify-center gap-3 text-gray-700">
              <svg class="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span>Targeted Patient Acquisition</span>
            </div>
            <div class="flex items-center justify-center gap-3 text-gray-700">
              <svg class="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span>Automated Booking Systems</span>
            </div>
            <div class="flex items-center justify-center gap-3 text-gray-700">
              <svg class="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span>Local SEO Dominance</span>
            </div>
          </div>
          
          <a 
            href="#pricing" 
            on:click={() => handleServiceClick('medspa')}
            class="inline-flex items-center gap-2 font-bold text-primary hover:text-secondary-dark transition-colors text-lg"
          >
            Learn More & See Pricing
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </a>
        </div>
      </div>

      <!-- Beauty E-commerce Brands -->
      <div class="card card-hover {isVisible ? 'animate-fade-in' : 'opacity-0'}" style="animation-delay: 0.6s;">
        <div class="text-center">
          <!-- Icon -->
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          
          <h3 class="text-2xl md:text-3xl font-bold text-gray-900 font-sans mb-4">
            For Beauty E-commerce Brands
          </h3>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            High ad costs eating your profits? We craft AI-powered campaigns that turn clicks into loyal customers and scale your sales.
          </p>
          
          <!-- Features -->
          <div class="space-y-3 mb-8">
            <div class="flex items-center justify-center gap-3 text-gray-700">
              <svg class="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span>Full-Funnel Ad Campaigns</span>
            </div>
            <div class="flex items-center justify-center gap-3 text-gray-700">
              <svg class="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span>AI-Powered Creative Suite</span>
            </div>
            <div class="flex items-center justify-center gap-3 text-gray-700">
              <svg class="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span>Advanced Retargeting</span>
            </div>
          </div>
          
          <a 
            href="#pricing" 
            on:click={() => handleServiceClick('ecommerce')}
            class="inline-flex items-center gap-2 font-bold text-primary hover:text-secondary-dark transition-colors text-lg"
          >
            Learn More & See Pricing
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </a>
        </div>
      </div>

      <!-- AI Voice Agent -->
      <div class="card card-hover {isVisible ? 'animate-fade-in' : 'opacity-0'}" style="animation-delay: 0.9s;">
        <div class="text-center">
          <!-- Icon -->
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
          </div>

          <h3 class="text-2xl md:text-3xl font-bold text-gray-900 font-sans mb-4">
            AI Voice Agent
          </h3>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            Never miss a call again. Our AI-powered voice agent handles inquiries, books appointments, and qualifies leads 24/7.
          </p>

          <!-- Features -->
          <div class="space-y-3 mb-8">
            <div class="flex items-center justify-center gap-3 text-gray-700">
              <svg class="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span>24/7 Availability</span>
            </div>
            <div class="flex items-center justify-center gap-3 text-gray-700">
              <svg class="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span>Automated Appointment Booking</span>
            </div>
            <div class="flex items-center justify-center gap-3 text-gray-700">
              <svg class="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span>Intelligent Lead Qualification</span>
            </div>
          </div>

          <a
            href="#contact"
            on:click={() => handleServiceClick('voiceagent')}
            class="inline-flex items-center gap-2 font-bold text-primary hover:text-secondary-dark transition-colors text-lg"
          >
            Try It Now
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </a>
        </div>
      </div>
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
