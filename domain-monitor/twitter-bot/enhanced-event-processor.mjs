import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

class EnhancedEventProcessor {
  constructor() {
    this.eventTypes = {
      EXPIRED: 'NAME_TOKEN_BURNED',
      SALES: ['NAME_TOKEN_SOLD', 'NAME_TOKEN_TRANSFERRED'],
      TRENDS: ['NAME_TOKEN_MINTED', 'NAME_TOKENIZATION_REQUESTED'],
      LISTINGS: ['NAME_TOKEN_LISTED', 'COMMAND_CREATED']
    };
    
    this.criteria = {
      highValue: { minPrice: 1000, minLength: 3, maxLength: 8 },
      trending: { minEvents: 5, timeWindow: 24 }, // hours
      expired: { gracePeriod: 7 }, // days
      brandable: { minScore: 70, maxLength: 10 }
    };
  }

  async processEvents() {
    console.log('🔄 Processing domain events...');
    
    try {
      // Get recent events (last 24 hours)
      const events = await this.getRecentEvents();
      
      if (!events || events.length === 0) {
        console.log('No recent events found');
        return { opportunities: [], analytics: {} };
      }

      // Process by event type
      const processedEvents = {
        expired: await this.processExpiredDomains(events),
        sales: await this.processDomainSales(events),
        trends: await this.processMarketTrends(events),
        listings: await this.processDomainListings(events)
      };

      // Generate opportunities
      const opportunities = await this.generateOpportunities(processedEvents);
      
      // Calculate analytics
      const analytics = this.calculateAnalytics(processedEvents);

      console.log(`✅ Processed ${events.length} events, found ${opportunities.length} opportunities`);
      
      return { opportunities, analytics, processedEvents };

    } catch (error) {
      console.error('Error processing events:', error);
      return { opportunities: [], analytics: {} };
    }
  }

  async getRecentEvents() {
    const { data: events, error } = await supabase
      .from('domain_events')
      .select('*')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }

