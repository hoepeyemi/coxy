'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Globe, Clock, Activity, Search } from 'lucide-react';

interface DomainEvent {
  id: number;
  event_id: number;
  name: string;
  type: string;
  event_data: Record<string, unknown>;
  created_at: string;
  relay_id?: string;
}

interface DomainEventsTimelineProps {
  className?: string;
}

export default function DomainEventsTimeline({ className }: DomainEventsTimelineProps) {
  const [events, setEvents] = useState<DomainEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('24h');
  const [searchTerm, setSearchTerm] = useState('');

  const eventTypes = [
    'all',
    'NAME_TOKEN_MINTED',
    'NAME_TOKEN_TRANSFERRED',
    'NAME_TOKEN_BURNED',
    'NAME_RENEWED',
    'NAME_UPDATED',
    'NAME_DETOKENIZED',
    'NAME_TOKENIZATION_REQUESTED',
    'NAME_TOKEN_LOCK_STATUS_CHANGED'
  ].filter(type => type && type.trim() !== '');

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        action: 'events',
        limit: '10',
        timeframe: timeFilter
      });

      if (eventTypeFilter !== 'all') {
        params.append('eventType', eventTypeFilter);
      }

      const response = await fetch(`/api/domain-monitor?${params}`);
      const data = await response.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error('Error fetching domain events:', err);
      setError('Failed to fetch domain events');
    } finally {
      setLoading(false);
    }
  }, [timeFilter, eventTypeFilter]);

  useEffect(() => {
    fetchEvents();
    // Refresh every 30 seconds
    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getEventTypeInfo = (type: string) => {
    const eventInfo = {
      'NAME_TOKEN_MINTED': { label: 'Minted', color: 'bg-green-100 text-green-800', icon: '🆕' },
      'NAME_TOKEN_TRANSFERRED': { label: 'Transferred', color: 'bg-blue-100 text-blue-800', icon: '🔄' },
      'NAME_TOKEN_BURNED': { label: 'Burned', color: 'bg-red-100 text-red-800', icon: '🔥' },
      'NAME_RENEWED': { label: 'Renewed', color: 'bg-yellow-100 text-yellow-800', icon: '🔄' },
      'NAME_UPDATED': { label: 'Updated', color: 'bg-purple-100 text-purple-800', icon: '✏️' },
      'NAME_DETOKENIZED': { label: 'Detokenized', color: 'bg-orange-100 text-orange-800', icon: '🔓' },
      'NAME_TOKENIZATION_REQUESTED': { label: 'Tokenization Requested', color: 'bg-indigo-100 text-indigo-800', icon: '🔐' },
      'NAME_TOKEN_LOCK_STATUS_CHANGED': { label: 'Lock Status Changed', color: 'bg-pink-100 text-pink-800', icon: '🔒' }
    };
    return eventInfo[type as keyof typeof eventInfo] || { label: type, color: 'bg-gray-100 text-gray-800', icon: '❓' };
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = searchTerm === '' || 
      event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            <span>Loading domain events...</span>
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
            <Button onClick={fetchEvents} className="mt-2" variant="outline">
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
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">📅 Recent Events</h2>
          <p className="text-sm text-muted-foreground">
            Latest domain activities
          </p>
        </div>
        <Button onClick={fetchEvents} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Compact Filters */}
      <div className="flex gap-2 mb-4">
        <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {eventTypes.map((type) => (
              <SelectItem key={type} value={type || 'unknown'}>
                {type === 'all' ? 'All' : (type ? type.replace('NAME_TOKEN_', '').replace('_', ' ') : 'Unknown')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">1h</SelectItem>
            <SelectItem value="24h">24h</SelectItem>
            <SelectItem value="7d">7d</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events Timeline */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-6">
                <Globe className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No events found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredEvents.slice(0, 8).map((event) => {
                  const eventInfo = getEventTypeInfo(event.type);
                  const eventData = event.event_data || {};
                  
                  return (
                    <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <span className="text-sm">{eventInfo.icon}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm truncate">
                            {event.name || 'Unknown Domain'}
                          </h4>
                          <Badge className={`text-xs ${eventInfo.color}`}>
                            {eventInfo.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(event.created_at)}
                          </div>
                          {(() => {
                            const price = eventData.price;
                            if (typeof price === 'number' && price > 0) {
                              return (
                                <span className="font-medium text-green-600">${price}</span>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

