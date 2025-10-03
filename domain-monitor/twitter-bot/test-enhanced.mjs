import { TwitterApi } from 'twitter-api-v2';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import OpportunityAnalyzer from './opportunity-analyzer.mjs';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const opportunityAnalyzer = new OpportunityAnalyzer();

class TwitterBotTester {
  constructor() {
    this.twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async runTests() {
    console.log('🧪 Running Enhanced Twitter Bot Tests...\n');
    
    try {
      // Test 1: API Connections
      await this.testAPIConnections();
      
      // Test 2: Opportunity Analysis
      await this.testOpportunityAnalysis();
      
      // Test 3: Tweet Generation
      await this.testTweetGeneration();
      
      // Test 4: Database Operations
      await this.testDatabaseOperations();
      
      console.log('\n✅ All tests passed! Bot is ready to run.');
      
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      process.exit(1);
    }
  }

  async testAPIConnections() {
    console.log('🔗 Testing API connections...');
    
    // Test Twitter API
    try {
      const user = await this.twitterClient.v2.me();
      console.log(`✅ Twitter API: Connected as @${user.data.username}`);
    } catch (error) {
      throw new Error(`Twitter API failed: ${error.message}`);
    }
    
    // Test OpenAI API
    try {
      await this.openai.models.list();
      console.log('✅ OpenAI API: Connection successful');
    } catch (error) {
      throw new Error(`OpenAI API failed: ${error.message}`);
    }
    
    // Test Supabase API
    try {
      const { data, error } = await supabase
        .from('domain_events')
        .select('count')
        .limit(1);
      
      if (error) throw error;
      console.log('✅ Supabase API: Connection successful');
    } catch (error) {
      throw new Error(`Supabase API failed: ${error.message}`);
    }
  }

  async testOpportunityAnalysis() {
    console.log('🔍 Testing opportunity analysis...');
    
    try {
      const opportunities = await opportunityAnalyzer.getTopOpportunities(3);
      console.log(`✅ Found ${opportunities.length} opportunities`);
      
      if (opportunities.length > 0) {
        const topOpp = opportunities[0];
        console.log(`   Top opportunity: ${topOpp.domain} (${topOpp.category})`);
      }
      
    } catch (error) {
      throw new Error(`Opportunity analysis failed: ${error.message}`);
    }
  }

  async testTweetGeneration() {
    console.log('📝 Testing tweet generation...');
    
    try {
      // Get sample opportunities
      const opportunities = await opportunityAnalyzer.getTopOpportunities(2);
      
      if (opportunities.length === 0) {
        console.log('⚠️ No opportunities found for tweet generation test');
        return;
      }
      
      // Test AI tweet generation
      const context = this.buildTestContext(opportunities[0]);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are Coxy, an expert domain investment bot. Create engaging, actionable tweets about domain opportunities. Keep under 280 characters."
          },
          {
            role: "user",
            content: context
          }
        ],
        max_tokens: 200,
        temperature: 0.8
      });

      const tweetContent = response.choices[0].message.content.trim();
      console.log(`✅ Generated tweet: ${tweetContent}`);
      console.log(`   Length: ${tweetContent.length} characters`);
      
    } catch (error) {
      throw new Error(`Tweet generation failed: ${error.message}`);
    }
  }

  async testDatabaseOperations() {
    console.log('🗄️ Testing database operations...');
    
    try {
      // Test reading from domain_events
      const { data: events, error: eventsError } = await supabase
        .from('domain_events')
        .select('*')
        .limit(5);
      
      if (eventsError) throw eventsError;
      console.log(`✅ Read ${events.length} domain events`);
      
      // Test writing to twitter_tweets (dry run)
      const testTweet = {
        tweet_id: `test_${Date.now()}`,
        content: 'Test tweet for bot verification',
        opportunities_data: { test: true },
        tweet_type: 'test'
      };
      
      const { error: insertError } = await supabase
        .from('twitter_tweets')
        .insert(testTweet);
      
      if (insertError) throw insertError;
      console.log('✅ Database write operations successful');
      
      // Clean up test data
      await supabase
        .from('twitter_tweets')
        .delete()
        .eq('tweet_id', testTweet.tweet_id);
      
    } catch (error) {
      throw new Error(`Database operations failed: ${error.message}`);
    }
  }

  buildTestContext(opportunity) {
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
    
    context += `Make this engaging and actionable for domain investors!`;
    
    return context;
  }
}

// Run tests
const tester = new TwitterBotTester();
tester.runTests().catch(console.error);

