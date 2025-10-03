import { TwitterApi } from 'twitter-api-v2';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import cron from 'node-cron';
import dotenv from 'dotenv';
import EnhancedEventProcessor from './enhanced-event-processor.mjs';
import SubscriptionManager from './subscription-manager.mjs';
import LandingPageTracker from './landing-page-tracker.mjs';

dotenv.config();

// Configuration
const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET;
const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN;
const TWITTER_ACCESS_SECRET = process.env.TWITTER_ACCESS_SECRET;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://coxy.com';

// Bot configuration
const HIGH_VALUE_THRESHOLD = parseInt(process.env.HIGH_VALUE_THRESHOLD) || 1000;
const TRENDING_THRESHOLD = parseInt(process.env.TRENDING_THRESHOLD) || 5;
const TWEET_INTERVAL_MINUTES = parseInt(process.env.TWEET_INTERVAL_MINUTES) || 30;
const MAX_TWEETS_PER_DAY = parseInt(process.env.MAX_TWEETS_PER_DAY) || 20;

// Initialize clients
const twitterClient = new TwitterApi({
  appKey: TWITTER_API_KEY,
  appSecret: TWITTER_API_SECRET,
  accessToken: TWITTER_ACCESS_TOKEN,
  accessSecret: TWITTER_ACCESS_SECRET,
});

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

class CoxyOptimizedBot {
  constructor() {
    this.isRunning = false;
    this.lastTweetTime = null;
    this.tweetInterval = TWEET_INTERVAL_MINUTES * 60 * 1000;
    this.highValueThreshold = HIGH_VALUE_THRESHOLD;
    this.trendingThreshold = TRENDING_THRESHOLD;
    
    // Initialize components
    this.eventProcessor = new EnhancedEventProcessor();
    this.subscriptionManager = new SubscriptionManager();
    this.landingPageTracker = new LandingPageTracker();
    
    // Bot state
    this.tweetCount = 0;
    this.dailyTweetCount = 0;
    this.lastResetDate = new Date().toDateString();
    this.engagementTracker = new Map();
    this.performanceMetrics = {
      totalTweets: 0,
      totalEngagement: 0,
      totalConversions: 0,
      averageEngagementRate: 0
    };
  }

  async initialize() {
    console.log('🚀 Initializing Coxy Optimized Bot...');
    console.log('📊 Following the optimized domain monitoring flow...\n');
    
    try {
      // Initialize all components
      await this.initializeComponents();
      
      // Verify API connections
      await this.verifyConnections();
      
      // Start the bot
      this.startBot();
      
      console.log('✅ Coxy Optimized Bot started successfully!');
      
    } catch (error) {
      console.error('❌ Failed to initialize Coxy Optimized Bot:', error);
    }
  }

  async initializeComponents() {
    console.log('🔄 Initializing bot components...');
    
    await this.eventProcessor.initialize?.();
    await this.subscriptionManager.initialize();
    await this.landingPageTracker.initialize();
    
    console.log('✅ All components initialized');
  }

  async verifyConnections() {
    console.log('🔗 Verifying API connections...');
    
    // Test Twitter API
    const user = await twitterClient.v2.me();
    console.log(`✅ Twitter API connected as @${user.data.username}`);
    
    // Test OpenAI API
    await openai.models.list();
    console.log('✅ OpenAI API connected');
    
    // Test Supabase API
    const { data, error } = await supabase
      .from('domain_events')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    console.log('✅ Supabase API connected');
  }

  startBot() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('\n🤖 Coxy Optimized Bot is now running!');
    console.log(`📊 Configuration:`);
    console.log(`   • High-value threshold: $${this.highValueThreshold}`);
    console.log(`   • Trending threshold: ${this.trendingThreshold} events`);
    console.log(`   • Tweet interval: ${TWEET_INTERVAL_MINUTES} minutes`);
    console.log(`   • Max tweets per day: ${MAX_TWEETS_PER_DAY}`);
    console.log(`   • Frontend URL: ${FRONTEND_URL}\n`);
    
