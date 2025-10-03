'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RealTimeData from '@/components/dashboard/real-time-data';
import DomainMonitorOverview from '@/components/dashboard/domain-monitor-overview';
import DomainAnalytics from '@/components/dashboard/domain-analytics';
import DomainSubscriptions from '@/components/dashboard/domain-subscriptions';
import DomainTrends from '@/components/dashboard/domain-trends';
import DomainMarketOverview from '@/components/dashboard/domain-market-overview';
import DomainEventsTimeline from '@/components/dashboard/domain-events-timeline';
import ErrorBoundary from '@/components/dashboard/error-boundary';

export default function DashboardClient() {
  const [domainStats, setDomainStats] = useState({
    totalEvents: 0,
    eventsToday: 0,
    activeDomains: 0,
    trendingDomains: 0,
    lastUpdate: null as Date | null
  });

  // Fetch domain statistics from Supabase
  useEffect(() => {
    const fetchDomainStats = async () => {
      try {
        const response = await fetch('/api/domain-monitor?action=analytics');
        const data = await response.json();
        setDomainStats({
          totalEvents: data.totalEvents || 0,
          eventsToday: data.eventsToday || 0,
          activeDomains: data.activeDomains || 0,
          trendingDomains: data.trendingDomains || 0,
          lastUpdate: new Date()
        });
      } catch (error) {
        console.error('Error fetching domain stats:', error);
      }
    };

    fetchDomainStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDomainStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Removed unused getStatusColor function

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return 'Loading...';
    
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



  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Coxy Domain Intelligence Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time Web3 domain analytics and market trends
        </p>
      </div>

      {/* Domain Market Overview - Main Focus */}
      <ErrorBoundary>
        <DomainMarketOverview />
      </ErrorBoundary>

      {/* No Data Message */}
      {domainStats.totalEvents === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="text-6xl">🔍</div>
              <h3 className="text-xl font-semibold">No Domain Data Available</h3>
              <p className="text-muted-foreground">
                The domain monitor is running but no events have been detected yet. 
                This could mean:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• The Doma Protocol API is not returning events</li>
                <li>• The domain monitor service needs to be started</li>
                <li>• There are no recent domain activities to track</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Check the domain monitor service status or try refreshing the page.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Domain Trends - Only show if we have data */}
      {domainStats.totalEvents > 0 && (
        <ErrorBoundary>
          <DomainTrends />
        </ErrorBoundary>
      )}


      {/* Domain Events Timeline - Only show if we have data */}
      {domainStats.totalEvents > 0 && (
        <ErrorBoundary>
          <DomainEventsTimeline />
        </ErrorBoundary>
      )}

      {/* Real-time Data Overview */}
      <ErrorBoundary>
        <RealTimeData />
      </ErrorBoundary>

      {/* Domain Monitoring Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">🌐 Advanced Domain Analytics</h2>
          <p className="text-muted-foreground">
            Detailed domain analysis, monitoring, and subscription management
          </p>
        </div>
        
        {/* Domain Monitor Overview */}
        <ErrorBoundary>
          <DomainMonitorOverview />
        </ErrorBoundary>
        
        {/* Domain Analytics - Only show if we have data */}
        {domainStats.totalEvents > 0 && (
          <ErrorBoundary>
            <DomainAnalytics />
          </ErrorBoundary>
        )}
        
        {/* Domain Subscriptions */}
        <ErrorBoundary>
          <DomainSubscriptions />
        </ErrorBoundary>
      </div>

      {/* Domain Statistics Overview */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Domain Market Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Total Events
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </CardTitle>
              <CardDescription>
                All domain events tracked
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{domainStats.totalEvents.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                Last updated: {domainStats.lastUpdate ? formatTimeAgo(domainStats.lastUpdate) : 'Never'}
              </p>
            </CardContent>
          </Card>

          {/* Events Today */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📈 Events Today
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </CardTitle>
              <CardDescription>
                Events in the last 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{domainStats.eventsToday.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                Real-time updates
              </p>
            </CardContent>
          </Card>

          {/* Active Domains */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🌐 Active Domains
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </CardTitle>
              <CardDescription>
                Domains with recent activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">{domainStats.activeDomains.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                Currently monitored
              </p>
            </CardContent>
          </Card>


          {/* Trending Domains */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔥 Trending
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </CardTitle>
              <CardDescription>
                Domains gaining momentum
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{domainStats.trendingDomains.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                Hot domains
              </p>
            </CardContent>
          </Card>
        </div>
      </div>


    </div>
  );
}
