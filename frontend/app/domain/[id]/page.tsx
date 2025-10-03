import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Calendar, DollarSign, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';

interface DomainPageProps {
  params: {
    id: string;
  };
  searchParams: {
    type?: string;
  };
}

async function getDomainData(domainId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/domain_events`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30 }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch domain data');
    }

    const data = await response.json();
    
    // Find events related to this domain ID
    const domainEvents = data.filter((event: any) => 
      event.domain_name?.includes(domainId) || 
      event.event_id === domainId ||
      event.id === domainId
    );

    if (domainEvents.length === 0) {
      return null;
    }

    // Get the most recent event as the main domain info
    const latestEvent = domainEvents.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

    return {
      domain: latestEvent,
      events: domainEvents,
      totalEvents: domainEvents.length
    };
  } catch (error) {
    console.error('Error fetching domain data:', error);
    return null;
  }
}

export default async function DomainPage({ params, searchParams }: DomainPageProps) {
  const { id } = params;
  const { type } = searchParams;
  
  const domainData = await getDomainData(id);

  if (!domainData) {
    notFound();
  }

  const { domain, events, totalEvents } = domainData;

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
      'FRACTIONALIZATION': 'bg-pink-100 text-pink-800'
    };
    return colors[eventType] || 'bg-gray-100 text-gray-800';
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
                {domain.domain_name || `Event ${id}`}
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
                    <p className="text-lg font-semibold">{domain.domain_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Event Type</p>
                    <Badge className={getEventTypeColor(domain.event_type)}>
                      {domain.event_type}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Price</p>
                    <p className="text-lg font-semibold flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {domain.price ? formatPrice(domain.price) : 'N/A'}
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
                
                {domain.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {domain.description}
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
                        <Badge className={getEventTypeColor(event.event_type)}>
                          {event.event_type}
                        </Badge>
                        <div>
                          <p className="font-medium">{event.domain_name || 'Unknown Domain'}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(event.created_at)}
                          </p>
                        </div>
                      </div>
                      {event.price && (
                        <p className="font-semibold text-green-600">
                          {formatPrice(event.price)}
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
                <Button className="w-full" variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Marketplace
                </Button>
                <Button className="w-full" variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Track Price
                </Button>
                <Button className="w-full" variant="outline">
                  <Activity className="w-4 h-4 mr-2" />
                  Set Alert
                </Button>
              </CardContent>
            </Card>

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
                    {new Set(events.map((e: any) => e.event_type)).size}
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
