import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

console.log('🔍 Debugging Supabase Connection...');
console.log('SUPABASE_URL:', SUPABASE_URL);
console.log('SUPABASE_KEY length:', SUPABASE_KEY ? SUPABASE_KEY.length : 'undefined');
console.log('SUPABASE_KEY starts with:', SUPABASE_KEY ? SUPABASE_KEY.substring(0, 20) + '...' : 'undefined');

// Check URL format
if (SUPABASE_URL) {
  console.log('URL validation:');
  console.log('- Starts with https:', SUPABASE_URL.startsWith('https://'));
  console.log('- Contains .supabase.co:', SUPABASE_URL.includes('.supabase.co'));
  console.log('- Has proper format:', /^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/.test(SUPABASE_URL));
}

// Test with different fetch options
console.log('\n🔄 Testing with different configurations...');

// Test 1: Basic fetch test
try {
  console.log('Test 1: Basic fetch to Supabase URL...');
  const response = await fetch(SUPABASE_URL + '/rest/v1/', {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  console.log('✅ Basic fetch successful, status:', response.status);
} catch (error) {
  console.log('❌ Basic fetch failed:', error.message);
}

// Test 2: Supabase client with different options
try {
  console.log('\nTest 2: Supabase client with custom options...');
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: false
    },
    global: {
      fetch: (url, options) => {
        console.log('Fetching:', url);
        return fetch(url, {
          ...options,
          timeout: 10000
        });
      }
    }
  });
  
  const { data, error } = await supabase
    .from('domain_events')
    .select('count')
    .limit(1);
    
  if (error) {
    console.log('❌ Supabase query failed:', error);
  } else {
    console.log('✅ Supabase query successful:', data);
  }
} catch (error) {
  console.log('❌ Supabase client test failed:', error.message);
}

// Test 3: Check if it's a Node.js fetch issue
console.log('\nTest 3: Node.js version and fetch support...');
console.log('Node.js version:', process.version);
console.log('Fetch available:', typeof fetch !== 'undefined');

// Test 4: Try with axios as alternative
try {
  console.log('\nTest 4: Testing with axios...');
  const axios = (await import('axios')).default;
  
  const response = await axios.get(SUPABASE_URL + '/rest/v1/', {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    },
    timeout: 10000
  });
  
  console.log('✅ Axios test successful, status:', response.status);
} catch (error) {
  console.log('❌ Axios test failed:', error.message);
}



