import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const DOMA_API_BASE = 'https://api-testnet.doma.xyz/v1';
const API_KEY = process.env.DOMA_API_KEY;

async function discoverEventTypes() {
  console.log('🔍 Discovering supported event types from Doma Protocol API\n');

  if (!API_KEY) {
    console.error('❌ DOMA_API_KEY not found in environment variables');
    return;
  }

  // Test with a basic request to see what event types are available
  console.log('1️⃣ Testing basic poll request to discover event types...');
  
  try {
    const params = new URLSearchParams({
      limit: '10',
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

    if (response.data.events && response.data.events.length > 0) {
      console.log('\n📋 Event types found in response:');
      const eventTypes = [...new Set(response.data.events.map(event => event.type))];
      eventTypes.forEach(type => console.log(`   - ${type}`));
    }

    // Let's also try to get more events to see more types
    console.log('\n2️⃣ Fetching more events to discover additional types...');
    
    const moreParams = new URLSearchParams({
      limit: '50',
      finalizedOnly: 'true'
    });

    const moreResponse = await axios.get(`${DOMA_API_BASE}/poll?${moreParams}`, {
      headers: {
        'Api-Key': API_KEY,
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    if (moreResponse.data.events && moreResponse.data.events.length > 0) {
      console.log('✅ Extended poll request successful');
      console.log('Events found:', moreResponse.data.events.length);
      
      const allEventTypes = [...new Set(moreResponse.data.events.map(event => event.type))];
      console.log('\n📋 All event types discovered:');
      allEventTypes.forEach(type => console.log(`   - ${type}`));
      
      console.log(`\nTotal unique event types: ${allEventTypes.length}`);
    }

  } catch (error) {
    console.error('❌ Error discovering event types:', error);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }

  // Test some common event type variations
  console.log('\n3️⃣ Testing common event type variations...');
  
  const commonVariations = [
    'MINTED',
    'BURNED',
    'TRANSFERRED',
    'LISTED',
    'UNLISTED',
    'SOLD',
    'OFFERED',
    'OFFER_ACCEPTED',
    'OFFER_CANCELLED',
    'EXPIRED',
    'RENEWED',
    'FRACTIONALIZED',
    'DEFRACTIONALIZED',
    'TOKEN_MINTED',
    'TOKEN_BURNED',
    'TOKEN_TRANSFERRED',
    'TOKEN_LISTED',
    'TOKEN_UNLISTED',
    'TOKEN_SOLD',
    'TOKEN_OFFERED',
    'TOKEN_OFFER_ACCEPTED',
    'TOKEN_OFFER_CANCELLED',
    'TOKEN_EXPIRED',
    'TOKEN_RENEWED',
    'TOKEN_FRACTIONALIZED',
    'TOKEN_DEFRACTIONALIZED'
  ];

  for (const eventType of commonVariations) {
    try {
      const params = new URLSearchParams({
        eventTypes: eventType,
        limit: '1',
        finalizedOnly: 'true'
      });

      const response = await axios.get(`${DOMA_API_BASE}/poll?${params}`, {
        headers: {
          'Api-Key': API_KEY,
          'Accept': 'application/json'
        },
        timeout: 5000
      });

      console.log(`✅ ${eventType} - Valid event type`);
      
    } catch (error) {
      if (error.response?.status === 400) {
        console.log(`❌ ${eventType} - Invalid event type`);
      } else {
        console.log(`⚠️  ${eventType} - Error: ${error.message}`);
      }
    }
  }

  console.log('\n🏁 Event type discovery completed');
}

discoverEventTypes();


