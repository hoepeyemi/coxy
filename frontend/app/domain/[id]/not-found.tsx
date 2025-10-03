import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Search, AlertCircle } from 'lucide-react';

export default function DomainNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl">Domain Not Found</CardTitle>
            <CardDescription>
              The domain or event you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-gray-500">
              <p>This could happen if:</p>
              <ul className="mt-2 space-y-1 text-left">
                <li>• The domain event has expired</li>
                <li>• The event ID is incorrect</li>
                <li>• The domain is no longer being tracked</li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-3">
              <Link href="/">
                <Button className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              
              <Link href="/domain-monitor">
                <Button variant="outline" className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Browse All Domains
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
