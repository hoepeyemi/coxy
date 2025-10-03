import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

class SubscriptionManager {
  constructor() {
    this.subscriptions = new Map();
    this.userPreferences = new Map();
    this.notificationQueue = [];
  }

  async initialize() {
    console.log('🔄 Initializing subscription manager...');
    
    try {
      await this.loadSubscriptions();
      await this.loadUserPreferences();
      console.log('✅ Subscription manager initialized');
    } catch (error) {
      console.error('Error initializing subscription manager:', error);
    }
  }

  async loadSubscriptions() {
    try {
      const { data: subscriptions, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      subscriptions?.forEach(sub => {
        this.subscriptions.set(sub.id, {
          userId: sub.user_id,
          eventTypes: sub.event_types || [],
          priceRange: {
            min: sub.min_price || 0,
            max: sub.max_price || Infinity
          },
          domainLength: {
            min: sub.min_length || 1,
            max: sub.max_length || 20
          },
          extensions: sub.extensions || [],
          notifications: sub.notifications || true,
          webhookUrl: sub.webhook_url,
          email: sub.email,
          createdAt: sub.created_at,
          updatedAt: sub.updated_at
        });
      });

      console.log(`✅ Loaded ${this.subscriptions.size} active subscriptions`);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    }
  }

  async loadUserPreferences() {
    try {
      const { data: preferences, error } = await supabase
        .from('user_preferences')
        .select('*');

      if (error) throw error;

      preferences?.forEach(pref => {
        this.userPreferences.set(pref.user_id, {
          language: pref.language || 'en',
          timezone: pref.timezone || 'UTC',
          notificationFrequency: pref.notification_frequency || 'immediate',
          maxNotificationsPerDay: pref.max_notifications_per_day || 10,
          preferredExtensions: pref.preferred_extensions || [],
          priceAlerts: pref.price_alerts || true,
          trendAlerts: pref.trend_alerts || true,
          expiredAlerts: pref.expired_alerts || true,
          createdAt: pref.created_at,
          updatedAt: pref.updated_at
        });
      });

      console.log(`✅ Loaded ${this.userPreferences.size} user preferences`);
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  }

  async createSubscription(userId, subscriptionData) {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          event_types: subscriptionData.eventTypes || [],
          min_price: subscriptionData.priceRange?.min || 0,
          max_price: subscriptionData.priceRange?.max || null,
          min_length: subscriptionData.domainLength?.min || 1,
          max_length: subscriptionData.domainLength?.max || 20,
          extensions: subscriptionData.extensions || [],
          notifications: subscriptionData.notifications || true,
          webhook_url: subscriptionData.webhookUrl || null,
          email: subscriptionData.email || null,
          is_active: true,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local cache
      this.subscriptions.set(data.id, {
        userId: data.user_id,
        eventTypes: data.event_types,
        priceRange: {
          min: data.min_price,
          max: data.max_price
        },
        domainLength: {
          min: data.min_length,
          max: data.max_length
        },
        extensions: data.extensions,
        notifications: data.notifications,
        webhookUrl: data.webhook_url,
        email: data.email,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      });

      console.log(`✅ Created subscription for user ${userId}`);
      return data;

    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  async updateSubscription(subscriptionId, updates) {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId)
        .select()
        .single();

      if (error) throw error;

      // Update local cache
      if (this.subscriptions.has(subscriptionId)) {
        this.subscriptions.set(subscriptionId, {
          ...this.subscriptions.get(subscriptionId),
          ...updates,
          updatedAt: new Date().toISOString()
        });
      }

      console.log(`✅ Updated subscription ${subscriptionId}`);
      return data;

    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  async deleteSubscription(subscriptionId) {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId);

      if (error) throw error;

      // Remove from local cache
      this.subscriptions.delete(subscriptionId);

      console.log(`✅ Deleted subscription ${subscriptionId}`);
      return true;

    } catch (error) {
      console.error('Error deleting subscription:', error);
      throw error;
    }
  }

  async createUserPreference(userId, preferenceData) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          language: preferenceData.language || 'en',
          timezone: preferenceData.timezone || 'UTC',
          notification_frequency: preferenceData.notificationFrequency || 'immediate',
          max_notifications_per_day: preferenceData.maxNotificationsPerDay || 10,
          preferred_extensions: preferenceData.preferredExtensions || [],
          price_alerts: preferenceData.priceAlerts || true,
          trend_alerts: preferenceData.trendAlerts || true,
          expired_alerts: preferenceData.expiredAlerts || true,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local cache
      this.userPreferences.set(userId, {
        language: data.language,
        timezone: data.timezone,
        notificationFrequency: data.notification_frequency,
        maxNotificationsPerDay: data.max_notifications_per_day,
        preferredExtensions: data.preferred_extensions,
        priceAlerts: data.price_alerts,
        trendAlerts: data.trend_alerts,
        expiredAlerts: data.expired_alerts,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      });

      console.log(`✅ Created preferences for user ${userId}`);
      return data;

    } catch (error) {
      console.error('Error creating user preference:', error);
      throw error;
    }
  }

  getMatchingSubscriptions(opportunity) {
    const matchingSubscriptions = [];

    for (const [id, subscription] of this.subscriptions) {
      if (this.matchesSubscription(opportunity, subscription)) {
        matchingSubscriptions.push({
          id,
          ...subscription
        });
      }
    }

    return matchingSubscriptions;
  }

  matchesSubscription(opportunity, subscription) {
    // Check event type
    if (subscription.eventTypes.length > 0 && !subscription.eventTypes.includes(opportunity.type)) {
      return false;
    }

    // Check price range
    if (opportunity.value) {
      if (opportunity.value < subscription.priceRange.min || 
          opportunity.value > subscription.priceRange.max) {
        return false;
      }
    }

    // Check domain length
    const domainLength = opportunity.domain.length;
    if (domainLength < subscription.domainLength.min || 
        domainLength > subscription.domainLength.max) {
      return false;
    }

    // Check extensions
    if (subscription.extensions.length > 0) {
      const extension = opportunity.domain.split('.').pop();
      if (!subscription.extensions.includes(extension)) {
        return false;
      }
    }

    return true;
  }

  async sendNotification(subscription, opportunity) {
    try {
      const userPrefs = this.userPreferences.get(subscription.userId);
      
      if (!userPrefs || !userPrefs.notificationFrequency) {
        return;
      }

      // Check notification limits
      if (!this.canSendNotification(subscription.userId)) {
        return;
      }

      const notification = {
        type: 'domain_opportunity',
        subscriptionId: subscription.id,
        userId: subscription.userId,
        opportunity: opportunity,
        timestamp: new Date().toISOString(),
        channels: []
      };

      // Add webhook notification
      if (subscription.webhookUrl) {
        notification.channels.push('webhook');
        await this.sendWebhookNotification(subscription.webhookUrl, opportunity);
      }

      // Add email notification
      if (subscription.email) {
        notification.channels.push('email');
        await this.sendEmailNotification(subscription.email, opportunity);
      }

      // Add to notification queue for processing
      this.notificationQueue.push(notification);

      // Update notification count
      await this.updateNotificationCount(subscription.userId);

      console.log(`✅ Sent notification for opportunity ${opportunity.domain} to user ${subscription.userId}`);

    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  async sendWebhookNotification(webhookUrl, opportunity) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'domain_opportunity',
          opportunity: opportunity,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      }

      console.log(`✅ Webhook notification sent to ${webhookUrl}`);
    } catch (error) {
      console.error('Error sending webhook notification:', error);
    }
  }

  async sendEmailNotification(email, opportunity) {
    try {
      // This would integrate with an email service like SendGrid, AWS SES, etc.
      console.log(`📧 Email notification would be sent to ${email} for ${opportunity.domain}`);
      
      // For now, just log the email notification
      // In a real implementation, you would send an actual email
      
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }

  canSendNotification(userId) {
    const userPrefs = this.userPreferences.get(userId);
    if (!userPrefs) return true;

    // Check daily notification limit
    const today = new Date().toDateString();
    const userNotifications = this.notificationQueue.filter(n => 
      n.userId === userId && 
      n.timestamp.startsWith(today)
    );

    return userNotifications.length < userPrefs.maxNotificationsPerDay;
  }

  async updateNotificationCount(userId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      await supabase
        .from('user_notification_counts')
        .upsert({
          user_id: userId,
          date: today,
          count: 1,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,date'
        });
    } catch (error) {
      console.error('Error updating notification count:', error);
    }
  }

  async processOpportunity(opportunity) {
    try {
      const matchingSubscriptions = this.getMatchingSubscriptions(opportunity);
      
      console.log(`Found ${matchingSubscriptions.length} matching subscriptions for ${opportunity.domain}`);

      // Send notifications to all matching subscriptions
      for (const subscription of matchingSubscriptions) {
        await this.sendNotification(subscription, opportunity);
      }

      return matchingSubscriptions.length;

    } catch (error) {
      console.error('Error processing opportunity:', error);
      return 0;
    }
  }

  getSubscriptionStats() {
    const stats = {
      totalSubscriptions: this.subscriptions.size,
      totalUsers: new Set(Array.from(this.subscriptions.values()).map(s => s.userId)).size,
      eventTypeDistribution: {},
      priceRangeDistribution: {},
      extensionDistribution: {}
    };

    // Calculate distributions
    for (const subscription of this.subscriptions.values()) {
      // Event types
      subscription.eventTypes.forEach(type => {
        stats.eventTypeDistribution[type] = (stats.eventTypeDistribution[type] || 0) + 1;
      });

      // Price ranges
      const range = `${subscription.priceRange.min}-${subscription.priceRange.max}`;
      stats.priceRangeDistribution[range] = (stats.priceRangeDistribution[range] || 0) + 1;

      // Extensions
      subscription.extensions.forEach(ext => {
        stats.extensionDistribution[ext] = (stats.extensionDistribution[ext] || 0) + 1;
      });
    }

    return stats;
  }

  async cleanupOldNotifications() {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      // Remove old notifications from queue
      this.notificationQueue = this.notificationQueue.filter(
        notification => new Date(notification.timestamp) > oneWeekAgo
      );

      console.log(`✅ Cleaned up old notifications, ${this.notificationQueue.length} remaining`);
    } catch (error) {
      console.error('Error cleaning up notifications:', error);
    }
  }
}

export default SubscriptionManager;
