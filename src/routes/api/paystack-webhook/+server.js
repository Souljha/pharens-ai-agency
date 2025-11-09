import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { PAYSTACK_SECRET_KEY } from '$env/static/private';
import { createHmac } from 'crypto';
import { sendCustomerPaymentConfirmation, sendBusinessPaymentNotification } from '$lib/utils/email.js';

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    // Verify webhook signature
    const hash = createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      return json({ success: false, error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);

    // Handle successful payment
    if (event.event === 'charge.success') {
      const paymentData = event.data;

      // Filter: Only process payments from this application (Pharens AI)
      // Check if the payment reference starts with 'pharens-'
      if (!paymentData.reference || !paymentData.reference.startsWith('pharens-')) {
        console.log('Skipping payment from different application:', paymentData.reference);
        return json({ success: true, message: 'Payment from different application, skipped' });
      }

      // Store payment in database
      const { data, error } = await supabase
        .from('payments')
        .upsert([
          {
            reference: paymentData.reference,
            email: paymentData.customer.email,
            amount: paymentData.amount / 100, // Convert from kobo
            currency: paymentData.currency,
            plan_name: paymentData.metadata?.plan_name || 'Unknown',
            service_type: paymentData.metadata?.service_type || 'Unknown',
            status: 'success',
            paid_at: paymentData.paid_at,
            metadata: {
              customer: paymentData.customer,
              authorization: paymentData.authorization,
              custom_fields: paymentData.metadata?.custom_fields || []
            }
          }
        ], { onConflict: 'reference' });

      if (error) {
        console.error('Database error:', error);
        return json({ success: false, error: 'Database error' }, { status: 500 });
      }

      // Send email notifications
      try {
        // Extract customer name and phone from metadata
        const customerName = paymentData.metadata?.name || paymentData.customer.first_name + ' ' + paymentData.customer.last_name || 'Valued Customer';
        const customerPhone = paymentData.metadata?.phone || '';

        // Send confirmation email to customer
        await sendCustomerPaymentConfirmation({
          customerEmail: paymentData.customer.email,
          customerName: customerName,
          amount: paymentData.amount,
          currency: paymentData.currency,
          planName: paymentData.metadata?.plan_name || 'Unknown',
          serviceType: paymentData.metadata?.service_type || 'Unknown',
          reference: paymentData.reference,
          paidAt: paymentData.paid_at
        });

        // Send notification email to business owner
        await sendBusinessPaymentNotification({
          customerEmail: paymentData.customer.email,
          customerName: customerName,
          customerPhone: customerPhone,
          amount: paymentData.amount,
          currency: paymentData.currency,
          planName: paymentData.metadata?.plan_name || 'Unknown',
          serviceType: paymentData.metadata?.service_type || 'Unknown',
          reference: paymentData.reference,
          paidAt: paymentData.paid_at
        });

        console.log('Email notifications sent successfully');
      } catch (emailError) {
        // Log error but don't fail the webhook
        console.error('Error sending email notifications:', emailError);
      }

      return json({ success: true, message: 'Payment processed successfully' });
    }

    // Handle failed payment
    if (event.event === 'charge.failed') {
      const paymentData = event.data;

      // Filter: Only process payments from this application (Pharens AI)
      if (!paymentData.reference || !paymentData.reference.startsWith('pharens-')) {
        console.log('Skipping failed payment from different application:', paymentData.reference);
        return json({ success: true, message: 'Failed payment from different application, skipped' });
      }

      // Store failed payment attempt
      await supabase
        .from('payments')
        .insert([
          {
            reference: paymentData.reference,
            email: paymentData.customer.email,
            amount: paymentData.amount / 100,
            currency: paymentData.currency,
            status: 'failed',
            metadata: { failure_reason: paymentData.gateway_response }
          }
        ]);

      return json({ success: true, message: 'Failed payment recorded' });
    }

    return json({ success: true, message: 'Event received' });
  } catch (error) {
    console.error('Webhook error:', error);
    return json({ success: false, error: 'Webhook processing error' }, { status: 500 });
  }
}
