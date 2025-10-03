'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Globe, AlertCircle } from 'lucide-react';

interface DomainEvent {
  id: number;
  event_id: number;
  name: string;
  token_id: string | null;
  type: string;
  unique_id: string | null;
  relay_id: string | null;
  event_data: Record<string, unknown>;
  processed: boolean;
  created_at: string;
}

interface DomainAnalytics {
  id: number;
  domain_name: string;
  token_id: string | null;
  total_events: number;
  last_event_type: string;
  last_event_at: string;
  total_volume_usd: number;
  highest_price_usd: number;
  lowest_price_usd: number;
  offer_count: number;
  trade_count: number;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

interface DomainMonitorOverviewProps {
  className?: string;
}

export default function DomainMonitorOverview({ className }: DomainMonitorOverviewProps) {
  const [domainEvents, setDomainEvents] = useState<DomainEvent[]>([]);
  const [trendingDomains, setTrendingDomains] = useState<DomainAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchDomainData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch recent domain events
      const eventsResponse = await fetch('/api/domain-monitor?action=events&limit=20');
      const eventsData = await eventsResponse.json();
      setDomainEvents(eventsData.events || []);

      // Fetch trending domains
      const trendingResponse = await fetch('/api/domain-monitor?action=trending&limit=10&timeframe=24h');
      const trendingData = await trendingResponse.json();
      setTrendingDomains(trendingData.domains || []);

      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching domain data:', err);
      setError('Failed to fetch domain data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomainData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDomainData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'NAME_TOKEN_MINTED': return 'bg-green-500/20 text-green-700';
      case 'NAME_TOKENIZED': return 'bg-blue-500/20 text-blue-700';
      case 'NAME_CLAIMED': return 'bg-purple-500/20 text-purple-700';
      case 'NAME_TOKEN_TRANSFERRED': return 'bg-orange-500/20 text-orange-700';
      case 'COMMAND_SUCCEEDED': return 'bg-emerald-500/20 text-emerald-700';
      case 'COMMAND_UPDATED': return 'bg-cyan-500/20 text-cyan-700';
      case 'COMMAND_CREATED': return 'bg-indigo-500/20 text-indigo-700';
      case 'NAME_TOKENIZATION_REQUESTED': return 'bg-pink-500/20 text-pink-700';
      case 'UNKNOWN_EVENT': return 'bg-gray-500/20 text-gray-700';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  const formatEventType = (type: string) => {
    if (!type || type === 'UNKNOWN_EVENT') return 'Domain Activity';
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const formatPrice = (price: number | null) => {
    if (!price || isNaN(price)) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  if (loading && domainEvents.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Domain Monitor
          </CardTitle>
          <CardDescription>
            Real-time Web3 domain events and analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Domain Monitor
            </CardTitle>
            <CardDescription>
              Real-time Web3 domain events and analytics
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdate && (
              <span className="text-sm text-muted-foreground">
                Updated {formatTimeAgo(lastUpdate.toISOString())}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDomainData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="events">Recent Events</TabsTrigger>
            <TabsTrigger value="trending">Trending Domains</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-4">
            <div className="space-y-3">
              {domainEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No recent domain events found
                </div>
              ) : (
                domainEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {event.name || `Event-${event.event_id}`}
                          </span>
                          <Badge className={getEventTypeColor(event.type)}>
                            {formatEventType(event.type)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {event.token_id && `Token: ${event.token_id.slice(0, 8)}...`}
                          {event.relay_id && ` • Relay: ${event.relay_id.slice(0, 8)}...`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {formatTimeAgo(event.created_at)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-4">
            <div className="space-y-3">
              {trendingDomains.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No trending domains found
                </div>
              ) : (
                trendingDomains.map((domain) => (
                  <div
                    key={domain.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{domain.domain_name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {domain.total_events} events • Last: {formatEventType(domain.last_event_type)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {formatPrice(domain.highest_price_usd)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}



