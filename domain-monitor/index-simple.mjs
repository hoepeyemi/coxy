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

// Start with a subset of event types for testing
const EVENT_TYPES = [
  'NAME_TOKEN_MINTED',
  'NAME_TOKENIZED',
  'NAME_CLAIMED',
  'NAME_TOKEN_TRANSFERRED',
  'COMMAND_SUCCEEDED',
  'COMMAND_FAILED'
];

class SimpleDomainMonitor {
  constructor() {
    this.lastEventId = null;
    this.isRunning = false;
    this.pollInterval = 30000; // 30 seconds
  }

  async initialize() {
    try {
      console.log('🚀 Starting Simple Domain Monitor...');
      console.log('Event types:', EVENT_TYPES.join(', '));
      
      // Get last processed event ID from database
      const { data: lastEvent, error } = await supabase
        .from('domain_events')
        .select('event_id')
        .order('event_id', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching last event ID:', error);
      } else if (lastEvent) {
        this.lastEventId = lastEvent.event_id;
        console.log(`Starting from event ID: ${this.lastEventId}`);
      } else {
        console.log('No previous events found, starting from beginning');
      }

      // Start polling
      this.startPolling();
    } catch (error) {
      console.error('Failed to initialize domain monitor:', error);
    }
  }

  startPolling() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('Starting domain event polling...');
    
    // Poll immediately
    this.pollEvents();
    
    // Then poll every 30 seconds
    setInterval(() => {
      if (this.isRunning) {
        this.pollEvents();
      }
    }, this.pollInterval);
  }

  stopPolling() {
    this.isRunning = false;
    console.log('Stopped domain event polling');
  }

  async pollEvents() {
    try {
      const params = new URLSearchParams({
        limit: '10',
        finalizedOnly: 'true'
      });

      // Add each event type as a separate parameter
      EVENT_TYPES.forEach(eventType => {
        params.append('eventTypes', eventType);
      });

      if (this.lastEventId) {
        params.append('after', this.lastEventId.toString());
      }

      console.log(`Polling events with params: ${params.toString()}`);

      const response = await axios.get(`${DOMA_API_BASE}/poll?${params}`, {
        headers: {
          'Api-Key': API_KEY,
          'Accept': 'application/json'
        },
        timeout: 10000
      });

      const { events, lastId, hasMoreEvents } = response.data;

      if (events && events.length > 0) {
        console.log(`✅ Processing ${events.length} domain events...`);
        
        // Process events
        await this.processEvents(events);
        
        // Update last event ID
        this.lastEventId = lastId;
        
        // Acknowledge events
        await this.acknowledgeEvents(lastId);
        
        console.log(`Processed events up to ID: ${lastId}`);
      } else {
        console.log('No new events found');
      }

      // If there are more events, poll again immediately
      if (hasMoreEvents) {
        setTimeout(() => this.pollEvents(), 1000);
      }

    } catch (error) {
      console.error('Error polling domain events:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        
        if (error.response.status === 400) {
          console.error('Bad Request - Check API parameters and event types');
          console.error('Request URL:', error.config?.url);
        } else if (error.response.status === 401) {
          console.error('Invalid API key. Please check DOMA_API_KEY environment variable.');
          this.stopPolling();
        } else if (error.response.status === 403) {
          console.error('API key missing EVENTS permission.');
          this.stopPolling();
        }
      } else {
        console.error('Network or other error:', error.message);
      }
    }
  }

  async processEvents(events) {
    for (const event of events) {
      try {
        console.log(`Processing event: ${event.type} - ${event.name}`);
        
        // Store event in database
        await this.storeEvent(event);
        
      } catch (error) {
        console.error(`Error processing event ${event.id}:`, error);
      }
    }
  }

  async storeEvent(event) {
    // Extract data from event and eventData with fallbacks
    const eventData = event.eventData || {};
    
    // For Doma Protocol, most data is in eventData or not available
    // Use event ID as unique identifier and relayId as the main identifier
    const { data, error } = await supabase
      .from('domain_events')
      .upsert({
        event_id: event.id,
        name: event.name || eventData.name || eventData.domain || `Event-${event.id}`,
        token_id: event.tokenId || eventData.tokenId || eventData.token_id || null,
        type: event.type || 'UNKNOWN_EVENT',
        unique_id: event.uniqueId || event.id || eventData.uniqueId || event.id.toString(),
        relay_id: event.relayId || eventData.relayId || null,
        event_data: eventData,
        processed: false,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'event_id',
        ignoreDuplicates: false
      });

    if (error) {
      console.error('Error storing event:', error);
    } else {
      const domainName = event.name || eventData.name || eventData.domain || `Event-${event.id}`;
      console.log(`✅ Stored/Updated event: ${event.type} - ${domainName}`);
    }
  }

  async acknowledgeEvents(lastEventId) {
    try {
      await axios.post(`${DOMA_API_BASE}/poll/ack/${lastEventId}`, {}, {
        headers: {
          'Api-Key': API_KEY,
          'Accept': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error acknowledging events:', error);
    }
  }
}

// Create and start the monitor
const monitor = new SimpleDomainMonitor();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down domain monitor...');
  monitor.stopPolling();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down domain monitor...');
  monitor.stopPolling();
  process.exit(0);
});

// Start the monitor
monitor.initialize().catch(console.error);

export default SimpleDomainMonitor;
