'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface DomainAnalytics {
  domain_name: string;
  event_count: number;
  last_event_type: string;
  last_event_at: string;
  event_types: string[];
  is_trending: boolean;
}

interface DomainAnalyticsProps {
  className?: string;
}

export default function DomainAnalytics({ className }: DomainAnalyticsProps) {
  const [analytics, setAnalytics] = useState<DomainAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('24h');
  const [sortBy, setSortBy] = useState('total_events');

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/domain-monitor?action=trending&limit=8&timeframe=${timeframe}`);
      const data = await response.json();
      setAnalytics(data.domains || []);
    } catch (err) {
      console.error('Error fetching domain analytics:', err);
      setError('Failed to fetch domain analytics');
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe, fetchAnalytics]);

  const sortedAnalytics = [...analytics].sort((a, b) => {
    switch (sortBy) {
      case 'event_count':
        return b.event_count - a.event_count;
      case 'last_event':
        return new Date(b.last_event_at).getTime() - new Date(a.last_event_at).getTime();
      case 'trending':
        return (b.is_trending ? 1 : 0) - (a.is_trending ? 1 : 0);
      default:
        return 0;
    }
  });


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


  const totalDomains = analytics.length;

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Domain Analytics
          </CardTitle>
          <CardDescription>
            Comprehensive domain market analysis
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
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-4 w-4" />
              Domain Analytics
            </CardTitle>
            <CardDescription className="text-sm">
              Top domains by activity
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1h</SelectItem>
                <SelectItem value="24h">24h</SelectItem>
                <SelectItem value="7d">7d</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={fetchAnalytics} disabled={loading}>
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-3">
            {error}
          </div>
        )}

        <div className="space-y-2">
          {sortedAnalytics.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              No analytics found
            </div>
          ) : (
            sortedAnalytics.slice(0, 6).map((domain, index) => (
              <div
                key={`${domain.domain_name}-${index}`}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{domain.domain_name || 'Unknown Domain'}</span>
                      {domain.is_trending && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                          Hot
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {domain.event_count || 0} events • {formatTimeAgo(domain.last_event_at || '')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-sm">{domain.event_count || 0}</div>
                  <div className="text-xs text-muted-foreground">Events</div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}



