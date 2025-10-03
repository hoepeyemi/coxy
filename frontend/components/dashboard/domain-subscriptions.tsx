'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bell, Plus, Trash2, Edit, Globe, Webhook } from 'lucide-react';

interface DomainSubscription {
  id: number;
  user_id: string;
  event_type: string;
  webhook_url: string;
  filters: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface DomainSubscriptionsProps {
  className?: string;
}

export default function DomainSubscriptions({ className }: DomainSubscriptionsProps) {
  const [subscriptions, setSubscriptions] = useState<DomainSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [, setEditingSubscription] = useState<DomainSubscription | null>(null);

  // Form state for creating/editing subscriptions
  const [formData, setFormData] = useState({
    eventType: '',
    webhookUrl: '',
    minPrice: '',
    maxPrice: '',
    minLength: '',
    maxLength: '',
    isActive: true
  });

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

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);

      // For demo purposes, using a mock user ID
      const userId = 'demo-user-123';
      const response = await fetch(`/api/domain-monitor?action=subscriptions&userId=${userId}`);
      const data = await response.json();
      setSubscriptions(data.subscriptions || []);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      setError('Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleCreateSubscription = async () => {
    try {
      const filters = {
        minPrice: formData.minPrice ? parseFloat(formData.minPrice) : undefined,
        maxPrice: formData.maxPrice ? parseFloat(formData.maxPrice) : undefined,
        minLength: formData.minLength ? parseInt(formData.minLength) : undefined,
        maxLength: formData.maxLength ? parseInt(formData.maxLength) : undefined,
      };

      const response = await fetch('/api/domain-monitor?action=subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'demo-user-123',
          eventType: formData.eventType,
          webhookUrl: formData.webhookUrl,
          filters: filters
        }),
      });

      if (response.ok) {
        await fetchSubscriptions();
        setIsCreateDialogOpen(false);
        resetForm();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create subscription');
      }
    } catch (err) {
      console.error('Error creating subscription:', err);
      setError('Failed to create subscription');
    }
  };

  const handleDeleteSubscription = async (subscriptionId: number) => {
    try {
      const response = await fetch('/api/domain-monitor?action=unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscriptionId
        }),
      });

      if (response.ok) {
        await fetchSubscriptions();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete subscription');
      }
    } catch (err) {
      console.error('Error deleting subscription:', err);
      setError('Failed to delete subscription');
    }
  };

  const handleToggleActive = async (subscription: DomainSubscription) => {
    try {
      const response = await fetch('/api/domain-monitor?action=update-filters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscription.id,
          filters: {
            ...subscription.filters,
            isActive: !subscription.is_active
          }
        }),
      });

      if (response.ok) {
        await fetchSubscriptions();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update subscription');
      }
    } catch (err) {
      console.error('Error updating subscription:', err);
      setError('Failed to update subscription');
    }
  };

  const resetForm = () => {
    setFormData({
      eventType: '',
      webhookUrl: '',
      minPrice: '',
      maxPrice: '',
      minLength: '',
      maxLength: '',
      isActive: true
    });
  };

  const formatEventType = (type: string) => {
    if (!type || type === 'UNKNOWN_EVENT') return 'Domain Activity';
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
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

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Domain Subscriptions
          </CardTitle>
          <CardDescription>
            Manage your domain event notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Domain Subscriptions
            </CardTitle>
            <CardDescription>
              Manage your domain event notifications
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Subscription
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Domain Subscription</DialogTitle>
                <DialogDescription>
                  Set up notifications for specific domain events with custom filters
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eventType">Event Type</Label>
                    <Select value={formData.eventType} onValueChange={(value) => setFormData({...formData, eventType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type} value={type || 'unknown'}>
                            {formatEventType(type)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="webhookUrl">Webhook URL</Label>
                    <Input
                      id="webhookUrl"
                      placeholder="https://your-webhook.com/endpoint"
                      value={formData.webhookUrl}
                      onChange={(e) => setFormData({...formData, webhookUrl: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minPrice">Min Price (USD)</Label>
                    <Input
                      id="minPrice"
                      type="number"
                      placeholder="0"
                      value={formData.minPrice}
                      onChange={(e) => setFormData({...formData, minPrice: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxPrice">Max Price (USD)</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      placeholder="1000000"
                      value={formData.maxPrice}
                      onChange={(e) => setFormData({...formData, maxPrice: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minLength">Min Length</Label>
                    <Input
                      id="minLength"
                      type="number"
                      placeholder="1"
                      value={formData.minLength}
                      onChange={(e) => setFormData({...formData, minLength: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxLength">Max Length</Label>
                    <Input
                      id="maxLength"
                      type="number"
                      placeholder="20"
                      value={formData.maxLength}
                      onChange={(e) => setFormData({...formData, maxLength: e.target.value})}
                    />
                  </div>
                </div>

              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSubscription}>
                  Create Subscription
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {subscriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No subscriptions found</p>
              <p className="text-sm">Create your first subscription to get started</p>
            </div>
          ) : (
            subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatEventType(subscription.event_type)}</span>
                      <Badge variant={subscription.is_active ? "default" : "secondary"}>
                        {subscription.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Webhook className="h-3 w-3" />
                        {subscription.webhook_url}
                      </div>
                      <div>Created {formatTimeAgo(subscription.created_at)}</div>
                    </div>
                    {subscription.filters && Object.keys(subscription.filters).length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Filters: {JSON.stringify(subscription.filters, null, 2)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={subscription.is_active}
                    onCheckedChange={() => handleToggleActive(subscription)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingSubscription(subscription)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSubscription(subscription.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

