import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

class SubscriptionManager {
  constructor() {
    this.eventTypes = [
      'NAME_TOKEN_MINTED',
      'NAME_TOKEN_BURNED', 
      'NAME_TOKEN_TRANSFERRED',
      'NAME_TOKEN_LISTED',
      'NAME_TOKEN_UNLISTED',
      'NAME_TOKEN_SOLD',
      'NAME_TOKEN_OFFERED',
      'NAME_TOKEN_OFFER_ACCEPTED',
      'NAME_TOKEN_OFFER_CANCELLED',
      'NAME_TOKEN_EXPIRED',
      'NAME_TOKEN_RENEWED',
      'NAME_TOKEN_FRACTIONALIZED',
      'NAME_TOKEN_DEFRACTIONALIZED'
    ];
  }

  // Create a new subscription
  async createSubscription(userId, eventType, webhookUrl, filters = {}) {
    try {
      if (!this.eventTypes.includes(eventType)) {
        throw new Error(`Invalid event type: ${eventType}`);
      }

      const { data, error } = await supabase
        .from('domain_subscriptions')
        .insert({
          user_id: userId,
          event_type: eventType,
          webhook_url: webhookUrl,
          filters: filters,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log(`✅ Created subscription for ${eventType} events`);
      return data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Get all subscriptions for a user
  async getUserSubscriptions(userId) {
    try {
      const { data, error } = await supabase
        .from('domain_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user subscriptions:', error);
      throw error;
    }
  }

  // Update subscription filters
  async updateSubscriptionFilters(subscriptionId, filters) {
    try {
      const { data, error } = await supabase
        .from('domain_subscriptions')
        .update({
          filters: filters,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log(`✅ Updated filters for subscription ${subscriptionId}`);
      return data;
    } catch (error) {
      console.error('Error updating subscription filters:', error);
      throw error;
    }
  }

  // Toggle subscription active status
  async toggleSubscription(subscriptionId, isActive) {
    try {
      const { data, error } = await supabase
        .from('domain_subscriptions')
        .update({
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log(`✅ ${isActive ? 'Activated' : 'Deactivated'} subscription ${subscriptionId}`);
      return data;
    } catch (error) {
      console.error('Error toggling subscription:', error);
      throw error;
    }
  }

  // Delete subscription
  async deleteSubscription(subscriptionId) {
    try {
      const { error } = await supabase
        .from('domain_subscriptions')
        .delete()
        .eq('id', subscriptionId);

      if (error) {
        throw error;
      }

      console.log(`✅ Deleted subscription ${subscriptionId}`);
      return true;
    } catch (error) {
      console.error('Error deleting subscription:', error);
      throw error;
    }
  }

  // Get subscription statistics
  async getSubscriptionStats(userId) {
    try {
      const { data: subscriptions, error: subError } = await supabase
        .from('domain_subscriptions')
        .select('*')
        .eq('user_id', userId);

      if (subError) {
        throw subError;
      }

      const { data: deliveries, error: delError } = await supabase
        .from('webhook_deliveries')
        .select('status, delivered_at')
        .in('subscription_id', subscriptions.map(s => s.id))
        .gte('delivered_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24 hours

      if (delError) {
        throw delError;
      }

      const stats = {
        total_subscriptions: subscriptions.length,
        active_subscriptions: subscriptions.filter(s => s.is_active).length,
        webhooks_sent_24h: deliveries.filter(d => d.status === 'success').length,
        webhooks_failed_24h: deliveries.filter(d => d.status === 'failed').length,
        event_types: [...new Set(subscriptions.map(s => s.event_type))],
        created_at: subscriptions[0]?.created_at || null
      };

      return stats;
    } catch (error) {
      console.error('Error fetching subscription stats:', error);
      throw error;
    }
  }

  // Create predefined subscription templates
  async createPredefinedSubscriptions(userId, webhookUrl) {
    const templates = [
      {
        eventType: 'NAME_TOKEN_LISTED',
        name: 'High-Value Listings',
        filters: {
          minPrice: 500000,
          extensions: ['.com', '.eth', '.sol']
        }
      },
      {
        eventType: 'NAME_TOKEN_SOLD',
        name: 'Recent Sales',
        filters: {
          minPrice: 5000,
          extensions: ['.com', '.eth', '.sol']
        }
      },
      {
        eventType: 'NAME_TOKEN_EXPIRED',
        name: 'Expiring Domains',
        filters: {
          expiresWithinDays: 10,
          extensions: ['.com', '.eth', '.sol']
        }
      },
      {
        eventType: 'NAME_TOKEN_OFFERED',
        name: 'High-Value Offers',
        filters: {
          minPrice: 10000,
          extensions: ['.com', '.eth', '.sol']
        }
      },
      {
        eventType: 'NAME_TOKEN_FRACTIONALIZED',
        name: 'Fractionalized Domains',
        filters: {
          extensions: ['.com', '.eth', '.sol']
        }
      }
    ];

    const results = [];
    
    for (const template of templates) {
      try {
        const subscription = await this.createSubscription(
          userId,
          template.eventType,
          webhookUrl,
          template.filters
        );
        results.push({ ...subscription, template_name: template.name });
      } catch (error) {
        console.error(`Error creating template ${template.name}:`, error);
        results.push({ error: error.message, template_name: template.name });
      }
    }

    return results;
  }

  // Validate webhook URL
  validateWebhookUrl(url) {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  // Get available event types
  getEventTypes() {
    return this.eventTypes;
  }

  // Get filter options for each event type
  getFilterOptions(eventType) {
    const baseFilters = {
      minPrice: { type: 'number', label: 'Minimum Price (USD)' },
      maxPrice: { type: 'number', label: 'Maximum Price (USD)' },
      minLength: { type: 'number', label: 'Minimum Domain Length' },
      maxLength: { type: 'number', label: 'Maximum Domain Length' },
      extensions: { 
        type: 'array', 
        label: 'Domain Extensions',
        options: ['.com', '.eth', '.sol', '.crypto', '.nft', '.dao', '.defi']
      },
      owner: { type: 'text', label: 'Owner Address' }
    };

    const eventSpecificFilters = {
      'NAME_TOKEN_EXPIRED': {
        ...baseFilters,
        expiresWithinDays: { type: 'number', label: 'Expires Within (Days)' }
      },
      'NAME_TOKEN_LISTED': {
        ...baseFilters,
        minListPrice: { type: 'number', label: 'Minimum Listing Price' }
      },
      'NAME_TOKEN_OFFERED': {
        ...baseFilters,
        minOfferPrice: { type: 'number', label: 'Minimum Offer Price' }
      }
    };

    return eventSpecificFilters[eventType] || baseFilters;
  }
}

export default SubscriptionManager;

