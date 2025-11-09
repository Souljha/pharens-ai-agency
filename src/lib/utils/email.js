import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';

const resend = new Resend(RESEND_API_KEY);

// Send payment confirmation to customer
export async function sendCustomerPaymentConfirmation({
  customerEmail,
  customerName,
  amount,
  currency,
  planName,
  serviceType,
  reference,
  paidAt
}) {
  try {
    const formattedAmount = (amount / 100).toLocaleString();
    const formattedDate = new Date(paidAt).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const { data, error } = await resend.emails.send({
      from: 'Pharens AI Agency <noreply@pharensaiagency.online>',
      to: [customerEmail],
      subject: `Payment Confirmation - ${planName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Confirmation</title>
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
            <div style="background-color: white; border-radius: 10px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #460070; margin: 0; font-size: 28px;">Pharens AI Agency</h1>
                <p style="color: #804297; margin: 5px 0 0 0;">Your Partner in Beauty Industry Growth</p>
              </div>

              <!-- Success Icon -->
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="background-color: #10B981; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin: 0 auto;">
                  <span style="color: white; font-size: 36px;">✓</span>
                </div>
              </div>

              <!-- Main Content -->
              <h2 style="color: #1a1a1a; margin-top: 0; text-align: center;">Payment Successful!</h2>

              <p style="font-size: 16px; color: #555;">Dear ${customerName},</p>

              <p style="font-size: 16px; color: #555;">
                Thank you for your payment! We're excited to help grow your beauty business with our AI-powered marketing solutions.
              </p>

              <!-- Payment Details -->
              <div style="background-color: #f8f5fb; border-left: 4px solid #460070; padding: 20px; margin: 30px 0; border-radius: 5px;">
                <h3 style="margin-top: 0; color: #460070; font-size: 18px;">Payment Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600;">Plan:</td>
                    <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">${planName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600;">Service Type:</td>
                    <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">${serviceType === 'medspa' ? 'Medical Aesthetic Clinics' : 'Beauty E-commerce'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600;">Amount Paid:</td>
                    <td style="padding: 8px 0; text-align: right; color: #1a1a1a; font-size: 18px; font-weight: bold;">${currency} ${formattedAmount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600;">Transaction ID:</td>
                    <td style="padding: 8px 0; text-align: right; color: #666; font-size: 12px;">${reference}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600;">Date:</td>
                    <td style="padding: 8px 0; text-align: right; color: #666;">${formattedDate}</td>
                  </tr>
                </table>
              </div>

              <!-- Next Steps -->
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 30px 0; border-radius: 5px;">
                <h3 style="margin-top: 0; color: #856404; font-size: 18px;">What Happens Next?</h3>
                <ol style="margin: 0; padding-left: 20px; color: #856404;">
                  <li style="margin-bottom: 10px;">Our team will contact you within 24 hours to schedule your onboarding call</li>
                  <li style="margin-bottom: 10px;">We'll discuss your specific goals and create a customized strategy</li>
                  <li style="margin-bottom: 10px;">Your dedicated account manager will be assigned</li>
                  <li>We'll begin implementing your AI-powered marketing campaigns</li>
                </ol>
              </div>

              <!-- Contact Information -->
              <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e5e5;">
                <p style="font-size: 14px; color: #666; margin-bottom: 10px;">Questions? We're here to help!</p>
                <p style="font-size: 14px; color: #666; margin: 5px 0;">
                  📧 Email: <a href="mailto:pharen@pharensaiagency.online" style="color: #460070; text-decoration: none;">pharen@pharensaiagency.online</a>
                </p>
                <p style="font-size: 14px; color: #666; margin: 5px 0;">
                  📞 Phone: <a href="tel:+27670374461" style="color: #460070; text-decoration: none;">+27 67 037 4461</a>
                </p>
              </div>

              <!-- Footer -->
              <div style="margin-top: 40px; text-align: center; padding-top: 20px; border-top: 1px solid #e5e5e5;">
                <p style="font-size: 12px; color: #999; margin: 5px 0;">
                  This is an automated receipt for your payment.
                </p>
                <p style="font-size: 12px; color: #999; margin: 5px 0;">
                  © 2025 Pharens AI Agency. A division of Pharens Nail Hub. All rights reserved.
                </p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    if (error) {
      console.error('Error sending customer email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending customer email:', error);
    return { success: false, error: error.message };
  }
}

// Send payment notification to business owner
export async function sendBusinessPaymentNotification({
  customerEmail,
  customerName,
  customerPhone,
  amount,
  currency,
  planName,
  serviceType,
  reference,
  paidAt
}) {
  try {
    const formattedAmount = (amount / 100).toLocaleString();
    const formattedDate = new Date(paidAt).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const { data, error } = await resend.emails.send({
      from: 'Pharens AI Agency <noreply@pharensaiagency.online>',
      to: ['pharen@pharensaiagency.online'],
      subject: `New Payment Received - ${currency} ${formattedAmount}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Payment Notification</title>
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
            <div style="background-color: white; border-radius: 10px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <!-- Header -->
              <div style="background-color: #10B981; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
                <h1 style="color: white; margin: 0; font-size: 24px;">New Payment Received! 🎉</h1>
                <p style="color: white; margin: 10px 0 0 0; font-size: 18px; font-weight: bold;">${currency} ${formattedAmount}</p>
              </div>

              <!-- Customer Details -->
              <div style="background-color: #f8f9fa; border-left: 4px solid #460070; padding: 20px; margin: 20px 0; border-radius: 5px;">
                <h3 style="margin-top: 0; color: #460070; font-size: 18px;">Customer Information</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600;">Name:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${customerName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600;">Email:</td>
                    <td style="padding: 8px 0;"><a href="mailto:${customerEmail}" style="color: #460070; text-decoration: none;">${customerEmail}</a></td>
                  </tr>
                  ${customerPhone ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600;">Phone:</td>
                    <td style="padding: 8px 0;"><a href="tel:${customerPhone}" style="color: #460070; text-decoration: none;">${customerPhone}</a></td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <!-- Payment Details -->
              <div style="background-color: #f8f9fa; border-left: 4px solid #10B981; padding: 20px; margin: 20px 0; border-radius: 5px;">
                <h3 style="margin-top: 0; color: #10B981; font-size: 18px;">Payment Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600;">Plan:</td>
                    <td style="padding: 8px 0; text-align: right; color: #1a1a1a; font-weight: bold;">${planName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600;">Service Type:</td>
                    <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">${serviceType === 'medspa' ? 'Medical Aesthetic Clinics' : 'Beauty E-commerce'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600;">Amount:</td>
                    <td style="padding: 8px 0; text-align: right; color: #10B981; font-size: 20px; font-weight: bold;">${currency} ${formattedAmount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600;">Transaction ID:</td>
                    <td style="padding: 8px 0; text-align: right; color: #666; font-size: 12px;">${reference}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600;">Date:</td>
                    <td style="padding: 8px 0; text-align: right; color: #666;">${formattedDate}</td>
                  </tr>
                </table>
              </div>

              <!-- Action Items -->
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 5px;">
                <h3 style="margin-top: 0; color: #856404; font-size: 18px;">Action Required</h3>
                <ul style="margin: 0; padding-left: 20px; color: #856404;">
                  <li style="margin-bottom: 10px;">Contact customer within 24 hours for onboarding call</li>
                  <li style="margin-bottom: 10px;">Assign dedicated account manager</li>
                  <li style="margin-bottom: 10px;">Prepare customized strategy document</li>
                  <li>Set up campaign tracking and analytics</li>
                </ul>
              </div>

              <!-- Quick Actions -->
              <div style="margin-top: 30px; text-align: center;">
                <a href="https://dashboard.paystack.com" style="display: inline-block; background-color: #460070; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 5px;">View in Paystack</a>
                <a href="mailto:${customerEmail}" style="display: inline-block; background-color: #804297; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 5px;">Email Customer</a>
              </div>

              <!-- Footer -->
              <div style="margin-top: 40px; text-align: center; padding-top: 20px; border-top: 1px solid #e5e5e5;">
                <p style="font-size: 12px; color: #999; margin: 5px 0;">
                  This is an automated notification from your payment system.
                </p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    if (error) {
      console.error('Error sending business notification email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending business notification email:', error);
    return { success: false, error: error.message };
  }
}
