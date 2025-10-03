'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, Globe } from 'lucide-react';

interface DomainTrendData {
  time: string;
  events: number;
  domains: number;
}

export default function DomainTrendChart() {
  const [chartData, setChartData] = useState<DomainTrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate sample trend data for the last 24 hours
    const generateTrendData = () => {
      const data: DomainTrendData[] = [];
      const now = new Date();
      
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          events: Math.floor(Math.random() * 50) + 10,
          domains: Math.floor(Math.random() * 20) + 5,
        });
      }
      
      return data;
    };

    setChartData(generateTrendData());
    setLoading(false);
  }, []);

  const maxEvents = Math.max(...chartData.map(d => d.events));
  const maxDomains = Math.max(...chartData.map(d => d.domains));

  if (loading) {
    return (
      <Card className="w-full h-64">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <Activity className="w-8 h-8 animate-pulse mx-auto mb-2" />
            <p className="text-muted-foreground">Loading chart...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-coxy-primary" />
          Domain Activity Trends (24h)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {/* Chart Visualization */}
          <div className="relative h-32 sm:h-40 lg:h-48 bg-muted/20 rounded-lg p-2 sm:p-4">
            <div className="flex items-end justify-between h-full space-x-0.5 sm:space-x-1">
              {chartData.map((data, index) => (
                <div key={index} className="flex flex-col items-center space-y-0.5 sm:space-y-1 flex-1">
                  {/* Events Bar */}
                  <div className="w-full bg-blue-500/20 rounded-t-sm relative group">
                    <div 
                      className="bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600"
                      style={{ 
                        height: `${(data.events / maxEvents) * 100}%`,
                        minHeight: '1px'
                      }}
                    />
                    <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-1 sm:px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {data.events} events
                    </div>
                  </div>
                  
                  {/* Domains Bar */}
                  <div className="w-full bg-green-500/20 rounded-t-sm relative group">
                    <div 
                      className="bg-green-500 rounded-t-sm transition-all duration-300 hover:bg-green-600"
                      style={{ 
                        height: `${(data.domains / maxDomains) * 100}%`,
                        minHeight: '1px'
                      }}
                    />
                    <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-1 sm:px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {data.domains} domains
                    </div>
                  </div>
                  
                  {/* Time Label */}
                  <span className="text-xs text-muted-foreground mt-1">
                    {index % 6 === 0 ? data.time : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-4 sm:space-x-6 text-xs sm:text-sm">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-sm"></div>
              <span className="text-muted-foreground">Events</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-sm"></div>
              <span className="text-muted-foreground">Active Domains</span>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                <span className="text-xs sm:text-sm font-medium">Total Events</span>
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-coxy-primary">
                {chartData.reduce((sum, d) => sum + d.events, 0)}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                <span className="text-xs sm:text-sm font-medium">Unique Domains</span>
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-coxy-primary">
                {chartData.reduce((sum, d) => sum + d.domains, 0)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
