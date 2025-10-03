-- =====================================================
-- Enhanced Twitter Bot Database Schema for Supabase
-- =====================================================
-- Run this SQL in your Supabase dashboard SQL editor
-- Go to: https://supabase.com/dashboard/project/[your-project]/sql
-- =====================================================

-- 1. Create twitter_tweets table
-- Stores all bot tweets and engagement data
CREATE TABLE IF NOT EXISTS twitter_tweets (
  id SERIAL PRIMARY KEY,
  tweet_id TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  opportunities_data JSONB,
  tweet_type VARCHAR(50) DEFAULT 'opportunity',
  engagement_metrics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for twitter_tweets
CREATE INDEX IF NOT EXISTS idx_twitter_tweets_tweet_id ON twitter_tweets(tweet_id);
CREATE INDEX IF NOT EXISTS idx_twitter_tweets_created_at ON twitter_tweets(created_at);
CREATE INDEX IF NOT EXISTS idx_twitter_tweets_content ON twitter_tweets USING gin(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_twitter_tweets_type ON twitter_tweets(tweet_type);

-- 2. Create twitter_analytics table
-- Daily analytics and performance metrics
CREATE TABLE IF NOT EXISTS twitter_analytics (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  tweets_posted INTEGER DEFAULT 0,
  opportunities_found INTEGER DEFAULT 0,
  high_value_opportunities INTEGER DEFAULT 0,
  trending_opportunities INTEGER DEFAULT 0,
  expired_opportunities INTEGER DEFAULT 0,
  new_mint_opportunities INTEGER DEFAULT 0,
  short_domain_opportunities INTEGER DEFAULT 0,
  brandable_opportunities INTEGER DEFAULT 0,
  total_engagement INTEGER DEFAULT 0,
  engagement_metrics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date)
);

-- Indexes for twitter_analytics
CREATE UNIQUE INDEX IF NOT EXISTS idx_twitter_analytics_date ON twitter_analytics(date);
CREATE INDEX IF NOT EXISTS idx_twitter_analytics_tweets_posted ON twitter_analytics(tweets_posted);
CREATE INDEX IF NOT EXISTS idx_twitter_analytics_opportunities_found ON twitter_analytics(opportunities_found);

-- 3. Create twitter_bot_config table
-- Bot configuration settings
CREATE TABLE IF NOT EXISTS twitter_bot_config (
  id SERIAL PRIMARY KEY,
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for twitter_bot_config
CREATE UNIQUE INDEX IF NOT EXISTS idx_twitter_bot_config_key ON twitter_bot_config(config_key);

-- 4. Create twitter_opportunities table
-- Tracks specific domain opportunities
CREATE TABLE IF NOT EXISTS twitter_opportunities (
  id SERIAL PRIMARY KEY,
  domain_name TEXT NOT NULL,
  opportunity_type TEXT NOT NULL,
  value_usd DECIMAL(20,2),
  activity_count INTEGER DEFAULT 0,
  brandability_score INTEGER,
  domain_length INTEGER,
  tweet_id TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for twitter_opportunities
CREATE INDEX IF NOT EXISTS idx_twitter_opportunities_domain ON twitter_opportunities(domain_name);
CREATE INDEX IF NOT EXISTS idx_twitter_opportunities_type ON twitter_opportunities(opportunity_type);
CREATE INDEX IF NOT EXISTS idx_twitter_opportunities_status ON twitter_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_twitter_opportunities_value ON twitter_opportunities(value_usd);
CREATE INDEX IF NOT EXISTS idx_twitter_opportunities_created_at ON twitter_opportunities(created_at);

-- 5. Create twitter_engagement table
-- Tracks individual tweet engagement metrics
CREATE TABLE IF NOT EXISTS twitter_engagement (
  id SERIAL PRIMARY KEY,
  tweet_id TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  retweets_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  quotes_count INTEGER DEFAULT 0,
  impressions_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  measured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for twitter_engagement
CREATE INDEX IF NOT EXISTS idx_twitter_engagement_tweet_id ON twitter_engagement(tweet_id);
CREATE INDEX IF NOT EXISTS idx_twitter_engagement_measured_at ON twitter_engagement(measured_at);
CREATE INDEX IF NOT EXISTS idx_twitter_engagement_rate ON twitter_engagement(engagement_rate);

-- 6. Create twitter_followers table
-- Tracks follower growth and demographics
CREATE TABLE IF NOT EXISTS twitter_followers (
  id SERIAL PRIMARY KEY,
  follower_count INTEGER NOT NULL,
  following_count INTEGER NOT NULL,
  tweet_count INTEGER NOT NULL,
  listed_count INTEGER NOT NULL,
  measured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for twitter_followers
CREATE INDEX IF NOT EXISTS idx_twitter_followers_measured_at ON twitter_followers(measured_at);
CREATE INDEX IF NOT EXISTS idx_twitter_followers_count ON twitter_followers(follower_count);

-- =====================================================
-- Row Level Security (RLS) Configuration
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE twitter_tweets ENABLE ROW LEVEL SECURITY;
ALTER TABLE twitter_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE twitter_bot_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE twitter_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE twitter_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE twitter_followers ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies for Public Access
-- =====================================================

-- Twitter Tweets - Allow public read access
CREATE POLICY "Allow public read access to twitter_tweets" 
ON twitter_tweets FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to twitter_tweets" 
ON twitter_tweets FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access to twitter_tweets" 
ON twitter_tweets FOR UPDATE 
USING (true);

-- Twitter Analytics - Allow public read access
CREATE POLICY "Allow public read access to twitter_analytics" 
ON twitter_analytics FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to twitter_analytics" 
ON twitter_analytics FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access to twitter_analytics" 
ON twitter_analytics FOR UPDATE 
USING (true);

-- Twitter Bot Config - Allow public read access
CREATE POLICY "Allow public read access to twitter_bot_config" 
ON twitter_bot_config FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to twitter_bot_config" 
ON twitter_bot_config FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access to twitter_bot_config" 
ON twitter_bot_config FOR UPDATE 
USING (true);

-- Twitter Opportunities - Allow public read access
CREATE POLICY "Allow public read access to twitter_opportunities" 
ON twitter_opportunities FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to twitter_opportunities" 
ON twitter_opportunities FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access to twitter_opportunities" 
ON twitter_opportunities FOR UPDATE 
USING (true);

-- Twitter Engagement - Allow public read access
CREATE POLICY "Allow public read access to twitter_engagement" 
ON twitter_engagement FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to twitter_engagement" 
ON twitter_engagement FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access to twitter_engagement" 
ON twitter_engagement FOR UPDATE 
USING (true);

-- Twitter Followers - Allow public read access
CREATE POLICY "Allow public read access to twitter_followers" 
ON twitter_followers FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to twitter_followers" 
ON twitter_followers FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access to twitter_followers" 
ON twitter_followers FOR UPDATE 
USING (true);

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

-- Triggers to automatically update updated_at
CREATE TRIGGER update_twitter_tweets_updated_at 
    BEFORE UPDATE ON twitter_tweets 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_twitter_analytics_updated_at 
    BEFORE UPDATE ON twitter_analytics 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_twitter_bot_config_updated_at 
    BEFORE UPDATE ON twitter_bot_config 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_twitter_opportunities_updated_at 
    BEFORE UPDATE ON twitter_opportunities 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate engagement rate
CREATE OR REPLACE FUNCTION calculate_engagement_rate(
  likes INTEGER,
  retweets INTEGER,
  replies INTEGER,
  quotes INTEGER,
  impressions INTEGER
) RETURNS DECIMAL(5,2) AS $$
BEGIN
  IF impressions = 0 THEN
    RETURN 0;
  END IF;
  
  RETURN ROUND(
    ((likes + retweets + replies + quotes)::DECIMAL / impressions * 100), 
    2
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Insert Default Configuration
-- =====================================================

-- Insert default bot configuration
INSERT INTO twitter_bot_config (config_key, config_value, description) VALUES
('high_value_threshold', '1000', 'Minimum price threshold for high-value domain alerts'),
('trending_threshold', '5', 'Minimum event count for trending domain detection'),
('tweet_interval_minutes', '30', 'Interval between opportunity tweets in minutes'),
('max_tweets_per_day', '20', 'Maximum number of tweets per day'),
('bot_status', 'active', 'Current bot status (active/inactive)'),
('openai_model', 'gpt-4', 'OpenAI model to use for tweet generation'),
('enable_daily_summary', 'true', 'Enable daily summary tweets'),
('enable_weekly_analysis', 'true', 'Enable weekly analysis tweets'),
('min_opportunity_score', '50', 'Minimum opportunity score to tweet about')
ON CONFLICT (config_key) DO UPDATE SET
  config_value = EXCLUDED.config_value,
  updated_at = NOW();

-- Insert sample analytics for today
INSERT INTO twitter_analytics (date, tweets_posted, opportunities_found, high_value_opportunities, trending_opportunities)
VALUES (
  CURRENT_DATE,
  0,
  0,
  0,
  0
) ON CONFLICT (date) DO NOTHING;

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
    'twitter_tweets',
    'twitter_analytics', 
    'twitter_bot_config',
    'twitter_opportunities',
    'twitter_engagement',
    'twitter_followers'
  )
ORDER BY table_name;

-- Check if all indexes were created
SELECT 
  indexname,
  tablename
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN (
    'twitter_tweets',
    'twitter_analytics', 
    'twitter_bot_config',
    'twitter_opportunities',
    'twitter_engagement',
    'twitter_followers'
  )
ORDER BY tablename, indexname;

-- Check configuration
SELECT config_key, config_value, description 
FROM twitter_bot_config 
ORDER BY config_key;

-- =====================================================
-- Schema Setup Complete!
-- =====================================================
-- All tables, indexes, policies, and triggers have been created.
-- Default configuration has been inserted.
-- You can now run the Twitter bot with: npm start
-- =====================================================

