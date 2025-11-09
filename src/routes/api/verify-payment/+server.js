import { json } from '@sveltejs/kit';
import { PAYSTACK_SECRET_KEY } from '$env/static/private';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  const reference = url.searchParams.get('reference');

  if (!reference) {
    return json({ success: false, error: 'Payment reference is required' }, { status: 400 });
  }

  try {
    // Verify payment with Paystack API
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.status && data.data.status === 'success') {
      return json({
        success: true,
        status: 'success',
        data: {
          reference: data.data.reference,
          amount: data.data.amount,
          currency: data.data.currency,
          paid_at: data.data.paid_at,
          customer: data.data.customer,
          metadata: data.data.metadata
        }
      });
    }

    return json({
      success: false,
      error: 'Payment verification failed',
      status: data.data.status
    }, { status: 400 });
  } catch (error) {
    console.error('Payment verification error:', error);
    return json({
      success: false,
      error: 'An error occurred while verifying payment'
    }, { status: 500 });
  }
}
