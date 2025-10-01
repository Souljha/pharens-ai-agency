<script>
  import { onMount } from 'svelte';
  import { activeService, setActiveService } from '$lib/stores/ui.js';
  
  let pricingElement;
  let isVisible = false;
  
  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    
    if (pricingElement) {
      observer.observe(pricingElement);
    }
    
    return () => {
      if (pricingElement) {
        observer.unobserve(pricingElement);
      }
    };
  });
</script>

<section id="pricing" class="py-20 md:py-24 bg-gray-50" bind:this={pricingElement}>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center {isVisible ? 'animate-slide-up' : 'opacity-0'}">
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 font-sans">
        Transparent Pricing for <span class="purple-accent">Real Growth</span>
      </h2>
      <p class="mt-6 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
        Choose the plan that fits your business goals. Our 3-tier models are optimized for the South African market to deliver maximum value and a clear return on investment.
      </p>
    </div>

    <div class="mt-12 flex justify-center {isVisible ? 'animate-fade-in' : 'opacity-0'}" style="animation-delay: 0.3s;">
      <div class="inline-flex rounded-lg shadow-sm bg-gray-200 p-1">
        <button 
          on:click={() => setActiveService('medspa')}
          class="px-6 py-3 text-lg font-bold font-sans rounded-md transition-colors duration-300"
          class:bg-white={$activeService === 'medspa'}
          class:text-primary={$activeService === 'medspa'}
          class:text-gray-600={$activeService !== 'medspa'}
        >
          Med Spa Marketing
        </button>
        <button 
          on:click={() => setActiveService('ecommerce')}
          class="px-6 py-3 text-lg font-bold font-sans rounded-md transition-colors duration-300"
          class:bg-white={$activeService === 'ecommerce'}
          class:text-primary={$activeService === 'ecommerce'}
          class:text-gray-600={$activeService !== 'ecommerce'}
        >
          E-commerce Ads
        </button>
      </div>
    </div>

    <!-- Med Spa Pricing -->
    {#if $activeService === 'medspa'}
      <div class="mt-12 animate-fade-in">
        <div class="text-center mb-12">
          <h3 class="text-3xl font-bold text-gray-900">AI-Powered Med Spa Marketing Packages</h3>
          <p class="text-xl text-gray-600 mt-2">Attract high-value patients and automate your bookings.</p>
        </div>
        <div class="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <!-- Essential Boost -->
          <div class="card">
            <h4 class="text-2xl font-bold text-gray-900 font-sans">Essential Boost</h4>
            <p class="mt-4 text-5xl font-extrabold text-gray-900 font-sans">R6,500<span class="text-lg font-medium text-gray-500">/mo</span></p>
            <p class="mt-2 text-md text-gray-500">For new or small clinics ready for consistent growth.</p>
            <ul class="mt-8 space-y-4 text-lg text-gray-600">
              <li class="flex items-center gap-3"><span class="text-primary">✔</span>Targeted Ad Campaigns</li>
              <li class="flex items-center gap-3"><span class="text-primary">✔</span>AI-Powered Optimization</li>
              <li class="flex items-center gap-3"><span class="text-primary">✔</span>Local SEO Dominance</li>
              <li class="flex items-center gap-3 text-gray-400"><span class="text-gray-400">-</span>Automated Booking Systems</li>
              <li class="flex items-center gap-3 text-gray-400"><span class="text-gray-400">-</span>Transparent ROI Reporting</li>
            </ul>
            <a href="#contact" class="mt-8 block w-full text-center btn-secondary">Get Started</a>
          </div>
          <!-- Professional Growth -->
          <div class="card border-2 border-primary relative">
            <div class="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
              <span class="bg-primary text-white px-4 py-1 rounded-full text-sm font-bold font-sans">MOST POPULAR</span>
            </div>
            <h4 class="text-2xl font-bold text-gray-900 font-sans">Professional Growth</h4>
            <p class="mt-4 text-5xl font-extrabold text-gray-900 font-sans">R12,500<span class="text-lg font-medium text-gray-500">/mo</span></p>
            <p class="mt-2 text-md text-gray-500">For established clinics aiming to dominate their local market.</p>
            <ul class="mt-8 space-y-4 text-lg text-gray-600">
              <li class="flex items-center gap-3"><span class="text-primary">✔</span>Targeted Ad Campaigns</li>
              <li class="flex items-center gap-3"><span class="text-primary">✔</span>AI-Powered Optimization</li>
              <li class="flex items-center gap-3"><span class="text-primary">✔</span>Local SEO Dominance</li>
              <li class="flex items-center gap-3"><span class="text-primary">✔</span>Automated Booking Systems</li>
              <li class="flex items-center gap-3"><span class="text-primary">✔</span>Transparent ROI Reporting</li>
            </ul>
            <a href="#contact" class="mt-8 block w-full text-center btn-primary">Choose Plan</a>
          </div>
          <!-- Elite Domination -->
          <div class="card">
            <h4 class="text-2xl font-bold text-gray-900 font-sans">Elite Domination</h4>
            <p class="mt-4 text-5xl font-extrabold text-gray-900 font-sans">R25,000<span class="text-lg font-medium text-gray-500">/mo</span></p>
            <p class="mt-2 text-md text-gray-500">For market leaders seeking aggressive expansion.</p>
            <ul class="mt-8 space-y-4 text-lg text-gray-600">
              <li class="flex items-center gap-3"><span class="text-primary">✔</span>All Professional Features, plus:</li>
              <li class="flex items-center gap-3"><span class="text-primary">✔</span>Multi-Platform Strategy</li>
              <li class="flex items-center gap-3"><span class="text-primary">✔</span>Advanced Analytics & Insights</li>
              <li class="flex items-center gap-3"><span class="text-primary">✔</span>Dedicated Account Manager</li>
            </ul>
            <a href="#contact" class="mt-8 block w-full text-center btn-secondary">Get Started</a>
          </div>
        </div>
      </div>
    {/if}

    <!-- E-commerce Pricing -->
    {#if $activeService === 'ecommerce'}
      <div class="mt-12 animate-fade-in">
        <div class="text-center mb-12">
          <h3 class="text-3xl font-bold text-gray-900">AI-Powered Ads for Beauty E-commerce</h3>
          <p class="text-xl text-gray-600 mt-2">Turn clicks into customers and profitably scale your brand.</p>
        </div>
        <div class="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <!-- Starter Kit -->
          <div class="card">
            <h4 class="text-2xl font-bold text-gray-900 font-sans">Starter Kit</h4>
            <p class="mt-4 text-5xl font-extrabold text-gray-900 font-sans">R5,500<span class="text-lg font-medium text-gray-500">/mo</span></p>
            <p class="mt-2 text-md text-gray-500">For new brands needing to build momentum and first sales.</p>
            <ul class="mt-8 space-y-4 text-lg text-gray-600">
              <li class="flex items-center gap-3"><span class="text-primary">✔</span>Full-Funnel Ad Campaigns</li>
              <li class="flex items-center gap-3"><span class="text-primary">✔</span>AI-Powered Creative Suite</li>
              <li class="flex items-center gap-3 text-gray-400"><span class="text-gray-400">-</span>Dynamic Catalog Optimization</li>
              <li class="flex items-center gap-3 text-gray-400"><span class="text-gray-400">-</span>Advanced Retargeting</li>
              <li class="flex items-center gap-3"><span class="text-primary">✔</span>E-commerce Analytics</li>
            </ul>
            <a href="#contact" class="mt-8 block w-full text-center btn-secondary">Get Started</a>
          </div>
          <!-- Growth Accelerator -->
          <div class="card border-2 border-primary relative">
            <div class="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
              <span class="bg-primary text-white px-4 py-1 rounded-full text-sm font-bold font-sans">BEST VALUE</span>
            </div>
            <h4 class="text-2xl font-bold text-gray-900 font-sans">Growth Accelerator</h4>
            <p class="mt-4 text-5xl font-extrabold text-gray-900 font-sans">R10,500<span class="text-lg font-medium text-gray-500">/mo</span></p>
            <p class="mt-2 text-md text-gray-500">For growing brands ready to scale sales and ROAS.</p>
            <ul class="mt-8 space-y-4 text-lg text-gray-600">
              <li class="flex items-center gap-3"><span class="text-primary">✔</span>Full-Funnel Ad Campaigns</li>
              <li class="flex items-center gap-3"><span class="text-primary">✔</span>AI-Powered Creative Suite</li>
              <li class="flex items-center gap-3"><span class="text-primary">✔</span>Dynamic Catalog Optimization</li>
              <li class="flex items-center gap-3"><span class="text-primary">✔</span>Advanced Retargeting</li>
              <li class="flex items-center gap-3"><span class="text-primary">✔</span>E-commerce Analytics</li>
            </ul>
            <a href="#contact" class="mt-8 block w-full text-center btn-primary">Choose Plan</a>
          </div>
          <!-- Scale-Up Pro -->
          <div class="card">
            <h4 class="text-2xl font-bold text-gray-900 font-sans">Scale-Up Pro</h4>
            <p class="mt-4 text-5xl font-extrabold text-gray-900 font-sans">R18,000<span class="text-lg font-medium text-gray-500">/mo</span></p>
            <p class="mt-2 text-md text-gray-500">For established brands aiming for market leadership.</p>
            <ul class="mt-8 space-y-4 text-lg text-gray-600">
              <li class="flex items-center gap-3"><span class="text-primary">✔</span>All Accelerator Features, plus:</li>
              <li class="flex items-center gap-3"><span class="text-primary">✔</span>Omnichannel Ad Strategy</li>
              <li class="flex items-center gap-3"><span class="text-primary">✔</span>Conversion Rate Optimization</li>
              <li class="flex items-center gap-3"><span class="text-primary">✔</span>Priority Support</li>
            </ul>
            <a href="#contact" class="mt-8 block w-full text-center btn-secondary">Get Started</a>
          </div>
        </div>
      </div>
    {/if}

    <p class="text-center mt-12 text-md text-gray-500 {isVisible ? 'animate-fade-in' : 'opacity-0'}" style="animation-delay: 0.6s;">
      Please note: Prices are exclusive of your monthly ad spend budget.
    </p>
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
