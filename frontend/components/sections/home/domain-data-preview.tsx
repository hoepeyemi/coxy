'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, TrendingUp, Activity, Clock, DollarSign } from 'lucide-react';

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
  trendingDomains: number;
  lastUpdate: Date | null;
}

export default function DomainDataPreview() {
  const [trends, setTrends] = useState<DomainTrend[]>([]);
  const [recentEvents, setRecentEvents] = useState<DomainEvent[]>([]);
  const [stats, setStats] = useState<DomainStats>({
    totalEvents: 0,
    eventsToday: 0,
    activeDomains: 0,
    trendingDomains: 0,
    lastUpdate: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDomainData();
  }, []);

  const fetchDomainData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch domain trends
      const trendsResponse = await fetch('/api/domain-monitor?action=trends&limit=5');
      const trendsData = await trendsResponse.json();
      setTrends(trendsData.trends || []);

      // Fetch recent events
      const eventsResponse = await fetch('/api/domain-monitor?action=events&limit=5');
      const eventsData = await eventsResponse.json();
      setRecentEvents(eventsData.events || []);

      // Fetch domain stats
      const statsResponse = await fetch('/api/domain-monitor?action=analytics');
      const statsData = await statsResponse.json();
      setStats({
        totalEvents: statsData.totalEvents || 0,
        eventsToday: statsData.eventsToday || 0,
        activeDomains: statsData.activeDomains || 0,
        trendingDomains: statsData.trendingDomains || 0,
        lastUpdate: new Date()
      });

    } catch (err) {
      console.error('Error fetching domain data:', err);
      setError('Failed to load domain data');
      
      // Set fallback data when API fails
      setStats({
        totalEvents: 0,
        eventsToday: 0,
        activeDomains: 0,
        trendingDomains: 0,
        lastUpdate: null,
      });
      setTrends([]);
      setRecentEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatEventType = (type: string) => {
    if (!type || type === 'UNKNOWN_EVENT') return 'Domain Activity';
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatPrice = (price: number) => {
    if (price === 0 || !price) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-orange-600 font-medium mb-2">Domain Monitor Not Configured</p>
              <p className="text-orange-600 text-sm mb-4">{error}</p>
              <div className="text-xs text-orange-500 mb-4">
                <p>Required environment variables:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>NEXT_PUBLIC_SUPABASE_URL</li>
                  <li>SUPABASE_SERVICE_ROLE_KEY</li>
                </ul>
              </div>
              <Button onClick={fetchDomainData} variant="outline" className="mt-2">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Domain Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.totalEvents.toLocaleString()}</p>
              </div>
              <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-coxy-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Today&apos;s Events</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.eventsToday.toLocaleString()}</p>
              </div>
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Active Domains</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.activeDomains.toLocaleString()}</p>
              </div>
              <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Trending Domains */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              Trending Domains
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Most active domains in the last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            {trends.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {trends.slice(0, 4).map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-2 sm:p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm sm:text-base truncate">{trend.domain_name}</span>
                        {trend.is_trending && (
                          <Badge variant="secondary" className="text-xs flex-shrink-0">
                            Trending
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {formatEventType(trend.event_type)} • {trend.event_count} events
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="font-medium text-sm sm:text-base">{formatPrice(trend.price_usd)}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {formatTimeAgo(trend.last_event_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4 text-sm">No trending domains found</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
              Recent Events
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Latest domain events and activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentEvents.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {recentEvents.slice(0, 4).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-2 sm:p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm sm:text-base truncate">{event.name || 'Domain Event'}</span>
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {formatEventType(event.type || 'UNKNOWN')}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {formatTimeAgo(event.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4 text-sm">No recent events found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
