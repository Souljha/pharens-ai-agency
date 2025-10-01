<script>
  import { page } from '$app/stores';

  $: errorMessage = $page.error?.message || 'An unexpected error occurred';
  $: statusCode = $page.status || 500;

  function handleGoHome() {
    window.location.href = '/';
  }

  function handleReload() {
    window.location.reload();
  }
</script>

<svelte:head>
  <title>Error {statusCode} - Pharens AI Agency</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-primary via-secondary-dark to-secondary-light flex items-center justify-center px-4">
  <div class="max-w-2xl w-full text-center">
    <!-- Error Icon -->
    <div class="mb-8">
      <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm">
        <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
    </div>

    <!-- Error Code -->
    <h1 class="text-8xl font-bold text-white mb-4">{statusCode}</h1>

    <!-- Error Message -->
    <h2 class="text-2xl font-semibold text-white mb-4">
      {#if statusCode === 404}
        Page Not Found
      {:else if statusCode === 500}
        Internal Server Error
      {:else}
        Something Went Wrong
      {/if}
    </h2>

    <p class="text-white/80 text-lg mb-8 max-w-md mx-auto">
      {#if statusCode === 404}
        The page you're looking for doesn't exist or has been moved.
      {:else}
        We're experiencing technical difficulties. Please try again later.
      {/if}
    </p>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        on:click={handleGoHome}
        class="px-8 py-3 bg-white text-primary font-semibold rounded-full hover:bg-white/90 transition-all duration-300 transform hover:scale-105"
      >
        Go to Homepage
      </button>

      {#if statusCode !== 404}
        <button
          on:click={handleReload}
          class="px-8 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
        >
          Try Again
        </button>
      {/if}
    </div>

    <!-- Support Info -->
    <div class="mt-12 text-white/60 text-sm">
      <p>Need help? Contact us at <a href="mailto:cbd.pharen25@gmail.com" class="text-white/90 hover:text-white underline">cbd.pharen25@gmail.com</a></p>
    </div>
  </div>
</div>
