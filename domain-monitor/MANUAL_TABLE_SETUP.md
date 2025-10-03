# Manual Table Setup Instructions

The application is missing two required tables: `user_subscriptions` and `user_preferences`. 

## Quick Fix

1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/wzohdsxbhwkrxqumejar/sql

2. **Run the following SQL in the SQL Editor:**

```sql
-- Create user_subscriptions table
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

-- Create user_preferences table
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

-- Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access to user_subscriptions" 
ON user_subscriptions FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to user_subscriptions" 
ON user_subscriptions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to user_subscriptions" 
ON user_subscriptions FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to user_subscriptions" 
ON user_subscriptions FOR DELETE USING (true);

CREATE POLICY "Allow public read access to user_preferences" 
ON user_preferences FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to user_preferences" 
ON user_preferences FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to user_preferences" 
ON user_preferences FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to user_preferences" 
ON user_preferences FOR DELETE USING (true);

-- Insert sample data
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
```

3. **Click "Run" to execute the SQL**

4. **Verify the tables were created:**
   - Go to the "Table Editor" in your Supabase dashboard
   - You should see `user_subscriptions` and `user_preferences` tables

## What This Fixes

- ✅ Resolves "Could not find the table 'public.user_subscriptions'" error
- ✅ Resolves "Could not find the table 'public.user_preferences'" error  
- ✅ Enables the Twitter bot to load user preferences
- ✅ Enables the subscription manager to work properly

## After Setup

Once the tables are created, the application should work without these database errors. You can then:

1. Start the domain monitor: `npm start`
2. Run the Twitter bot without table errors
3. Use the subscription management features in the dashboard

The error messages should disappear and you should see:
- ✅ Loaded X user preferences
- ✅ Loaded X subscriptions
