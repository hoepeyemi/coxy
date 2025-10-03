import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Configuration
const DOMA_API_BASE = 'https://api-testnet.doma.xyz/v1';
const API_KEY = process.env.DOMA_API_KEY;

console.log('🔍 Debugging Doma Protocol Event Structure...');

async function debugEventStructure() {
  try {
    console.log('1️⃣ Fetching sample events to analyze structure...');
    
    const response = await axios.get(`${DOMA_API_BASE}/poll?limit=5&finalizedOnly=true`, {
      headers: {
        'Api-Key': API_KEY,
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    const { events } = response.data;
    
    if (events && events.length > 0) {
      console.log(`✅ Found ${events.length} events`);
      console.log('\n📋 Sample Event Structure:');
      console.log('=' .repeat(50));
      
      events.forEach((event, index) => {
        console.log(`\nEvent ${index + 1}:`);
        console.log('ID:', event.id);
        console.log('Type:', event.type);
        console.log('Name:', event.name);
        console.log('Token ID:', event.tokenId);
        console.log('Unique ID:', event.uniqueId);
        console.log('Relay ID:', event.relayId);
        console.log('Event Data:', JSON.stringify(event.eventData, null, 2));
        console.log('-'.repeat(30));
      });
      
      // Analyze the structure
      console.log('\n🔍 Event Structure Analysis:');
      const sampleEvent = events[0];
      console.log('Available fields:', Object.keys(sampleEvent));
      console.log('Event data fields:', sampleEvent.eventData ? Object.keys(sampleEvent.eventData) : 'No eventData');
      
      // Check for alternative field names
      console.log('\n🔍 Checking for alternative field names:');
      const possibleNameFields = ['name', 'domain', 'domainName', 'domain_name'];
      const possibleTokenIdFields = ['tokenId', 'token_id', 'tokenAddress', 'token_address'];
      const possibleUniqueIdFields = ['uniqueId', 'unique_id', 'id', 'eventId'];
      
      possibleNameFields.forEach(field => {
        if (sampleEvent[field] !== undefined) {
          console.log(`✅ Found name field: ${field} = ${sampleEvent[field]}`);
        }
      });
      
      possibleTokenIdFields.forEach(field => {
        if (sampleEvent[field] !== undefined) {
          console.log(`✅ Found tokenId field: ${field} = ${sampleEvent[field]}`);
        }
      });
      
      possibleUniqueIdFields.forEach(field => {
        if (sampleEvent[field] !== undefined) {
          console.log(`✅ Found uniqueId field: ${field} = ${sampleEvent[field]}`);
        }
      });
      
      // Check eventData for these fields
      if (sampleEvent.eventData) {
        console.log('\n🔍 Checking eventData for missing fields:');
        possibleNameFields.forEach(field => {
          if (sampleEvent.eventData[field] !== undefined) {
            console.log(`✅ Found name in eventData: ${field} = ${sampleEvent.eventData[field]}`);
          }
        });
        
        possibleTokenIdFields.forEach(field => {
          if (sampleEvent.eventData[field] !== undefined) {
            console.log(`✅ Found tokenId in eventData: ${field} = ${sampleEvent.eventData[field]}`);
          }
        });
      }
      
    } else {
      console.log('❌ No events found');
    }
    
  } catch (error) {
    console.error('❌ Error fetching events:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

debugEventStructure();



