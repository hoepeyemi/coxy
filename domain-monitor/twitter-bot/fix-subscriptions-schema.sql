-- =====================================================
-- Fix User Subscriptions Schema
-- =====================================================
-- This script adds the missing user_subscriptions table
-- and user_preferences table for the Twitter bot
-- =====================================================

-- 1. Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  event_types TEXT[] DEFAULT '{}',
  min_price DECIMAL(10,2) DEFAULT 0,
  max_price DECIMAL(10,2) DEFAULT 999999.99,
  min_length INTEGER DEFAULT 1,
  max_length INTEGER DEFAULT 20,
  extensions TEXT[] DEFAULT '{}',
  notifications BOOLEAN DEFAULT true,
  webhook_url TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns if table already exists
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS webhook_url TEXT;
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS event_types TEXT[] DEFAULT '{}';
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS min_price DECIMAL(10,2) DEFAULT 0;
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS max_price DECIMAL(10,2) DEFAULT 999999.99;
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS min_length INTEGER DEFAULT 1;
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS max_length INTEGER DEFAULT 20;
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS extensions TEXT[] DEFAULT '{}';
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS notifications BOOLEAN DEFAULT true;
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  notification_frequency VARCHAR(20) DEFAULT 'immediate',
  max_notifications_per_day INTEGER DEFAULT 10,
  preferred_extensions TEXT[] DEFAULT '{}',
  price_alerts BOOLEAN DEFAULT true,
  trend_alerts BOOLEAN DEFAULT true,
  expired_alerts BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_is_active ON user_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_created_at ON user_subscriptions(created_at);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_language ON user_preferences(language);

-- 4. Add RLS policies
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Allow public access for bot operations (adjust as needed for security)
CREATE POLICY "Allow public access to user_subscriptions" ON user_subscriptions
  FOR ALL USING (true);

CREATE POLICY "Allow public access to user_preferences" ON user_preferences
  FOR ALL USING (true);

-- 5. Insert sample data (optional)
INSERT INTO user_subscriptions (user_id, event_types, min_price, max_price, notifications, email)
VALUES 
  ('sample_user_1', ARRAY['sale', 'expired'], 100.00, 10000.00, true, 'user1@example.com'),
  ('sample_user_2', ARRAY['sale', 'new_mint'], 50.00, 5000.00, true, 'user2@example.com')
ON CONFLICT DO NOTHING;

INSERT INTO user_preferences (user_id, language, timezone, notification_frequency)
VALUES 
  ('sample_user_1', 'en', 'UTC', 'immediate'),
  ('sample_user_2', 'en', 'UTC', 'daily')
ON CONFLICT (user_id) DO NOTHING;

-- 6. Verify tables were created
SELECT 'user_subscriptions table created' as status;
SELECT 'user_preferences table created' as status;
