# Coxy Optimized Domain Monitor & Twitter Bot

An intelligent, AI-powered domain monitoring and Twitter bot system that follows an optimized flow for discovering, analyzing, and sharing actionable domain investment opportunities.

## 🎯 Optimized Flow Implementation

This implementation follows the provided flowchart with the following components:

```
Domain Events Monitor → Event Processing System → Twitter Bot → Landing Page → User Actions
```

### **Flow Components:**

1. **Domain Events Monitor** - Monitors blockchain for domain events
2. **Event Processing System** - Analyzes and categorizes events by type
3. **Twitter Bot** - Posts actionable tweets with landing page links
4. **Landing Page** - User interface for domain actions
5. **User Actions** - Buy, sell, trade, subscribe functionality
6. **Subscription Manager** - Handles user preferences and notifications

## 🚀 Key Features

### **Enhanced Event Processing**
- **Intelligent Filtering**: Filters events by criteria (price, length, extensions)
- **Priority Scoring**: Ranks opportunities by value and potential
- **Real-time Analysis**: Processes events as they occur
- **Multi-category Detection**: Expired, sales, trends, listings

### **AI-Powered Content Generation**
- **Context-Aware Tweets**: Uses domain data for relevant content
- **Actionable Content**: Includes clear calls to action
- **Landing Page Integration**: Tracks user engagement
- **Brand Voice**: Maintains consistent "Coxy" personality

### **Advanced Analytics & Tracking**
- **Conversion Funnel**: Tracks tweet clicks → landing page → actions
- **Performance Metrics**: Monitors engagement and conversions
- **User Journey Tracking**: Tracks complete user flow
- **A/B Testing**: Optimizes content based on performance

### **Subscription Management**
- **User Preferences**: Customizable notification settings
- **Webhook Integration**: Real-time notifications
- **Email Alerts**: Direct user communication
- **Smart Filtering**: Matches opportunities to user criteria

## 📁 File Structure

```
domain-monitor/twitter-bot/
├── coxy-optimized-bot.mjs          # Main optimized bot
├── enhanced-event-processor.mjs    # Event processing system
├── subscription-manager.mjs        # User subscription management
├── landing-page-tracker.mjs        # User action tracking
├── opportunity-analyzer.mjs        # Opportunity analysis
├── index.mjs                       # Original bot (backup)
├── test-enhanced.mjs              # Testing suite
├── setup-enhanced.mjs             # Setup script
├── migrate-schema.mjs             # Database migration
└── supabase-enhanced-schema.sql   # Database schema
```

## 🛠️ Installation & Setup

### **1. Prerequisites**
- Node.js 18+
- Twitter Developer Account
- OpenAI API key
- Supabase account with domain monitoring data

### **2. Install Dependencies**
```bash
cd domain-monitor/twitter-bot
npm install
```

### **3. Setup Database**
```bash
# Run the enhanced schema in Supabase dashboard
# Or use the migration script
npm run migrate
```

### **4. Configure Environment**
```env
# Twitter API Configuration
TWITTER_API_KEY=your_twitter_api_key_here
TWITTER_API_SECRET=your_twitter_api_secret_here
TWITTER_ACCESS_TOKEN=your_twitter_access_token_here
TWITTER_ACCESS_SECRET=your_twitter_access_secret_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Frontend Configuration
FRONTEND_URL=https://coxy.onrender.com

# Bot Configuration
HIGH_VALUE_THRESHOLD=1000
TRENDING_THRESHOLD=5
TWEET_INTERVAL_MINUTES=30
MAX_TWEETS_PER_DAY=20
```

### **5. Test the Bot**
```bash
npm test
```

### **6. Start the Bot**
```bash
npm start
```

## 🔄 Optimized Flow Implementation

### **Step 1: Domain Events Monitor**
- Monitors blockchain for domain events in real-time
- Captures: expired domains, sales, trends, listings
- Filters by criteria: price, length, extensions, brandability

### **Step 2: Event Processing System**
- **Expired Domains**: Identifies premium domains becoming available
- **Domain Sales**: Tracks high-value sales and price analysis
- **Market Trends**: Detects trending domains with high activity
- **Domain Listings**: Monitors new domain listings

### **Step 3: Twitter Bot Integration**
- **AI Content Generation**: Creates engaging, actionable tweets
- **Priority-Based Selection**: Only tweets high-value opportunities
- **Landing Page Links**: Includes tracked URLs for user engagement
- **Anti-Spam Protection**: Prevents over-tweeting

### **Step 4: Landing Page Integration**
- **User Action Tracking**: Tracks clicks, views, actions
- **Conversion Funnel**: Monitors tweet → landing page → action flow
- **Performance Analytics**: Measures engagement and conversions
- **A/B Testing**: Optimizes content based on performance

