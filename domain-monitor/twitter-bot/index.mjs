import { TwitterApi } from 'twitter-api-v2';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import cron from 'node-cron';
import dotenv from 'dotenv';
import OpportunityAnalyzer from './opportunity-analyzer.mjs';

dotenv.config();

// Configuration
const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET;
const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN;
const TWITTER_ACCESS_SECRET = process.env.TWITTER_ACCESS_SECRET;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

// Bot configuration
const HIGH_VALUE_THRESHOLD = parseInt(process.env.HIGH_VALUE_THRESHOLD) || 1000;
const TRENDING_THRESHOLD = parseInt(process.env.TRENDING_THRESHOLD) || 5;
const TWEET_INTERVAL_MINUTES = parseInt(process.env.TWEET_INTERVAL_MINUTES) || 30;

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

class DomainTwitterBot {
  constructor() {
    this.isRunning = false;
    this.lastTweetTime = null;
    this.tweetInterval = TWEET_INTERVAL_MINUTES * 60 * 1000;
    this.highValueThreshold = HIGH_VALUE_THRESHOLD;
    this.trendingThreshold = TRENDING_THRESHOLD;
    this.opportunityAnalyzer = new OpportunityAnalyzer();
    this.tweetCount = 0;
    this.lastOpportunityCheck = null;
  }

  // Check if the domain name is a real domain (contains a dot) and not an event ID
  isValidDomainName(domainName) {
    if (!domainName || typeof domainName !== 'string') {
      return false;
    }
    
    // Check if it contains a dot (real domain) and is not an event ID
    const hasDot = domainName.includes('.');
    const isEventId = /^(Event-|Command-|Name-)\d+$/i.test(domainName);
    
    return hasDot && !isEventId;
  }

  async initialize() {
    console.log('🤖 Starting Domain Twitter Bot...');
    
    try {
      // Verify Twitter API connection
      await this.verifyTwitterConnection();
      
      // Verify OpenAI connection
      await this.verifyOpenAIConnection();
      
      // Start the bot
      this.startBot();
      
    } catch (error) {
      console.error('Failed to initialize Twitter bot:', error);
    }
  }

  async verifyTwitterConnection() {
    try {
      const user = await twitterClient.v2.me();
      console.log(`✅ Twitter API connected as @${user.data.username}`);
    } catch (error) {
      console.error('❌ Twitter API connection failed:', error);
      throw error;
    }
  }

  async verifyOpenAIConnection() {
    try {
      const response = await openai.models.list();
      console.log('✅ OpenAI API connected');
    } catch (error) {
      console.error('❌ OpenAI API connection failed:', error);
      throw error;
    }
  }

  startBot() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🚀 Bot started successfully!');
    console.log(`📊 Configuration: High-value threshold: $${this.highValueThreshold}, Trending threshold: ${this.trendingThreshold} events`);
    
    // Tweet immediately
    this.postOpportunityTweet();
    
