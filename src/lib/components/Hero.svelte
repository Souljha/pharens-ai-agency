<script>
  import { onMount } from 'svelte';
  
  let heroElement;
  let isVisible = false;
  
  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    
    if (heroElement) {
      observer.observe(heroElement);
    }
    
    return () => {
      if (heroElement) {
        observer.unobserve(heroElement);
      }
    };
  });
</script>

<section id="home" class="relative bg-gradient-to-br from-purple-100 via-purple-50 to-white pt-20 pb-16 md:pt-32 md:pb-24 min-h-screen flex items-center overflow-hidden" bind:this={heroElement}>
  <!-- Circuit Background Pattern -->
  <div class="absolute inset-0 opacity-25">
    <img src="/circuit.png" alt="" class="w-full h-full object-cover" />
  </div>
  
  <!-- Background decorative elements -->
  <div class="absolute inset-0 opacity-50">
    <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl"></div>
    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl"></div>
  </div>

  <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      
      <!-- Left Column - Text Content -->
      <div class="space-y-8">
        <!-- Main Heading -->
        <div class="space-y-4 {isVisible ? 'animate-slide-up' : 'opacity-0'}">
          <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
            <span class="block">AI-Powered Growth</span>
            <span class="block">for Beauty & Aesthetics</span>
            <span class="block font-extrabold">Brands</span>
          </h1>
        </div>
        
        <!-- Subtitle -->
        <div class="mt-6 {isVisible ? 'animate-fade-in' : 'opacity-0'}" style="animation-delay: 0.3s;">
          <p class="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium">
            Boost Sales • Scale Ads • Automate Marketing
          </p>
        </div>
        
        <!-- CTA Button -->
        <div class="mt-8 {isVisible ? 'animate-slide-up' : 'opacity-0'}" style="animation-delay: 0.6s;">
          <a href="#contact" class="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold text-xl px-12 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            Let's Grow Together
          </a>
        </div>
      </div>

      <!-- Right Column - Visual Elements -->
      <div class="relative {isVisible ? 'animate-fade-in' : 'opacity-0'}" style="animation-delay: 0.4s;">
        <div class="relative w-full h-96 lg:h-[600px]">
          
          <!-- Single Hero Image -->
          <div class="flex items-center justify-center w-full h-full">
            <img src="/one image.png" alt="Beauty & Aesthetics AI Solutions" class="w-full max-w-2xl h-auto drop-shadow-2xl" />
          </div>
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
