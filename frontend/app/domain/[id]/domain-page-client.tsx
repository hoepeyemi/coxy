'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Calendar, DollarSign, TrendingUp, Activity, Bell, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

interface DomainPageClientProps {
  domain: any;
  events: any[];
  totalEvents: number;
  domainId: string;
  type?: string;
}

export default function DomainPageClient({ domain, events, totalEvents, domainId, type }: DomainPageClientProps) {
  const { toast } = useToast();
  const [isTracking, setIsTracking] = useState(false);
  const [isAlertSet, setIsAlertSet] = useState(false);
  const [trackingPrice, setTrackingPrice] = useState<number | null>(null);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(2)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(2)}K`;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeColor = (eventType: string) => {
    const colors: Record<string, string> = {
      'MINT': 'bg-green-100 text-green-800',
      'TRANSFER': 'bg-blue-100 text-blue-800',
      'LISTING': 'bg-yellow-100 text-yellow-800',
      'SALE': 'bg-purple-100 text-purple-800',
      'OFFER': 'bg-orange-100 text-orange-800',
      'EXPIRATION': 'bg-red-100 text-red-800',
      'RENEWAL': 'bg-indigo-100 text-indigo-800',
      'FRACTIONALIZATION': 'bg-pink-100 text-pink-800',
      'COMMAND_CREATED': 'bg-blue-100 text-blue-800',
      'COMMAND_UPDATED': 'bg-yellow-100 text-yellow-800',
      'COMMAND_SUCCEEDED': 'bg-green-100 text-green-800',
      'NAME_CLAIMED': 'bg-purple-100 text-purple-800',
      'NAME_TOKEN_MINTED': 'bg-indigo-100 text-indigo-800'
    };
    return colors[eventType] || 'bg-gray-100 text-gray-800';
  };

  const handleViewMarketplace = () => {
    // Check if this is a real domain name or just an event ID
    const isRealDomain = domain.name && domain.name.includes('.');
    
    if (isRealDomain) {
      // If it's a real domain name, try to open it on the marketplace
      const marketplaceUrl = `https://doma.xyz/domain/${domain.name}`;
      window.open(marketplaceUrl, '_blank');
      toast({
        title: "Opening Marketplace",
        description: `Viewing ${domain.name} on Doma marketplace`,
      });
    } else {
      // If it's an event ID, show a helpful message and open the main marketplace
      toast({
        title: "Event ID Detected",
        description: "This is an event ID, not a domain name. Opening Doma marketplace to browse domains.",
        variant: "default",
      });
      
      // Open the main marketplace for browsing
      window.open('https://doma.xyz', '_blank');
    }
  };

  const handleTrackPrice = () => {
    if (isTracking) {
      setIsTracking(false);
      setTrackingPrice(null);
      toast({
        title: "Price Tracking Stopped",
        description: `No longer tracking price for ${domain.name || domainId}`,
      });
    } else {
      setIsTracking(true);
      const currentPrice = domain.event_data?.price || 0;
      setTrackingPrice(currentPrice);
      toast({
        title: "Price Tracking Started",
        description: `Now tracking price for ${domain.name || domainId}`,
      });
    }
  };

  const handleSetAlert = () => {
    if (isAlertSet) {
      setIsAlertSet(false);
      toast({
        title: "Alert Removed",
        description: `Price alert removed for ${domain.name || domainId}`,
      });
    } else {
      setIsAlertSet(true);
      toast({
        title: "Alert Set",
        description: `Price alert set for ${domain.name || domainId}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {domain.name || `Event ${domainId}`}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Domain Intelligence & Analytics
              </p>
            </div>
            <div className="text-right">
              <Badge className="mb-2" variant="outline">
                {type?.toUpperCase() || 'OVERVIEW'}
              </Badge>
              <p className="text-sm text-gray-500">
                {totalEvents} total events
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Domain Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Domain Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Domain Information
                </CardTitle>
                <CardDescription>
                  Current status and key metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Domain Name</p>
                    <p className="text-lg font-semibold">{domain.name || 'N/A'}</p>
                    {domain.name && !domain.name.includes('.') && (
                      <p className="text-xs text-amber-600 mt-1">
                        ⚠️ This is an event ID, not a domain name
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Event Type</p>
                    <Badge className={getEventTypeColor(domain.type)}>
                      {domain.type}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Price</p>
                    <p className="text-lg font-semibold flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {domain.event_data?.price ? formatPrice(domain.event_data.price) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Updated</p>
                    <p className="text-sm flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(domain.created_at)}
                    </p>
                  </div>
                </div>
                
                {domain.event_data?.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {domain.event_data.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recent Events
                </CardTitle>
                <CardDescription>
                  Latest activity for this domain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.slice(0, 5).map((event: any, index: number) => (
                    <div key={event.id || index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className={getEventTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                        <div>
                          <p className="font-medium">{event.name || 'Unknown Domain'}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(event.created_at)}
                          </p>
                        </div>
                      </div>
                      {event.event_data?.price && (
                        <p className="font-semibold text-green-600">
                          {formatPrice(event.event_data.price)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={handleViewMarketplace}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {domain.name && domain.name.includes('.') ? 'View on Marketplace' : 'Browse Marketplace'}
                </Button>
                <Button 
                  className="w-full" 
                  variant={isTracking ? "default" : "outline"}
                  onClick={handleTrackPrice}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {isTracking ? 'Stop Tracking' : 'Track Price'}
                </Button>
                <Button 
                  className="w-full" 
                  variant={isAlertSet ? "default" : "outline"}
                  onClick={handleSetAlert}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  {isAlertSet ? 'Alert Set' : 'Set Alert'}
                </Button>
              </CardContent>
            </Card>

            {/* Price Tracking Status */}
            {isTracking && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Price Tracking Active
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Tracking price changes for {domain.name || domainId}
                    </p>
                    {trackingPrice && (
                      <p className="text-lg font-semibold text-green-600">
                        Current: {formatPrice(trackingPrice)}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Domain Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Domain Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Events</span>
                  <span className="font-semibold">{totalEvents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Event Types</span>
                  <span className="font-semibold">
                    {new Set(events.map((e: any) => e.type)).size}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Last Activity</span>
                  <span className="font-semibold text-sm">
                    {formatDate(domain.created_at)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Related Domains */}
            <Card>
              <CardHeader>
                <CardTitle>Related Domains</CardTitle>
                <CardDescription>
                  Similar domains you might be interested in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 text-center py-4">
                  Related domains will appear here
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