### **Step 5: User Actions**
- **Buy Interface**: Domain purchase functionality
- **Sell Interface**: Domain listing functionality
- **Trade Interface**: Domain trading platform
- **Subscription Management**: User preference management

## 📊 Analytics & Tracking

### **Conversion Funnel Metrics**
- Tweet clicks → Landing page views
- Landing page views → User actions
- User actions → Conversions
- Overall conversion rates

### **Performance Metrics**
- Total tweets posted
- Total engagement received
- Total conversions generated
- Average engagement rate

### **Opportunity Performance**
- Top performing domains
- Best performing tweet types
- User journey analysis
- Conversion optimization

## 🎯 Sample Tweet Types

### **High-Value Expired Domains**
```
⏰ URGENT: premium.com just expired! 
💎 5-character .com domain available now
🚀 Estimated value: $50,000+
🔗 Check availability: https://coxy.onrender.com/domain/premium.com?type=expired

#DomainInvesting #Web3 #DigitalAssets #Coxy
```

### **High-Value Sales**
```
💰 BREAKING: crypto.io sold for $125,000!
🔥 Premium .io domain with massive potential
📈 Similar domains trending now
🔗 Find similar opportunities: https://coxy.onrender.com/domain/crypto.io?type=similar

#DomainInvesting #Web3 #DigitalAssets #Coxy
```

### **Trending Domains**
```
🔥 TRENDING: nft.eth with 8 recent events!
📈 High activity indicates strong interest
💎 Perfect for Web3 projects
🔗 Track this domain: https://coxy.onrender.com/domain/nft.eth?type=trending

#DomainTrends #Web3 #DigitalAssets #Coxy
```

### **New Listings**
```
🆕 NEW LISTING: startup.ai for $15,000!
✨ Brandable domain perfect for AI companies
🎯 High brandability score: 95/100
🔗 View listing: https://coxy.onrender.com/domain/startup.ai?type=listing

#DomainInvesting #Web3 #DigitalAssets #Coxy
```

## 🔧 Configuration Options

### **Event Processing**
- `HIGH_VALUE_THRESHOLD`: Minimum price for high-value alerts
- `TRENDING_THRESHOLD`: Minimum events for trending detection
- `MIN_DOMAIN_LENGTH`: Minimum domain length to consider
- `MAX_DOMAIN_LENGTH`: Maximum domain length to consider

### **Twitter Bot**
- `TWEET_INTERVAL_MINUTES`: Minutes between opportunity tweets
- `MAX_TWEETS_PER_DAY`: Maximum tweets per day
- `MIN_PRIORITY_SCORE`: Minimum priority score to tweet
- `ENABLE_DAILY_SUMMARY`: Enable daily summary tweets

### **Analytics**
- `TRACK_ENGAGEMENT`: Track tweet engagement metrics
- `TRACK_CONVERSIONS`: Track user conversions
- `CLEANUP_INTERVAL`: Days to keep tracking data
- `PERFORMANCE_REPORTING`: Generate performance reports

## 📈 Performance Optimization

### **Event Processing Optimization**
- Parallel processing of multiple event types
- Intelligent caching of processed data
- Priority-based opportunity selection
- Real-time analytics updates

### **Twitter Bot Optimization**
- AI-powered content generation
- Engagement-based content selection
- A/B testing of tweet formats
- Performance-based scheduling

### **Landing Page Optimization**
- Conversion tracking and analytics
- User journey analysis
- A/B testing of landing pages
- Performance-based optimization

## 🛡️ Error Handling & Monitoring

### **Robust Error Handling**
- Graceful degradation on API failures
- Automatic retry mechanisms
- Comprehensive error logging
- Health check endpoints

### **Monitoring & Alerts**
- Real-time performance monitoring
- Automated alerting for issues
- Performance metrics dashboard
- Health status reporting

## 🚀 Deployment

### **Production Deployment**
1. Set up production environment variables
2. Configure database with production schema
3. Set up monitoring and alerting
4. Deploy with process manager (PM2)
5. Configure auto-restart and health checks

### **Scaling Considerations**
- Horizontal scaling with multiple bot instances
- Database optimization for high volume
- CDN for landing page assets
- Load balancing for API endpoints

## 📞 Support & Maintenance

### **Regular Maintenance**
- Daily performance reviews
- Weekly analytics reports
- Monthly optimization updates
- Quarterly feature updates

### **Troubleshooting**
- Check API connection status
- Verify database connectivity
- Review error logs
- Monitor performance metrics

---

**Built with ❤️ by the Coxy Team**

*Optimizing domain investment intelligence for the Web3 ecosystem*

