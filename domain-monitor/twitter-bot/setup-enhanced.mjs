import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

class TwitterBotSetup {
  constructor() {
    this.requiredEnvVars = [
      'TWITTER_API_KEY',
      'TWITTER_API_SECRET', 
      'TWITTER_ACCESS_TOKEN',
      'TWITTER_ACCESS_SECRET',
      'OPENAI_API_KEY',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY'
    ];
  }

  async setup() {
    console.log('🚀 Setting up Enhanced Domain Twitter Bot...\n');
    
    try {
      // Check environment variables
      await this.checkEnvironmentVariables();
      
      // Test API connections
      await this.testConnections();
      
      // Setup database tables
      await this.setupDatabaseTables();
      
      // Create .env file if it doesn't exist
      await this.createEnvFile();
      
      console.log('\n✅ Twitter Bot setup completed successfully!');
      console.log('\n📋 Next steps:');
      console.log('1. Review your .env file configuration');
      console.log('2. Run: npm start (to start the bot)');
      console.log('3. Run: npm test (to test the bot)');
      console.log('4. Monitor logs for bot activity');
      
    } catch (error) {
      console.error('❌ Setup failed:', error.message);
      process.exit(1);
    }
  }

  async checkEnvironmentVariables() {
    console.log('🔍 Checking environment variables...');
    
    const missing = this.requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
    
    console.log('✅ All required environment variables found');
  }

  async testConnections() {
    console.log('🔗 Testing API connections...');
    
    // Test Supabase connection
    try {
      const { data, error } = await supabase
        .from('domain_events')
        .select('count')
        .limit(1);
      
      if (error) throw error;
      console.log('✅ Supabase connection successful');
    } catch (error) {
      throw new Error(`Supabase connection failed: ${error.message}`);
    }
    
    // Test OpenAI connection
    try {
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      await openai.models.list();
      console.log('✅ OpenAI connection successful');
    } catch (error) {
      throw new Error(`OpenAI connection failed: ${error.message}`);
    }
    
    // Test Twitter API connection
    try {
      const { TwitterApi } = await import('twitter-api-v2');
      const twitterClient = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY,
        appSecret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_SECRET,
      });
      
      await twitterClient.v2.me();
      console.log('✅ Twitter API connection successful');
    } catch (error) {
      throw new Error(`Twitter API connection failed: ${error.message}`);
    }
  }

  async setupDatabaseTables() {
    console.log('🗄️ Setting up database tables...');
    
    const tables = [
      {
        name: 'twitter_tweets',
        sql: `
          CREATE TABLE IF NOT EXISTS twitter_tweets (
            id SERIAL PRIMARY KEY,
            tweet_id VARCHAR(255) UNIQUE NOT NULL,
            content TEXT NOT NULL,
            opportunities_data JSONB,
            tweet_type VARCHAR(50) DEFAULT 'opportunity',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'twitter_analytics',
        sql: `
          CREATE TABLE IF NOT EXISTS twitter_analytics (
            id SERIAL PRIMARY KEY,
            date DATE NOT NULL,
            tweets_posted INTEGER DEFAULT 0,
            opportunities_found INTEGER DEFAULT 0,
            high_value_opportunities INTEGER DEFAULT 0,
            trending_opportunities INTEGER DEFAULT 0,
            engagement_metrics JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(date)
          );
        `
      },
      {
        name: 'twitter_bot_config',
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
      }
    ];

    for (const table of tables) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: table.sql });
        if (error) throw error;
        console.log(`✅ Table ${table.name} created/verified`);
      } catch (error) {
        console.log(`⚠️ Table ${table.name} may already exist or need manual creation`);
      }
    }

    // Insert default configuration
    await this.insertDefaultConfig();
  }

  async insertDefaultConfig() {
    const defaultConfig = [
      {
        config_key: 'high_value_threshold',
        config_value: '1000',
        description: 'Minimum price threshold for high-value domain alerts'
      },
      {
        config_key: 'trending_threshold',
        config_value: '5',
        description: 'Minimum event count for trending domain detection'
      },
      {
        config_key: 'tweet_interval_minutes',
        config_value: '30',
        description: 'Interval between opportunity tweets in minutes'
      },
      {
        config_key: 'max_tweets_per_day',
        config_value: '20',
        description: 'Maximum number of tweets per day'
      },
      {
        config_key: 'bot_status',
        config_value: 'active',
        description: 'Current bot status (active/inactive)'
      }
    ];

    for (const config of defaultConfig) {
      try {
        const { error } = await supabase
          .from('twitter_bot_config')
          .upsert(config, { onConflict: 'config_key' });
        
        if (error) throw error;
      } catch (error) {
        console.log(`⚠️ Could not insert config ${config.config_key}: ${error.message}`);
      }
    }
  }

  async createEnvFile() {
    const envPath = path.join(process.cwd(), '.env');
    
    if (fs.existsSync(envPath)) {
      console.log('✅ .env file already exists');
      return;
    }

    const envTemplate = `# Twitter API Configuration
TWITTER_API_KEY=your_twitter_api_key_here
TWITTER_API_SECRET=your_twitter_api_secret_here
TWITTER_ACCESS_TOKEN=your_twitter_access_token_here
TWITTER_ACCESS_SECRET=your_twitter_access_secret_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration (same as domain-monitor)
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Bot Configuration (Optional)
HIGH_VALUE_THRESHOLD=1000
TRENDING_THRESHOLD=5
TWEET_INTERVAL_MINUTES=30
MAX_TWEETS_PER_DAY=20
`;

    try {
      fs.writeFileSync(envPath, envTemplate);
      console.log('✅ .env file created from template');
      console.log('⚠️ Please update the .env file with your actual API keys');
    } catch (error) {
      console.log('⚠️ Could not create .env file:', error.message);
    }
  }
}

// Run setup
const setup = new TwitterBotSetup();
setup.setup().catch(console.error);

