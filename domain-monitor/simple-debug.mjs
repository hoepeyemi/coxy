import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Simple Debug - Checking API and Environment...');
console.log('API Key exists:', !!process.env.DOMA_API_KEY);
console.log('API Key length:', process.env.DOMA_API_KEY ? process.env.DOMA_API_KEY.length : 0);

const DOMA_API_BASE = 'https://api-testnet.doma.xyz/v1';
const API_KEY = process.env.DOMA_API_KEY;

if (!API_KEY) {
  console.log('❌ No API key found!');
  process.exit(1);
}

console.log('🔄 Making API call...');

try {
  const response = await axios.get(`${DOMA_API_BASE}/poll?limit=2&finalizedOnly=true`, {
    headers: {
      'Api-Key': API_KEY,
      'Accept': 'application/json'
    },
    timeout: 10000
  });

  console.log('✅ API call successful!');
  console.log('Status:', response.status);
  console.log('Events found:', response.data.events ? response.data.events.length : 0);
  
  if (response.data.events && response.data.events.length > 0) {
    console.log('\n📋 First Event Structure:');
    console.log(JSON.stringify(response.data.events[0], null, 2));
  }
  
} catch (error) {
  console.log('❌ API call failed:', error.message);
  if (error.response) {
    console.log('Status:', error.response.status);
    console.log('Data:', error.response.data);
  }
}



