<script>
  import Header from '$lib/components/Header.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Services from '$lib/components/Services.svelte';
  import About from '$lib/components/About.svelte';
  import Pricing from '$lib/components/Pricing.svelte';
  import Contact from '$lib/components/Contact.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
  <!-- Primary Meta Tags -->
  <title>Pharens AI Agency - AI-Powered Marketing for the Beauty Industry</title>
  <meta name="title" content="Pharens AI Agency - AI-Powered Marketing for the Beauty Industry" />
  <meta name="description" content="Transform your beauty business with AI-powered digital marketing. Specialized services for medical spas, salons, and e-commerce brands in South Africa. Get results-driven social media, SEO, and content marketing." />
  <meta name="keywords" content="beauty marketing, medical spa marketing, AI marketing, digital marketing South Africa, beauty industry, social media management, SEO optimization, content marketing" />
  <meta name="author" content="Pharens AI Agency" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://pharensai.com" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://pharensai.com" />
  <meta property="og:title" content="Pharens AI Agency - AI-Powered Marketing for the Beauty Industry" />
  <meta property="og:description" content="Transform your beauty business with AI-powered digital marketing. Specialized services for medical spas, salons, and e-commerce brands in South Africa." />
  <meta property="og:image" content="https://pharensai.com/brand image.png" />
  <meta property="og:image:alt" content="Pharens AI Agency - Beauty Marketing Solutions" />
  <meta property="og:site_name" content="Pharens AI Agency" />
  <meta property="og:locale" content="en_ZA" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="https://pharensai.com" />
  <meta name="twitter:title" content="Pharens AI Agency - AI-Powered Marketing for the Beauty Industry" />
  <meta name="twitter:description" content="Transform your beauty business with AI-powered digital marketing. Specialized services for medical spas, salons, and e-commerce brands." />
  <meta name="twitter:image" content="https://pharensai.com/brand image.png" />

  <!-- Additional Meta Tags -->
  <meta name="theme-color" content="#460070" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />

  <!-- Geo Tags -->
  <meta name="geo.region" content="ZA" />
  <meta name="geo.placename" content="South Africa" />

  <!-- Structured Data for Local Business -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Pharens AI Agency",
      "description": "AI-powered digital marketing agency specializing in beauty industry marketing solutions",
      "url": "https://pharensai.com",
      "telephone": ["+27670374461", "+27602785621"],
      "email": "cbd.pharen25@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "ZA",
        "addressRegion": "South Africa"
      },
      "areaServed": {
        "@type": "Country",
        "name": "South Africa"
      },
      "serviceType": ["Digital Marketing", "Social Media Management", "SEO Optimization", "Content Marketing", "Beauty Industry Marketing"],
      "priceRange": "$$",
      "image": "https://pharensai.com/brand image.png"
    }
  </script>
</svelte:head>

<Header />

<main>
  <Hero />
  <Services />
  <About />
  <Pricing />
  <Contact />
</main>

<Footer />
