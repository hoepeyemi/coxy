#!/usr/bin/env node

// Debug script to test the domain-monitor API
const testDomainId = 'Event-396045';
const baseUrl = 'http://localhost:3000';

console.log('🐛 Debugging Domain Monitor API');
console.log('================================');
console.log(`Test Domain ID: ${testDomainId}`);
console.log(`Base URL: ${baseUrl}`);
console.log('');

async function testAPI() {
  try {
    // Test the domain-monitor API endpoint
    const apiUrl = `${baseUrl}/api/domain-monitor?action=events&domainName=${encodeURIComponent(testDomainId)}&limit=10`;
    console.log(`📡 Testing API: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    const responseText = await response.text();
    console.log(`   Response: ${responseText}`);
    
    if (response.ok) {
      const data = JSON.parse(responseText);
      console.log(`   ✅ API Success: ${JSON.stringify(data, null, 2)}`);
    } else {
      console.log(`   ❌ API Error: ${response.status} - ${responseText}`);
    }
    
  } catch (error) {
    console.error('❌ Test Failed:', error.message);
  }
}

async function testWithoutDomain() {
  try {
    // Test the API without domain filter
    const apiUrl = `${baseUrl}/api/domain-monitor?action=events&limit=5`;
    console.log(`\n📡 Testing API without domain filter: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    const responseText = await response.text();
    console.log(`   Response: ${responseText}`);
    
    if (response.ok) {
      const data = JSON.parse(responseText);
      console.log(`   ✅ API Success: Found ${data.events?.length || 0} events`);
      if (data.events && data.events.length > 0) {
        console.log(`   📊 Sample event:`, data.events[0]);
      }
    } else {
      console.log(`   ❌ API Error: ${response.status} - ${responseText}`);
    }
    
  } catch (error) {
    console.error('❌ Test Failed:', error.message);
  }
}

async function testHealth() {
  try {
    // Test the health endpoint
    const healthUrl = `${baseUrl}/api/health`;
    console.log(`\n🏥 Testing Health: ${healthUrl}`);
    
    const response = await fetch(healthUrl);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    const responseText = await response.text();
    console.log(`   Response: ${responseText}`);
    
  } catch (error) {
    console.error('❌ Health Test Failed:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting API debug tests...\n');
  
  await testHealth();
  await testWithoutDomain();
  await testAPI();
  
  console.log('\n🎉 Debug tests completed!');
  console.log('\n📝 Next Steps:');
  console.log('   1. Check if the frontend server is running: npm run dev');
  console.log('   2. Check if the domain-monitor service is running');
  console.log('   3. Check Supabase connection and data');
}

runTests().catch(console.error);
