import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

// Contact form submission
export async function submitContactForm(formData) {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          business: formData.business_name,
          interest: formData.service_interest,
          challenge: formData.challenge
        }
      ]);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error submitting form:', error);
    return { success: false, error: error.message };
  }
}

// Newsletter subscription
export async function subscribeToNewsletter(email) {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .insert([{ email }]);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return { success: false, error: error.message };
  }
}
