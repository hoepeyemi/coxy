import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

class AnalyticsProcessor {
  constructor() {
    this.batchSize = 100;
    this.processingInterval = 60000; // 1 minute
    this.isProcessing = false;
  }

  // Start the analytics processing loop
  start() {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    console.log('Starting analytics processing...');
    
    // Process immediately
    this.processAnalytics();
    
    // Then process every minute
    setInterval(() => {
      if (this.isProcessing) {
        this.processAnalytics();
      }
    }, this.processingInterval);
  }

  stop() {
    this.isProcessing = false;
    console.log('Stopped analytics processing');
  }

  async processAnalytics() {
    try {
      // Get unprocessed events
      const { data: events, error } = await supabase
        .from('domain_events')
        .select('*')
        .is('processed', null)
        .order('created_at', { ascending: true })
        .limit(this.batchSize);

      if (error) {
        console.error('Error fetching unprocessed events:', error);
        return;
      }

      if (!events || events.length === 0) {
        return;
      }

      console.log(`Processing ${events.length} events for analytics...`);

      // Group events by domain name
      const domainGroups = this.groupEventsByDomain(events);

      // Process each domain
      for (const [domainName, domainEvents] of domainGroups) {
        await this.updateDomainAnalytics(domainName, domainEvents);
        await this.updateDomainTraits(domainName, domainEvents[0]);
      }

      // Mark events as processed
      const eventIds = events.map(e => e.id);
      await this.markEventsAsProcessed(eventIds);

      console.log(`✅ Processed ${events.length} events`);

    } catch (error) {
      console.error('Error processing analytics:', error);
    }
  }

  groupEventsByDomain(events) {
    const groups = {};
    
    for (const event of events) {
      const domainName = event.name;
      if (!groups[domainName]) {
        groups[domainName] = [];
      }
      groups[domainName].push(event);
    }
    
    return groups;
  }

