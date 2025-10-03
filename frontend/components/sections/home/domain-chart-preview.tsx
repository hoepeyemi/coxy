'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, Globe, Activity, DollarSign } from 'lucide-react';
import DomainTrendChart from './domain-trend-chart';

interface DomainTrend {
  domain_name: string;
  event_type: string;
  price_usd: number;
  event_count: number;
  last_event_at: string;
  is_trending: boolean;
}

interface DomainEvent {
  id: number;
  name: string;
  type: string;
  event_data: Record<string, unknown>;
  created_at: string;
}

interface DomainStats {
  totalEvents: number;
  eventsToday: number;
  activeDomains: number;
  lastUpdate: Date | null;
}

export default function DomainChartPreview() {
  const [stats, setStats] = useState<DomainStats>({
    totalEvents: 0,
    eventsToday: 0,
    activeDomains: 0,
    lastUpdate: null,
  });
  const [trendingDomains, setTrendingDomains] = useState<DomainTrend[]>([]);
  const [recentEvents, setRecentEvents] = useState<DomainEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all data in parallel
      const [statsRes, trendsRes, eventsRes] = await Promise.all([
        fetch('/api/domain-monitor?action=analytics'),
        fetch('/api/domain-monitor?action=trends&limit=5'),
        fetch('/api/domain-monitor?action=events&limit=8')
      ]);

      const [statsData, trendsData, eventsData] = await Promise.all([
        statsRes.json(),
        trendsRes.json(),
        eventsRes.json()
      ]);

      setStats({
        totalEvents: statsData.totalEvents || 0,
        eventsToday: statsData.eventsToday || 0,
        activeDomains: statsData.activeDomains || 0,
        lastUpdate: new Date(),
      });

      setTrendingDomains(trendsData.trends || []);
      setRecentEvents(eventsData.events || []);
    } catch (err) {
      console.error('Error fetching domain data:', err);
      setError('Failed to load domain data');
      
      // Set fallback data when API fails
      setStats({
        totalEvents: 0,
        eventsToday: 0,
        activeDomains: 0,
        lastUpdate: null,
      });
      setTrendingDomains([]);
      setRecentEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price === 0 || !price) return '—';
    if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `$${(price / 1000).toFixed(1)}K`;
    return `$${price.toFixed(2)}`;
  };

  const formatEventType = (type: string) => {
    if (!type || type === 'UNKNOWN_EVENT') return 'Domain Activity';
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'COMMAND_UPDATED': 'bg-blue-100 text-blue-800',
      'DOMAIN_LISTED': 'bg-green-100 text-green-800',
      'DOMAIN_SOLD': 'bg-purple-100 text-purple-800',
      'DOMAIN_EXPIRED': 'bg-red-100 text-red-800',
      'DOMAIN_RENEWED': 'bg-yellow-100 text-yellow-800',
      'DOMAIN_TRANSFERRED': 'bg-indigo-100 text-indigo-800',
      'UNKNOWN_EVENT': 'bg-gray-100 text-gray-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="w-full">
      {/* Refresh Button - Moved to top */}
      <div className="flex justify-center lg:justify-end mb-4 sm:mb-6">
        <Button 
          onClick={fetchData} 
          variant="outline" 
          size="sm"
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Loading...' : 'Refresh Data'}
        </Button>
      </div>

      {/* Main Content - Full Width */}
      <div className="w-full">
        {loading ? (
          <div className="w-full h-64 sm:h-80 lg:h-96 bg-muted animate-pulse rounded-lg flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 animate-spin mx-auto mb-2" />
              <p className="text-muted-foreground text-sm sm:text-base">Loading domain data...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="w-full h-64 sm:h-80 lg:h-96 flex items-center justify-center border-orange-200 bg-orange-50">
            <div className="text-center text-orange-600 px-4">
              <Activity className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
              <p className="font-medium text-sm sm:text-base">Domain Monitor Not Configured</p>
              <p className="text-xs sm:text-sm mb-4">
                The domain monitoring API is not available. Please check your environment configuration.
              </p>
              <div className="text-xs text-orange-500 mb-4">
                <p>Required environment variables:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>NEXT_PUBLIC_SUPABASE_URL</li>
                  <li>SUPABASE_SERVICE_ROLE_KEY</li>
                </ul>
              </div>
              <Button onClick={fetchData} variant="outline" size="sm" className="mt-2">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              <Card className="p-2 sm:p-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Events</p>
                    <p className="font-bold text-xs sm:text-sm">{stats.totalEvents.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-2 sm:p-3">
                <div className="flex items-center space-x-2">
                  <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Domains</p>
                    <p className="font-bold text-xs sm:text-sm">{stats.activeDomains.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-2 sm:p-3 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Today</p>
                    <p className="font-bold text-xs sm:text-sm">{stats.eventsToday.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Trending Domains */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-coxy-primary" />
                  Trending Domains
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                {trendingDomains.length === 0 ? (
                  <p className="text-muted-foreground text-center py-3 sm:py-4 text-sm">No trending domains found</p>
                ) : (
                  trendingDomains.slice(0, 3).map((domain) => (
                    <div key={domain.domain_name} className="flex items-center justify-between p-2 sm:p-3 border rounded-lg">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-xs sm:text-sm truncate">{domain.domain_name || 'Domain'}</p>
                          <Badge variant="outline" className="text-xs">
                            {formatEventType(domain.event_type || 'UNKNOWN')}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="font-medium text-xs sm:text-sm">{formatPrice(domain.price_usd)}</p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Trend Chart */}
            <DomainTrendChart />

            {/* Recent Events */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-coxy-primary" />
                  Recent Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentEvents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-3 sm:py-4 text-sm">No recent events found</p>
                ) : (
                  recentEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-2 sm:p-3 border rounded-lg">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-xs sm:text-sm truncate">{event.name || 'Domain Event'}</p>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getEventTypeColor(event.type)}`}
                          >
                            {formatEventType(event.type || 'UNKNOWN')}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {new Date(event.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
