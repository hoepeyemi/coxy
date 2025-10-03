import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Configuration
const DOMA_API_BASE = 'https://api-testnet.doma.xyz/v1';
const API_KEY = process.env.DOMA_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('🔍 Fixing Event Mapping - Fetching and analyzing real events...');

async function fixEventMapping() {
  try {
    console.log('1️⃣ Fetching sample events from Doma API...');
    
    const response = await axios.get(`${DOMA_API_BASE}/poll?limit=3&finalizedOnly=true`, {
      headers: {
        'Api-Key': API_KEY,
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    const { events } = response.data;
    
    if (events && events.length > 0) {
      console.log(`✅ Found ${events.length} events`);
      
      // Analyze the first event structure
      const sampleEvent = events[0];
      console.log('\n📋 Sample Event Structure:');
      console.log('Raw event:', JSON.stringify(sampleEvent, null, 2));
      
      // Try to extract the correct field mappings
      console.log('\n🔍 Field Mapping Analysis:');
      
      // Check for name in various possible locations
      const possibleNames = [
        sampleEvent.name,
        sampleEvent.eventData?.name,
        sampleEvent.eventData?.domain,
        sampleEvent.eventData?.domainName,
        sampleEvent.eventData?.domain_name
      ].filter(Boolean);
      
      console.log('Possible names found:', possibleNames);
      
      // Check for token_id in various possible locations
      const possibleTokenIds = [
        sampleEvent.tokenId,
        sampleEvent.eventData?.tokenId,
        sampleEvent.eventData?.token_id,
        sampleEvent.eventData?.tokenAddress,
        sampleEvent.eventData?.token_address
      ].filter(Boolean);
      
      console.log('Possible token IDs found:', possibleTokenIds);
      
      // Check for unique_id in various possible locations
      const possibleUniqueIds = [
        sampleEvent.uniqueId,
        sampleEvent.id,
        sampleEvent.eventData?.uniqueId,
        sampleEvent.eventData?.unique_id,
        sampleEvent.eventData?.eventId
      ].filter(Boolean);
      
      console.log('Possible unique IDs found:', possibleUniqueIds);
      
      // Test storing with corrected mapping
      console.log('\n🧪 Testing corrected event storage...');
      
      for (const event of events) {
        const correctedEvent = {
          event_id: event.id,
          name: event.name || event.eventData?.name || event.eventData?.domain || null,
          token_id: event.tokenId || event.eventData?.tokenId || event.eventData?.token_id || null,
          type: event.type,
          unique_id: event.uniqueId || event.id || null,
          relay_id: event.relayId || null,
          event_data: event.eventData || {},
          processed: false,
          created_at: new Date().toISOString()
        };
        
        console.log(`\nCorrected event for ${event.type}:`);
        console.log('Name:', correctedEvent.name);
        console.log('Token ID:', correctedEvent.token_id);
        console.log('Unique ID:', correctedEvent.unique_id);
        
        // Store the corrected event
        const { data, error } = await supabase
          .from('domain_events')
          .upsert(correctedEvent, {
            onConflict: 'event_id',
            ignoreDuplicates: false
          });
        
        if (error) {
          console.log('❌ Error storing corrected event:', error);
        } else {
          console.log('✅ Corrected event stored successfully');
        }
      }
      
    } else {
      console.log('❌ No events found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

fixEventMapping();



