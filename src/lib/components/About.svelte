<script>
  import { onMount } from 'svelte';
  
  let aboutElement;
  let isVisible = false;
  
  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    
    if (aboutElement) {
      observer.observe(aboutElement);
    }
    
    return () => {
      if (aboutElement) {
        observer.unobserve(aboutElement);
      }
    };
  });
</script>

<section id="about" class="py-20 md:py-24 bg-white" bind:this={aboutElement}>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
      <div class="{isVisible ? 'animate-slide-up' : 'opacity-0'}">
        <span class="font-bold purple-accent font-sans text-lg">OUR EDGE</span>
        <h2 class="mt-4 text-4xl md:text-5xl font-bold text-gray-900 font-sans leading-tight">
          Our Secret Weapon? <br>
          <span class="text-gray-700">We've Been in Your Shoes.</span>
        </h2>
        <p class="mt-6 text-xl text-gray-600 leading-relaxed">
          Generic agencies don't understand the nuances of the beauty industry—the client psychology, the aesthetic trends, the compliance hurdles. Pharens AI Agency was founded by Pharen, a beauty professional turned AI marketing expert.
        </p>
        <p class="mt-4 text-xl text-gray-600 leading-relaxed">
          This insider knowledge is our superpower. We don't just run ads; we craft strategies that resonate deeply with your target audience because we've served them, listened to them, and understand what truly motivates them. This is the difference between marketing that costs and marketing that pays.
        </p>
        <div class="mt-8">
          <h4 class="font-bold text-gray-900 font-sans text-xl mb-4">Certified Expertise</h4>
          <div class="p-6 bg-primary/10 border-l-4 border-primary rounded-r-lg">
            <div class="flex items-center gap-4">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zM9 11a1 1 0 11-2 0 1 1 0 012 0zm2-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div>
                <p class="font-bold text-primary text-lg">Facebook Blueprint Certified Professional</p>
                <p class="text-md text-secondary-dark">Demonstrating advanced-level proficiency in Facebook, Instagram, and Messenger advertising.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center items-center {isVisible ? 'animate-fade-in' : 'opacity-0'}" style="animation-delay: 0.3s;">
        <div class="relative">
          <div class="absolute -top-8 -left-8 w-32 h-32 bg-primary/10 rounded-full"></div>
          <div class="absolute -bottom-8 -right-8 w-32 h-32 bg-gray-100 rounded-full"></div>
          <img src="/brand image.png" alt="Pharen, Founder of Pharens AI Agency" class="rounded-2xl shadow-2xl object-cover w-full max-w-sm relative z-10">
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