    // Schedule regular tweets based on interval
    const cronPattern = `*/${TWEET_INTERVAL_MINUTES} * * * *`;
    cron.schedule(cronPattern, () => {
      if (this.isRunning) {
        this.postOpportunityTweet();
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
  }

  stopBot() {
    this.isRunning = false;
    console.log('🛑 Bot stopped');
  }

  async postOpportunityTweet() {
    try {
      console.log('🔍 Looking for domain opportunities...');
      
      // Use the enhanced opportunity analyzer
      const opportunities = await this.opportunityAnalyzer.getTopOpportunities(5);
      
      if (opportunities.length === 0) {
        console.log('No opportunities found, skipping tweet');
        return;
      }
      
      // Check if we should tweet (avoid spam)
      if (this.shouldSkipTweet(opportunities)) {
        console.log('Skipping tweet to avoid spam');
        return;
      }
      
      // Generate tweet content using AI
      const tweetContent = await this.generateActionableTweet(opportunities);
      
      if (!tweetContent) {
        console.log('No tweet content generated, skipping');
        return;
      }
      
      // Post tweet
      const tweet = await twitterClient.v2.tweet(tweetContent);
      console.log(`✅ Tweet posted: ${tweet.data.id}`);
      console.log(`📝 Content: ${tweetContent}`);
      
      // Log tweet to database
      await this.logTweet(tweet.data.id, tweetContent, opportunities);
      
      this.tweetCount++;
      this.lastTweetTime = new Date();
      
    } catch (error) {
      console.error('Error posting opportunity tweet:', error);
    }
  }

  shouldSkipTweet(opportunities) {
    // Skip if we tweeted recently (within 15 minutes)
    if (this.lastTweetTime && (Date.now() - this.lastTweetTime.getTime()) < 15 * 60 * 1000) {
      return true;
    }
    
    // Skip if no high-priority opportunities
    const highPriority = opportunities.filter(opp => 
      opp.category === 'high_value' || 
      opp.category === 'trending' || 
      opp.category === 'expired'
    );
    
    return highPriority.length === 0;
  }

  async generateActionableTweet(opportunities) {
    try {
      const topOpportunity = opportunities[0];
      
      // Create context for AI
      const context = this.buildOpportunityContext(topOpportunity, opportunities);
      
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
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
- Highlight unique aspects (price, rarity, activity, etc.)`
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
      return this.generateFallbackTweet(opportunities);
    }
  }

  buildOpportunityContext(opportunity, allOpportunities) {
    let context = `Generate a Twitter post about this domain opportunity:\n\n`;
    
    context += `OPPORTUNITY TYPE: ${opportunity.category.toUpperCase()}\n`;
    context += `DOMAIN: ${opportunity.domain}\n`;
    
    if (opportunity.price) {
      context += `PRICE: $${opportunity.price}\n`;
    }
    
    if (opportunity.activityCount) {
      context += `ACTIVITY: ${opportunity.activityCount} recent events\n`;
    }
    
    if (opportunity.brandabilityScore) {
      context += `BRANDABILITY SCORE: ${opportunity.brandabilityScore}/100\n`;
    }
    
    if (opportunity.length) {
      context += `LENGTH: ${opportunity.length} characters\n`;
    }
    
    context += `TIMESTAMP: ${opportunity.timestamp || opportunity.lastActivity}\n\n`;
    
    // Add context about other opportunities
    const otherTypes = allOpportunities.slice(1, 3).map(opp => opp.category);
    if (otherTypes.length > 0) {
      context += `OTHER OPPORTUNITIES AVAILABLE: ${otherTypes.join(', ')}\n\n`;
    }
    
    context += `Make this engaging and actionable for domain investors!`;
    
    return context;
  }

  extractPrice(eventData) {
    if (!eventData) return null;
    
    // Try different price fields
    const priceFields = ['price', 'amount', 'value', 'cost'];
    for (const field of priceFields) {
      if (eventData[field]) {
        const price = parseFloat(eventData[field]);
        if (!isNaN(price)) {
          return price;
        }
      }
    }
    
    return null;
  }

  async generateTweetContent(opportunities) {
    try {
      const prompt = this.buildPrompt(opportunities);
      
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a domain investment expert Twitter bot. Create engaging, actionable tweets about domain opportunities. Use emojis, hashtags, and make it exciting. Keep tweets under 280 characters. Focus on actionable insights and market intelligence."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      });

      return response.choices[0].message.content.trim();

    } catch (error) {
      console.error('Error generating tweet content:', error);
      return this.generateFallbackTweet(opportunities);
    }
  }

  buildPrompt(opportunities) {
    let prompt = "Generate a Twitter post about these domain opportunities:\n\n";
    
    if (opportunities.highValue.length > 0) {
      prompt += "HIGH-VALUE DOMAINS:\n";
      opportunities.highValue.slice(0, 3).forEach(opp => {
        prompt += `- ${opp.domain}: $${opp.price}\n`;
      });
      prompt += "\n";
    }
    
    if (opportunities.trending.length > 0) {
      prompt += "TRENDING DOMAINS:\n";
      opportunities.trending.slice(0, 3).forEach(opp => {
        prompt += `- ${opp.domain}: ${opp.activityCount} events\n`;
      });
      prompt += "\n";
    }
    
    if (opportunities.expired.length > 0) {
      prompt += "RECENTLY EXPIRED:\n";
      opportunities.expired.slice(0, 3).forEach(opp => {
        prompt += `- ${opp.domain}\n`;
      });
      prompt += "\n";
    }
    
    if (opportunities.newMints.length > 0) {
      prompt += "NEW DOMAIN MINTS:\n";
      opportunities.newMints.slice(0, 3).forEach(opp => {
        prompt += `- ${opp.domain}\n`;
      });
    }
    
    prompt += "\nMake this engaging and actionable for domain investors!";
    
    return prompt;
  }

  generateFallbackTweet(opportunities) {
    const topOpportunity = opportunities[0];
    
    if (topOpportunity.category === 'high_value') {
      return `💰 HIGH-VALUE ALERT: ${topOpportunity.domain} sold for $${topOpportunity.price}! 🚀\n\n#DomainInvesting #Web3 #DigitalAssets #Coxy`;
    }
    
    if (topOpportunity.category === 'trending') {
      return `🔥 TRENDING: ${topOpportunity.domain} with ${topOpportunity.activityCount} recent events! 📈\n\n#DomainTrends #Web3 #DigitalAssets #Coxy`;
    }
    
    if (topOpportunity.category === 'expired') {
      return `⏰ EXPIRED: ${topOpportunity.domain} is now available! 💎\n\n#DomainInvesting #Web3 #DigitalAssets #Coxy`;
    }
    
    if (topOpportunity.category === 'short') {
      return `🎯 SHORT DOMAIN: ${topOpportunity.domain} (${topOpportunity.length} chars) - Premium opportunity! 💎\n\n#DomainInvesting #Web3 #DigitalAssets #Coxy`;
    }
    
    if (topOpportunity.category === 'brandable') {
      return `✨ BRANDABLE: ${topOpportunity.domain} (Score: ${topOpportunity.brandabilityScore}/100) - Perfect for branding! 🎨\n\n#DomainInvesting #Web3 #DigitalAssets #Coxy`;
    }
    
    return `🌐 Domain market is active! New opportunities emerging... 📊\n\n#DomainInvesting #Web3 #DigitalAssets #Coxy`;
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
      // Get last week's data
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

      // Filter out events with invalid domain names (event IDs)
      const validEvents = events.filter(event => 
        this.isValidDomainName(event.name)
      );

      console.log(`📊 Filtered ${events.length} events to ${validEvents.length} valid domain events for weekly stats`);

      const stats = this.calculateWeeklyStats(validEvents);
      
      const prompt = `Create a weekly domain market analysis tweet with these stats:
      - Total events this week: ${stats.totalEvents}
      - High-value sales: ${stats.highValueSales}
      - New mints: ${stats.newMints}
      - Expired domains: ${stats.expired}
      - Most active domain: ${stats.mostActiveDomain}
      - Top extension: ${stats.topExtension}
      - Market trend: ${stats.trend}
      
      Make it engaging and informative for domain investors! Include insights and predictions.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
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

  calculateWeeklyStats(events) {
    const stats = {
      totalEvents: events.length,
      highValueSales: 0,
      newMints: 0,
      expired: 0,
      mostActiveDomain: null,
      topExtension: null,
      trend: 'stable'
    };

    const domainActivity = {};
    const extensionCount = {};
    let maxActivity = 0;

    events.forEach(event => {
      // Count by type
      if (event.type === 'NAME_TOKEN_MINTED') stats.newMints++;
      if (event.type === 'NAME_TOKEN_BURNED') stats.expired++;
      
      // Check for high-value sales
      const price = this.extractPrice(event.event_data);
      if (price && price >= this.highValueThreshold) {
        stats.highValueSales++;
      }
      
      // Track domain activity
      if (!domainActivity[event.name]) {
        domainActivity[event.name] = 0;
      }
      domainActivity[event.name]++;
      
      if (domainActivity[event.name] > maxActivity) {
        maxActivity = domainActivity[event.name];
        stats.mostActiveDomain = event.name;
      }
      
      // Track extensions
      const ext = event.name.split('.').pop();
      extensionCount[ext] = (extensionCount[ext] || 0) + 1;
    });

    // Find top extension
    const topExt = Object.entries(extensionCount)
      .sort(([,a], [,b]) => b - a)[0];
    if (topExt) {
      stats.topExtension = topExt[0];
    }

    // Determine trend
    const midWeek = Math.floor(events.length / 2);
    const firstHalf = events.slice(0, midWeek).length;
    const secondHalf = events.slice(midWeek).length;
    
    if (secondHalf > firstHalf * 1.2) stats.trend = 'growing';
    else if (secondHalf < firstHalf * 0.8) stats.trend = 'declining';

    return stats;
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
      // Get yesterday's data
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      
      const { data: events, error } = await supabase
        .from('domain_events')
        .select('*')
        .gte('created_at', yesterday.toISOString())
        .lt('created_at', new Date().toISOString());

      if (error || !events) {
        return "📊 Daily domain market update: Data processing... #DomainInvesting #Web3";
      }

      // Filter out events with invalid domain names (event IDs)
      const validEvents = events.filter(event => 
        this.isValidDomainName(event.name)
      );

      console.log(`📊 Filtered ${events.length} events to ${validEvents.length} valid domain events for daily stats`);

      const stats = this.calculateDailyStats(validEvents);
      
      const prompt = `Create a daily domain market summary tweet with these stats:
      - Total events: ${stats.totalEvents}
      - High-value sales: ${stats.highValueSales}
      - New mints: ${stats.newMints}
      - Expired domains: ${stats.expired}
      - Top domain: ${stats.topDomain}
      
      Make it engaging and informative for domain investors!`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a domain market analyst. Create engaging daily summary tweets with market insights and statistics."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 250,
        temperature: 0.6
      });

      return response.choices[0].message.content.trim();

    } catch (error) {
      console.error('Error generating daily summary:', error);
      return "📊 Daily domain market update: Processing data... #DomainInvesting #Web3";
    }
  }

  calculateDailyStats(events) {
    const stats = {
      totalEvents: events.length,
      highValueSales: 0,
      newMints: 0,
      expired: 0,
      topDomain: null
    };

    const domainActivity = {};
    let maxActivity = 0;

    events.forEach(event => {
      // Count by type
      if (event.type === 'NAME_TOKEN_MINTED') stats.newMints++;
      if (event.type === 'NAME_TOKEN_BURNED') stats.expired++;
      
      // Check for high-value sales
      const price = this.extractPrice(event.event_data);
      if (price && price >= this.highValueThreshold) {
        stats.highValueSales++;
      }
      
      // Track domain activity
      if (!domainActivity[event.name]) {
        domainActivity[event.name] = 0;
      }
      domainActivity[event.name]++;
      
      if (domainActivity[event.name] > maxActivity) {
        maxActivity = domainActivity[event.name];
        stats.topDomain = event.name;
      }
    });

    return stats;
  }

  async logTweet(tweetId, content, opportunities) {
    try {
      await supabase
        .from('twitter_tweets')
        .insert({
          tweet_id: tweetId,
          content: content,
          opportunities_data: opportunities,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error logging tweet:', error);
    }
  }
}

// Create and start the bot
const bot = new DomainTwitterBot();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down Twitter bot...');
  bot.stopBot();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down Twitter bot...');
  bot.stopBot();
  process.exit(0);
});

// Start the bot
bot.initialize().catch(console.error);

export default DomainTwitterBot;


