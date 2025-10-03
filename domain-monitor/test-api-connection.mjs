import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const DOMA_API_BASE = 'https://api-testnet.doma.xyz/v1';
const API_KEY = process.env.DOMA_API_KEY;

async function testApiConnection() {
  console.log('🧪 Testing Doma Protocol API Connection\n');

  if (!API_KEY) {
    console.error('❌ DOMA_API_KEY not found in environment variables');
    console.log('Please add DOMA_API_KEY to your .env file');
    return;
  }

  console.log('✅ API Key found:', API_KEY.substring(0, 10) + '...');

  // Test 1: Simple poll request with minimal parameters
  console.log('\n1️⃣ Testing basic poll request...');
  try {
    const params = new URLSearchParams({
      limit: '1',
      finalizedOnly: 'true'
    });

    const response = await axios.get(`${DOMA_API_BASE}/poll?${params}`, {
      headers: {
        'Api-Key': API_KEY,
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Basic poll request successful');
    console.log('Response status:', response.status);
    console.log('Events found:', response.data.events?.length || 0);
    console.log('Has more events:', response.data.hasMoreEvents);

  } catch (error) {
    console.error('❌ Basic poll request failed');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }

  // Test 2: Poll request with single event type
  console.log('\n2️⃣ Testing poll request with single event type...');
  try {
    const params = new URLSearchParams({
      eventTypes: 'NAME_TOKEN_MINTED',
      limit: '1',
      finalizedOnly: 'true'
    });

    const response = await axios.get(`${DOMA_API_BASE}/poll?${params}`, {
      headers: {
        'Api-Key': API_KEY,
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Single event type request successful');
    console.log('Response status:', response.status);
    console.log('Events found:', response.data.events?.length || 0);

  } catch (error) {
    console.error('❌ Single event type request failed');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }

  // Test 3: Poll request with multiple event types
  console.log('\n3️⃣ Testing poll request with multiple event types...');
  try {
    const params = new URLSearchParams({
      limit: '1',
      finalizedOnly: 'true'
    });

    // Add multiple event types
    ['NAME_TOKEN_MINTED', 'NAME_TOKEN_LISTED', 'NAME_TOKEN_SOLD'].forEach(eventType => {
      params.append('eventTypes', eventType);
    });

    console.log('Request URL:', `${DOMA_API_BASE}/poll?${params.toString()}`);

    const response = await axios.get(`${DOMA_API_BASE}/poll?${params}`, {
      headers: {
        'Api-Key': API_KEY,
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Multiple event types request successful');
    console.log('Response status:', response.status);
    console.log('Events found:', response.data.events?.length || 0);

  } catch (error) {
    console.error('❌ Multiple event types request failed');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Request URL:', error.config?.url);
    } else {
      console.error('Error:', error.message);
    }
  }

  // Test 4: Check available event types
  console.log('\n4️⃣ Testing with all event types...');
  const allEventTypes = [
    'NAME_TOKEN_MINTED',
    'NAME_TOKEN_BURNED', 
    'NAME_TOKEN_TRANSFERRED',
    'NAME_TOKEN_LISTED',
    'NAME_TOKEN_UNLISTED',
    'NAME_TOKEN_SOLD',
    'NAME_TOKEN_OFFERED',
    'NAME_TOKEN_OFFER_ACCEPTED',
    'NAME_TOKEN_OFFER_CANCELLED',
    'NAME_TOKEN_EXPIRED',
    'NAME_TOKEN_RENEWED',
    'NAME_TOKEN_FRACTIONALIZED',
    'NAME_TOKEN_DEFRACTIONALIZED'
  ];

  try {
    const params = new URLSearchParams({
      limit: '1',
      finalizedOnly: 'true'
    });

    // Add all event types
    allEventTypes.forEach(eventType => {
      params.append('eventTypes', eventType);
    });

    console.log('Testing with all event types...');
    console.log('Total event types:', allEventTypes.length);

    const response = await axios.get(`${DOMA_API_BASE}/poll?${params}`, {
      headers: {
        'Api-Key': API_KEY,
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ All event types request successful');
    console.log('Response status:', response.status);
    console.log('Events found:', response.data.events?.length || 0);

  } catch (error) {
    console.error('❌ All event types request failed');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }

  console.log('\n🏁 API connection test completed');
}

testApiConnection();


