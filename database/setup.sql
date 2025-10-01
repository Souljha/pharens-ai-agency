-- Enable the vector extension for Supabase
CREATE EXTENSION IF NOT EXISTS vector;

-- Create knowledge_base table for RAG system
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  embedding vector(1536), -- OpenAI text-embedding-3-small produces 1536-dimensional vectors
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create an index for vector similarity search
CREATE INDEX IF NOT EXISTS knowledge_base_embedding_idx ON knowledge_base 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create a function to search the knowledge base using vector similarity
CREATE OR REPLACE FUNCTION search_knowledge_base(
  query_embedding vector(1536),
  similarity_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  title text,
  content text,
  category text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.title,
    kb.content,
    kb.category,
    1 - (kb.embedding <=> query_embedding) AS similarity
  FROM knowledge_base kb
  WHERE 1 - (kb.embedding <=> query_embedding) > similarity_threshold
  ORDER BY kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create function to ensure vector extension is available
CREATE OR REPLACE FUNCTION ensure_vector_extension()
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- This function helps ensure the vector extension is properly set up
  IF NOT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'vector'
  ) THEN
    RAISE EXCEPTION 'Vector extension is not installed. Please enable it in your Supabase dashboard.';
  END IF;
  
  RETURN true;
END;
$$;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_knowledge_base_updated_at 
  BEFORE UPDATE ON knowledge_base 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions (adjust as needed for your setup)
-- These might need to be run by a superuser or adjusted based on your Supabase setup
-- ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- You may want to create policies for row level security here
-- Example policy (uncomment and modify as needed):
-- CREATE POLICY "Allow authenticated users to read knowledge base" ON knowledge_base
--   FOR SELECT TO authenticated USING (true);

COMMENT ON TABLE knowledge_base IS 'Stores knowledge base content with vector embeddings for RAG chatbot system';
COMMENT ON COLUMN knowledge_base.embedding IS 'Vector embedding generated from title + content using OpenAI text-embedding-3-small';
COMMENT ON FUNCTION search_knowledge_base IS 'Searches knowledge base using vector similarity with configurable threshold and limit';