-- Payments Table Schema for Pharens AI Agency
-- Run this SQL in your Supabase SQL Editor to create the payments table

CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'ZAR',
  plan_name VARCHAR(100) NOT NULL,
  service_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on reference for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(reference);

-- Create index on email for customer queries
CREATE INDEX IF NOT EXISTS idx_payments_email ON payments(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Create index on created_at for chronological queries
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for webhook)
CREATE POLICY "Allow public insert" ON payments
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow authenticated reads (optional - adjust based on your needs)
-- Uncomment if you want to allow users to view their own payments
-- CREATE POLICY "Allow authenticated read own payments" ON payments
--   FOR SELECT
--   USING (auth.email() = email);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function on every update
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for successful payments only
CREATE OR REPLACE VIEW successful_payments AS
SELECT
  id,
  reference,
  email,
  amount,
  currency,
  plan_name,
  service_type,
  paid_at,
  metadata,
  created_at
FROM payments
WHERE status = 'success'
ORDER BY paid_at DESC;

-- Comment on table
COMMENT ON TABLE payments IS 'Stores payment records from Paystack for Pharens AI Agency subscriptions';

-- Comments on columns
COMMENT ON COLUMN payments.reference IS 'Unique Paystack transaction reference';
COMMENT ON COLUMN payments.email IS 'Customer email address';
COMMENT ON COLUMN payments.amount IS 'Payment amount in Rands (ZAR)';
COMMENT ON COLUMN payments.plan_name IS 'Name of the selected pricing plan';
COMMENT ON COLUMN payments.service_type IS 'Type of service (medspa or ecommerce)';
COMMENT ON COLUMN payments.status IS 'Payment status: pending, success, or failed';
COMMENT ON COLUMN payments.metadata IS 'Additional payment metadata from Paystack';
