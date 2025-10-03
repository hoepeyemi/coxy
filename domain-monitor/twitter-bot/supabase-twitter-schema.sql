-- =====================================================
-- Twitter Bot Database Schema for Supabase
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
  engagement_metrics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for twitter_tweets
CREATE INDEX IF NOT EXISTS idx_twitter_tweets_tweet_id ON twitter_tweets(tweet_id);
CREATE INDEX IF NOT EXISTS idx_twitter_tweets_created_at ON twitter_tweets(created_at);
CREATE INDEX IF NOT EXISTS idx_twitter_tweets_content ON twitter_tweets USING gin(to_tsvector('english', content));

-- 2. Create twitter_analytics table
-- Daily analytics and performance metrics
CREATE TABLE IF NOT EXISTS twitter_analytics (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  total_tweets INTEGER DEFAULT 0,
  total_engagement INTEGER DEFAULT 0,
  high_value_alerts INTEGER DEFAULT 0,
  trending_alerts INTEGER DEFAULT 0,
  expired_alerts INTEGER DEFAULT 0,
  new_mint_alerts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for twitter_analytics
CREATE UNIQUE INDEX IF NOT EXISTS idx_twitter_analytics_date ON twitter_analytics(date);
CREATE INDEX IF NOT EXISTS idx_twitter_analytics_total_tweets ON twitter_analytics(total_tweets);
CREATE INDEX IF NOT EXISTS idx_twitter_analytics_total_engagement ON twitter_analytics(total_engagement);

-- 3. Create twitter_opportunities table
-- Tracks specific domain opportunities
CREATE TABLE IF NOT EXISTS twitter_opportunities (
  id SERIAL PRIMARY KEY,
  domain_name TEXT NOT NULL,
  opportunity_type TEXT NOT NULL,
  value_usd DECIMAL(20,2),
  activity_count INTEGER DEFAULT 0,
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

-- 4. Create twitter_engagement table
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

-- 5. Create twitter_followers table
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

-- Trigger to automatically update updated_at on twitter_analytics
CREATE TRIGGER update_twitter_analytics_updated_at 
    BEFORE UPDATE ON twitter_analytics 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to automatically update updated_at on twitter_opportunities
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
-- Sample Data (Optional)
-- =====================================================

-- Insert sample analytics for testing
INSERT INTO twitter_analytics (date, total_tweets, total_engagement, high_value_alerts, trending_alerts)
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
    'twitter_opportunities',
    'twitter_engagement',
    'twitter_followers'
  )
ORDER BY tablename, indexname;

-- =====================================================
-- Schema Setup Complete!
-- =====================================================
-- All tables, indexes, policies, and triggers have been created.
-- You can now run the Twitter bot with: npm start
-- =====================================================


