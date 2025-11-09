<script>
  import { onMount } from 'svelte';
  import {
    paymentModalOpen,
    selectedPlan,
    closePaymentModal,
    setPaymentProcessing,
    setPaymentSuccess,
    setPaymentError,
    resetPaymentState,
    paymentSuccess,
    paymentError
  } from '$lib/stores/ui.js';
  import {
    PAYSTACK_PUBLIC_KEY,
    initializePayment,
    verifyPayment,
    storePaymentRecord
  } from '$lib/utils/paystack.js';

  let email = '';
  let name = '';
  let phone = '';
  let showForm = true;
  let paymentConfig = null;
  let paystackLoaded = false;

  // Load Paystack inline script
  onMount(() => {
    if (!window.PaystackPop) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => {
        paystackLoaded = true;
      };
      document.head.appendChild(script);
    } else {
      paystackLoaded = true;
    }
  });

  // Handle payment success
  async function handlePaymentSuccess(response) {
    setPaymentProcessing(true);

    try {
      // Verify payment
      const verificationResult = await verifyPayment(response.reference);

      if (verificationResult.success) {
        // Store payment record
        const paymentData = {
          reference: response.reference,
          email: email,
          amount: $selectedPlan.amount * 100, // Convert to kobo
          currency: $selectedPlan.currency,
          plan_name: $selectedPlan.planName,
          service_type: $selectedPlan.serviceType,
          status: 'success',
          paid_at: new Date().toISOString(),
          metadata: {
            name: name,
            phone: phone,
            features: $selectedPlan.features
          }
        };

        await storePaymentRecord(paymentData);

        setPaymentSuccess(true);
        setPaymentError(null);

        // Close modal after 3 seconds
        setTimeout(() => {
          resetPaymentState();
        }, 3000);
      } else {
        setPaymentError('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setPaymentError('An error occurred while processing your payment.');
    } finally {
      setPaymentProcessing(false);
    }
  }

  // Handle payment close
  function handlePaymentClose() {
    setPaymentError('Payment cancelled. Please try again.');
  }

  // Prepare and initiate payment
  function preparePayment() {
    if (!email || !name || !phone) {
      setPaymentError('Please fill in all required fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setPaymentError('Please enter a valid email address.');
      return;
    }

    if (!paystackLoaded || !window.PaystackPop) {
      setPaymentError('Payment system is loading. Please try again in a moment.');
      return;
    }

    setPaymentError(null);

    paymentConfig = initializePayment({
      email,
      amount: $selectedPlan.amount,
      planName: $selectedPlan.planName,
      serviceType: $selectedPlan.serviceType,
      metadata: {
        name,
        phone
      }
    });

    // Open Paystack popup
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: paymentConfig.email,
      amount: paymentConfig.amount,
      currency: paymentConfig.currency,
      ref: paymentConfig.reference,
      metadata: paymentConfig.metadata,
      onClose: function() {
        handlePaymentClose();
      },
      callback: function(response) {
        handlePaymentSuccess(response);
      }
    });

    handler.openIframe();
  }

  // Reset form when modal closes
  $: if (!$paymentModalOpen) {
    email = '';
    name = '';
    phone = '';
    showForm = true;
    paymentConfig = null;
  }
</script>

{#if $paymentModalOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fade-in">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 md:p-8 relative">
      <!-- Close button -->
      <button
        on:click={closePaymentModal}
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close modal"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      {#if showForm}
        <!-- Payment Details Form -->
        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Complete Your Purchase</h3>

          {#if $selectedPlan}
            <div class="bg-purple-50 rounded-lg p-4 mb-6">
              <p class="text-sm text-gray-600">Selected Plan</p>
              <p class="text-xl font-bold text-primary">{$selectedPlan.planName}</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">
                R{$selectedPlan.amount.toLocaleString()}
                <span class="text-sm font-normal text-gray-500">/month</span>
              </p>
            </div>
          {/if}

          <form on:submit|preventDefault={preparePayment} class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                bind:value={name}
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                bind:value={email}
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                bind:value={phone}
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="+27 123 456 7890"
              />
            </div>

            <button
              type="submit"
              class="w-full btn-primary"
            >
              Pay R{$selectedPlan?.amount.toLocaleString() || '0'} with Paystack
            </button>
          </form>
        </div>
      {/if}

      <!-- Success Message -->
      {#if $paymentSuccess}
        <div class="absolute inset-0 bg-white rounded-lg flex items-center justify-center p-6">
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
            <p class="text-gray-600">Thank you for your purchase. We'll be in touch shortly.</p>
          </div>
        </div>
      {/if}

      <!-- Error Message -->
      {#if $paymentError}
        <div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p class="text-red-600 text-sm">{$paymentError}</p>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
</style>
