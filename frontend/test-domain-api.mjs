#!/usr/bin/env node

// Test script to verify domain page API integration
const testDomainId = 'Event-396045';
const baseUrl = 'http://localhost:3000';

console.log('🧪 Testing Domain Page API Integration');
console.log('=====================================');
console.log(`Test Domain ID: ${testDomainId}`);
console.log(`Base URL: ${baseUrl}`);
console.log('');

async function testDomainAPI() {
  try {
    // Test the domain-monitor API endpoint
    const apiUrl = `${baseUrl}/api/domain-monitor?action=events&domainName=${encodeURIComponent(testDomainId)}&limit=100`;
    console.log(`📡 Testing API: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
    
    if (data.events && data.events.length > 0) {
      console.log(`   ✅ Found ${data.events.length} events`);
      console.log(`   📊 Sample event:`, data.events[0]);
    } else {
      console.log(`   ⚠️  No events found for domain: ${testDomainId}`);
    }
    
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
  }
}

async function testDomainPage() {
  try {
    // Test the domain page URL
    const pageUrl = `${baseUrl}/domain/${testDomainId}?type=listing`;
    console.log(`\n🌐 Testing Domain Page: ${pageUrl}`);
    
    const response = await fetch(pageUrl);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      console.log(`   ✅ Domain page loads successfully`);
    } else {
      console.log(`   ❌ Domain page failed to load`);
    }
    
  } catch (error) {
    console.error('❌ Domain Page Test Failed:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting tests...\n');
  
  await testDomainAPI();
  await testDomainPage();
  
  console.log('\n🎉 Tests completed!');
  console.log('\n📝 Next Steps:');
  console.log('   1. Start the frontend server: npm run dev');
  console.log('   2. Test the actual domain page in browser');
  console.log('   3. Verify Twitter bot links work');
}

runTests().catch(console.error);