    return events || [];
  }

  async processExpiredDomains(events) {
    const expiredEvents = events.filter(event => 
      event.type === this.eventTypes.EXPIRED && this.isValidDomainName(event.name)
    );

    const expiredDomains = expiredEvents.map(event => ({
      domain: event.name,
      expiredAt: event.created_at,
      eventData: event.event_data,
      gracePeriod: this.criteria.expired.gracePeriod,
      isAvailable: this.isDomainAvailable(event.name, event.created_at),
      priority: this.calculateExpiredPriority(event)
    }));

    // Filter by criteria
    return expiredDomains.filter(domain => 
      this.meetsExpiredCriteria(domain)
    );
  }

  async processDomainSales(events) {
    const salesEvents = events.filter(event => 
      this.eventTypes.SALES.includes(event.type) && this.isValidDomainName(event.name)
    );

    const sales = salesEvents.map(event => {
      const price = this.extractPrice(event.event_data);
      return {
        domain: event.name,
        price: price,
        saleType: event.type,
        soldAt: event.created_at,
        eventData: event.event_data,
        priceCategory: this.categorizePrice(price),
        priority: this.calculateSalesPriority(event, price)
      };
    });

    // Filter by price criteria
    return sales.filter(sale => 
      sale.price && sale.price >= this.criteria.highValue.minPrice
    );
  }

  async processMarketTrends(events) {
    const trendEvents = events.filter(event => 
      this.eventTypes.TRENDS.includes(event.type) && this.isValidDomainName(event.name)
    );

    // Group by domain and calculate activity
    const domainActivity = {};
    trendEvents.forEach(event => {
      if (!domainActivity[event.name]) {
        domainActivity[event.name] = {
          domain: event.name,
          events: [],
          eventTypes: new Set(),
          activityCount: 0,
          firstSeen: event.created_at,
          lastSeen: event.created_at
        };
      }
      
      domainActivity[event.name].events.push(event);
      domainActivity[event.name].eventTypes.add(event.type);
      domainActivity[event.name].activityCount++;
      domainActivity[event.name].lastSeen = event.created_at;
    });

    // Filter by trending criteria
    return Object.values(domainActivity)
      .filter(domain => 
        domain.activityCount >= this.criteria.trending.minEvents
      )
      .map(domain => ({
        ...domain,
        eventTypes: Array.from(domain.eventTypes),
        trendScore: this.calculateTrendScore(domain),
        priority: this.calculateTrendPriority(domain)
      }));
  }

  async processDomainListings(events) {
    const listingEvents = events.filter(event => 
      this.eventTypes.LISTINGS.includes(event.type) && this.isValidDomainName(event.name)
    );

    return listingEvents.map(event => {
      const price = this.extractPrice(event.event_data);
      return {
        domain: event.name,
        price: price,
        listingType: event.type,
        listedAt: event.created_at,
        eventData: event.event_data,
        priority: this.calculateListingPriority(event, price)
      };
    });
  }

  async generateOpportunities(processedEvents) {
    const opportunities = [];

    // High-value expired domains
    processedEvents.expired.forEach(domain => {
      opportunities.push({
        type: 'expired',
        category: 'high_value_expired',
        domain: domain.domain,
        priority: domain.priority,
        value: this.estimateDomainValue(domain.domain),
        description: `Premium domain ${domain.domain} just expired and is available!`,
        actionUrl: this.generateActionUrl(domain.domain, 'expired'),
        metadata: {
          expiredAt: domain.expiredAt,
          gracePeriod: domain.gracePeriod,
          isAvailable: domain.isAvailable
        }
      });
    });

    // High-value sales
    processedEvents.sales.forEach(sale => {
      opportunities.push({
        type: 'sale',
        category: 'high_value_sale',
        domain: sale.domain,
        priority: sale.priority,
        value: sale.price,
        description: `🔥 ${sale.domain} sold for $${sale.price.toLocaleString()}!`,
        actionUrl: this.generateActionUrl(sale.domain, 'similar'),
        metadata: {
          saleType: sale.saleType,
          soldAt: sale.soldAt,
          priceCategory: sale.priceCategory
        }
      });
    });

    // Trending domains
    processedEvents.trends.forEach(trend => {
      opportunities.push({
        type: 'trending',
        category: 'trending_domain',
        domain: trend.domain,
        priority: trend.priority,
        value: this.estimateDomainValue(trend.domain),
        description: `📈 ${trend.domain} trending with ${trend.activityCount} recent events!`,
        actionUrl: this.generateActionUrl(trend.domain, 'trending'),
        metadata: {
          activityCount: trend.activityCount,
          eventTypes: trend.eventTypes,
          trendScore: trend.trendScore,
          firstSeen: trend.firstSeen,
          lastSeen: trend.lastSeen
        }
      });
    });

    // New listings
    processedEvents.listings.forEach(listing => {
      opportunities.push({
        type: 'listing',
        category: 'new_listing',
        domain: listing.domain,
        priority: listing.priority,
        value: listing.price,
        description: `🆕 ${listing.domain} just listed for $${listing.price?.toLocaleString() || 'TBD'}!`,
        actionUrl: this.generateActionUrl(listing.domain, 'listing'),
        metadata: {
          listingType: listing.listingType,
          listedAt: listing.listedAt,
          price: listing.price
        }
      });
    });

    // Sort by priority and return top opportunities
    return opportunities
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 10);
  }

  calculateAnalytics(processedEvents) {
    return {
      totalEvents: Object.values(processedEvents).flat().length,
      expiredCount: processedEvents.expired.length,
      salesCount: processedEvents.sales.length,
      trendsCount: processedEvents.trends.length,
      listingsCount: processedEvents.listings.length,
      highValueCount: processedEvents.sales.filter(s => s.price >= 10000).length,
      averagePrice: this.calculateAveragePrice(processedEvents.sales),
      topExtensions: this.getTopExtensions(processedEvents),
      marketActivity: this.calculateMarketActivity(processedEvents)
    };
  }

  // Helper methods
  extractPrice(eventData) {
    if (!eventData) return null;
    
    const priceFields = ['price', 'amount', 'value', 'cost', 'priceUsd'];
    for (const field of priceFields) {
      if (eventData[field]) {
        const price = parseFloat(eventData[field]);
        if (!isNaN(price) && price > 0) {
          return price;
        }
      }
    }
    return null;
  }

  categorizePrice(price) {
    if (!price) return 'unknown';
    if (price >= 100000) return 'ultra_premium';
    if (price >= 10000) return 'premium';
    if (price >= 1000) return 'high_value';
    if (price >= 100) return 'mid_value';
    return 'low_value';
  }

  calculateExpiredPriority(event) {
    let priority = 50; // base priority
    
    // Length bonus (shorter = higher priority)
    const length = event.name.length;
    if (length <= 3) priority += 40;
    else if (length <= 5) priority += 30;
    else if (length <= 7) priority += 20;
    
    // Extension bonus
    const extension = event.name.split('.').pop();
    if (['com', 'org', 'net'].includes(extension)) priority += 20;
    if (['io', 'ai', 'co'].includes(extension)) priority += 15;
    
    // Brandability bonus
    if (this.isBrandable(event.name)) priority += 25;
    
    return Math.min(priority, 100);
  }

  calculateSalesPriority(event, price) {
    let priority = 30; // base priority
    
    if (price >= 100000) priority += 50;
    else if (price >= 10000) priority += 40;
    else if (price >= 1000) priority += 30;
    
    // Domain characteristics
    const length = event.name.length;
    if (length <= 3) priority += 30;
    else if (length <= 5) priority += 20;
    
    return Math.min(priority, 100);
  }

  calculateTrendPriority(domain) {
    let priority = 40; // base priority
    
    // Activity level
    priority += Math.min(domain.activityCount * 5, 30);
    
    // Domain characteristics
    const length = domain.domain.length;
    if (length <= 5) priority += 20;
    
    // Event diversity
    priority += domain.eventTypes.length * 5;
    
    return Math.min(priority, 100);
  }

  calculateListingPriority(event, price) {
    let priority = 35; // base priority
    
    if (price && price >= 1000) priority += 25;
    
    // Domain characteristics
    const length = event.name.length;
    if (length <= 5) priority += 20;
    
    return Math.min(priority, 100);
  }

  isDomainAvailable(domain, expiredAt) {
    const gracePeriod = this.criteria.expired.gracePeriod * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const expiredTime = new Date(expiredAt).getTime();
    
    return (now - expiredTime) <= gracePeriod;
  }

  meetsExpiredCriteria(domain) {
    return domain.isAvailable && 
           domain.domain.length >= this.criteria.highValue.minLength &&
           domain.domain.length <= this.criteria.highValue.maxLength;
  }

  isBrandable(domain) {
    const name = domain.split('.')[0];
    const hasVowels = /[aeiou]/.test(name.toLowerCase());
    const hasConsonants = /[bcdfghjklmnpqrstvwxyz]/.test(name.toLowerCase());
    const goodLength = name.length >= 3 && name.length <= 8;
    const noNumbers = !/\d/.test(name);
    const noHyphens = !/-/.test(name);
    
    return hasVowels && hasConsonants && goodLength && noNumbers && noHyphens;
  }

  estimateDomainValue(domain) {
    let value = 100; // base value
    
    const length = domain.length;
    if (length <= 3) value *= 10;
    else if (length <= 5) value *= 5;
    else if (length <= 7) value *= 2;
    
    const extension = domain.split('.').pop();
    if (['com', 'org', 'net'].includes(extension)) value *= 2;
    if (['io', 'ai', 'co'].includes(extension)) value *= 1.5;
    
    if (this.isBrandable(domain)) value *= 1.5;
    
    return Math.round(value);
  }

  calculateTrendScore(domain) {
    const timeDiff = new Date(domain.lastSeen) - new Date(domain.firstSeen);
    const hours = timeDiff / (1000 * 60 * 60);
    const eventsPerHour = domain.activityCount / Math.max(hours, 1);
    
    return Math.min(eventsPerHour * 10, 100);
  }

  generateActionUrl(domain, type) {
    const baseUrl = process.env.FRONTEND_URL || 'https://coxy.onrender.com';
    return `${baseUrl}/domain/${encodeURIComponent(domain)}?type=${type}`;
  }

  calculateAveragePrice(sales) {
    const prices = sales.map(s => s.price).filter(p => p > 0);
    if (prices.length === 0) return 0;
    return prices.reduce((sum, price) => sum + price, 0) / prices.length;
  }

  getTopExtensions(processedEvents) {
    const allEvents = Object.values(processedEvents).flat();
    const extensions = {};
    
    allEvents.forEach(event => {
      const ext = event.domain.split('.').pop();
      extensions[ext] = (extensions[ext] || 0) + 1;
    });
    
    return Object.entries(extensions)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([ext, count]) => ({ extension: ext, count }));
  }

  calculateMarketActivity(processedEvents) {
    const totalEvents = Object.values(processedEvents).flat().length;
    const timeWindow = 24; // hours
    
    return {
      eventsPerHour: totalEvents / timeWindow,
      activityLevel: totalEvents > 50 ? 'high' : totalEvents > 20 ? 'medium' : 'low',
      trend: 'growing' // This would be calculated based on historical data
    };
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
}

export default EnhancedEventProcessor;

