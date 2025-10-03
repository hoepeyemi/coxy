import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

class OpportunityAnalyzer {
  constructor() {
    this.highValueThreshold = 1000;
    this.trendingThreshold = 5;
    this.volumeThreshold = 10000;
  }

  async analyzeOpportunities() {
    try {
      console.log('🔍 Analyzing domain opportunities...');

      // Get recent events (last 24 hours)
      const { data: events, error } = await supabase
        .from('domain_events')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching events:', error);
        return [];
      }

      const opportunities = {
        highValueSales: this.findHighValueSales(events),
        trendingDomains: this.findTrendingDomains(events),
        expiredDomains: this.findExpiredDomains(events),
        newMints: this.findNewMints(events),
        volumeSpikes: this.findVolumeSpikes(events),
        rareExtensions: this.findRareExtensions(events),
        shortDomains: this.findShortDomains(events),
        brandableDomains: this.findBrandableDomains(events)
      };

      return opportunities;

    } catch (error) {
      console.error('Error analyzing opportunities:', error);
      return [];
    }
  }

  findHighValueSales(events) {
    const sales = events.filter(event => 
      (event.type === 'NAME_TOKEN_SOLD' || 
       event.type === 'NAME_TOKEN_TRANSFERRED') &&
      this.isValidDomainName(event.name)
    );

    return sales
      .map(event => ({
        domain: event.name,
        price: this.extractPrice(event.event_data),
        type: event.type,
        timestamp: event.created_at,
        event: event
      }))
      .filter(sale => sale.price && sale.price >= this.highValueThreshold)
      .sort((a, b) => b.price - a.price);
  }

  findTrendingDomains(events) {
    const domainActivity = {};
    
    events.forEach(event => {
      if (this.isValidDomainName(event.name)) {
        if (!domainActivity[event.name]) {
          domainActivity[event.name] = {
            count: 0,
            events: [],
            types: new Set()
          };
        }
        domainActivity[event.name].count++;
        domainActivity[event.name].events.push(event);
        domainActivity[event.name].types.add(event.type);
      }
    });

    return Object.entries(domainActivity)
      .filter(([domain, data]) => data.count >= this.trendingThreshold)
      .map(([domain, data]) => ({
        domain,
        activityCount: data.count,
        eventTypes: Array.from(data.types),
        events: data.events,
        lastActivity: data.events[0].created_at
      }))
      .sort((a, b) => b.activityCount - a.activityCount);
  }

  findExpiredDomains(events) {
    return events
      .filter(event => event.type === 'NAME_TOKEN_BURNED' && this.isValidDomainName(event.name))
      .map(event => ({
        domain: event.name,
        type: 'expired',
        timestamp: event.created_at,
        event: event
      }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  findNewMints(events) {
    return events
      .filter(event => event.type === 'NAME_TOKEN_MINTED' && this.isValidDomainName(event.name))
      .map(event => ({
        domain: event.name,
        type: 'new_mint',
        timestamp: event.created_at,
        event: event
      }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  findVolumeSpikes(events) {
    // Group events by hour to find volume spikes
    const hourlyVolume = {};
    
    events.forEach(event => {
      const hour = new Date(event.created_at).toISOString().slice(0, 13);
      if (!hourlyVolume[hour]) {
        hourlyVolume[hour] = 0;
      }
      hourlyVolume[hour]++;
    });

    const spikes = Object.entries(hourlyVolume)
      .filter(([hour, count]) => count >= 10) // 10+ events in an hour
      .map(([hour, count]) => ({
        hour,
        eventCount: count,
        timestamp: new Date(hour + ':00:00Z').toISOString()
      }))
      .sort((a, b) => b.eventCount - a.eventCount);

    return spikes;
  }

  findRareExtensions(events) {
    const extensions = {};
    
    events.forEach(event => {
      const ext = event.name.split('.').pop();
      if (!extensions[ext]) {
        extensions[ext] = 0;
      }
      extensions[ext]++;
    });

    // Find extensions with low frequency (rare)
    const totalEvents = events.length;
    return Object.entries(extensions)
      .filter(([ext, count]) => count <= 3 && count > 0) // 1-3 occurrences
      .map(([ext, count]) => ({
        extension: ext,
        count,
        rarity: (count / totalEvents * 100).toFixed(2) + '%'
      }))
      .sort((a, b) => a.count - b.count);
  }

  findShortDomains(events) {
    return events
      .filter(event => this.isValidDomainName(event.name) && event.name.length <= 6 && event.name.includes('.'))
      .map(event => ({
        domain: event.name,
        length: event.name.length,
        type: event.type,
        timestamp: event.created_at,
        event: event
      }))
      .sort((a, b) => a.length - b.length);
  }

  findBrandableDomains(events) {
    return events
      .filter(event => this.isValidDomainName(event.name) && this.isBrandable(event.name))
      .map(event => ({
        domain: event.name,
        type: event.type,
        timestamp: event.created_at,
        event: event,
        brandabilityScore: this.calculateBrandabilityScore(event.name)
      }))
      .sort((a, b) => b.brandabilityScore - a.brandabilityScore);
  }

  isBrandable(domain) {
    const name = domain.split('.')[0];
    
    // Check for brandable characteristics
    const hasVowels = /[aeiou]/.test(name.toLowerCase());
    const hasConsonants = /[bcdfghjklmnpqrstvwxyz]/.test(name.toLowerCase());
    const isPronounceable = this.isPronounceable(name);
    const hasGoodLength = name.length >= 3 && name.length <= 8;
    const noNumbers = !/\d/.test(name);
    const noHyphens = !/-/.test(name);
    
    return hasVowels && hasConsonants && isPronounceable && hasGoodLength && noNumbers && noHyphens;
  }

  isPronounceable(str) {
    const vowels = 'aeiou';
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    
    let vowelCount = 0;
    let consonantCount = 0;
    
    for (const char of str.toLowerCase()) {
      if (vowels.includes(char)) vowelCount++;
      else if (consonants.includes(char)) consonantCount++;
    }
    
    const total = vowelCount + consonantCount;
    if (total === 0) return false;
    
    const vowelRatio = vowelCount / total;
    return vowelRatio >= 0.2 && vowelRatio <= 0.6;
  }

  calculateBrandabilityScore(domain) {
    const name = domain.split('.')[0];
    let score = 0;
    
    // Length score (4-6 chars is ideal)
    if (name.length >= 4 && name.length <= 6) score += 30;
    else if (name.length >= 3 && name.length <= 8) score += 20;
    
    // Pronounceability
    if (this.isPronounceable(name)) score += 25;
    
    // No numbers or hyphens
    if (!/\d/.test(name)) score += 15;
    if (!/-/.test(name)) score += 15;
    
    // Vowel/consonant balance
    const vowelRatio = (name.match(/[aeiou]/gi) || []).length / name.length;
    if (vowelRatio >= 0.2 && vowelRatio <= 0.6) score += 15;
    
    return Math.min(score, 100);
  }

  extractPrice(eventData) {
    if (!eventData) return null;
    
    const priceFields = ['price', 'amount', 'value', 'cost'];
    for (const field of priceFields) {
      if (eventData[field]) {
        const price = parseFloat(eventData[field]);
        if (!isNaN(price)) {
          return price;
        }
      }
    }
    
    return null;
  }

  // Domain name validation to filter out event IDs
  isValidDomainName(name) {
    if (!name || typeof name !== 'string') {
      return false;
    }

    // Skip if it looks like an event ID (starts with "Event-" or is just a number)
    if (name.startsWith('Event-') || /^\d+$/.test(name)) {
      return false;
    }

    // Check if it's a valid domain name format
    // Must contain at least one dot and valid characters
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!domainRegex.test(name)) {
      return false;
    }

    // Must have at least one dot (TLD)
    if (!name.includes('.')) {
      return false;
    }

    // Must not be too long (max 253 characters for full domain)
    if (name.length > 253) {
      return false;
    }

    // Must not start or end with hyphen
    if (name.startsWith('-') || name.endsWith('-')) {
      return false;
    }

    return true;
  }

  async getTopOpportunities(limit = 10) {
    const opportunities = await this.analyzeOpportunities();
    
    const allOpportunities = [
      ...opportunities.highValueSales.map(opp => ({ ...opp, category: 'high_value' })),
      ...opportunities.trendingDomains.map(opp => ({ ...opp, category: 'trending' })),
      ...opportunities.expiredDomains.map(opp => ({ ...opp, category: 'expired' })),
      ...opportunities.newMints.map(opp => ({ ...opp, category: 'new_mint' })),
      ...opportunities.shortDomains.map(opp => ({ ...opp, category: 'short' })),
      ...opportunities.brandableDomains.map(opp => ({ ...opp, category: 'brandable' }))
    ];

    // Filter out opportunities with invalid domain names
    const validOpportunities = allOpportunities.filter(opp => 
      opp.domain && this.isValidDomainName(opp.domain)
    );

    // Sort by priority (high value first, then trending, etc.)
    const priorityOrder = {
      'high_value': 1,
      'trending': 2,
      'expired': 3,
      'new_mint': 4,
      'short': 5,
      'brandable': 6
    };

    return validOpportunities
      .sort((a, b) => {
        const priorityA = priorityOrder[a.category] || 999;
        const priorityB = priorityOrder[b.category] || 999;
        
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
        
        // If same priority, sort by timestamp (newest first)
        return new Date(b.timestamp || b.lastActivity) - new Date(a.timestamp || a.lastActivity);
      })
      .slice(0, limit);
  }
}

export default OpportunityAnalyzer;



