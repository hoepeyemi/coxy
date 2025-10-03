import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import cron from 'node-cron';
import dotenv from 'dotenv';

dotenv.config();

// Configuration
const DOMA_API_BASE = 'https://api-testnet.doma.xyz/v1';
const API_KEY = process.env.DOMA_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Event types we want to monitor (discovered from API)
const EVENT_TYPES = [
  'NAME_CLAIMED',
  'NAME_TOKENIZED',
  'COMMAND_UPDATED',
  'COMMAND_SUCCEEDED',
  'NAME_TOKEN_MINTED',
  'COMMAND_CREATED',
  'NAME_TOKEN_TRANSFERRED',
  'NAME_TOKENIZATION_REQUESTED'
];

class DomainMonitor {
  constructor() {
    this.lastEventId = null;
    this.isRunning = false;
    this.pollInterval = 30000; // 30 seconds
    this.maxRetries = 3;
    this.retryDelay = 5000; // 5 seconds
  }

  async initialize() {
    try {
      // Get last processed event ID from database
      const { data: lastEvent, error } = await supabase
        .from('domain_events')
        .select('event_id')
        .order('event_id', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
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
        limit: '100',
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
        console.log(`Processing ${events.length} domain events...`);
        
        // Process events
        await this.processEvents(events);
        
        // Update last event ID
        this.lastEventId = lastId;
        
        // Acknowledge events
        await this.acknowledgeEvents(lastId);
        
        console.log(`Processed events up to ID: ${lastId}`);
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
          console.error('Request headers:', error.config?.headers);
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
        // Store event in database
        await this.storeEvent(event);
        
        // Process event for webhooks
        await this.processEventForWebhooks(event);
        
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
        type: event.type,
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

  async processEventForWebhooks(event) {
    try {
      // Get active subscriptions for this event type
      const { data: subscriptions, error } = await supabase
        .from('domain_subscriptions')
        .select('*')
        .eq('event_type', event.type)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching subscriptions:', error);
        return;
      }

      if (!subscriptions || subscriptions.length === 0) {
        return;
      }

      // Process each subscription
      for (const subscription of subscriptions) {
        try {
          const shouldTrigger = await this.evaluateFilters(event, subscription.filters);
          
          if (shouldTrigger) {
            await this.sendWebhook(subscription, event);
          }
        } catch (error) {
          console.error(`Error processing subscription ${subscription.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error processing event for webhooks:', error);
    }
  }

  async evaluateFilters(event, filters) {
    if (!filters) return true;

    try {
      const eventData = event.eventData;
      
      // Price filters
      if (filters.minPrice && eventData.price) {
        if (parseFloat(eventData.price) < parseFloat(filters.minPrice)) {
          return false;
        }
      }

      if (filters.maxPrice && eventData.price) {
        if (parseFloat(eventData.price) > parseFloat(filters.maxPrice)) {
          return false;
        }
      }

      // Domain length filters
      if (filters.minLength && event.name) {
        if (event.name.length < filters.minLength) {
          return false;
        }
      }

      if (filters.maxLength && event.name) {
        if (event.name.length > filters.maxLength) {
          return false;
        }
      }

      // Domain extension filters
      if (filters.extensions && filters.extensions.length > 0) {
        const domainExt = event.name?.split('.').pop();
        if (!filters.extensions.includes(domainExt)) {
          return false;
        }
      }

      // Expiration filters
      if (filters.expiresWithinDays && eventData.expiresAt) {
        const expiresAt = new Date(eventData.expiresAt);
        const now = new Date();
        const daysUntilExpiry = (expiresAt - now) / (1000 * 60 * 60 * 24);
        
        if (daysUntilExpiry > filters.expiresWithinDays) {
          return false;
        }
      }

      // Owner filters
      if (filters.owner && eventData.owner) {
        if (eventData.owner.toLowerCase() !== filters.owner.toLowerCase()) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error evaluating filters:', error);
      return false;
    }
  }

  async sendWebhook(subscription, event) {
    try {
      const webhookData = {
        subscription_id: subscription.id,
        event: {
          id: event.id,
          name: event.name,
          tokenId: event.tokenId,
          type: event.type,
          eventData: event.eventData,
          timestamp: new Date().toISOString()
        },
        metadata: {
          webhook_url: subscription.webhook_url,
          created_at: new Date().toISOString()
        }
      };

      const response = await axios.post(subscription.webhook_url, webhookData, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Iris-Domain-Monitor/1.0'
        },
        timeout: 10000
      });

      console.log(`Webhook sent successfully to ${subscription.webhook_url}`);
      
      // Log webhook delivery
      await supabase
        .from('webhook_deliveries')
        .insert({
          subscription_id: subscription.id,
          event_id: event.id,
          webhook_url: subscription.webhook_url,
          status: 'success',
          response_status: response.status,
          delivered_at: new Date().toISOString()
        });

    } catch (error) {
      console.error(`Webhook delivery failed for ${subscription.webhook_url}:`, error);
      
      // Log failed webhook delivery
      await supabase
        .from('webhook_deliveries')
        .insert({
          subscription_id: subscription.id,
          event_id: event.id,
          webhook_url: subscription.webhook_url,
          status: 'failed',
          error_message: error.message,
          delivered_at: new Date().toISOString()
        });
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

  async resetPolling(eventId) {
    try {
      await axios.post(`${DOMA_API_BASE}/poll/reset/${eventId}`, {}, {
        headers: {
          'Api-Key': API_KEY,
          'Accept': 'application/json'
        }
      });
      
      this.lastEventId = eventId;
      console.log(`Reset polling to event ID: ${eventId}`);
    } catch (error) {
      console.error('Error resetting polling:', error);
    }
  }
}

// Create and start the monitor
const monitor = new DomainMonitor();

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

export default DomainMonitor;

