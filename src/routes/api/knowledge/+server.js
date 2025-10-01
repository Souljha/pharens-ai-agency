import { json } from '@sveltejs/kit';
import axios from 'axios';
import { supabase } from '$lib/utils/supabase.js';
import { v4 as uuidv4 } from 'uuid';

// Ollama configuration - Use environment variable for production
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const EMBEDDING_MODEL = 'nomic-embed-text:latest';

// Helper function to generate embeddings using Ollama
async function generateEmbedding(text) {
  try {
    const response = await axios.post(`${OLLAMA_BASE_URL}/api/embeddings`, {
      model: EMBEDDING_MODEL,
      prompt: text
    });
    return response.data.embedding;
  } catch (error) {
    console.error('Embedding generation failed:', error.message);
    return null;
  }
}

// Beauty industry knowledge base content
const knowledgeBaseContent = [
  {
    title: "Social Media Marketing for Beauty Businesses",
    content: "Effective social media marketing for beauty businesses involves showcasing before/after transformations, sharing educational content about treatments, leveraging user-generated content, and maintaining consistent posting schedules. Instagram and TikTok are particularly powerful for visual content. Use hashtags strategically, collaborate with beauty influencers, and engage authentically with your community. Video content performs exceptionally well, especially tutorials and treatment demonstrations.",
    category: "social_media"
  },
  {
    title: "Med Spa Marketing Strategies", 
    content: "Med spa marketing requires building trust through educational content, showcasing certifications and expertise, and highlighting safety protocols. Focus on aesthetic treatments like Botox, dermal fillers, laser treatments, and skin rejuvenation. Use before/after photos (with consent), patient testimonials, and expert content. Local SEO is crucial for attracting nearby clients. Partner with dermatologists and plastic surgeons for referrals.",
    category: "medspa"
  },
  {
    title: "Beauty Salon Client Retention",
    content: "Client retention in beauty salons depends on exceptional service, personalized experiences, and consistent follow-up. Implement loyalty programs, send appointment reminders, offer package deals, and maintain detailed client profiles with preferences and treatment history. Regular check-ins via email or text, special birthday offers, and referral incentives help maintain long-term relationships.",
    category: "salon"
  },
  {
    title: "Digital Marketing for Skincare Brands",
    content: "Skincare brand marketing should focus on ingredient education, skin concern solutions, and building trust through expertise. Create content around skin types, common concerns, and treatment routines. User reviews and testimonials are crucial. Use SEO-optimized blog content, email marketing for skincare tips, and targeted social media advertising. Partner with dermatologists and estheticians for credibility.",
    category: "skincare"
  },
  {
    title: "Beauty Business SEO Optimization",
    content: "Beauty business SEO requires local optimization with Google My Business, location-based keywords, and service-specific pages. Create content around 'beauty services near me', treatment-specific terms, and local area keywords. Ensure website is mobile-friendly, loads quickly, and includes client testimonials. Regular blog posts about beauty trends, treatments, and tips improve search rankings.",
    category: "seo"
  },
  {
    title: "Email Marketing for Beauty Services",
    content: "Beauty service email marketing should focus on appointment reminders, treatment follow-ups, seasonal promotions, and educational content. Segment lists by service type (skincare, hair, nails, etc.), send personalized treatment recommendations, and include beauty tips and trends. Automated sequences for new clients, post-treatment care, and re-engagement campaigns are highly effective.",
    category: "email"
  },
  {
    title: "Beauty Industry Trends and Innovations",
    content: "Current beauty trends include clean beauty, personalized skincare, minimally invasive treatments, and tech-driven solutions. Sustainability is increasingly important, with eco-friendly packaging and natural ingredients in demand. AI-powered skin analysis, virtual consultations, and AR try-on experiences are transforming customer interactions. Stay current with innovations like microneedling, LED therapy, and advanced facial treatments.",
    category: "trends"
  },
  {
    title: "Content Marketing for Beauty Professionals",
    content: "Beauty content marketing should educate and inspire while showcasing expertise. Create how-to tutorials, treatment explanations, ingredient spotlights, and seasonal beauty guides. User-generated content and client transformations build social proof. Collaborate with other beauty professionals, participate in industry events, and share behind-the-scenes content to humanize your brand and build connections.",
    category: "content"
  },
  {
    title: "Pharens AI Services Overview",
    content: "Pharens AI specializes in comprehensive digital marketing solutions for beauty businesses. Our services include social media management, SEO optimization, content creation, email marketing campaigns, website development, and brand strategy. We understand the unique challenges of beauty marketing and create tailored strategies that drive client acquisition, improve retention, and build strong brand presence across all digital channels.",
    category: "services"
  },
  {
    title: "Beauty Business Analytics and ROI",
    content: "Measuring beauty business marketing success requires tracking key metrics like client acquisition cost, lifetime value, appointment booking rates, and social media engagement. Use tools like Google Analytics, social media insights, and CRM data to understand client behavior. Track conversion rates from different marketing channels, monitor online reviews and reputation, and measure return on marketing investment to optimize campaigns.",
    category: "analytics"
  },
  {
    title: "Pharens AI Contact Information",
    content: "To get in touch with Pharens AI Agency, you can reach us through multiple channels. Call us on our mobile numbers: +27 67 037 4461 or +27 60 278 5621. You can also email us at cbd.pharen25@gmail.com. We're available to discuss your beauty marketing needs, provide consultations, and answer any questions about our services. Whether you need help with social media marketing, SEO, content creation, or comprehensive digital marketing strategies for your beauty business, we're here to help you grow.",
    category: "contact"
  }
];

export async function POST({ request }) {
  try {
    const { action } = await request.json();

    if (action === 'populate') {
      // First, ensure the knowledge base table exists and has the right structure
      const { error: functionError } = await supabase.rpc('ensure_vector_extension');
      
      if (functionError) {
        console.error('Vector extension error:', functionError);
      }

      let successCount = 0;
      let failCount = 0;

      // Create embeddings and store knowledge base content
      for (const item of knowledgeBaseContent) {
        try {
          // Generate embedding using Ollama
          const embedding = await generateEmbedding(`${item.title} ${item.content}`);

          if (embedding) {
            // Store in database
            const { error: insertError } = await supabase
              .from('knowledge_base')
              .upsert({
                id: uuidv4(),
                title: item.title,
                content: item.content,
                category: item.category,
                embedding: embedding,
                created_at: new Date().toISOString()
              });

            if (insertError) {
              console.error('Insert error for item:', item.title, insertError);
              failCount++;
            } else {
              console.log('Successfully stored:', item.title);
              successCount++;
            }
          } else {
            console.error('Failed to generate embedding for:', item.title);
            failCount++;
          }
        } catch (itemError) {
          console.error('Error processing item:', item.title, itemError);
          failCount++;
        }
      }

      return json({ 
        success: true, 
        message: `Knowledge base populated: ${successCount} successful, ${failCount} failed`,
        successCount,
        failCount
      });
    }

    return json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Knowledge API error:', error);
    return json(
      { error: 'Failed to process knowledge base request' },
      { status: 500 }
    );
  }
}