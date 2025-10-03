# 🤖 Domain Twitter Bot

An intelligent Twitter bot that automatically tracks and shares valuable domain name opportunities using AI-powered content generation and real-time domain market data.

## 🎯 Features

### **Real-Time Domain Monitoring**
- **High-Value Sales**: Tracks domains sold for $1000+
- **Trending Domains**: Identifies domains with high activity (5+ events in 24h)
- **Expired Domains**: Alerts on recently expired domains
- **New Mints**: Highlights newly registered domains
- **Volume Spikes**: Detects unusual market activity

### **AI-Powered Content Generation**
- **OpenAI GPT-4 Integration**: Generates engaging, actionable tweets
- **Smart Categorization**: Automatically categorizes opportunities by type
- **Brandability Analysis**: Identifies brandable domain names
- **Rare Extension Detection**: Finds domains with uncommon extensions

### **Automated Posting**
- **Scheduled Tweets**: Posts every 30 minutes with new opportunities
- **Daily Summaries**: Comprehensive market analysis at 9 AM daily
- **Engagement Tracking**: Monitors tweet performance and engagement
- **Smart Filtering**: Avoids spam and focuses on high-quality opportunities

## 🚀 Quick Start

### **1. Installation**
```bash
cd domain-monitor/twitter-bot
npm install
```

### **2. Configuration**
```bash
cp env.example .env
# Edit .env with your API keys
```

### **3. Database Setup**
```bash
npm run setup
```

### **4. Test the Bot**
```bash
npm test
```

### **5. Start the Bot**
```bash
npm start
```

## 🔧 Configuration

### **Required API Keys**

#### **Twitter API v2**
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app
3. Generate API keys and access tokens
4. Add to `.env` file

#### **OpenAI API**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create API key
3. Add to `.env` file

#### **Supabase** (Same as domain-monitor)
- Uses existing Supabase configuration

### **Environment Variables**
```env
# Twitter API
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

# Optional Configuration
HIGH_VALUE_THRESHOLD=1000
TRENDING_THRESHOLD=5
TWEET_INTERVAL_MINUTES=30
```

## 📊 Database Schema

### **twitter_tweets**
Stores all bot tweets and engagement data
```sql
- tweet_id (TEXT) - Twitter tweet ID
- content (TEXT) - Tweet content
- opportunities_data (JSONB) - Associated opportunities
- engagement_metrics (JSONB) - Likes, retweets, etc.
- created_at (TIMESTAMP) - Tweet timestamp
```

### **twitter_analytics**
Daily performance metrics
```sql
- date (DATE) - Analytics date
- total_tweets (INTEGER) - Tweets posted
- total_engagement (INTEGER) - Total engagement
- high_value_alerts (INTEGER) - High-value alerts sent
- trending_alerts (INTEGER) - Trending alerts sent
```

### **twitter_opportunities**
Tracks specific domain opportunities
```sql
- domain_name (TEXT) - Domain name
- opportunity_type (TEXT) - Type of opportunity
- value_usd (DECIMAL) - Domain value
- activity_count (INTEGER) - Activity level
- status (TEXT) - Opportunity status
```

## 🎨 Tweet Examples

### **High-Value Sales**
```
💰 HIGH-VALUE ALERT: example.com sold for $5,000! 

This premium .com domain represents excellent ROI potential. 

#DomainInvesting #Web3 #DigitalAssets #HighValue
```

### **Trending Domains**
```
🔥 TRENDING: test.shib with 8 recent events!

High activity indicates strong market interest. 

#DomainTrends #Web3 #DigitalAssets #Trending
```

### **Expired Domains**
```
⏰ EXPIRED DOMAIN: expired.com is now available!

Recently expired domains often represent great opportunities.

#ExpiredDomains #Web3 #DigitalAssets #Opportunity
```

### **Daily Summary**
```
📊 DAILY DOMAIN MARKET SUMMARY

• 47 total events
• 3 high-value sales ($1K+)
• 12 new mints
• 5 expired domains
• Top trending: example.shib

#DomainMarket #Web3 #DigitalAssets #DailySummary
```

## 🤖 Bot Intelligence

### **Opportunity Detection**
- **Price Analysis**: Extracts prices from event data
- **Activity Tracking**: Monitors domain activity levels
- **Trend Analysis**: Identifies emerging patterns
- **Rarity Assessment**: Finds unique and valuable domains

### **Content Generation**
- **AI-Powered**: Uses GPT-4 for engaging content
- **Context-Aware**: Considers market conditions
- **Action-Oriented**: Focuses on actionable insights
- **Brand-Safe**: Maintains professional tone

### **Smart Scheduling**
- **Peak Times**: Posts during high-engagement hours
- **Frequency Control**: Avoids spam with smart intervals
- **Content Variety**: Mixes different opportunity types
- **Engagement Optimization**: Tracks and optimizes performance

## 📈 Analytics & Performance

### **Engagement Metrics**
- Tweet impressions
- Likes and retweets
- Click-through rates
- Follower growth

### **Opportunity Tracking**
- High-value alerts sent
- Trending domain alerts
- Expired domain notifications
- New mint highlights

### **Market Intelligence**
- Daily market summaries
- Volume spike detection
- Rare extension identification
- Brandability scoring

## 🔄 Integration with Domain Monitor

The Twitter bot seamlessly integrates with your existing domain monitoring system:

1. **Data Source**: Uses the same `domain_events` table
2. **Real-Time Updates**: Processes new events as they arrive
3. **Unified Analytics**: Shares analytics with main system
4. **Consistent Branding**: Maintains Iris brand voice

## 🛠️ Advanced Features

### **Custom Filters**
- Set custom price thresholds
- Filter by domain extensions
- Exclude specific domains
- Custom trending criteria

### **Engagement Optimization**
- A/B test different content styles
- Optimize posting times
- Track performance metrics
- Adjust strategy based on data

### **Community Building**
- Respond to mentions
- Engage with followers
- Share educational content
- Build domain investor community

## 🚨 Error Handling

- **API Failures**: Graceful degradation with retry logic
- **Rate Limiting**: Respects Twitter API limits
- **Content Validation**: Ensures tweets meet Twitter guidelines
- **Database Errors**: Continues operation with error logging

## 📞 Support

For issues or questions:
1. Check the logs for error details
2. Verify API credentials are correct
3. Ensure database tables are created
4. Test individual components with `npm test`

---

**Made with ❤️ by the Iris Team**

*Building the future of domain investment intelligence*



