import DomainTwitterBot from './index.mjs';
import dotenv from 'dotenv';

dotenv.config();

async function testTwitterBot() {
  console.log('🧪 Testing Domain Twitter Bot\n');

  try {
    // Test 1: Initialize Bot
    console.log('1️⃣ Testing bot initialization...');
    const bot = new DomainTwitterBot();
    console.log('✅ Bot initialized');

    // Test 2: Check environment variables
    console.log('\n2️⃣ Checking environment variables...');
    const requiredEnvVars = [
      'TWITTER_API_KEY',
      'TWITTER_API_SECRET', 
      'TWITTER_ACCESS_TOKEN',
      'TWITTER_ACCESS_SECRET',
      'OPENAI_API_KEY',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.log('❌ Missing environment variables:');
      missingVars.forEach(varName => console.log(`   - ${varName}`));
      console.log('\nPlease add these to your .env file');
      return;
    } else {
      console.log('✅ All environment variables found');
    }

    // Test 3: Test Twitter API connection
    console.log('\n3️⃣ Testing Twitter API connection...');
    try {
      await bot.verifyTwitterConnection();
      console.log('✅ Twitter API connection successful');
    } catch (error) {
      console.log('❌ Twitter API connection failed:', error.message);
      console.log('Please check your Twitter API credentials');
    }

    // Test 4: Test OpenAI API connection
    console.log('\n4️⃣ Testing OpenAI API connection...');
    try {
      await bot.verifyOpenAIConnection();
      console.log('✅ OpenAI API connection successful');
    } catch (error) {
      console.log('❌ OpenAI API connection failed:', error.message);
      console.log('Please check your OpenAI API key');
    }

    // Test 5: Test opportunity finding
    console.log('\n5️⃣ Testing opportunity finding...');
    try {
      const opportunities = await bot.findDomainOpportunities();
      console.log('✅ Opportunity finding successful');
      console.log(`Found ${Object.keys(opportunities).length} opportunity categories`);
      
      Object.entries(opportunities).forEach(([type, items]) => {
        console.log(`   - ${type}: ${items.length} items`);
      });
    } catch (error) {
      console.log('❌ Opportunity finding failed:', error.message);
    }

    // Test 6: Test tweet content generation
    console.log('\n6️⃣ Testing tweet content generation...');
    try {
      const mockOpportunities = {
        highValue: [
          { domain: 'example.com', price: 5000, type: 'NAME_TOKEN_SOLD' }
        ],
        trending: [
          { domain: 'test.shib', activityCount: 8 }
        ],
        expired: [
          { domain: 'expired.com', type: 'expired' }
        ],
        newMints: [
          { domain: 'new.shib', type: 'new_mint' }
        ]
      };

      const tweetContent = await bot.generateTweetContent(mockOpportunities);
      console.log('✅ Tweet content generation successful');
      console.log('Generated tweet:');
      console.log(`"${tweetContent}"`);
      console.log(`Character count: ${tweetContent.length}`);
    } catch (error) {
      console.log('❌ Tweet content generation failed:', error.message);
    }

    // Test 7: Test daily stats calculation
    console.log('\n7️⃣ Testing daily stats calculation...');
    try {
      const mockEvents = [
        { name: 'test1.com', type: 'NAME_TOKEN_MINTED', event_data: { price: '1000' } },
        { name: 'test2.com', type: 'NAME_TOKEN_SOLD', event_data: { price: '5000' } },
        { name: 'test3.com', type: 'NAME_TOKEN_BURNED', event_data: {} },
        { name: 'test1.com', type: 'NAME_TOKEN_TRANSFERRED', event_data: {} }
      ];

      const stats = bot.calculateDailyStats(mockEvents);
      console.log('✅ Daily stats calculation successful');
      console.log('Calculated stats:', stats);
    } catch (error) {
      console.log('❌ Daily stats calculation failed:', error.message);
    }

    console.log('\n🎉 All tests completed!');
    console.log('\nNext steps:');
    console.log('1. Make sure all API credentials are correct');
    console.log('2. Run: npm run setup (to create database tables)');
    console.log('3. Run: npm start (to start the bot)');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testTwitterBot();


