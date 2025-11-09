import { supabase } from './supabase.js';
import { PUBLIC_PAYSTACK_PUBLIC_KEY } from '$env/static/public';

// Paystack configuration
export const PAYSTACK_PUBLIC_KEY = PUBLIC_PAYSTACK_PUBLIC_KEY;

// Pricing data for different plans (in Rands, converted to kobo/cents for Paystack)
export const PRICING_PLANS = {
  medspa: {
    'Essential Boost': {
      amount: 6500,
      currency: 'ZAR',
      features: [
        'Targeted Ad Campaigns',
        'AI-Powered Optimization',
        'Local SEO Dominance',
        'AI Voice Agent (100 calls/mo)'
      ]
    },
    'Professional Growth': {
      amount: 12500,
      currency: 'ZAR',
      features: [
        'Targeted Ad Campaigns',
        'AI-Powered Optimization',
        'Local SEO Dominance',
        'AI Voice Agent (500 calls/mo)',
        'Automated Booking Systems',
        'Transparent ROI Reporting'
      ]
    },
    'Elite Domination': {
      amount: 25000,
      currency: 'ZAR',
      features: [
        'All Professional Features',
        'AI Voice Agent (2000 calls/mo)',
        'Multi-Platform Strategy',
        'Advanced Analytics & Insights',
        'Dedicated Account Manager'
      ]
    }
  },
  ecommerce: {
    'Starter Kit': {
      amount: 5500,
      currency: 'ZAR',
      features: [
        'Full-Funnel Ad Campaigns',
        'AI-Powered Creative Suite',
        'AI Voice Agent (100 calls/mo)',
        'E-commerce Analytics'
      ]
    },
    'Growth Accelerator': {
      amount: 10500,
      currency: 'ZAR',
      features: [
        'Full-Funnel Ad Campaigns',
        'AI-Powered Creative Suite',
        'AI Voice Agent (500 calls/mo)',
        'Dynamic Catalog Optimization',
        'Advanced Retargeting',
        'E-commerce Analytics'
      ]
    },
    'Scale-Up Pro': {
      amount: 18000,
      currency: 'ZAR',
      features: [
        'All Accelerator Features',
        'AI Voice Agent (2000 calls/mo)',
        'Omnichannel Ad Strategy',
        'Conversion Rate Optimization',
        'Priority Support'
      ]
    }
  }
};

// Convert amount to Paystack format (amount in kobo/cents - multiply by 100)
export function convertToPaystackAmount(amount) {
  return amount * 100;
}

// Initialize payment configuration
export function initializePayment({ email, amount, planName, serviceType, metadata = {} }) {
  const config = {
    reference: generateReference(),
    email,
    amount: convertToPaystackAmount(amount),
    currency: 'ZAR',
    metadata: {
      plan_name: planName,
      service_type: serviceType,
      custom_fields: [
        {
          display_name: 'Plan Name',
          variable_name: 'plan_name',
          value: planName
        },
        {
          display_name: 'Service Type',
          variable_name: 'service_type',
          value: serviceType
        }
      ],
      ...metadata
    }
  };

  return config;
}

// Generate unique payment reference
export function generateReference() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `pharens-${timestamp}-${random}`;
}

// Verify payment with Paystack
export async function verifyPayment(reference) {
  try {
    // Note: This should be done on the server-side for security
    // For now, we'll store the payment info and verify via webhook
    const response = await fetch(`/api/verify-payment?reference=${reference}`);
    const data = await response.json();

    if (data.success && data.status === 'success') {
      return { success: true, data: data.data };
    }

    return { success: false, error: 'Payment verification failed' };
  } catch (error) {
    console.error('Error verifying payment:', error);
    return { success: false, error: error.message };
  }
}

// Store payment record in Supabase
export async function storePaymentRecord(paymentData) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          reference: paymentData.reference,
          email: paymentData.email,
          amount: paymentData.amount / 100, // Convert back from kobo
          currency: paymentData.currency,
          plan_name: paymentData.plan_name,
          service_type: paymentData.service_type,
          status: paymentData.status,
          paid_at: paymentData.paid_at,
          metadata: paymentData.metadata
        }
      ])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error storing payment record:', error);
    return { success: false, error: error.message };
  }
}

// Get payment plan details
export function getPlanDetails(serviceType, planName) {
  return PRICING_PLANS[serviceType]?.[planName] || null;
}
