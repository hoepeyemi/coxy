import DomainMonitor from './index.mjs';
import SubscriptionManager from './subscription-manager.mjs';
import AnalyticsProcessor from './analytics-processor.mjs';
import dotenv from 'dotenv';

dotenv.config();

async function testDomainMonitor() {
  console.log('🧪 Testing Domain Monitor System\n');

  try {
    // Test 1: Initialize Domain Monitor
    console.log('1️⃣ Testing Domain Monitor initialization...');
    const monitor = new DomainMonitor();
    console.log('✅ Domain Monitor initialized');

    // Test 2: Test Subscription Manager
    console.log('\n2️⃣ Testing Subscription Manager...');
    const subscriptionManager = new SubscriptionManager();
    
    // Test creating a subscription
    const testUserId = 'test-user-123';
    const testWebhookUrl = 'https://webhook.site/test-webhook';
    
    console.log('Creating test subscription...');
    const subscription = await subscriptionManager.createSubscription(
      testUserId,
      'NAME_TOKEN_LISTED',
      testWebhookUrl,
      {
        minPrice: 1000,
        extensions: ['.com', '.eth']
      }
    );
    console.log('✅ Test subscription created:', subscription.id);

    // Test 3: Test Analytics Processor
    console.log('\n3️⃣ Testing Analytics Processor...');
    const analyticsProcessor = new AnalyticsProcessor();
    console.log('✅ Analytics Processor initialized');

    // Test 4: Test API Connection
    console.log('\n4️⃣ Testing Doma Protocol API connection...');
    const axios = (await import('axios')).default;
    
    try {
      const response = await axios.get('https://api-testnet.doma.xyz/v1/poll', {
        headers: {
          'Api-Key': process.env.DOMA_API_KEY,
          'Accept': 'application/json'
        },
        params: {
          eventTypes: ['NAME_TOKEN_MINTED'],
          limit: 1,
          finalizedOnly: true
        },
        timeout: 10000
      });
      
      console.log('✅ API connection successful');
      console.log(`Found ${response.data.events?.length || 0} events`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('❌ API Key invalid or missing');
        console.log('Please set DOMA_API_KEY in your .env file');
      } else if (error.response?.status === 403) {
        console.log('❌ API Key missing EVENTS permission');
      } else {
        console.log('❌ API connection failed:', error.message);
      }
    }

    // Test 5: Test Database Connection
    console.log('\n5️⃣ Testing Database connection...');
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    
    try {
      const { data, error } = await supabase
        .from('domain_events')
        .select('count')
        .limit(1);
      
      if (error) {
        console.log('❌ Database connection failed:', error.message);
        console.log('Please run: node setup-database.mjs');
      } else {
        console.log('✅ Database connection successful');
      }
    } catch (error) {
      console.log('❌ Database connection failed:', error.message);
    }

    // Test 6: Test Webhook URL Validation
    console.log('\n6️⃣ Testing Webhook URL validation...');
    const validUrls = [
      'https://webhook.site/test',
      'http://localhost:3000/webhook',
      'https://api.example.com/webhook'
    ];
    
    const invalidUrls = [
      'not-a-url',
      'ftp://example.com',
      'javascript:alert(1)'
    ];

    validUrls.forEach(url => {
      const isValid = subscriptionManager.validateWebhookUrl(url);
      console.log(`${isValid ? '✅' : '❌'} ${url}`);
    });

    invalidUrls.forEach(url => {
      const isValid = subscriptionManager.validateWebhookUrl(url);
      console.log(`${isValid ? '❌' : '✅'} ${url} (correctly rejected)`);
    });

    // Test 7: Test Event Types
    console.log('\n7️⃣ Testing Event Types...');
    const eventTypes = subscriptionManager.getEventTypes();
    console.log(`✅ Found ${eventTypes.length} event types:`);
    eventTypes.forEach(type => console.log(`   - ${type}`));

    // Test 8: Test Filter Options
    console.log('\n8️⃣ Testing Filter Options...');
    const filterOptions = subscriptionManager.getFilterOptions('NAME_TOKEN_LISTED');
    console.log('✅ Filter options for NAME_TOKEN_LISTED:');
    Object.entries(filterOptions).forEach(([key, config]) => {
      console.log(`   - ${key}: ${config.label} (${config.type})`);
    });

    // Cleanup test subscription
    console.log('\n🧹 Cleaning up test data...');
    await subscriptionManager.deleteSubscription(subscription.id);
    console.log('✅ Test subscription deleted');

    console.log('\n🎉 All tests completed!');
    console.log('\nNext steps:');
    console.log('1. Set up your .env file with DOMA_API_KEY and Supabase credentials');
    console.log('2. Run: node setup-database.mjs');
    console.log('3. Run: node index.mjs to start monitoring');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests
testDomainMonitor();

