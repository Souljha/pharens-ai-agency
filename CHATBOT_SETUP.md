# AI Chatbot with RAG Setup Guide

This guide will help you set up the AI chatbot with Retrieval-Augmented Generation (RAG) capabilities for your Pharens AI website.

## Prerequisites

1. **OpenAI API Key**: You'll need an OpenAI API key to use the chat completions and embeddings API
2. **Supabase Project**: Your existing Supabase project with the vector extension enabled

## Setup Steps

### 1. Environment Configuration

Add your OpenAI API key to your environment variables:

```bash
# Copy the example file if you haven't already
cp .env.example .env.local

# Add your OpenAI API key to .env.local
echo "OPENAI_API_KEY=your-openai-api-key-here" >> .env.local
```

### 2. Database Setup

Run the SQL setup script in your Supabase database:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the contents of `database/setup.sql`

This will:
- Enable the vector extension
- Create the `knowledge_base` table
- Set up vector similarity search functions
- Create necessary indexes

### 3. Populate Knowledge Base

After setting up the database, populate it with beauty industry knowledge:

```bash
# Make a request to populate the knowledge base
curl -X POST http://localhost:3000/api/knowledge \
  -H "Content-Type: application/json" \
  -d '{"action": "populate"}'
```

Or use the browser developer console:
```javascript
fetch('/api/knowledge', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'populate' })
}).then(r => r.json()).then(console.log)
```

### 4. Enable Vector Extension in Supabase

If the vector extension isn't already enabled:

1. Go to your Supabase dashboard
2. Navigate to Database > Extensions
3. Search for "vector" and enable it
4. The extension provides pgvector functionality for vector similarity search

## Features

### RAG System Components

1. **Vector Database**: Uses Supabase's pgvector for storing and searching embeddings
2. **Knowledge Base**: Pre-populated with beauty industry marketing expertise
3. **Embedding Generation**: Uses OpenAI's text-embedding-3-small model
4. **Chat Interface**: Floating widget with conversational UI
5. **Context-Aware Responses**: Leverages relevant knowledge base content

### Chatbot Capabilities

- Beauty marketing strategy advice
- Med spa marketing guidance
- Social media optimization tips
- SEO and content marketing strategies
- Industry trends and innovations
- Pharens AI service information

### Technical Architecture

- **Frontend**: Svelte component with reactive state management
- **Backend**: SvelteKit API routes for chat and knowledge management
- **Database**: Supabase with vector similarity search
- **AI**: OpenAI GPT-4 for responses and text-embedding-3-small for vectors

## API Endpoints

### Chat API (`/api/chat`)
- Handles chat messages
- Performs vector similarity search
- Generates contextual responses using RAG

### Knowledge API (`/api/knowledge`)
- Populates the knowledge base
- Manages beauty industry content
- Creates and stores embeddings

## Customization

### Adding New Knowledge

To add new content to the knowledge base:

1. Edit `src/routes/api/knowledge/+server.js`
2. Add new entries to the `knowledgeBaseContent` array
3. Run the populate endpoint again

### Modifying Chat Behavior

Customize the chatbot personality and responses in:
- `src/routes/api/chat/+server.js` (system prompt)
- `src/lib/components/Chatbot.svelte` (UI behavior)

### Styling

The chatbot uses your existing Tailwind theme:
- Primary colors from your brand palette
- Consistent typography and spacing
- Responsive design for mobile devices

## Troubleshooting

### Common Issues

1. **Vector extension not found**: Enable pgvector in Supabase Extensions
2. **OpenAI API errors**: Check your API key and billing status
3. **No relevant responses**: Ensure knowledge base is populated
4. **CORS errors**: Verify API routes are correctly configured

### Debug Mode

Add console logging to track:
- Vector search results
- Embedding generation
- API response times
- Knowledge base queries

## Performance Considerations

- Vector searches are optimized with IVFFlat indexing
- Conversation history is limited to last 5 messages
- Response tokens are capped at 500 for faster responses
- Knowledge base content is pre-computed and stored

## Security Notes

- API keys are server-side only (not exposed to client)
- Consider rate limiting for production use
- Implement proper authentication for admin functions
- Vector embeddings contain no sensitive information

The chatbot is now integrated into your website and will appear as a floating widget in the bottom-right corner of all pages.