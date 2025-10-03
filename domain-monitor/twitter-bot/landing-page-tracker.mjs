import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

class LandingPageTracker {
  constructor() {
    this.trackingEvents = new Map();
    this.userSessions = new Map();
    this.conversionFunnel = {
      tweet_click: 0,
      landing_page_view: 0,
      action_attempt: 0,
      action_completed: 0
    };
  }

  async initialize() {
    console.log('🔄 Initializing landing page tracker...');
    
    try {
      await this.setupTrackingTables();
      console.log('✅ Landing page tracker initialized');
    } catch (error) {
      console.error('Error initializing landing page tracker:', error);
    }
  }

  async setupTrackingTables() {
    // This would create tracking tables if they don't exist
    // For now, we'll assume they exist
    console.log('📊 Tracking tables ready');
  }

  async trackTweetClick(tweetId, userId, opportunity) {
    try {
      const trackingData = {
        event_type: 'tweet_click',
        tweet_id: tweetId,
        user_id: userId,
        opportunity_id: opportunity.domain,
        opportunity_type: opportunity.type,
        opportunity_value: opportunity.value,
        action_url: opportunity.actionUrl,
        timestamp: new Date().toISOString(),
        user_agent: 'twitter_bot',
        referrer: 'twitter'
      };

      await supabase
        .from('user_tracking_events')
        .insert(trackingData);

      this.conversionFunnel.tweet_click++;
      console.log(`📊 Tracked tweet click for ${opportunity.domain}`);

    } catch (error) {
      console.error('Error tracking tweet click:', error);
    }
  }

  async trackLandingPageView(sessionId, userId, opportunity, pageData) {
    try {
      const trackingData = {
        event_type: 'landing_page_view',
        session_id: sessionId,
        user_id: userId,
        opportunity_id: opportunity.domain,
        opportunity_type: opportunity.type,
        opportunity_value: opportunity.value,
        page_url: pageData.url,
        page_title: pageData.title,
        timestamp: new Date().toISOString(),
        user_agent: pageData.userAgent,
        referrer: pageData.referrer,
        utm_source: pageData.utmSource || 'twitter',
        utm_medium: pageData.utmMedium || 'social',
        utm_campaign: pageData.utmCampaign || 'domain_opportunity'
      };

      await supabase
        .from('user_tracking_events')
        .insert(trackingData);

      this.conversionFunnel.landing_page_view++;
      console.log(`📊 Tracked landing page view for ${opportunity.domain}`);

    } catch (error) {
      console.error('Error tracking landing page view:', error);
    }
  }

  async trackUserAction(sessionId, userId, action, opportunity, actionData) {
    try {
      const trackingData = {
        event_type: 'user_action',
        session_id: sessionId,
        user_id: userId,
        action_type: action, // 'buy', 'sell', 'trade', 'subscribe', 'contact'
        opportunity_id: opportunity.domain,
        opportunity_type: opportunity.type,
        opportunity_value: opportunity.value,
        action_data: actionData,
        timestamp: new Date().toISOString(),
        success: actionData.success || false,
        error_message: actionData.error || null
      };

      await supabase
        .from('user_tracking_events')
        .insert(trackingData);

      this.conversionFunnel.action_attempt++;
      
      if (actionData.success) {
        this.conversionFunnel.action_completed++;
      }

      console.log(`📊 Tracked user action: ${action} for ${opportunity.domain}`);

    } catch (error) {
      console.error('Error tracking user action:', error);
    }
  }

  async trackConversion(sessionId, userId, opportunity, conversionData) {
    try {
      const trackingData = {
        event_type: 'conversion',
        session_id: sessionId,
        user_id: userId,
        opportunity_id: opportunity.domain,
        opportunity_type: opportunity.type,
        opportunity_value: opportunity.value,
        conversion_type: conversionData.type, // 'purchase', 'listing', 'trade'
        conversion_value: conversionData.value,
        conversion_data: conversionData,
        timestamp: new Date().toISOString(),
        success: true
      };

      await supabase
        .from('user_tracking_events')
        .insert(trackingData);

      console.log(`🎉 Tracked conversion: ${conversionData.type} for ${opportunity.domain}`);

    } catch (error) {
      console.error('Error tracking conversion:', error);
    }
  }

  async trackEngagement(sessionId, userId, engagementType, data) {
    try {
      const trackingData = {
        event_type: 'engagement',
        session_id: sessionId,
        user_id: userId,
        engagement_type: engagementType, // 'scroll', 'click', 'hover', 'form_fill'
        engagement_data: data,
        timestamp: new Date().toISOString()
      };

      await supabase
        .from('user_tracking_events')
        .insert(trackingData);

      console.log(`📊 Tracked engagement: ${engagementType}`);

    } catch (error) {
      console.error('Error tracking engagement:', error);
    }
  }

