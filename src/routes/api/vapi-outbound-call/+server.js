import { json } from '@sveltejs/kit';
import { VAPI_PRIVATE_API_KEY } from '$env/static/private';
import { PUBLIC_VAPI_ASSISTANT_ID } from '$env/static/public';

/**
 * Vercel Serverless Function to trigger Vapi outbound phone calls
 * POST /api/vapi-outbound-call
 */
export async function POST({ request }) {
  try {
    const { phoneNumber, customerName, metadata } = await request.json();

    // Validate required fields
    if (!phoneNumber) {
      return json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    if (!VAPI_PRIVATE_API_KEY) {
      console.error('VAPI_PRIVATE_API_KEY is not configured');
      return json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Make outbound call request to Vapi API
    const vapiResponse = await fetch('https://api.vapi.ai/call/phone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_PRIVATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assistantId: PUBLIC_VAPI_ASSISTANT_ID,
        phoneNumber: phoneNumber, // Direct field - the customer's phone number to call
        customer: {
          name: customerName || 'Customer',
        },
        metadata: {
          source: 'contact_form',
          timestamp: new Date().toISOString(),
          ...metadata,
        },
      }),
    });

    const responseData = await vapiResponse.json();

    if (!vapiResponse.ok) {
      console.error('Vapi API error:', responseData);
      return json(
        {
          success: false,
          error: responseData.message || 'Failed to initiate call',
        },
        { status: vapiResponse.status }
      );
    }

    console.log('Outbound call initiated successfully:', responseData);

    return json({
      success: true,
      data: {
        callId: responseData.id,
        status: responseData.status,
        message: 'Call initiated successfully',
      },
    });
  } catch (error) {
    console.error('Error in vapi-outbound-call API:', error);
    return json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
