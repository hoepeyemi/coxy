#!/usr/bin/env node

/**
 * Test script to verify domain monitoring API endpoints
 */

const BASE_URL = 'http://localhost:3000';

async function testDomainMonitorAPI() {
  console.log('🧪 Testing Domain Monitor API Endpoints...\n');

  try {
    // Test 1: Get domain events
    console.log('1️⃣ Testing domain events endpoint...');
    const eventsResponse = await fetch(`${BASE_URL}/api/domain-monitor?action=events&limit=5`);
    const eventsData = await eventsResponse.json();
    
    if (eventsResponse.ok) {
      console.log('✅ Domain events endpoint working');
      console.log(`   Found ${eventsData.events?.length || 0} events`);
      if (eventsData.events?.length > 0) {
        const event = eventsData.events[0];
        console.log(`   Sample event: ${event.name || 'N/A'} (${event.type})`);
      }
    } else {
      console.log('❌ Domain events endpoint failed:', eventsData.error);
    }

    // Test 2: Get trending domains
    console.log('\n2️⃣ Testing trending domains endpoint...');
    const trendingResponse = await fetch(`${BASE_URL}/api/domain-monitor?action=trending&limit=5&timeframe=24h`);
    const trendingData = await trendingResponse.json();
    
    if (trendingResponse.ok) {
      console.log('✅ Trending domains endpoint working');
      console.log(`   Found ${trendingData.domains?.length || 0} trending domains`);
      if (trendingData.domains?.length > 0) {
        const domain = trendingData.domains[0];
        console.log(`   Sample domain: ${domain.domain_name} (${domain.total_events} events)`);
      }
    } else {
      console.log('❌ Trending domains endpoint failed:', trendingData.error);
    }

    // Test 3: Get subscriptions
    console.log('\n3️⃣ Testing subscriptions endpoint...');
    const subscriptionsResponse = await fetch(`${BASE_URL}/api/domain-monitor?action=subscriptions&userId=test-user`);
    const subscriptionsData = await subscriptionsResponse.json();
    
    if (subscriptionsResponse.ok) {
      console.log('✅ Subscriptions endpoint working');
      console.log(`   Found ${subscriptionsData.subscriptions?.length || 0} subscriptions`);
    } else {
      console.log('❌ Subscriptions endpoint failed:', subscriptionsData.error);
    }

    // Test 4: Test analytics endpoint
    console.log('\n4️⃣ Testing analytics endpoint...');
    const analyticsResponse = await fetch(`${BASE_URL}/api/domain-monitor?action=analytics&domainName=example.com`);
    const analyticsData = await analyticsResponse.json();
    
    if (analyticsResponse.ok) {
      console.log('✅ Analytics endpoint working');
      console.log(`   Analytics data: ${analyticsData.analytics ? 'Found' : 'Not found'}`);
    } else {
      console.log('❌ Analytics endpoint failed:', analyticsData.error);
    }

    console.log('\n🎉 Domain Monitor API testing completed!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Start the frontend: cd frontend && npm run dev');
    console.log('   2. Visit http://localhost:3000/dashboard to see domain monitoring');
    console.log('   3. Visit http://localhost:3000/domain-monitor for detailed view');

  } catch (error) {
    console.error('❌ Error testing domain monitor API:', error.message);
    console.log('\n💡 Make sure the frontend is running on http://localhost:3000');
  }
}

// Run the test
testDomainMonitorAPI();



