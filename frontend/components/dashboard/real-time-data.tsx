'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, Activity, Target, Zap } from 'lucide-react';
import { realTimeService } from '@/lib/real-time-service';

interface RealTimeData {
  patternAnalysis: {
    lastAnalysis: string;
    correlations: number;
    recommendations: number;
  };
  domainMonitor: {
    totalEvents: number;
    eventsToday: number;
    activeSubscriptions: number;
  };
}

export default function RealTimeData() {
  const [data, setData] = useState<RealTimeData>({
    patternAnalysis: { lastAnalysis: 'Never', correlations: 0, recommendations: 0 },
    domainMonitor: { totalEvents: 0, eventsToday: 0, activeSubscriptions: 0 }
  });
  const [formattedLastAnalysis, setFormattedLastAnalysis] = useState<string>('Never');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're on the client side
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only fetch data after we're on the client side
    if (!isClient) return;
    
    // Initial data fetch
    fetchRealTimeData();
    
    // Subscribe to real-time updates only if service is available
    if (realTimeService) {
      const unsubscribeDomain = realTimeService.subscribe('domain_update', (newData) => {
        // Type guard to ensure newData is an object with expected properties
        if (newData && typeof newData === 'object' && 'eventsToday' in newData) {
          const domainData = newData as { eventsToday?: number };
          setData(prev => ({
            ...prev,
            domainMonitor: {
              ...prev.domainMonitor,
              totalEvents: prev.domainMonitor.totalEvents + 1,
              eventsToday: prev.domainMonitor.eventsToday + (domainData.eventsToday || 0)
            }
          }));
        }
      });

      // Cleanup subscriptions
      return () => {
        unsubscribeDomain();
      };
    }
  }, [isClient]);


  // Update formatted time whenever lastAnalysis changes
  useEffect(() => {
    if (data.patternAnalysis.lastAnalysis && data.patternAnalysis.lastAnalysis !== 'Never') {
      const formatTimeAgo = (timestamp: string) => {
        try {
          const date = new Date(timestamp);
          const now = new Date();
          const diffMs = now.getTime() - date.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          
          if (diffMins < 60) return `${diffMins}m ago`;
          if (diffHours < 24) return `${diffHours}h ago`;
          return '1d+ ago';
        } catch {
          return timestamp;
        }
      };
      
      setFormattedLastAnalysis(formatTimeAgo(data.patternAnalysis.lastAnalysis));
    } else {
      setFormattedLastAnalysis('Never');
    }
  }, [data.patternAnalysis.lastAnalysis]);

  const fetchRealTimeData = async () => {
    try {
      // Fetch pattern analysis summary
      const analysisResponse = await fetch('/api/dashboard/analysis-summary');
      if (analysisResponse.ok) {
        const analysisData = await analysisResponse.json();
        setData(prev => ({
          ...prev,
          patternAnalysis: {
            lastAnalysis: analysisData.lastAnalysis || 'Never',
            correlations: analysisData.totalCorrelations || 0,
            recommendations: analysisData.totalRecommendations || 0
          }
        }));
      }

      // Fetch domain monitor data
      const domainResponse = await fetch('/api/domain-monitor?action=analytics');
      if (domainResponse.ok) {
        const domainData = await domainResponse.json();
        setData(prev => ({
          ...prev,
          domainMonitor: {
            totalEvents: domainData.totalEvents || 0,
            eventsToday: domainData.eventsToday || 0,
            activeSubscriptions: domainData.activeSubscriptions || 0
          }
        }));
      }

    } catch (error) {
      console.error('Error fetching real-time data:', error);
      // Set default values on error to prevent UI crashes
      setData(prev => ({
        ...prev,
        patternAnalysis: { lastAnalysis: 'Error', correlations: 0, recommendations: 0 },
        domainMonitor: { totalEvents: 0, eventsToday: 0, activeSubscriptions: 0 }
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">📊 Domain Trends Overview</h2>
        <p className="text-muted-foreground">
          Live domain market data and trending analysis - no refresh needed
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Domain Monitor Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
              🌐 Domain Monitor
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </CardTitle>
            <p className="text-sm text-muted-foreground">
              Web3 domain events and analytics
              <span className="text-green-500 ml-2">● Live</span>
            </p>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold text-blue-600">{data.domainMonitor.totalEvents}</p>
            </div>
              <div>
                <p className="text-muted-foreground">Events Today</p>
                <p className="text-2xl font-bold text-green-600">{data.domainMonitor.eventsToday}</p>
            </div>
          </div>
          
          <div>
            <p className="text-muted-foreground">Active Subscriptions</p>
            <p className="text-lg font-semibold text-purple-600">{data.domainMonitor.activeSubscriptions}</p>
          </div>
        </CardContent>
      </Card>

        {/* Pattern Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
              🧠 AI Pattern Analysis
          </CardTitle>
            <p className="text-sm text-muted-foreground">
              Real-time insights and correlations
            </p>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Correlations</p>
                <p className="text-2xl font-bold text-orange-600">{data.patternAnalysis.correlations}</p>
            </div>
              <div>
                <p className="text-muted-foreground">Recommendations</p>
                <p className="text-2xl font-bold text-red-600">{data.patternAnalysis.recommendations}</p>
            </div>
          </div>
          
            <div>
            <p className="text-sm text-muted-foreground">Last Analysis</p>
              <p className="text-sm font-medium">{formattedLastAnalysis}</p>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
