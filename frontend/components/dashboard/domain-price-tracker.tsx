'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, Globe, Activity, BarChart3 } from 'lucide-react';

interface DomainPrice {
  domain_name: string;
  current_price: number;
  last_trade_at: string;
  is_trending: boolean;
}

interface PriceStats {
  average_price: number;
  median_price: number;
  highest_price: number;
  lowest_price: number;
  total_events: number;
  price_increase_count: number;
  price_decrease_count: number;
}

interface DomainPriceTrackerProps {
  className?: string;
}

export default function DomainPriceTracker({ className }: DomainPriceTrackerProps) {
  const [prices, setPrices] = useState<DomainPrice[]>([]);
  const [stats, setStats] = useState<PriceStats>({
    average_price: 0,
    median_price: 0,
    highest_price: 0,
    lowest_price: 0,
    total_events: 0,
    price_increase_count: 0,
    price_decrease_count: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('prices');
  const [sortBy, setSortBy] = useState('current_price');

  const fetchPriceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching price data...');

      // Fetch domain prices
      const pricesResponse = await fetch('/api/domain-monitor?action=prices&limit=20');
      if (!pricesResponse.ok) {
        throw new Error(`HTTP error! status: ${pricesResponse.status}`);
      }
      const pricesData = await pricesResponse.json();
      console.log('Price data received:', pricesData);
      setPrices(pricesData.prices || []);

      // Fetch price statistics
      const statsResponse = await fetch('/api/domain-monitor?action=price-stats');
      if (!statsResponse.ok) {
        throw new Error(`HTTP error! status: ${statsResponse.status}`);
      }
      const statsData = await statsResponse.json();
      console.log('Stats data received:', statsData);
      setStats(statsData.stats || {
        average_price: 0,
        median_price: 0,
        highest_price: 0,
        lowest_price: 0,
        total_events: 0,
        price_increase_count: 0,
        price_decrease_count: 0
      });

    } catch (err) {
      console.error('Error fetching price data:', err);
      setError('Failed to fetch price data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPriceData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPriceData, 30000);
    return () => clearInterval(interval);
  }, [fetchPriceData]);

  const formatPrice = (price: number) => {
    if (!price || isNaN(price)) return '—';
    if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `$${(price / 1000).toFixed(1)}K`;
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {isPositive ? '+' : ''}{change.toFixed(2)}%
      </span>
    );
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

  const sortedPrices = [...prices].sort((a, b) => {
    switch (sortBy) {
      case 'current_price':
        return b.current_price - a.current_price;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            <span>Loading price data...</span>
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
            <Button onClick={fetchPriceData} className="mt-2" variant="outline">
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
          <h2 className="text-2xl font-bold">💰 Domain Price Tracker</h2>
          <p className="text-muted-foreground">
            Real-time domain pricing and market movements
          </p>
        </div>
        <Button onClick={fetchPriceData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="prices">Price List</TabsTrigger>
          <TabsTrigger value="stats">Market Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="prices" className="space-y-4">
          {/* Sort Controls */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={sortBy === 'current_price' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('current_price')}
            >
              Price
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Domain Prices
              </CardTitle>
              <CardDescription>
                Sorted by {sortBy ? sortBy.replace('_', ' ') : 'Unknown'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedPrices.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No price data available
                  </p>
                ) : (
                  sortedPrices.map((domain, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                          <Globe className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{domain.domain_name}</span>
                          {domain.is_trending && (
                            <Badge variant="destructive" className="text-xs">
                              🔥 Trending
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(domain.current_price)}</p>
                          <p className="text-muted-foreground">Current Price</p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground">{formatTimeAgo(domain.last_trade_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Average Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(stats.average_price)}</div>
                <p className="text-xs text-muted-foreground">Per domain</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Median Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(stats.median_price)}</div>
                <p className="text-xs text-muted-foreground">Middle value</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Highest Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatPrice(stats.highest_price)}</div>
                <p className="text-xs text-muted-foreground">All time high</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Lowest Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{formatPrice(stats.lowest_price)}</div>
                <p className="text-xs text-muted-foreground">All time low</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Total Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.total_events}</div>
                <p className="text-xs text-muted-foreground">With prices</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Price Increases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.price_increase_count}</div>
                <p className="text-xs text-muted-foreground">24h increases</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Price Decreases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.price_decrease_count}</div>
                <p className="text-xs text-muted-foreground">24h decreases</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