  async updateDomainAnalytics(domainName, events) {
    try {
      // Get existing analytics record
      const { data: existing, error: fetchError } = await supabase
        .from('domain_analytics')
        .select('*')
        .eq('domain_name', domainName)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching existing analytics:', fetchError);
        return;
      }

      // Calculate new analytics
      const analytics = this.calculateAnalytics(domainName, events, existing);

      if (existing) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('domain_analytics')
          .update(analytics)
          .eq('domain_name', domainName);

        if (updateError) {
          console.error('Error updating analytics:', updateError);
        }
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('domain_analytics')
          .insert(analytics);

        if (insertError) {
          console.error('Error inserting analytics:', insertError);
        }
      }

    } catch (error) {
      console.error('Error updating domain analytics:', error);
    }
  }

  calculateAnalytics(domainName, events, existing = null) {
    const analytics = {
      domain_name: domainName,
      total_events: (existing?.total_events || 0) + events.length,
      last_event_type: events[events.length - 1]?.type,
      last_event_at: events[events.length - 1]?.created_at,
      updated_at: new Date().toISOString()
    };

    // Get token ID from the most recent event
    const latestEvent = events[events.length - 1];
    if (latestEvent?.token_id) {
      analytics.token_id = latestEvent.token_id;
    }

    // Calculate price metrics
    const priceEvents = events.filter(e => 
      e.event_data?.price && 
      ['NAME_TOKEN_SOLD', 'NAME_TOKEN_LISTED', 'NAME_TOKEN_OFFERED'].includes(e.type)
    );

    if (priceEvents.length > 0) {
      const prices = priceEvents.map(e => parseFloat(e.event_data.price) || 0);
      const totalVolume = prices.reduce((sum, price) => sum + price, 0);
      
      analytics.total_volume_usd = (existing?.total_volume_usd || 0) + totalVolume;
      analytics.highest_price_usd = Math.max(
        existing?.highest_price_usd || 0,
        ...prices
      );
      
      if (existing?.lowest_price_usd) {
        analytics.lowest_price_usd = Math.min(existing.lowest_price_usd, ...prices);
      } else {
        analytics.lowest_price_usd = Math.min(...prices);
      }
    }

    // Count offers and trades
    const offerEvents = events.filter(e => e.type === 'NAME_TOKEN_OFFERED');
    const tradeEvents = events.filter(e => e.type === 'NAME_TOKEN_SOLD');
    
    analytics.offer_count = (existing?.offer_count || 0) + offerEvents.length;
    analytics.trade_count = (existing?.trade_count || 0) + tradeEvents.length;

    // Check if fractionalized
    const fractionalizedEvent = events.find(e => e.type === 'NAME_TOKEN_FRACTIONALIZED');
    if (fractionalizedEvent) {
      analytics.is_fractionalized = true;
    }

    // Set expiration date
    const latestEventData = latestEvent?.event_data;
    if (latestEventData?.expiresAt) {
      analytics.expires_at = latestEventData.expiresAt;
    }

    return analytics;
  }

  async updateDomainTraits(domainName, event) {
    try {
      // Check if traits already exist
      const { data: existing, error: fetchError } = await supabase
        .from('domain_traits')
        .select('*')
        .eq('domain_name', domainName)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching existing traits:', fetchError);
        return;
      }

      if (existing) {
        return; // Traits already calculated
      }

      // Calculate domain traits
      const traits = this.calculateDomainTraits(domainName, event);

      // Insert new traits record
      const { error: insertError } = await supabase
        .from('domain_traits')
        .insert(traits);

      if (insertError) {
        console.error('Error inserting domain traits:', insertError);
      }

    } catch (error) {
      console.error('Error updating domain traits:', error);
    }
  }

  calculateDomainTraits(domainName, event) {
    const traits = {
      domain_name: domainName,
      token_id: event?.token_id,
      length: domainName.length,
      extension: domainName.split('.').pop(),
      has_numbers: /\d/.test(domainName),
      has_hyphens: domainName.includes('-'),
      has_underscores: domainName.includes('_'),
      word_count: domainName.split(/[-._]/).length,
      is_palindrome: this.isPalindrome(domainName.split('.')[0]),
      is_pronounceable: this.isPronounceable(domainName),
      character_diversity: new Set(domainName.toLowerCase()).size
    };

    return traits;
  }

  isPalindrome(str) {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === cleaned.split('').reverse().join('');
  }

  isPronounceable(str) {
    // Simple heuristic for pronounceability
    const vowels = 'aeiou';
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    
    let vowelCount = 0;
    let consonantCount = 0;
    
    for (const char of str.toLowerCase()) {
      if (vowels.includes(char)) vowelCount++;
      else if (consonants.includes(char)) consonantCount++;
    }
    
    // A domain is likely pronounceable if it has a good vowel/consonant ratio
    const total = vowelCount + consonantCount;
    if (total === 0) return false;
    
    const vowelRatio = vowelCount / total;
    return vowelRatio >= 0.2 && vowelRatio <= 0.6;
  }

  async markEventsAsProcessed(eventIds) {
    try {
      const { error } = await supabase
        .from('domain_events')
        .update({ processed: true })
        .in('id', eventIds);

      if (error) {
        console.error('Error marking events as processed:', error);
      }
    } catch (error) {
      console.error('Error marking events as processed:', error);
    }
  }

  // Get domain analytics for a specific domain
  async getDomainAnalytics(domainName) {
    try {
      const { data, error } = await supabase
        .from('domain_analytics')
        .select('*')
        .eq('domain_name', domainName)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching domain analytics:', error);
      throw error;
    }
  }

  // Get trending domains
  async getTrendingDomains(limit = 10, timeframe = '24h') {
    try {
      const timeFilter = this.getTimeFilter(timeframe);
      
      const { data, error } = await supabase
        .from('domain_analytics')
        .select('*')
        .gte('last_event_at', timeFilter)
        .order('total_events', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching trending domains:', error);
      throw error;
    }
  }

  getTimeFilter(timeframe) {
    const now = new Date();
    const hours = {
      '1h': 1,
      '24h': 24,
      '7d': 24 * 7,
      '30d': 24 * 30
    };

    const hoursBack = hours[timeframe] || 24;
    const timeFilter = new Date(now.getTime() - hoursBack * 60 * 60 * 1000);
    
    return timeFilter.toISOString();
  }
}

export default AnalyticsProcessor;

