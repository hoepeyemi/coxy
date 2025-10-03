-- =====================================================
-- Domain Monitor Database Schema for Supabase
-- =====================================================
-- Run this SQL in your Supabase dashboard SQL editor
-- Go to: https://supabase.com/dashboard/project/[your-project]/sql
-- =====================================================

-- 1. Create domain_events table
-- Stores all domain events from Doma Protocol API
CREATE TABLE IF NOT EXISTS domain_events (
  id SERIAL PRIMARY KEY,
  event_id BIGINT UNIQUE NOT NULL,
  name TEXT,
  token_id TEXT,
  type TEXT NOT NULL,
  unique_id TEXT,
  relay_id TEXT,
  event_data JSONB,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for domain_events
CREATE INDEX IF NOT EXISTS idx_domain_events_type ON domain_events(type);
CREATE INDEX IF NOT EXISTS idx_domain_events_created_at ON domain_events(created_at);
CREATE INDEX IF NOT EXISTS idx_domain_events_event_id ON domain_events(event_id);
CREATE INDEX IF NOT EXISTS idx_domain_events_processed ON domain_events(processed);
CREATE INDEX IF NOT EXISTS idx_domain_events_name ON domain_events(name);

-- 2. Create domain_subscriptions table
-- User webhook subscriptions for domain events
CREATE TABLE IF NOT EXISTS domain_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  event_type TEXT NOT NULL,
  webhook_url TEXT NOT NULL,
  filters JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for domain_subscriptions
CREATE INDEX IF NOT EXISTS idx_domain_subscriptions_event_type ON domain_subscriptions(event_type);
CREATE INDEX IF NOT EXISTS idx_domain_subscriptions_user_id ON domain_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_domain_subscriptions_active ON domain_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_domain_subscriptions_created_at ON domain_subscriptions(created_at);

-- 3. Create webhook_deliveries table
-- Logs of webhook delivery attempts and status
CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id SERIAL PRIMARY KEY,
  subscription_id INTEGER REFERENCES domain_subscriptions(id) ON DELETE CASCADE,
  event_id BIGINT,
  webhook_url TEXT NOT NULL,
  status TEXT NOT NULL,
  response_status INTEGER,
  error_message TEXT,
  delivered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for webhook_deliveries
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_subscription_id ON webhook_deliveries(subscription_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_status ON webhook_deliveries(status);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_delivered_at ON webhook_deliveries(delivered_at);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_event_id ON webhook_deliveries(event_id);

-- 4. Create domain_analytics table
-- Aggregated analytics for each domain
CREATE TABLE IF NOT EXISTS domain_analytics (
  id SERIAL PRIMARY KEY,
  domain_name TEXT NOT NULL,
  token_id TEXT,
  total_events INTEGER DEFAULT 0,
  last_event_type TEXT,
  last_event_at TIMESTAMP WITH TIME ZONE,
  total_volume_usd DECIMAL(20,2) DEFAULT 0,
  highest_price_usd DECIMAL(20,2) DEFAULT 0,
  lowest_price_usd DECIMAL(20,2) DEFAULT 0,
  offer_count INTEGER DEFAULT 0,
  trade_count INTEGER DEFAULT 0,
  is_fractionalized BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for domain_analytics
CREATE UNIQUE INDEX IF NOT EXISTS idx_domain_analytics_domain_name ON domain_analytics(domain_name);
CREATE INDEX IF NOT EXISTS idx_domain_analytics_token_id ON domain_analytics(token_id);
CREATE INDEX IF NOT EXISTS idx_domain_analytics_last_event_at ON domain_analytics(last_event_at);
CREATE INDEX IF NOT EXISTS idx_domain_analytics_total_volume ON domain_analytics(total_volume_usd);
CREATE INDEX IF NOT EXISTS idx_domain_analytics_trade_count ON domain_analytics(trade_count);

-- 5. Create domain_traits table
-- Domain characteristics for scoring and filtering
CREATE TABLE IF NOT EXISTS domain_traits (
  id SERIAL PRIMARY KEY,
  domain_name TEXT NOT NULL,
  token_id TEXT,
  length INTEGER,
  extension TEXT,
  has_numbers BOOLEAN,
  has_hyphens BOOLEAN,
  has_underscores BOOLEAN,
  word_count INTEGER,
  is_palindrome BOOLEAN,
  is_pronounceable BOOLEAN,
  character_diversity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for domain_traits
CREATE UNIQUE INDEX IF NOT EXISTS idx_domain_traits_domain_name ON domain_traits(domain_name);
CREATE INDEX IF NOT EXISTS idx_domain_traits_length ON domain_traits(length);
CREATE INDEX IF NOT EXISTS idx_domain_traits_extension ON domain_traits(extension);
CREATE INDEX IF NOT EXISTS idx_domain_traits_has_numbers ON domain_traits(has_numbers);
CREATE INDEX IF NOT EXISTS idx_domain_traits_is_palindrome ON domain_traits(is_palindrome);

-- =====================================================
-- Row Level Security (RLS) Configuration
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE domain_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_traits ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies for Public Access
-- =====================================================

-- Domain Events - Allow public read and insert access
CREATE POLICY "Allow public read access to domain_events" 
ON domain_events FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to domain_events" 
ON domain_events FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access to domain_events" 
ON domain_events FOR UPDATE 
USING (true);

-- Domain Subscriptions - Allow full CRUD for public (adjust for your security needs)
CREATE POLICY "Allow public read access to domain_subscriptions" 
ON domain_subscriptions FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to domain_subscriptions" 
ON domain_subscriptions FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access to domain_subscriptions" 
ON domain_subscriptions FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete access to domain_subscriptions" 
ON domain_subscriptions FOR DELETE 
USING (true);

-- Webhook Deliveries - Allow public read access
CREATE POLICY "Allow public read access to webhook_deliveries" 
ON webhook_deliveries FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to webhook_deliveries" 
ON webhook_deliveries FOR INSERT 
WITH CHECK (true);

-- Domain Analytics - Allow public read access
CREATE POLICY "Allow public read access to domain_analytics" 
ON domain_analytics FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to domain_analytics" 
ON domain_analytics FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access to domain_analytics" 
ON domain_analytics FOR UPDATE 
USING (true);

-- Domain Traits - Allow public read access
CREATE POLICY "Allow public read access to domain_traits" 
ON domain_traits FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to domain_traits" 
ON domain_traits FOR INSERT 
WITH CHECK (true);

-- =====================================================
-- Functions and Triggers
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at on domain_subscriptions
CREATE TRIGGER update_domain_subscriptions_updated_at 
    BEFORE UPDATE ON domain_subscriptions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to automatically update updated_at on domain_analytics
CREATE TRIGGER update_domain_analytics_updated_at 
    BEFORE UPDATE ON domain_analytics 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Sample Data (Optional)
-- =====================================================

-- Insert sample subscription for testing
INSERT INTO domain_subscriptions (user_id, event_type, webhook_url, filters, is_active)
VALUES (
  'sample-user-123',
  'NAME_TOKEN_LISTED',
  'https://webhook.site/sample-webhook',
  '{"minPrice": 1000, "extensions": [".com", ".eth"]}',
  true
) ON CONFLICT DO NOTHING;

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check if all tables were created successfully
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'domain_events',
    'domain_subscriptions', 
    'webhook_deliveries',
    'domain_analytics',
    'domain_traits'
  )
ORDER BY table_name;

-- Check if all indexes were created
SELECT 
  indexname,
  tablename
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN (
    'domain_events',
    'domain_subscriptions', 
    'webhook_deliveries',
    'domain_analytics',
    'domain_traits'
  )
ORDER BY tablename, indexname;

-- =====================================================
-- Schema Setup Complete!
-- =====================================================
-- All tables, indexes, policies, and triggers have been created.
-- You can now run the domain monitor with: npm start
-- =====================================================
