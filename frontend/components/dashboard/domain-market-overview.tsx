'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Globe, TrendingUp, DollarSign, Activity, Clock, Users, Zap } from 'lucide-react';

interface DomainMarketStats {
  totalEvents: number;
  eventsToday: number;
  activeDomains: number;
  trendingDomains: number;
  lastUpdate: string;
}

interface DomainEvent {
  id: number;
  name: string;
  type: string;
  event_data: Record<string, unknown>;
  created_at: string;
}

interface TopDomain {
  name: string;
  event_count: number;
  last_event_type: string;
  last_event_at: string;
  event_types: string[];
}

interface DomainMarketOverviewProps {
  className?: string;
}

export default function DomainMarketOverview({ className }: DomainMarketOverviewProps) {
  const [marketStats, setMarketStats] = useState<DomainMarketStats>({
    totalEvents: 0,
    eventsToday: 0,
    activeDomains: 0,
    trendingDomains: 0,
    lastUpdate: ''
  });
  const [recentEvents, setRecentEvents] = useState<DomainEvent[]>([]);
  const [topDomains, setTopDomains] = useState<TopDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch market statistics
      const statsResponse = await fetch('/api/domain-monitor?action=analytics');
      const statsData = await statsResponse.json();
      setMarketStats({
        totalEvents: statsData.totalEvents || 0,
        eventsToday: statsData.eventsToday || 0,
        activeDomains: statsData.activeDomains || 0,
        trendingDomains: statsData.trendingDomains || 0,
        lastUpdate: new Date().toISOString()
      });

      // Fetch recent events
      const eventsResponse = await fetch('/api/domain-monitor?action=events&limit=10');
      const eventsData = await eventsResponse.json();
      setRecentEvents(eventsData.events || []);

      // Fetch top domains
      const topDomainsResponse = await fetch('/api/domain-monitor?action=trending&limit=5');
      const topDomainsData = await topDomainsResponse.json();
      setTopDomains(topDomainsData.domains || []);

    } catch (err) {
      console.error('Error fetching market data:', err);
      setError('Failed to fetch market data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (!price || isNaN(price)) return '—';
    if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `$${(price / 1000).toFixed(1)}K`;
    return `$${price.toFixed(2)}`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'NAME_TOKEN_MINTED': return 'bg-green-100 text-green-800';
      case 'NAME_TOKEN_TRANSFERRED': return 'bg-blue-100 text-blue-800';
      case 'NAME_TOKEN_BURNED': return 'bg-red-100 text-red-800';
      case 'NAME_RENEWED': return 'bg-yellow-100 text-yellow-800';
      case 'NAME_UPDATED': return 'bg-purple-100 text-purple-800';
      case 'UNKNOWN_EVENT': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            <span>Loading domain market data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <Button onClick={fetchMarketData} className="mt-2" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">🌐 Domain Market Overview</h2>
          <p className="text-muted-foreground">
            Comprehensive domain market intelligence and analytics
            {marketStats.lastUpdate && (
              <span className="ml-2 text-sm">
                • Last updated: {formatTimeAgo(marketStats.lastUpdate)}
              </span>
            )}
          </p>
        </div>
        <Button onClick={fetchMarketData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Market Stats</TabsTrigger>
          <TabsTrigger value="events">Recent Events</TabsTrigger>
          <TabsTrigger value="domains">Top Domains</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {marketStats.totalEvents > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Total Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{marketStats.totalEvents.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              {marketStats.eventsToday > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Events Today
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{marketStats.eventsToday.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Last 24h</p>
                  </CardContent>
                </Card>
              )}

              {marketStats.activeDomains > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Active Domains
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{marketStats.activeDomains.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Currently active</p>
                  </CardContent>
                </Card>
              )}

            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="text-4xl">📊</div>
                  <h3 className="text-lg font-semibold">No Domain Data Available</h3>
                  <p className="text-muted-foreground">
                    Start the domain monitor to begin tracking domain events.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {marketStats.trendingDomains > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Trending
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{marketStats.trendingDomains.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Hot domains</p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Domain Events
              </CardTitle>
              <CardDescription>
                Latest domain activities and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentEvents.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No recent events available
                  </p>
                ) : (
                  recentEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-medium">{event.name || 'Unknown Domain'}</p>
                          <Badge className={`text-xs ${getEventTypeColor(event.type)}`}>
                            {event.type && event.type !== 'UNKNOWN_EVENT' ? event.type.replace('NAME_TOKEN_', '').replace('_', ' ') : 'Domain Activity'}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{formatTimeAgo(event.created_at)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domains" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Top Performing Domains
              </CardTitle>
              <CardDescription>
                Domains with highest activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topDomains.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No domain data available
                  </p>
                ) : (
                  topDomains.map((domain, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                        <Globe className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-medium">{domain.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {domain.event_count} events • {formatTimeAgo(domain.last_event_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

