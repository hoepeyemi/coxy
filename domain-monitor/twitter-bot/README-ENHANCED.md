# Enhanced Domain Monitor Twitter Bot

An intelligent Twitter bot that automatically discovers and shares actionable domain investment opportunities using AI-powered analysis and real-time domain monitoring data.

## 🚀 Features

### **Intelligent Opportunity Detection**
- **High-Value Domains**: Automatically detects domains sold for $1000+
- **Trending Domains**: Identifies domains with high activity (5+ events in 24h)
- **Expired Domains**: Alerts when premium domains become available
- **Short Domains**: Highlights valuable short domain names (≤6 characters)
- **Brandable Domains**: Identifies domains with high brandability scores
- **New Mints**: Tracks newly minted domain tokens

### **AI-Powered Content Generation**
- **OpenAI GPT-4 Integration**: Generates engaging, actionable tweets
- **Context-Aware**: Uses domain data to create relevant content
- **Brand Voice**: Maintains consistent "Coxy" brand personality
- **Hashtag Optimization**: Automatically includes relevant hashtags
- **Character Optimization**: Ensures tweets stay under 280 characters

### **Smart Scheduling**
- **Configurable Intervals**: Tweet every 30 minutes (configurable)
- **Anti-Spam Protection**: Prevents over-tweeting with intelligent filtering
- **Daily Summaries**: Comprehensive market analysis at 9 AM
- **Weekly Analysis**: Deep market insights every Monday at 10 AM
- **Priority-Based**: Only tweets high-value opportunities

### **Advanced Analytics**
- **Real-Time Data**: Uses live domain monitoring data from Supabase
- **Market Trends**: Tracks domain activity patterns and trends
- **Engagement Metrics**: Monitors tweet performance and engagement
- **Opportunity Scoring**: Ranks opportunities by value and potential

## 📋 Prerequisites

- Node.js 18+ 
- Twitter Developer Account with API access
- OpenAI API key
- Supabase account with domain monitoring data
- Domain monitor running and collecting data

## 🛠️ Installation

1. **Navigate to the Twitter bot directory:**
   ```bash
   cd domain-monitor/twitter-bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the enhanced setup:**
   ```bash
   npm run setup
   ```

4. **Configure your environment:**
   - Update the `.env` file with your API keys
   - Ensure your Supabase database has domain monitoring data

## ⚙️ Configuration

### Environment Variables

Create a `.env` file with the following variables:

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

# Bot Configuration (Optional)
HIGH_VALUE_THRESHOLD=1000
TRENDING_THRESHOLD=5
TWEET_INTERVAL_MINUTES=30
MAX_TWEETS_PER_DAY=20
```

### Bot Settings

The bot can be configured through environment variables or the database:

- **HIGH_VALUE_THRESHOLD**: Minimum price for high-value alerts (default: $1000)
- **TRENDING_THRESHOLD**: Minimum events for trending detection (default: 5)
- **TWEET_INTERVAL_MINUTES**: Minutes between opportunity tweets (default: 30)
- **MAX_TWEETS_PER_DAY**: Maximum tweets per day (default: 20)

## 🚀 Usage

### Start the Bot

```bash
# Start the bot
npm start

# Start in development mode (with auto-restart)
npm run dev
```

### Test the Bot

```bash
# Run comprehensive tests
npm test

# Test API connections and functionality
npm run test
```

### Monitor the Bot

The bot will log its activity to the console:

```
🤖 Starting Domain Twitter Bot...
✅ Twitter API connected as @your_username
✅ OpenAI API connected
✅ Supabase API connected
🚀 Bot started successfully!
📊 Configuration: High-value threshold: $1000, Trending threshold: 5 events
🔍 Looking for domain opportunities...
✅ Tweet posted: 1234567890
📝 Content: 💰 HIGH-VALUE ALERT: example.com sold for $5000! 🚀
```

## 📊 Database Schema

The bot uses several Supabase tables:

### `twitter_tweets`
Stores all posted tweets and their associated opportunity data.

### `twitter_analytics`
Tracks daily bot performance and engagement metrics.

### `twitter_bot_config`
Stores bot configuration settings.

## 🎯 Tweet Types

### 1. High-Value Alerts
```
💰 HIGH-VALUE ALERT: example.com sold for $5000! 🚀

#DomainInvesting #Web3 #DigitalAssets #Coxy
```

### 2. Trending Domains
```
🔥 TRENDING: crypto.eth with 8 recent events! 📈

#DomainTrends #Web3 #DigitalAssets #Coxy
```

### 3. Expired Domains
```
⏰ EXPIRED: premium.com is now available! 💎

#DomainInvesting #Web3 #DigitalAssets #Coxy
```

### 4. Short Domains
```
🎯 SHORT DOMAIN: ai.com (5 chars) - Premium opportunity! 💎

#DomainInvesting #Web3 #DigitalAssets #Coxy
```

### 5. Brandable Domains
```
✨ BRANDABLE: startup.io (Score: 95/100) - Perfect for branding! 🎨

#DomainInvesting #Web3 #DigitalAssets #Coxy
```

### 6. Daily Summaries
```
📊 Daily Domain Market Update:

• 47 new events today
• 3 high-value sales ($2.1M total)
• 12 new mints
• 5 expired domains

Top performer: crypto.eth (15 events)
Market trend: Growing 📈

#DomainInvesting #Web3 #Coxy
```

## 🔧 Advanced Features

### Opportunity Scoring
The bot uses sophisticated algorithms to score opportunities:

- **High-Value Score**: Based on sale price and rarity
- **Trending Score**: Based on activity frequency and recency
- **Brandability Score**: Based on pronounceability, length, and character patterns
- **Short Domain Score**: Based on length and extension value

### Anti-Spam Protection
- Minimum 15-minute intervals between tweets
- Priority-based filtering (only high-value opportunities)
- Daily tweet limits
- Duplicate detection

### Real-Time Monitoring
- Monitors domain events in real-time
- Processes opportunities as they occur
- Maintains up-to-date market intelligence

## 📈 Analytics & Monitoring

### Console Logs
The bot provides detailed console output for monitoring:

- API connection status
- Opportunity detection results
- Tweet generation and posting
- Error handling and recovery

### Database Analytics
Track bot performance through Supabase:

```sql
-- View recent tweets
SELECT * FROM twitter_tweets 
ORDER BY created_at DESC 
LIMIT 10;

-- View daily analytics
SELECT * FROM twitter_analytics 
ORDER BY date DESC;

-- View bot configuration
SELECT * FROM twitter_bot_config;
```

## 🛠️ Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify API keys in `.env` file
   - Check API quotas and limits
   - Ensure proper permissions

2. **No Opportunities Found**
   - Verify domain monitor is running
   - Check Supabase data availability
   - Adjust threshold settings

3. **Tweet Generation Failures**
   - Check OpenAI API key and quota
   - Verify internet connectivity
   - Review error logs

### Debug Mode

Run the bot with debug logging:

```bash
DEBUG=* npm start
```

### Manual Testing

Test individual components:

```bash
# Test opportunity analysis only
node -e "import('./opportunity-analyzer.mjs').then(m => new m.default().getTopOpportunities(5).then(console.log))"

# Test tweet generation only
node test-enhanced.mjs
```

## 🔒 Security

- API keys stored in environment variables
- No sensitive data logged to console
- Secure Supabase connections
- Rate limiting and error handling

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review console logs
- Verify API configurations
- Test individual components

---

**Built with ❤️ by the Coxy Team**

*Automating domain investment intelligence for the Web3 ecosystem*
