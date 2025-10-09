# 🚨 Quick Fix: Missing Subscriptions Tables

## **Problem**
The Twitter bot is failing with this error:
```
Error loading subscriptions: {
  code: '42703',
  details: null,
  hint: null,
  message: 'column user_subscriptions.webhook_url does not exist'
}
```

## **Root Cause**
The `user_subscriptions` and `user_preferences` tables don't exist in your Supabase database.

## **Quick Fix (2 minutes)**

### **Step 1: Go to Supabase Dashboard**
1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** (left sidebar)

### **Step 2: Run This SQL**
Copy and paste this SQL into the SQL editor and click **Run**:

```sql
-- Create user_subscriptions table
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

-- Create user_preferences table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_is_active ON user_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Allow public access (adjust for your security needs)
CREATE POLICY "Allow public access to user_subscriptions" ON user_subscriptions
  FOR ALL USING (true);

CREATE POLICY "Allow public access to user_preferences" ON user_preferences
  FOR ALL USING (true);

-- Insert sample data
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
```

### **Step 3: Verify Tables Created**
After running the SQL, check that the tables exist:
1. Go to **Table Editor** in Supabase
2. You should see `user_subscriptions` and `user_preferences` tables
3. Each should have some sample data

### **Step 4: Test the Bot**
Run your Twitter bot again:
```bash
cd domain-monitor/twitter-bot
node coxy-optimized-bot.mjs
```

## **Expected Result**
✅ The bot should start without subscription errors
✅ You should see: "✅ Loaded X active subscriptions"
✅ You should see: "✅ Loaded X user preferences"

## **Alternative: Use the Setup Script**
If you prefer to run it programmatically:

```bash
cd domain-monitor/twitter-bot
node setup-subscriptions.mjs
```

## **What This Fixes**
- ✅ Creates missing `user_subscriptions` table
- ✅ Creates missing `user_preferences` table  
- ✅ Adds proper indexes for performance
- ✅ Enables Row Level Security
- ✅ Adds sample data for testing
- ✅ Bot can now load subscriptions without errors

The bot should now start successfully! 🚀
