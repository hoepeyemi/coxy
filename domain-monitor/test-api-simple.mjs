import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const DOMA_API_BASE = 'https://api-testnet.doma.xyz/v1';
const API_KEY = process.env.DOMA_API_KEY;

console.log('🔍 Testing Doma API Connection...');
console.log('API Key length:', API_KEY ? API_KEY.length : 'undefined');

try {
  console.log('Making API call...');
  const response = await axios.get(`${DOMA_API_BASE}/poll?limit=1&finalizedOnly=true`, {
    headers: {
      'Api-Key': API_KEY,
      'Accept': 'application/json'
    },
    timeout: 5000
  });

  console.log('✅ API call successful!');
  console.log('Status:', response.status);
  console.log('Events found:', response.data.events ? response.data.events.length : 0);
  
  if (response.data.events && response.data.events.length > 0) {
    const event = response.data.events[0];
    console.log('\n📋 Event Structure:');
    console.log('ID:', event.id);
    console.log('Type:', event.type);
    console.log('Name:', event.name);
    console.log('Token ID:', event.tokenId);
    console.log('Unique ID:', event.uniqueId);
    console.log('Event Data:', JSON.stringify(event.eventData, null, 2));
  }
  
} catch (error) {
  console.log('❌ API call failed:', error.message);
  if (error.response) {
    console.log('Status:', error.response.status);
    console.log('Data:', error.response.data);
  }
}



