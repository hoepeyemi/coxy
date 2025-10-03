import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function setupDatabase() {
  console.log('Setting up domain monitoring database tables...');

  try {
    // Create domain_events table
    const { error: eventsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS domain_events (
          id SERIAL PRIMARY KEY,
          event_id BIGINT UNIQUE NOT NULL,
          name TEXT,
          token_id TEXT,
          type TEXT NOT NULL,
          unique_id TEXT,
          relay_id TEXT,
          event_data JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_domain_events_type ON domain_events(type);
        CREATE INDEX IF NOT EXISTS idx_domain_events_created_at ON domain_events(created_at);
        CREATE INDEX IF NOT EXISTS idx_domain_events_event_id ON domain_events(event_id);
      `
    });

    if (eventsError) {
      console.error('Error creating domain_events table:', eventsError);
    } else {
      console.log('✅ domain_events table created');
    }

    // Create domain_subscriptions table
    const { error: subscriptionsError } = await supabase.rpc('exec_sql', {
      sql: `
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
        
        CREATE INDEX IF NOT EXISTS idx_domain_subscriptions_event_type ON domain_subscriptions(event_type);
        CREATE INDEX IF NOT EXISTS idx_domain_subscriptions_user_id ON domain_subscriptions(user_id);
        CREATE INDEX IF NOT EXISTS idx_domain_subscriptions_active ON domain_subscriptions(is_active);
      `
    });

    if (subscriptionsError) {
      console.error('Error creating domain_subscriptions table:', subscriptionsError);
    } else {
      console.log('✅ domain_subscriptions table created');
    }

    // Create webhook_deliveries table
    const { error: deliveriesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS webhook_deliveries (
          id SERIAL PRIMARY KEY,
          subscription_id INTEGER REFERENCES domain_subscriptions(id),
          event_id BIGINT,
          webhook_url TEXT NOT NULL,
          status TEXT NOT NULL,
          response_status INTEGER,
          error_message TEXT,
          delivered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_subscription_id ON webhook_deliveries(subscription_id);
        CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_status ON webhook_deliveries(status);
        CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_delivered_at ON webhook_deliveries(delivered_at);
      `
    });

    if (deliveriesError) {
      console.error('Error creating webhook_deliveries table:', deliveriesError);
    } else {
      console.log('✅ webhook_deliveries table created');
    }

    // Create domain_analytics table for aggregated data
    const { error: analyticsError } = await supabase.rpc('exec_sql', {
      sql: `
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
        
        CREATE UNIQUE INDEX IF NOT EXISTS idx_domain_analytics_domain_name ON domain_analytics(domain_name);
        CREATE INDEX IF NOT EXISTS idx_domain_analytics_token_id ON domain_analytics(token_id);
        CREATE INDEX IF NOT EXISTS idx_domain_analytics_last_event_at ON domain_analytics(last_event_at);
      `
    });

    if (analyticsError) {
      console.error('Error creating domain_analytics table:', analyticsError);
    } else {
      console.log('✅ domain_analytics table created');
    }

    // Create domain_traits table for trait-based scoring
    const { error: traitsError } = await supabase.rpc('exec_sql', {
      sql: `
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
        
        CREATE UNIQUE INDEX IF NOT EXISTS idx_domain_traits_domain_name ON domain_traits(domain_name);
        CREATE INDEX IF NOT EXISTS idx_domain_traits_length ON domain_traits(length);
        CREATE INDEX IF NOT EXISTS idx_domain_traits_extension ON domain_traits(extension);
      `
    });

    if (traitsError) {
      console.error('Error creating domain_traits table:', traitsError);
    } else {
      console.log('✅ domain_traits table created');
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\nTables created:');
    console.log('- domain_events: Stores all domain events from Doma Protocol');
    console.log('- domain_subscriptions: User subscriptions for webhook notifications');
    console.log('- webhook_deliveries: Logs of webhook delivery attempts');
    console.log('- domain_analytics: Aggregated analytics for each domain');
    console.log('- domain_traits: Domain characteristics for scoring and filtering');

  } catch (error) {
    console.error('Database setup failed:', error);
  }
}

setupDatabase();

