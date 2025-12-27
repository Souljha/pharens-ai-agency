<script>
  import '../app.css';
  import Chatbot from '$lib/components/Chatbot.svelte';
  import Analytics from '$lib/components/Analytics.svelte';
  import RetellWidget from '$lib/components/RetellWidget.svelte';
</script>

<svelte:head>
  <!-- Favicon -->
  <link rel="icon" type="image/png" href="/logo.png" />
  <link rel="apple-touch-icon" href="/logo.png" />
</svelte:head>

<Analytics />

<slot />

<Chatbot />

<!-- Retell AI Voice Agent Widget (for course demonstration) -->
<RetellWidget />
