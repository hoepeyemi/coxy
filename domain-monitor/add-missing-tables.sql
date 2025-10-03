-- =====================================================
-- Add Missing Tables for User Subscriptions and Preferences
-- =====================================================
-- Run this SQL in your Supabase dashboard SQL editor
-- Go to: https://supabase.com/dashboard/project/[your-project]/sql
-- =====================================================

-- 1. Create user_subscriptions table
-- This table stores user-specific subscription preferences
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  event_types TEXT[] DEFAULT '{}',
  min_price DECIMAL(20,2) DEFAULT 0,
  max_price DECIMAL(20,2),
  min_length INTEGER DEFAULT 1,
  max_length INTEGER DEFAULT 20,
  extensions TEXT[] DEFAULT '{}',
  notifications BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for user_subscriptions
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_active ON user_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_created_at ON user_subscriptions(created_at);

-- 2. Create user_preferences table
-- This table stores user-specific preferences for the Twitter bot
CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  notification_frequency TEXT DEFAULT 'immediate',
  max_notifications_per_day INTEGER DEFAULT 10,
  preferred_extensions TEXT[] DEFAULT '{}',
  price_alerts BOOLEAN DEFAULT true,
  trend_alerts BOOLEAN DEFAULT true,
  expired_alerts BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for user_preferences
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_language ON user_preferences(language);
CREATE INDEX IF NOT EXISTS idx_user_preferences_timezone ON user_preferences(timezone);

-- =====================================================
-- Row Level Security (RLS) Configuration
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies for Public Access
-- =====================================================

-- User Subscriptions - Allow full CRUD for public (adjust for your security needs)
CREATE POLICY "Allow public read access to user_subscriptions" 
ON user_subscriptions FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to user_subscriptions" 
ON user_subscriptions FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access to user_subscriptions" 
ON user_subscriptions FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete access to user_subscriptions" 
ON user_subscriptions FOR DELETE 
USING (true);

-- User Preferences - Allow full CRUD for public (adjust for your security needs)
CREATE POLICY "Allow public read access to user_preferences" 
ON user_preferences FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to user_preferences" 
ON user_preferences FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access to user_preferences" 
ON user_preferences FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete access to user_preferences" 
ON user_preferences FOR DELETE 
USING (true);

-- =====================================================
-- Triggers for Updated At
-- =====================================================

-- Trigger to automatically update updated_at on user_subscriptions
CREATE TRIGGER update_user_subscriptions_updated_at 
    BEFORE UPDATE ON user_subscriptions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to automatically update updated_at on user_preferences
CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON user_preferences 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Sample Data (Optional)
-- =====================================================

-- Insert sample user subscription for testing
INSERT INTO user_subscriptions (
  user_id, 
  event_types, 
  min_price, 
  max_price, 
  min_length, 
  max_length, 
  extensions, 
  notifications, 
  is_active
)
VALUES (
  'demo-user-123',
  ARRAY['NAME_TOKEN_MINTED', 'NAME_TOKENIZED', 'NAME_CLAIMED'],
  1000,
  100000,
  3,
  15,
  ARRAY['.com', '.eth', '.sol'],
  true,
  true
) ON CONFLICT DO NOTHING;

-- Insert sample user preferences for testing
INSERT INTO user_preferences (
  user_id,
  language,
  timezone,
  notification_frequency,
  max_notifications_per_day,
  preferred_extensions,
  price_alerts,
  trend_alerts,
  expired_alerts
)
VALUES (
  'demo-user-123',
  'en',
  'UTC',
  'immediate',
  20,
  ARRAY['.com', '.eth', '.sol'],
  true,
  true,
  true
) ON CONFLICT (user_id) DO NOTHING;

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check if new tables were created successfully
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'user_subscriptions',
    'user_preferences'
  )
ORDER BY table_name;

-- Check if all indexes were created
SELECT 
  indexname,
  tablename
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN (
    'user_subscriptions',
    'user_preferences'
  )
ORDER BY tablename, indexname;

-- =====================================================
-- Missing Tables Setup Complete!
-- =====================================================
-- The user_subscriptions and user_preferences tables have been created.
-- The application should now be able to access these tables without errors.
-- =====================================================
