import dynamic from 'next/dynamic';

const DomainMonitorClient = dynamic(() => import('./domain-monitor-client'), {
  ssr: false,
  loading: () => (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Domain Monitor</h1>
        <p className="text-muted-foreground">
          Real-time Web3 domain events and analytics
        </p>
      </div>
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading domain monitor...</p>
      </div>
    </div>
  )
});

export default function DomainMonitorPage() {
  return <DomainMonitorClient />;
}



