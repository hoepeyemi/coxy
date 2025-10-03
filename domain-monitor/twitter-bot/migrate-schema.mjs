import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

class SchemaMigration {
  constructor() {
    this.migrations = [
      {
        name: 'Add tweet_type column to twitter_tweets',
        sql: `ALTER TABLE twitter_tweets ADD COLUMN IF NOT EXISTS tweet_type VARCHAR(50) DEFAULT 'opportunity';`
      },
      {
        name: 'Add updated_at column to twitter_tweets',
        sql: `ALTER TABLE twitter_tweets ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();`
      },
      {
        name: 'Create twitter_bot_config table',
        sql: `
          CREATE TABLE IF NOT EXISTS twitter_bot_config (
            id SERIAL PRIMARY KEY,
            config_key VARCHAR(100) UNIQUE NOT NULL,
            config_value TEXT NOT NULL,
            description TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'Create twitter_opportunities table',
        sql: `
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
        `
      },
      {
        name: 'Create twitter_engagement table',
        sql: `
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
        `
      },
      {
        name: 'Create twitter_followers table',
        sql: `
          CREATE TABLE IF NOT EXISTS twitter_followers (
            id SERIAL PRIMARY KEY,
            follower_count INTEGER NOT NULL,
            following_count INTEGER NOT NULL,
            tweet_count INTEGER NOT NULL,
            listed_count INTEGER NOT NULL,
            measured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'Update twitter_analytics table structure',
        sql: `
          ALTER TABLE twitter_analytics ADD COLUMN IF NOT EXISTS tweets_posted INTEGER DEFAULT 0;
          ALTER TABLE twitter_analytics ADD COLUMN IF NOT EXISTS opportunities_found INTEGER DEFAULT 0;
          ALTER TABLE twitter_analytics ADD COLUMN IF NOT EXISTS high_value_opportunities INTEGER DEFAULT 0;
          ALTER TABLE twitter_analytics ADD COLUMN IF NOT EXISTS trending_opportunities INTEGER DEFAULT 0;
          ALTER TABLE twitter_analytics ADD COLUMN IF NOT EXISTS expired_opportunities INTEGER DEFAULT 0;
          ALTER TABLE twitter_analytics ADD COLUMN IF NOT EXISTS new_mint_opportunities INTEGER DEFAULT 0;
          ALTER TABLE twitter_analytics ADD COLUMN IF NOT EXISTS short_domain_opportunities INTEGER DEFAULT 0;
          ALTER TABLE twitter_analytics ADD COLUMN IF NOT EXISTS brandable_opportunities INTEGER DEFAULT 0;
          ALTER TABLE twitter_analytics ADD COLUMN IF NOT EXISTS total_engagement INTEGER DEFAULT 0;
          ALTER TABLE twitter_analytics ADD COLUMN IF NOT EXISTS engagement_metrics JSONB;
        `
      },
      {
        name: 'Add unique constraint to twitter_analytics date',
        sql: `ALTER TABLE twitter_analytics ADD CONSTRAINT IF NOT EXISTS twitter_analytics_date_unique UNIQUE (date);`
      },
      {
        name: 'Create indexes for twitter_tweets',
        sql: `
          CREATE INDEX IF NOT EXISTS idx_twitter_tweets_tweet_id ON twitter_tweets(tweet_id);
          CREATE INDEX IF NOT EXISTS idx_twitter_tweets_created_at ON twitter_tweets(created_at);
          CREATE INDEX IF NOT EXISTS idx_twitter_tweets_type ON twitter_tweets(tweet_type);
        `
      },
      {
        name: 'Create indexes for twitter_bot_config',
        sql: `CREATE UNIQUE INDEX IF NOT EXISTS idx_twitter_bot_config_key ON twitter_bot_config(config_key);`
      },
      {
        name: 'Create indexes for twitter_opportunities',
        sql: `
          CREATE INDEX IF NOT EXISTS idx_twitter_opportunities_domain ON twitter_opportunities(domain_name);
          CREATE INDEX IF NOT EXISTS idx_twitter_opportunities_type ON twitter_opportunities(opportunity_type);
          CREATE INDEX IF NOT EXISTS idx_twitter_opportunities_status ON twitter_opportunities(status);
          CREATE INDEX IF NOT EXISTS idx_twitter_opportunities_value ON twitter_opportunities(value_usd);
        `
      },
      {
        name: 'Create indexes for twitter_engagement',
        sql: `
          CREATE INDEX IF NOT EXISTS idx_twitter_engagement_tweet_id ON twitter_engagement(tweet_id);
          CREATE INDEX IF NOT EXISTS idx_twitter_engagement_measured_at ON twitter_engagement(measured_at);
        `
      },
      {
        name: 'Create indexes for twitter_followers',
        sql: `
          CREATE INDEX IF NOT EXISTS idx_twitter_followers_measured_at ON twitter_followers(measured_at);
          CREATE INDEX IF NOT EXISTS idx_twitter_followers_count ON twitter_followers(follower_count);
        `
      },
      {
        name: 'Enable RLS on all tables',
        sql: `
          ALTER TABLE twitter_tweets ENABLE ROW LEVEL SECURITY;
          ALTER TABLE twitter_analytics ENABLE ROW LEVEL SECURITY;
          ALTER TABLE twitter_bot_config ENABLE ROW LEVEL SECURITY;
          ALTER TABLE twitter_opportunities ENABLE ROW LEVEL SECURITY;
          ALTER TABLE twitter_engagement ENABLE ROW LEVEL SECURITY;
          ALTER TABLE twitter_followers ENABLE ROW LEVEL SECURITY;
        `
      },
      {
        name: 'Create RLS policies for twitter_tweets',
        sql: `
          DROP POLICY IF EXISTS "Allow public read access to twitter_tweets" ON twitter_tweets;
          DROP POLICY IF EXISTS "Allow public insert access to twitter_tweets" ON twitter_tweets;
          DROP POLICY IF EXISTS "Allow public update access to twitter_tweets" ON twitter_tweets;
          
          CREATE POLICY "Allow public read access to twitter_tweets" ON twitter_tweets FOR SELECT USING (true);
          CREATE POLICY "Allow public insert access to twitter_tweets" ON twitter_tweets FOR INSERT WITH CHECK (true);
          CREATE POLICY "Allow public update access to twitter_tweets" ON twitter_tweets FOR UPDATE USING (true);
        `
      },
      {
        name: 'Create RLS policies for twitter_analytics',
        sql: `
          DROP POLICY IF EXISTS "Allow public read access to twitter_analytics" ON twitter_analytics;
          DROP POLICY IF EXISTS "Allow public insert access to twitter_analytics" ON twitter_analytics;
          DROP POLICY IF EXISTS "Allow public update access to twitter_analytics" ON twitter_analytics;
          
          CREATE POLICY "Allow public read access to twitter_analytics" ON twitter_analytics FOR SELECT USING (true);
          CREATE POLICY "Allow public insert access to twitter_analytics" ON twitter_analytics FOR INSERT WITH CHECK (true);
          CREATE POLICY "Allow public update access to twitter_analytics" ON twitter_analytics FOR UPDATE USING (true);
        `
      },
      {
        name: 'Create RLS policies for twitter_bot_config',
        sql: `
          DROP POLICY IF EXISTS "Allow public read access to twitter_bot_config" ON twitter_bot_config;
          DROP POLICY IF EXISTS "Allow public insert access to twitter_bot_config" ON twitter_bot_config;
          DROP POLICY IF EXISTS "Allow public update access to twitter_bot_config" ON twitter_bot_config;
          
          CREATE POLICY "Allow public read access to twitter_bot_config" ON twitter_bot_config FOR SELECT USING (true);
          CREATE POLICY "Allow public insert access to twitter_bot_config" ON twitter_bot_config FOR INSERT WITH CHECK (true);
          CREATE POLICY "Allow public update access to twitter_bot_config" ON twitter_bot_config FOR UPDATE USING (true);
        `
      },
      {
        name: 'Create RLS policies for twitter_opportunities',
        sql: `
          DROP POLICY IF EXISTS "Allow public read access to twitter_opportunities" ON twitter_opportunities;
          DROP POLICY IF EXISTS "Allow public insert access to twitter_opportunities" ON twitter_opportunities;
          DROP POLICY IF EXISTS "Allow public update access to twitter_opportunities" ON twitter_opportunities;
          
          CREATE POLICY "Allow public read access to twitter_opportunities" ON twitter_opportunities FOR SELECT USING (true);
          CREATE POLICY "Allow public insert access to twitter_opportunities" ON twitter_opportunities FOR INSERT WITH CHECK (true);
          CREATE POLICY "Allow public update access to twitter_opportunities" ON twitter_opportunities FOR UPDATE USING (true);
        `
      },
      {
        name: 'Create RLS policies for twitter_engagement',
        sql: `
          DROP POLICY IF EXISTS "Allow public read access to twitter_engagement" ON twitter_engagement;
          DROP POLICY IF EXISTS "Allow public insert access to twitter_engagement" ON twitter_engagement;
          DROP POLICY IF EXISTS "Allow public update access to twitter_engagement" ON twitter_engagement;
          
          CREATE POLICY "Allow public read access to twitter_engagement" ON twitter_engagement FOR SELECT USING (true);
          CREATE POLICY "Allow public insert access to twitter_engagement" ON twitter_engagement FOR INSERT WITH CHECK (true);
          CREATE POLICY "Allow public update access to twitter_engagement" ON twitter_engagement FOR UPDATE USING (true);
        `
      },
      {
        name: 'Create RLS policies for twitter_followers',
        sql: `
          DROP POLICY IF EXISTS "Allow public read access to twitter_followers" ON twitter_followers;
          DROP POLICY IF EXISTS "Allow public insert access to twitter_followers" ON twitter_followers;
          DROP POLICY IF EXISTS "Allow public update access to twitter_followers" ON twitter_followers;
          
          CREATE POLICY "Allow public read access to twitter_followers" ON twitter_followers FOR SELECT USING (true);
          CREATE POLICY "Allow public insert access to twitter_followers" ON twitter_followers FOR INSERT WITH CHECK (true);
          CREATE POLICY "Allow public update access to twitter_followers" ON twitter_followers FOR UPDATE USING (true);
        `
      },
      {
        name: 'Insert default configuration',
        sql: `
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
        `
      }
    ];
  }

  async migrate() {
    console.log('🔄 Running Twitter Bot Schema Migration...\n');
    
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < this.migrations.length; i++) {
      const migration = this.migrations[i];
      
      try {
        console.log(`⚡ Migration ${i + 1}/${this.migrations.length}: ${migration.name}`);
        
        const { error } = await supabase.rpc('exec_sql', { sql: migration.sql });
        
        if (error) {
          console.log(`⚠️ Warning: ${error.message}`);
          errorCount++;
        } else {
          console.log(`✅ Success`);
          successCount++;
        }
      } catch (err) {
        console.log(`❌ Error: ${err.message}`);
        errorCount++;
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`⚠️ Warnings/Errors: ${errorCount}`);

    // Verify the migration
    await this.verifyMigration();

    console.log('\n🎉 Migration completed!');
  }

  async verifyMigration() {
    console.log('\n🔍 Verifying migration...');
    
    try {
      // Check if tweet_type column exists
      const { data: columns, error } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_name', 'twitter_tweets')
        .eq('column_name', 'tweet_type');

      if (error) throw error;

      if (columns && columns.length > 0) {
        console.log('✅ tweet_type column exists in twitter_tweets');
      } else {
        console.log('❌ tweet_type column missing in twitter_tweets');
      }

      // Check if twitter_bot_config table exists
      const { data: tables, error: tableError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'twitter_bot_config');

      if (tableError) throw tableError;

      if (tables && tables.length > 0) {
        console.log('✅ twitter_bot_config table exists');
        
        // Check configuration
        const { data: config, error: configError } = await supabase
          .from('twitter_bot_config')
          .select('config_key, config_value');

        if (!configError && config) {
          console.log(`✅ Configuration loaded: ${config.length} settings`);
        }
      } else {
        console.log('❌ twitter_bot_config table missing');
      }

    } catch (error) {
      console.log(`⚠️ Could not verify migration: ${error.message}`);
    }
  }
}

// Run migration
const migration = new SchemaMigration();
migration.migrate().catch(console.error);

