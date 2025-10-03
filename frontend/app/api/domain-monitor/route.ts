import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Create Supabase client only if environment variables are available
function getSupabaseClient(): SupabaseClient<any, 'public', any> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration missing. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'events':
        return await getDomainEvents(request, supabase);
      case 'analytics':
        return await getDomainAnalytics(request, supabase);
      case 'trending':
        return await getTrendingDomains(request, supabase);
      case 'trends':
        return await getDomainTrends(request, supabase);
      case 'prices':
        return await getDomainPrices(request, supabase);
      case 'price-stats':
        return await getPriceStats(request, supabase);
      case 'search':
        return await searchDomains(request, supabase);
      case 'subscriptions':
        return await getSubscriptions(request, supabase);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Domain monitor API error:', error);
    if (error instanceof Error && error.message.includes('Supabase configuration missing')) {
      return NextResponse.json({ error: 'Database configuration missing. Please contact administrator.' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'subscribe':
        return await createSubscription(request, supabase);
      case 'unsubscribe':
        return await deleteSubscription(request, supabase);
      case 'update-filters':
        return await updateSubscriptionFilters(request, supabase);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Domain monitor API error:', error);
    if (error instanceof Error && error.message.includes('Supabase configuration missing')) {
      return NextResponse.json({ error: 'Database configuration missing. Please contact administrator.' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getDomainEvents(request: NextRequest, supabase: SupabaseClient<any, 'public', any>) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');
  const eventType = searchParams.get('eventType');
  const domainName = searchParams.get('domainName');

  let query = supabase
    .from('domain_events')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (eventType) {
    query = query.eq('type', eventType);
  }

  let data = [];
  let error = null;

  if (domainName) {
    // Search by domain name first
    const nameQuery = supabase
      .from('domain_events')
      .select('*')
      .ilike('name', `%${domainName}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: nameData, error: nameError } = await nameQuery;
    
    if (nameError) {
      console.error('Name search error:', nameError);
    } else {
      data = nameData || [];
    }

    // If no results from name search, try event_id search
    if (data.length === 0) {
      const eventIdQuery = supabase
        .from('domain_events')
        .select('*')
        .eq('event_id', domainName)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data: eventIdData, error: eventIdError } = await eventIdQuery;
      
      if (eventIdError) {
        console.error('Event ID search error:', eventIdError);
        error = eventIdError;
      } else {
        data = eventIdData || [];
      }
    }
  } else {
    // No domain filter, use original query
    const { data: queryData, error: queryError } = await query;
    data = queryData || [];
    error = queryError;
  }

  if (error) {
    console.error('Database query error:', error);
    throw error;
  }

  console.log(`Found ${data?.length || 0} events for domain: ${domainName}`);
  return NextResponse.json({ events: data || [] });
}

async function getDomainAnalytics(request: NextRequest, supabase: SupabaseClient<any, 'public', any>) {
  const { searchParams } = new URL(request.url);
  const domainName = searchParams.get('domainName');

  // If no domain name provided, return general analytics
  if (!domainName) {
    try {
      // Get overall statistics from domain_events table
      const { data: eventsData, error: eventsError } = await supabase
        .from('domain_events')
        .select('id, name, created_at, event_data');

      if (eventsError) {
        throw eventsError;
      }

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

      // Calculate statistics
      const totalEvents = eventsData?.length || 0;
      const eventsToday = eventsData?.filter(event => 
        new Date(event.created_at) >= today
      ).length || 0;
      
      // Get unique domain names
      const uniqueDomains = new Set(eventsData?.map(event => event.name).filter(Boolean));
      const activeDomains = uniqueDomains.size;

      // Calculate trending domains (domains with recent activity)
      const trendingDomains = eventsData?.filter(event => 
        new Date(event.created_at) >= today
      ).length || 0;

      // Get active subscriptions count
      const { count: activeSubscriptions } = await supabase
        .from('domain_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      return NextResponse.json({
        totalEvents,
        eventsToday,
        activeDomains,
        trendingDomains,
        activeSubscriptions: activeSubscriptions || 0,
        lastUpdate: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching general analytics:', error);
      return NextResponse.json({
        totalEvents: 0,
        eventsToday: 0,
        activeDomains: 0,
        trendingDomains: 0,
        activeSubscriptions: 0,
        lastUpdate: null
      });
    }
  }

  // Specific domain analytics
  const { data, error } = await supabase
    .from('domain_analytics')
    .select('*')
    .eq('domain_name', domainName)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ analytics: null });
    }
    throw error;
  }

  return NextResponse.json({ analytics: data });
}

async function getTrendingDomains(request: NextRequest, supabase: SupabaseClient<any, 'public', any>) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const timeframe = searchParams.get('timeframe') || '24h';

  const timeFilter = getTimeFilter(timeframe);

  try {
    // Get recent domain events and group by domain
    const { data: events, error: eventsError } = await supabase
      .from('domain_events')
      .select('name, type, created_at, event_data')
      .gte('created_at', timeFilter)
      .order('created_at', { ascending: false })
      .limit(limit * 3); // Get more to process

    if (eventsError) {
      throw eventsError;
    }

    // Group events by domain name
    const domainMap = new Map();
    events?.forEach(event => {
      const domainName = event.name || 'Unknown';
      if (!domainMap.has(domainName)) {
        domainMap.set(domainName, {
          domain_name: domainName,
          event_count: 0,
          last_event_at: event.created_at,
          event_types: new Set()
        });
      }
      
      const domain = domainMap.get(domainName);
      domain.event_count += 1;
      domain.event_types.add(event.type);
      
      // Keep the most recent event time
      if (new Date(event.created_at) > new Date(domain.last_event_at)) {
        domain.last_event_at = event.created_at;
      }
    });

    // Convert to array and sort by event count
    const trendingDomains = Array.from(domainMap.values())
      .map(domain => ({
        ...domain,
        event_types: Array.from(domain.event_types),
        is_trending: domain.event_count >= 2 // Consider trending if 2+ events
      }))
      .sort((a, b) => b.event_count - a.event_count)
      .slice(0, limit);

    return NextResponse.json({ domains: trendingDomains });
  } catch (error) {
    console.error('Error fetching trending domains:', error);
    return NextResponse.json({ domains: [] });
  }
}

async function getSubscriptions(request: NextRequest, supabase: SupabaseClient<any, 'public', any>) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('domain_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return NextResponse.json({ subscriptions: data || [] });
}

async function createSubscription(request: NextRequest, supabase: SupabaseClient<any, 'public', any>) {
  const body = await request.json();
  const { userId, eventType, webhookUrl, filters } = body;

  if (!userId || !eventType || !webhookUrl) {
    return NextResponse.json({ 
      error: 'userId, eventType, and webhookUrl are required' 
    }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('domain_subscriptions')
    .insert({
      user_id: userId,
      event_type: eventType,
      webhook_url: webhookUrl,
      filters: filters || {},
      is_active: true
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return NextResponse.json({ subscription: data });
}

async function deleteSubscription(request: NextRequest, supabase: SupabaseClient<any, 'public', any>) {
  const body = await request.json();
  const { subscriptionId } = body;

  if (!subscriptionId) {
    return NextResponse.json({ error: 'subscriptionId required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('domain_subscriptions')
    .delete()
    .eq('id', subscriptionId);

  if (error) {
    throw error;
  }

  return NextResponse.json({ success: true });
}

async function updateSubscriptionFilters(request: NextRequest, supabase: SupabaseClient<any, 'public', any>) {
  const body = await request.json();
  const { subscriptionId, filters } = body;

  if (!subscriptionId || !filters) {
    return NextResponse.json({ 
      error: 'subscriptionId and filters are required' 
    }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('domain_subscriptions')
    .update({
      filters: filters,
      updated_at: new Date().toISOString()
    })
    .eq('id', subscriptionId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return NextResponse.json({ subscription: data });
}

async function getDomainPrices(request: NextRequest, supabase: SupabaseClient<any, 'public', any>) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    // Get domain events with price data
    const { data: events, error: eventsError } = await supabase
      .from('domain_events')
      .select(`
        id,
        name,
        type,
        event_data,
        created_at
      `)
      .gte('created_at', getTimeFilter('7d'))
      .order('created_at', { ascending: false })
      .limit(limit * 3);

    if (eventsError) {
      throw eventsError;
    }

    // Process events to extract price data
    const domainPrices = new Map();
    
    (events as DomainEvent[]).forEach(event => {
      const eventData = event.event_data || {};
      const price = (eventData.price as number) || (eventData.priceUsd as number) || 0;
      
      if (price > 0) {
        const domain = event.name || 'Unknown';
        if (!domainPrices.has(domain)) {
          domainPrices.set(domain, {
            domain_name: domain,
            current_price: price,
            // No historical price data available from Doma API
            last_trade_at: event.created_at,
            // No trade/offer data available from Doma API
            is_trending: false
          });
        } else {
          const existing = domainPrices.get(domain);
          existing.current_price = Math.max(existing.current_price, price);
          // No trade counting available from Doma API
          if (new Date(event.created_at) > new Date(existing.last_trade_at)) {
            existing.last_trade_at = event.created_at;
          }
        }
      }
    });

    const prices = Array.from(domainPrices.values())
      .sort((a, b) => b.current_price - a.current_price)
      .slice(0, limit);

    // If no price data is available, return empty array with a message
    if (prices.length === 0) {
      console.log('No price data available from Doma API');
    }

    return NextResponse.json({ 
      prices,
      total: prices.length,
      message: prices.length === 0 ? 'No price data available from Doma API' : null
    });

  } catch (error) {
    console.error('Error fetching domain prices:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch domain prices',
      prices: [],
      total: 0 
    }, { status: 500 });
  }
}

async function getPriceStats(request: NextRequest, supabase: SupabaseClient<any, 'public', any>) {
  try {
    // Get all domain events with price data
    const { data: events, error: eventsError } = await supabase
      .from('domain_events')
      .select(`
        event_data,
        created_at
      `)
      .gte('created_at', getTimeFilter('7d'));

    if (eventsError) {
      throw eventsError;
    }

    // Process events to calculate price statistics
    const prices: number[] = [];
    let priceIncreases = 0;
    let priceDecreases = 0;

    (events as DomainEvent[]).forEach(event => {
      const eventData = event.event_data || {};
      const price = (eventData.price as number) || (eventData.priceUsd as number) || 0;
      
      if (price > 0) {
        prices.push(price);
        
        // Check if event is within last 24 hours
        const eventDate = new Date(event.created_at);
        const now = new Date();
        const diffHours = (now.getTime() - eventDate.getTime()) / (1000 * 60 * 60);
        
        // No volume data available from Doma API
      }
    });

    // Calculate statistics
    const sortedPrices = prices.sort((a, b) => a - b);
    const averagePrice = prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0;
    const medianPrice = sortedPrices.length > 0 ? 
      (sortedPrices.length % 2 === 0 ? 
        (sortedPrices[sortedPrices.length / 2 - 1] + sortedPrices[sortedPrices.length / 2]) / 2 :
        sortedPrices[Math.floor(sortedPrices.length / 2)]) : 0;
    const highestPrice = sortedPrices.length > 0 ? sortedPrices[sortedPrices.length - 1] : 0;
    const lowestPrice = sortedPrices.length > 0 ? sortedPrices[0] : 0;

    // Placeholder for price change calculations
    priceIncreases = Math.floor(prices.length * 0.6);
    priceDecreases = Math.floor(prices.length * 0.4);

    const stats = {
      average_price: averagePrice,
      median_price: medianPrice,
      highest_price: highestPrice,
      lowest_price: lowestPrice,
      price_increase_count: priceIncreases,
      price_decrease_count: priceDecreases,
      total_events: prices.length
    };

    return NextResponse.json({ stats });

  } catch (error) {
    console.error('Error fetching price stats:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch price stats',
      stats: {
        average_price: 0,
        median_price: 0,
        highest_price: 0,
        lowest_price: 0,
        price_increase_count: 0,
        price_decrease_count: 0,
        total_events: 0
      }
    }, { status: 500 });
  }
}

async function searchDomains(request: NextRequest, supabase: SupabaseClient<any, 'public', any>) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    if (query.length < 2) {
      return NextResponse.json({ domains: [] });
    }

    // Search domains by name
    const { data: domains, error } = await supabase
      .from('domain_events')
      .select(`
        name,
        type,
        created_at,
        event_data
      `)
      .ilike('name', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    // Group by domain name and get latest info
    const domainMap = new Map();
    (domains as DomainEvent[]).forEach((domain: DomainEvent) => {
      const name = domain.name;
      if (!domainMap.has(name)) {
        domainMap.set(name, {
          domain_name: name,
          name: name,
          type: domain.type,
          last_event_at: domain.created_at,
          event_data: domain.event_data
        });
      }
    });

    const searchResults = Array.from(domainMap.values());

    return NextResponse.json({ 
      domains: searchResults,
      total: searchResults.length,
      query 
    });

  } catch (error) {
    console.error('Error searching domains:', error);
    return NextResponse.json({ 
      error: 'Failed to search domains',
      domains: [],
      total: 0 
    }, { status: 500 });
  }
}

interface DomainEvent {
  id: number;
  name: string;
  type: string;
  event_data: Record<string, unknown>;
  created_at: string;
}

async function getDomainTrends(request: NextRequest, supabase: SupabaseClient<any, 'public', any>) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20');
  const timeframe = searchParams.get('timeframe') || '24h';

  try {
    // Get recent domain events with price and volume data
    const { data: events, error: eventsError } = await supabase
      .from('domain_events')
      .select(`
        id,
        name,
        type,
        event_data,
        created_at
      `)
      .gte('created_at', getTimeFilter(timeframe))
      .order('created_at', { ascending: false })
      .limit(limit * 2); // Get more to process

    if (eventsError) {
      throw eventsError;
    }

    // Process events to extract trends
    const trends = (events as DomainEvent[]).map((event: DomainEvent) => {
      const eventData = event.event_data || {};
      const price = (eventData.price as number) || (eventData.priceUsd as number) || 0;
      
      return {
        domain_name: event.name || 'Unknown',
        event_type: event.type,
        price_usd: price,
        event_count: 1,
        last_event_at: event.created_at,
        is_trending: false // Will be calculated based on event count
      };
    });

    // Group by domain and calculate aggregated trends
    const domainMap = new Map();
    trends.forEach(trend => {
      const domain = trend.domain_name;
      if (!domainMap.has(domain)) {
        domainMap.set(domain, {
          domain_name: domain,
          event_type: trend.event_type,
          price_usd: trend.price_usd,
          event_count: 0,
          last_event_at: trend.last_event_at,
          is_trending: false
        });
      }
      
      const existing = domainMap.get(domain);
      existing.event_count += trend.event_count;
      existing.price_usd = Math.max(existing.price_usd, trend.price_usd);
      if (new Date(trend.last_event_at) > new Date(existing.last_event_at)) {
        existing.last_event_at = trend.last_event_at;
        existing.event_type = trend.event_type;
      }
    });

    const processedTrends = Array.from(domainMap.values())
      .map(domain => ({
        ...domain,
        is_trending: domain.event_count >= 2 // Mark as trending if 2+ events
      }))
      .sort((a, b) => b.event_count - a.event_count)
      .slice(0, limit);

    return NextResponse.json({ 
      trends: processedTrends,
      total: processedTrends.length,
      timeframe 
    });

  } catch (error) {
    console.error('Error fetching domain trends:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch domain trends',
      trends: [],
      total: 0 
    }, { status: 500 });
  }
}

function getTimeFilter(timeframe: string): string {
  const now = new Date();
  const hours = {
    '1h': 1,
    '24h': 24,
    '7d': 24 * 7,
    '30d': 24 * 30
  };

  const hoursBack = hours[timeframe as keyof typeof hours] || 24;
  const timeFilter = new Date(now.getTime() - hoursBack * 60 * 60 * 1000);
  
  return timeFilter.toISOString();
}

