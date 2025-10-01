import { json } from '@sveltejs/kit';
import axios from 'axios';
import { supabase } from '$lib/utils/supabase.js';

// Ollama configuration - Use environment variable for production
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const CHAT_MODEL = 'llama3.2:3b';  // Using llama3.2:3b model
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

// Helper function to generate chat response using Ollama
async function generateChatResponse(systemPrompt, userMessage) {
  try {
    const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
      model: CHAT_MODEL,
      prompt: `System: ${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`,
      stream: false,
      options: {
        temperature: 0.7,
        num_predict: 500
      }
    });
    return response.data.response;
  } catch (error) {
    console.error('Chat generation failed:', error.message);
    return null;
  }
}

// Fallback responses when Ollama is unavailable
function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('social media') || lowerMessage.includes('instagram') || lowerMessage.includes('tiktok')) {
    return "I'd love to help with your social media strategy! For beauty businesses, I recommend focusing on visual content like before/after transformations, tutorial videos, and behind-the-scenes content. Instagram and TikTok are particularly effective for beauty brands. Would you like specific tips for your type of beauty business?";
  }
  
  if (lowerMessage.includes('medspa') || lowerMessage.includes('med spa') || lowerMessage.includes('botox') || lowerMessage.includes('filler')) {
    return "Med spa marketing requires building trust and showcasing expertise. I recommend creating educational content about treatments, sharing patient testimonials (with consent), and highlighting your certifications. Local SEO is also crucial for attracting nearby clients. What specific med spa services do you offer?";
  }
  
  if (lowerMessage.includes('grow') || lowerMessage.includes('business') || lowerMessage.includes('marketing')) {
    return "I can help you grow your beauty business through strategic digital marketing! This includes social media management, SEO optimization, content creation, and email marketing. At Pharens AI, we specialize in beauty industry marketing that drives real results. What's your biggest marketing challenge right now?";
  }
  
  if (lowerMessage.includes('seo') || lowerMessage.includes('search') || lowerMessage.includes('google')) {
    return "SEO is crucial for beauty businesses! Focus on local optimization with Google My Business, create service-specific pages, and use location-based keywords like 'beauty services near me'. Regular blog content about beauty tips and treatments also helps improve rankings. What type of beauty services do you offer?";
  }
  
  if (lowerMessage.includes('pharens') || lowerMessage.includes('service')) {
    return "Pharens AI specializes in comprehensive digital marketing for beauty businesses. Our services include social media management, SEO optimization, content creation, email marketing, website development, and brand strategy. We understand the unique challenges of beauty marketing and create tailored strategies that work. How can we help grow your beauty business?";
  }
  
  if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email') || lowerMessage.includes('reach') || lowerMessage.includes('get in touch') || lowerMessage.includes('call')) {
    return "You can reach Pharens AI through multiple channels: Call us on +27 67 037 4461 or +27 60 278 5621, or email us at cbd.pharen25@gmail.com. We're available to discuss your beauty marketing needs and provide consultations. How can we help grow your beauty business?";
  }
  
  return "Hi! I'm your Pharens AI Assistant, specializing in beauty industry marketing. I can help with social media strategies, SEO optimization, content marketing, email campaigns, and growing your beauty business. I'm powered by your local qwen2:8b model for fast, private responses! What specific area would you like help with?";
}

export async function POST({ request }) {
  try {
    const { message, conversationHistory } = await request.json();

    let relevantDocs = [];
    
    // Try to generate embedding and search knowledge base using Ollama
    const embedding = await generateEmbedding(message);
    
    if (embedding) {
      try {
        // Search for relevant knowledge base entries using vector similarity
        const { data: searchResults, error: searchError } = await supabase.rpc(
          'search_knowledge_base',
          {
            query_embedding: embedding,
            similarity_threshold: 0.7,
            match_count: 5
          }
        );

        if (!searchError && searchResults) {
          relevantDocs = searchResults;
        }
      } catch (searchError) {
        console.log('Knowledge base search failed:', searchError.message);
      }
    }

    // Prepare context from relevant documents
    let context = '';
    if (relevantDocs && relevantDocs.length > 0) {
      context = relevantDocs
        .map((doc) => `${doc.title}: ${doc.content}`)
        .join('\n\n');
    }

    // Build conversation history for context
    let conversationContext = '';
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext = conversationHistory
        .map((msg) => `${msg.isBot ? 'Assistant' : 'User'}: ${msg.text}`)
        .join('\n');
    }

    // Create the prompt with RAG context
    const systemPrompt = `You are Pharens AI Assistant, an expert in beauty industry marketing and business growth. You help beauty businesses with marketing strategies, service optimization, and business development.

IMPORTANT GUIDELINES:
- Always be helpful, professional, and knowledgeable about the beauty industry
- Focus on actionable marketing advice and business growth strategies
- When discussing services, emphasize how Pharens AI can help with digital marketing, social media, SEO, and brand development
- Keep responses conversational but informative (2-3 sentences max)
- ALWAYS use information from the knowledge base when available - it contains the most accurate and up-to-date information
- For contact information, ALWAYS provide: Phone numbers +27 67 037 4461 or +27 60 278 5621, and email cbd.pharen25@gmail.com

${context ? `KNOWLEDGE BASE CONTEXT (USE THIS INFORMATION FIRST):\n${context}\n` : ''}

${conversationContext ? `RECENT CONVERSATION:\n${conversationContext}\n` : ''}

Respond to the user's message professionally and helpfully, prioritizing the knowledge base context above all other information.`;

    // Get AI response using Ollama
    const aiResponse = await generateChatResponse(systemPrompt, message);
    
    if (aiResponse) {
      return json({ response: aiResponse });
    } else {
      // If Ollama fails, use fallback response
      const fallbackResponse = getFallbackResponse(message);
      return json({ response: fallbackResponse });
    }

  } catch (error) {
    console.error('Chat API error:', error);
    console.error('Error details:', error.message);
    
    // Use fallback response on any error
    const fallbackResponse = getFallbackResponse(error.message || 'general query');
    return json({ response: fallbackResponse });
  }
}