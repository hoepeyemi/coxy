'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Search, Filter, Globe, Activity, Bell, TrendingUp } from 'lucide-react';
import DomainMonitorOverview from '@/components/dashboard/domain-monitor-overview';
import DomainAnalytics from '@/components/dashboard/domain-analytics';
import DomainSubscriptions from '@/components/dashboard/domain-subscriptions';

export default function DomainMonitorClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [timeframeFilter, setTimeframeFilter] = useState('24h');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const eventTypes = [
    'NAME_TOKEN_MINTED',
    'NAME_TOKENIZED',
    'NAME_CLAIMED',
    'NAME_TOKEN_TRANSFERRED',
    'COMMAND_SUCCEEDED',
    'COMMAND_UPDATED',
    'COMMAND_CREATED',
    'NAME_TOKENIZATION_REQUESTED'
  ].filter(type => type && type.trim() !== '');

  const timeframes = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  const handleRefresh = () => {
    setLastUpdate(new Date());
    // Trigger refresh in child components by updating a key
    window.location.reload();
  };

  const formatEventType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="h-8 w-8" />
            Domain Monitor
          </h1>
          <p className="text-muted-foreground">
            Real-time Web3 domain events, analytics, and market intelligence
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdate && (
            <span className="text-sm text-muted-foreground">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">2,847</p>
                <p className="text-sm text-muted-foreground">Total Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">127</p>
                <p className="text-sm text-muted-foreground">Events Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-sm text-muted-foreground">Active Domains</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">45</p>
                <p className="text-sm text-muted-foreground">Subscriptions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>
            Filter domain events and analytics by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search domains..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Filter by event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Event Types</SelectItem>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type || 'unknown'}>
                    {formatEventType(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={timeframeFilter} onValueChange={setTimeframeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeframes.map((timeframe) => (
                  <SelectItem key={timeframe.value} value={timeframe.value}>
                    {timeframe.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <DomainMonitorOverview />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <DomainAnalytics />
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <DomainSubscriptions />
        </TabsContent>
      </Tabs>

      {/* Event Types Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Event Types Legend</CardTitle>
          <CardDescription>
            Understanding the different types of domain events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {eventTypes.map((type) => (
              <div key={type} className="flex items-center gap-2 p-3 border rounded-lg">
                <Badge variant="outline" className="text-xs">
                  {formatEventType(type)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {getEventDescription(type)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getEventDescription(type: string): string {
  const descriptions: { [key: string]: string } = {
    'NAME_TOKEN_MINTED': 'New domain token created',
    'NAME_TOKENIZED': 'Domain converted to token',
    'NAME_CLAIMED': 'Domain ownership claimed',
    'NAME_TOKEN_TRANSFERRED': 'Domain token transferred',
    'COMMAND_SUCCEEDED': 'Command executed successfully',
    'COMMAND_UPDATED': 'Command status updated',
    'COMMAND_CREATED': 'New command created',
    'NAME_TOKENIZATION_REQUESTED': 'Tokenization request made'
  };
  return descriptions[type] || 'Domain event';
}