    // Start the main processing loop
    this.processDomainEvents();
    
    // Schedule regular processing
    const cronPattern = `*/${TWEET_INTERVAL_MINUTES} * * * *`;
    cron.schedule(cronPattern, () => {
      if (this.isRunning) {
        this.processDomainEvents();
      }
    });
    
    // Schedule daily summary at 9 AM
    cron.schedule('0 9 * * *', () => {
      if (this.isRunning) {
        this.postDailySummary();
      }
    });
    
    // Schedule weekly analysis at 10 AM on Mondays
    cron.schedule('0 10 * * 1', () => {
      if (this.isRunning) {
        this.postWeeklyAnalysis();
      }
    });

    // Schedule engagement tracking every hour
    cron.schedule('0 * * * *', () => {
      if (this.isRunning) {
        this.trackEngagement();
      }
    });

    // Schedule cleanup tasks daily at midnight
    cron.schedule('0 0 * * *', () => {
      if (this.isRunning) {
        this.performMaintenance();
      }
    });
  }

  stopBot() {
    this.isRunning = false;
    console.log('🛑 Coxy Optimized Bot stopped');
  }

  async processDomainEvents() {
    try {
      console.log('\n🔄 Processing domain events...');
      
      // Reset daily counter if new day
      this.resetDailyCounter();
      
      // Check if we can tweet
      if (!this.canTweet()) {
        console.log('⏭️ Skipping tweet - daily limit reached or too soon');
        return;
      }

      // Step 1: Process events using enhanced processor
      console.log('📊 Step 1: Processing domain events...');
      const { opportunities, analytics, processedEvents } = await this.eventProcessor.processEvents();
      
      if (opportunities.length === 0) {
        console.log('ℹ️ No opportunities found, skipping tweet');
        return;
      }

      console.log(`✅ Found ${opportunities.length} opportunities`);

      // Step 2: Process subscriptions and notifications
      console.log('📧 Step 2: Processing subscriptions...');
      for (const opportunity of opportunities.slice(0, 5)) { // Process top 5 opportunities
        await this.subscriptionManager.processOpportunity(opportunity);
      }

      // Step 3: Select best opportunity for Twitter
      console.log('🎯 Step 3: Selecting best opportunity...');
      const selectedOpportunity = this.selectBestOpportunity(opportunities);
      
      if (!selectedOpportunity) {
        console.log('ℹ️ No suitable opportunity selected');
        return;
      }

      // Step 4: Generate optimized tweet
      console.log('✍️ Step 4: Generating tweet content...');
      const tweetContent = await this.generateOptimizedTweet(selectedOpportunity, analytics);
      
      if (!tweetContent) {
        console.log('ℹ️ No tweet content generated');
        return;
      }

      // Step 5: Post tweet
      console.log('🐦 Step 5: Posting tweet...');
      const tweet = await twitterClient.v2.tweet(tweetContent);
      console.log(`✅ Tweet posted: ${tweet.data.id}`);

      // Step 6: Track engagement and log data
      console.log('📊 Step 6: Tracking and logging...');
      await this.trackAndLogTweet(tweet.data.id, tweetContent, selectedOpportunity, analytics);
      
      // Update counters
      this.tweetCount++;
      this.dailyTweetCount++;
      this.lastTweetTime = new Date();

      console.log(`🎉 Successfully processed and tweeted about ${selectedOpportunity.domain}`);

    } catch (error) {
      console.error('❌ Error in processDomainEvents:', error);
    }
  }

  selectBestOpportunity(opportunities) {
    // Filter opportunities by priority and user preferences
    const filteredOpportunities = opportunities.filter(opp => 
      opp.priority >= 70 && // Only high-priority opportunities
      opp.value >= this.highValueThreshold // Only high-value opportunities
    );

    if (filteredOpportunities.length === 0) {
      // Fallback to any opportunity if no high-priority ones
      return opportunities[0];
    }

    // Sort by priority and return the best one
    return filteredOpportunities
      .sort((a, b) => b.priority - a.priority)[0];
  }

  async generateOptimizedTweet(opportunity, analytics) {
    try {
      const context = this.buildOptimizedContext(opportunity, analytics);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are Coxy, an expert domain investment bot. Create engaging, actionable tweets about domain opportunities.

Key guidelines:
- Keep tweets under 280 characters
- Use relevant emojis and hashtags
- Make it exciting and actionable
- Focus on specific opportunities with clear value
- Include calls to action when appropriate
- Use hashtags: #DomainInvesting #Web3 #DigitalAssets #Coxy
- Be informative but not spammy
- Highlight unique aspects (price, rarity, activity, etc.)
- Include the landing page URL for user engagement
- Make it feel urgent and valuable
- Use the opportunity's action URL for tracking`
          },
          {
            role: "user",
            content: context
          }
        ],
        max_tokens: 200,
        temperature: 0.8
      });

      return response.choices[0].message.content.trim();

    } catch (error) {
      console.error('Error generating tweet content:', error);
      return this.generateFallbackTweet(opportunity);
    }
  }

  buildOptimizedContext(opportunity, analytics) {
    let context = `Generate a Twitter post about this domain opportunity:\n\n`;
    
    context += `OPPORTUNITY TYPE: ${opportunity.type.toUpperCase()}\n`;
    context += `CATEGORY: ${opportunity.category}\n`;
    context += `DOMAIN: ${opportunity.domain}\n`;
    context += `PRIORITY: ${opportunity.priority}/100\n`;
    context += `VALUE: $${opportunity.value?.toLocaleString() || 'TBD'}\n`;
    context += `DESCRIPTION: ${opportunity.description}\n`;
    context += `ACTION URL: ${opportunity.actionUrl}\n\n`;
    
    if (opportunity.metadata) {
      context += `METADATA:\n`;
      Object.entries(opportunity.metadata).forEach(([key, value]) => {
        context += `- ${key}: ${value}\n`;
      });
      context += `\n`;
    }
    
    context += `MARKET ANALYTICS:\n`;
    context += `- Total events: ${analytics.totalEvents}\n`;
    context += `- High-value opportunities: ${analytics.highValueCount}\n`;
    context += `- Market activity: ${analytics.marketActivity?.activityLevel || 'medium'}\n`;
    context += `- Average price: $${analytics.averagePrice?.toLocaleString() || 'N/A'}\n\n`;
    
    context += `Make this engaging and actionable for domain investors! Include the action URL for user engagement.`;
    
    return context;
  }

  generateFallbackTweet(opportunity) {
    const emojis = {
      expired: '⏰',
      sale: '💰',
      trending: '🔥',
      listing: '🆕'
    };

    const emoji = emojis[opportunity.type] || '🌐';
    const value = opportunity.value ? `$${opportunity.value.toLocaleString()}` : 'TBD';
    
    return `${emoji} ${opportunity.description}\n\n${opportunity.actionUrl}\n\n#DomainInvesting #Web3 #DigitalAssets #Coxy`;
  }

  async trackAndLogTweet(tweetId, content, opportunity, analytics) {
    try {
      // Track tweet engagement
      this.engagementTracker.set(tweetId, {
        opportunity,
        postedAt: new Date(),
        likes: 0,
        retweets: 0,
        replies: 0,
        impressions: 0
      });

      // Log to database
      await supabase
        .from('twitter_tweets')
        .insert({
          tweet_id: tweetId,
          content: content,
          opportunities_data: opportunity,
          tweet_type: opportunity.type,
          engagement_metrics: analytics,
          created_at: new Date().toISOString()
        });

      // Update analytics
      await this.updateAnalytics(analytics, opportunity);

      console.log('✅ Tweet tracked and logged successfully');

    } catch (error) {
      console.error('Error tracking and logging tweet:', error);
    }
  }

  async updateAnalytics(analytics, opportunity) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      await supabase
        .from('twitter_analytics')
        .upsert({
          date: today,
          tweets_posted: 1,
          opportunities_found: analytics.totalEvents,
          high_value_opportunities: analytics.highValueCount,
          trending_opportunities: analytics.trendsCount,
          expired_opportunities: analytics.expiredCount,
          new_mint_opportunities: analytics.trendsCount,
          total_engagement: 0,
          engagement_metrics: analytics,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'date'
        });
    } catch (error) {
      console.error('Error updating analytics:', error);
    }
  }

  async trackEngagement() {
    console.log('📊 Tracking tweet engagement...');
    
    for (const [tweetId, data] of this.engagementTracker) {
      try {
        const tweet = await twitterClient.v2.singleTweet(tweetId, {
          'tweet.fields': ['public_metrics']
        });
        
        if (tweet.data) {
          const metrics = tweet.data.public_metrics;
          data.likes = metrics.like_count;
          data.retweets = metrics.retweet_count;
          data.replies = metrics.reply_count;
          data.impressions = metrics.impression_count || 0;
          
          // Update database
          await this.updateEngagementMetrics(tweetId, metrics);
        }
      } catch (error) {
        console.log(`⚠️ Could not track engagement for tweet ${tweetId}:`, error.message);
      }
    }
  }

  async updateEngagementMetrics(tweetId, metrics) {
    try {
      await supabase
        .from('twitter_engagement')
        .upsert({
          tweet_id: tweetId,
          likes_count: metrics.like_count,
          retweets_count: metrics.retweet_count,
          replies_count: metrics.reply_count,
          quotes_count: metrics.quote_count || 0,
          impressions_count: metrics.impression_count || 0,
          engagement_rate: this.calculateEngagementRate(metrics),
          measured_at: new Date().toISOString()
        });
    } catch (error) {
      console.log('⚠️ Could not update engagement metrics:', error.message);
    }
  }

  calculateEngagementRate(metrics) {
    const totalEngagement = metrics.like_count + metrics.retweet_count + metrics.reply_count + (metrics.quote_count || 0);
    const impressions = metrics.impression_count || 1;
    
    return Math.round((totalEngagement / impressions) * 100 * 100) / 100;
  }

  canTweet() {
    // Check daily limit
    if (this.dailyTweetCount >= MAX_TWEETS_PER_DAY) {
      return false;
    }
    
    // Check minimum interval
    if (this.lastTweetTime && (Date.now() - this.lastTweetTime.getTime()) < 15 * 60 * 1000) {
      return false;
    }
    
    return true;
  }

  resetDailyCounter() {
    const today = new Date().toDateString();
    if (today !== this.lastResetDate) {
      this.dailyTweetCount = 0;
      this.lastResetDate = today;
    }
  }

  async postDailySummary() {
    try {
      console.log('📊 Generating daily summary...');
      
      const summary = await this.generateDailySummary();
      const tweet = await twitterClient.v2.tweet(summary);
      
      console.log(`✅ Daily summary posted: ${tweet.data.id}`);
      
    } catch (error) {
      console.error('Error posting daily summary:', error);
    }
  }

  async generateDailySummary() {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      
      const { data: events, error } = await supabase
        .from('domain_events')
        .select('*')
        .gte('created_at', yesterday.toISOString())
        .lt('created_at', new Date().toISOString());

      if (error || !events) {
        return "📊 Daily domain market update: Data processing... #DomainInvesting #Web3 #Coxy";
      }

      const { analytics } = await this.eventProcessor.processEvents();
      
      const prompt = `Create a daily domain market summary tweet with these stats:
      - Total events: ${analytics.totalEvents}
      - High-value opportunities: ${analytics.highValueCount}
      - Expired domains: ${analytics.expiredCount}
      - Trending domains: ${analytics.trendsCount}
      - Average price: $${analytics.averagePrice?.toLocaleString() || 'N/A'}
      - Market activity: ${analytics.marketActivity?.activityLevel || 'medium'}
      
      Make it engaging and informative for domain investors! Include insights and predictions.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are Coxy, a domain market analyst. Create engaging daily summary tweets with market insights, trends, and predictions. Use emojis and hashtags effectively."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 280,
        temperature: 0.7
      });

      return response.choices[0].message.content.trim();

    } catch (error) {
      console.error('Error generating daily summary:', error);
      return "📊 Daily domain market analysis: Processing data... #DomainInvesting #Web3 #Coxy";
    }
  }

  async postWeeklyAnalysis() {
    try {
      console.log('📊 Generating weekly analysis...');
      
      const analysis = await this.generateWeeklyAnalysis();
      const tweet = await twitterClient.v2.tweet(analysis);
      
      console.log(`✅ Weekly analysis posted: ${tweet.data.id}`);
      
    } catch (error) {
      console.error('Error posting weekly analysis:', error);
    }
  }

  async generateWeeklyAnalysis() {
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { data: events, error } = await supabase
        .from('domain_events')
        .select('*')
        .gte('created_at', weekAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error || !events) {
        return "📊 Weekly domain market analysis: Data processing... #DomainInvesting #Web3 #Coxy";
      }

      const { analytics } = await this.eventProcessor.processEvents();
      
      const prompt = `Create a weekly domain market analysis tweet with these stats:
      - Total events this week: ${analytics.totalEvents}
      - High-value opportunities: ${analytics.highValueCount}
      - Expired domains: ${analytics.expiredCount}
      - Trending domains: ${analytics.trendsCount}
      - Top extensions: ${analytics.topExtensions?.map(e => e.extension).join(', ') || 'N/A'}
      - Market activity: ${analytics.marketActivity?.activityLevel || 'medium'}
      
      Make it engaging and informative for domain investors! Include insights and predictions.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are Coxy, a domain market analyst. Create engaging weekly analysis tweets with market insights, trends, and predictions. Use emojis and hashtags effectively."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 280,
        temperature: 0.7
      });

      return response.choices[0].message.content.trim();

    } catch (error) {
      console.error('Error generating weekly analysis:', error);
      return "📊 Weekly domain market analysis: Processing data... #DomainInvesting #Web3 #Coxy";
    }
  }

  async performMaintenance() {
    console.log('🧹 Performing maintenance tasks...');
    
    try {
      // Clean up old tracking data
      await this.landingPageTracker.cleanupOldTrackingData();
      
      // Clean up old notifications
      await this.subscriptionManager.cleanupOldNotifications();
      
      // Update performance metrics
      await this.updatePerformanceMetrics();
      
      console.log('✅ Maintenance completed');
    } catch (error) {
      console.error('Error during maintenance:', error);
    }
  }

  async updatePerformanceMetrics() {
    try {
      const stats = await this.landingPageTracker.getConversionStats('24h');
      
      if (stats) {
        this.performanceMetrics = {
          totalTweets: this.tweetCount,
          totalEngagement: stats.totalEvents,
          totalConversions: stats.conversions,
          averageEngagementRate: stats.conversionRate
        };
      }
    } catch (error) {
      console.error('Error updating performance metrics:', error);
    }
  }

  getBotStatus() {
    return {
      isRunning: this.isRunning,
      tweetCount: this.tweetCount,
      dailyTweetCount: this.dailyTweetCount,
      lastTweetTime: this.lastTweetTime,
      performanceMetrics: this.performanceMetrics,
      conversionFunnel: this.landingPageTracker.getConversionFunnel()
    };
  }
}

// Create and start the bot
const bot = new CoxyOptimizedBot();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Coxy Optimized Bot...');
  bot.stopBot();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down Coxy Optimized Bot...');
  bot.stopBot();
  process.exit(0);
});

// Start the bot
bot.initialize().catch(console.error);

export default CoxyOptimizedBot;

