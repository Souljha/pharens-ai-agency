<script>
  import { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } from '$lib/stores/ui.js';
  import { onMount } from 'svelte';
  
  let scrollY = 0;
  let headerClass = '';
  
  $: headerClass = scrollY > 50 ? 'bg-white/90 backdrop-blur-lg shadow-lg' : 'bg-white/80 backdrop-blur-lg shadow-sm';
  
  onMount(() => {
    const handleScroll = () => scrollY = window.scrollY;
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
  
  function handleNavClick() {
    closeMobileMenu();
  }
</script>

<svelte:window bind:scrollY />

<header class="sticky top-0 z-50 transition-all duration-300 {headerClass}">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-20">
      <!-- Logo -->
      <div class="flex-shrink-0">
        <a href="#home" class="flex items-center" on:click={handleNavClick}>
          <img src="/logo.png" alt="Pharens AI Agency" class="h-12 w-auto">
        </a>
      </div>
      
      <!-- Desktop Navigation -->
      <div class="hidden md:block">
        <nav class="flex items-center space-x-8">
          <a href="#services" class="text-gray-600 hover:text-primary transition-colors duration-300 font-medium">
            Services
          </a>
          <a href="#about" class="text-gray-600 hover:text-primary transition-colors duration-300 font-medium">
            Our Edge
          </a>
          <a href="#pricing" class="text-gray-600 hover:text-primary transition-colors duration-300 font-medium">
            Pricing
          </a>
          <a href="#contact" class="btn-primary">
            Book a Consultation
          </a>
        </nav>
      </div>
      
      <!-- Mobile menu button -->
      <div class="md:hidden">
        <button 
          on:click={toggleMobileMenu}
          class="text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-2"
          aria-label="Toggle mobile menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
  
  <!-- Mobile Navigation -->
  {#if $mobileMenuOpen}
    <div class="md:hidden bg-white border-t border-gray-200 animate-fade-in">
      <nav class="px-4 pt-2 pb-4 space-y-1">
        <a 
          href="#services" 
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          on:click={handleNavClick}
        >
          Services
        </a>
        <a 
          href="#about" 
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          on:click={handleNavClick}
        >
          Our Edge
        </a>
        <a 
          href="#pricing" 
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          on:click={handleNavClick}
        >
          Pricing
        </a>
        <a 
          href="#contact" 
          class="block w-full text-center mt-2 btn-primary"
          on:click={handleNavClick}
        >
          Book a Consultation
        </a>
      </nav>
    </div>
  {/if}
</header>