  async getConversionStats(timeframe = '24h') {
    try {
      let timeFilter;
      const now = new Date();
      
      switch (timeframe) {
        case '1h':
          timeFilter = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
          break;
        case '24h':
          timeFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
          break;
        case '7d':
          timeFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
          break;
        case '30d':
          timeFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
          break;
        default:
          timeFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      }

      const { data: events, error } = await supabase
        .from('user_tracking_events')
        .select('event_type, opportunity_type, action_type, conversion_type, opportunity_value, timestamp')
        .gte('timestamp', timeFilter);

      if (error) throw error;

      const stats = {
        totalEvents: events.length,
        tweetClicks: events.filter(e => e.event_type === 'tweet_click').length,
        landingPageViews: events.filter(e => e.event_type === 'landing_page_view').length,
        userActions: events.filter(e => e.event_type === 'user_action').length,
        conversions: events.filter(e => e.event_type === 'conversion').length,
        conversionRate: 0,
        averageOpportunityValue: 0,
        topOpportunityTypes: {},
        topActionTypes: {},
        topConversionTypes: {}
      };

      // Calculate conversion rate
      if (stats.landingPageViews > 0) {
        stats.conversionRate = (stats.conversions / stats.landingPageViews) * 100;
      }

      // Calculate average opportunity value
      const valueEvents = events.filter(e => e.opportunity_value && e.opportunity_value > 0);
      if (valueEvents.length > 0) {
        stats.averageOpportunityValue = valueEvents.reduce((sum, e) => sum + e.opportunity_value, 0) / valueEvents.length;
      }

      // Calculate distributions
      events.forEach(event => {
        if (event.opportunity_type) {
          stats.topOpportunityTypes[event.opportunity_type] = (stats.topOpportunityTypes[event.opportunity_type] || 0) + 1;
        }
        if (event.action_type) {
          stats.topActionTypes[event.action_type] = (stats.topActionTypes[event.action_type] || 0) + 1;
        }
        if (event.conversion_type) {
          stats.topConversionTypes[event.conversion_type] = (stats.topConversionTypes[event.conversion_type] || 0) + 1;
        }
      });

      return stats;

    } catch (error) {
      console.error('Error getting conversion stats:', error);
      return null;
    }
  }

  async getOpportunityPerformance(opportunityId) {
    try {
      const { data: events, error } = await supabase
        .from('user_tracking_events')
        .select('*')
        .eq('opportunity_id', opportunityId)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      const performance = {
        opportunityId,
        totalEvents: events.length,
        tweetClicks: events.filter(e => e.event_type === 'tweet_click').length,
        landingPageViews: events.filter(e => e.event_type === 'landing_page_view').length,
        userActions: events.filter(e => e.event_type === 'user_action').length,
        conversions: events.filter(e => e.event_type === 'conversion').length,
        conversionRate: 0,
        engagementRate: 0,
        averageSessionDuration: 0,
        topActions: {},
        userJourney: events.map(e => ({
          eventType: e.event_type,
          timestamp: e.timestamp,
          actionType: e.action_type,
          success: e.success
        }))
      };

      // Calculate rates
      if (performance.landingPageViews > 0) {
        performance.conversionRate = (performance.conversions / performance.landingPageViews) * 100;
        performance.engagementRate = (performance.userActions / performance.landingPageViews) * 100;
      }

      // Calculate average session duration
      const sessions = new Set(events.map(e => e.session_id));
      performance.averageSessionDuration = sessions.size > 0 ? 
        events.length / sessions.size : 0;

      // Calculate top actions
      events.forEach(event => {
        if (event.action_type) {
          performance.topActions[event.action_type] = (performance.topActions[event.action_type] || 0) + 1;
        }
      });

      return performance;

    } catch (error) {
      console.error('Error getting opportunity performance:', error);
      return null;
    }
  }

  async getTopPerformingOpportunities(limit = 10) {
    try {
      const { data: events, error } = await supabase
        .from('user_tracking_events')
        .select('opportunity_id, opportunity_type, opportunity_value, event_type, timestamp')
        .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const opportunityStats = {};

      events.forEach(event => {
        if (!opportunityStats[event.opportunity_id]) {
          opportunityStats[event.opportunity_id] = {
            opportunityId: event.opportunity_id,
            opportunityType: event.opportunity_type,
            opportunityValue: event.opportunity_value,
            tweetClicks: 0,
            landingPageViews: 0,
            conversions: 0,
            conversionRate: 0
          };
        }

        const stats = opportunityStats[event.opportunity_id];
        
        if (event.event_type === 'tweet_click') stats.tweetClicks++;
        if (event.event_type === 'landing_page_view') stats.landingPageViews++;
        if (event.event_type === 'conversion') stats.conversions++;

        // Calculate conversion rate
        if (stats.landingPageViews > 0) {
          stats.conversionRate = (stats.conversions / stats.landingPageViews) * 100;
        }
      });

      // Sort by conversion rate and return top performers
      return Object.values(opportunityStats)
        .sort((a, b) => b.conversionRate - a.conversionRate)
        .slice(0, limit);

    } catch (error) {
      console.error('Error getting top performing opportunities:', error);
      return [];
    }
  }

  async generateActionUrl(domain, type, campaign = 'domain_opportunity') {
    const baseUrl = process.env.FRONTEND_URL || 'https://coxy.com';
    const params = new URLSearchParams({
      domain: domain,
      type: type,
      utm_source: 'twitter',
      utm_medium: 'social',
      utm_campaign: campaign,
      utm_content: type,
      timestamp: Date.now().toString()
    });

    return `${baseUrl}/domain/${encodeURIComponent(domain)}?${params.toString()}`;
  }

  async cleanupOldTrackingData() {
    try {
      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
      
      const { error } = await supabase
        .from('user_tracking_events')
        .delete()
        .lt('timestamp', oneMonthAgo.toISOString());

      if (error) throw error;

      console.log('✅ Cleaned up old tracking data');
    } catch (error) {
      console.error('Error cleaning up tracking data:', error);
    }
  }

  getConversionFunnel() {
    return {
      ...this.conversionFunnel,
      clickToViewRate: this.conversionFunnel.landing_page_view / Math.max(this.conversionFunnel.tweet_click, 1) * 100,
      viewToActionRate: this.conversionFunnel.action_attempt / Math.max(this.conversionFunnel.landing_page_view, 1) * 100,
      actionToConversionRate: this.conversionFunnel.action_completed / Math.max(this.conversionFunnel.action_attempt, 1) * 100
    };
  }
}

export default LandingPageTracker;

