import { notFound } from 'next/navigation';
import DomainPageClient from './domain-page-client';

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
    // Use the existing API route to fetch domain events
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/domain-monitor?action=events&domainName=${encodeURIComponent(domainId)}&limit=100`, {
      next: { revalidate: 30 }
    });

    if (!response.ok) {
      console.error(`API request failed: ${response.status} ${response.statusText}`);
      // Try to get error details
      try {
        const errorData = await response.json();
        console.error('API error details:', errorData);
      } catch (e) {
        console.error('Could not parse error response');
      }
      throw new Error(`Failed to fetch domain data: ${response.status}`);
    }

    const data = await response.json();
    const domainEvents = data.events || [];
    
    console.log(`Found ${domainEvents.length} events for domain: ${domainId}`);
    
    if (domainEvents.length === 0) {
      console.log(`No events found for domain: ${domainId}`);
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

  return (
    <DomainPageClient 
      domain={domain}
      events={events}
      totalEvents={totalEvents}
      domainId={id}
      type={type}
    />
  );
}
