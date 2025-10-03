import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

console.log('🌐 Network Connectivity Test...');

// Test 1: Basic internet connectivity
console.log('\n1️⃣ Testing basic internet connectivity...');
try {
  const response = await fetch('https://httpbin.org/get');
  const data = await response.json();
  console.log('✅ Internet connectivity: OK');
  console.log('Response origin:', data.origin);
} catch (error) {
  console.log('❌ Internet connectivity failed:', error.message);
}

// Test 2: DNS resolution test
console.log('\n2️⃣ Testing DNS resolution...');
try {
  const dns = await import('dns');
  const { promisify } = await import('util');
  const lookup = promisify(dns.lookup);
  
  const result = await lookup('uksjuwycgnmzhnurqrdo.supabase.co');
  console.log('✅ DNS resolution: OK');
  console.log('Resolved IP:', result.address);
} catch (error) {
  console.log('❌ DNS resolution failed:', error.message);
}

// Test 3: Test different Supabase endpoints
console.log('\n3️⃣ Testing different Supabase endpoints...');
const endpoints = [
  'https://uksjuwycgnmzhnurqrdo.supabase.co',
  'https://uksjuwycgnmzhnurqrdo.supabase.co/rest/v1/',
  'https://uksjuwycgnmzhnurqrdo.supabase.co/auth/v1/'
];

for (const endpoint of endpoints) {
  try {
    console.log(`Testing: ${endpoint}`);
    const response = await fetch(endpoint, { 
      method: 'GET',
      timeout: 5000 
    });
    console.log(`✅ ${endpoint}: Status ${response.status}`);
  } catch (error) {
    console.log(`❌ ${endpoint}: ${error.message}`);
  }
}

// Test 4: Try with different Node.js fetch options
console.log('\n4️⃣ Testing with different fetch configurations...');
try {
  const response = await fetch('https://uksjuwycgnmzhnurqrdo.supabase.co', {
    method: 'GET',
    headers: {
      'User-Agent': 'Node.js/22.13.0'
    },
    // Add timeout and other options
    signal: AbortSignal.timeout(10000)
  });
  console.log('✅ Custom fetch configuration: OK');
  console.log('Status:', response.status);
} catch (error) {
  console.log('❌ Custom fetch failed:', error.message);
}

// Test 5: Check if it's a specific Supabase issue
console.log('\n5️⃣ Testing alternative Supabase project...');
try {
  // Try a known working Supabase endpoint (public demo)
  const response = await fetch('https://supabase.com');
  console.log('✅ Supabase.com accessible: OK');
  console.log('Status:', response.status);
} catch (error) {
  console.log('❌ Supabase.com not accessible:', error.message);
}

console.log('\n🔍 Diagnosis:');
console.log('- If internet connectivity fails: Check your internet connection');
console.log('- If DNS resolution fails: Check your DNS settings or try different DNS (8.8.8.8)');
console.log('- If only Supabase fails: Check if your Supabase project is active');
console.log('- If all fail: Check firewall/proxy settings');



