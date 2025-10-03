// Test script to verify domain monitoring API endpoints
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3000/api/domain-monitor';

async function testEndpoint(action, params = {}) {
  const url = new URL(`${API_BASE}?action=${action}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  try {
    console.log(`\n🧪 Testing ${action}...`);
    console.log(`URL: ${url.toString()}`);
    
    const response = await fetch(url.toString());
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    if (response.ok) {
      console.log(`✅ Success:`, JSON.stringify(data, null, 2));
    } else {
      console.log(`❌ Error:`, data);
    }
    
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    console.log(`❌ Network Error:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Testing Domain Monitoring API Endpoints\n');
  
  const tests = [
    { action: 'analytics' },
    { action: 'events', params: { limit: '5' } },
    { action: 'trends', params: { limit: '5' } },
    { action: 'search', params: { query: 'test' } },
  ];

  const results = [];
  
  for (const test of tests) {
    const result = await testEndpoint(test.action, test.params);
    results.push({ ...test, ...result });
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n📊 Test Summary:');
  console.log('================');
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.action}: ${result.status || 'ERROR'}`);
  });

  const successCount = results.filter(r => r.success).length;
  console.log(`\n🎯 Results: ${successCount}/${results.length} tests passed`);
}

// Run the tests
runTests().catch(console.error);
