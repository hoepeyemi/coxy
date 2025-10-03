'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, TrendingUp, Globe, Activity } from 'lucide-react';

interface DomainTrend {
  domain_name: string;
  event_type: string;
  event_count: number;
  last_event_at: string;
  is_trending: boolean;
}

interface TrendingDomain {
  domain_name: string;
  event_count: number;
  last_event_at: string;
  event_types: string[];
  is_trending: boolean;
}

interface DomainTrendsProps {
  className?: string;
}

export default function DomainTrends({ className }: DomainTrendsProps) {
  const [trends, setTrends] = useState<DomainTrend[]>([]);
  const [trendingDomains, setTrendingDomains] = useState<TrendingDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState('trends');

  const fetchTrends = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch recent domain trends
      const trendsResponse = await fetch('/api/domain-monitor?action=trends&limit=20');
      const trendsData = await trendsResponse.json();
      setTrends(trendsData.trends || []);

      // Fetch trending domains
      const trendingResponse = await fetch('/api/domain-monitor?action=trending&limit=10');
      const trendingData = await trendingResponse.json();
      setTrendingDomains(trendingData.domains || []);

      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching domain trends:', err);
      setError('Failed to fetch domain trends');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
    // Refresh every 30 seconds
    const interval = setInterval(fetchTrends, 30000);
    return () => clearInterval(interval);
  }, []);


  const formatTimeAgo = (timestamp: string) => {
    if (!timestamp) return '—';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '—';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            <span>Loading domain trends...</span>
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
            <Button onClick={fetchTrends} className="mt-2" variant="outline">
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
          <h2 className="text-2xl font-bold">🔥 Domain Trends</h2>
          <p className="text-muted-foreground">
            Real-time domain market trends and activity
            {lastUpdate && (
              <span className="ml-2 text-sm">
                • Last updated: {formatTimeAgo(lastUpdate.toISOString())}
              </span>
            )}
          </p>
        </div>
        <Button onClick={fetchTrends} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="trends">Recent Trends</TabsTrigger>
          <TabsTrigger value="trending">Trending Domains</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Domain Activity
              </CardTitle>
              <CardDescription>
                Latest domain events and price movements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trends.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No recent trends available
                  </p>
                ) : (
                  trends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{trend.domain_name}</span>
                          {trend.is_trending && (
                            <Badge variant="destructive" className="text-xs">
                              🔥 Trending
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline">{trend.event_type}</Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <p className="font-medium">{trend.event_count}</p>
                          <p className="text-muted-foreground">Events</p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground">{formatTimeAgo(trend.last_event_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Top Trending Domains
              </CardTitle>
              <CardDescription>
                Domains with highest activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendingDomains.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No trending domains available
                  </p>
                ) : (
                  trendingDomains.map((domain, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                          <Globe className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{domain.domain_name}</span>
                          {domain.is_trending && (
                            <Badge variant="secondary" className="text-xs">
                              Trending
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {domain.event_types.slice(0, 2).map((eventType, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {eventType.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                          {domain.event_types.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{domain.event_types.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <p className="font-medium">{domain.event_count}</p>
                          <p className="text-muted-foreground">Events</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{domain.event_types.length}</p>
                          <p className="text-muted-foreground">Types</p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground">{formatTimeAgo(domain.last_event_at)}</p>
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



