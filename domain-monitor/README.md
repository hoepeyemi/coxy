# 🌐 Domain Monitor - Doma Protocol Integration

A comprehensive domain monitoring system that tracks Web3 domain events using the Doma Protocol API. This system integrates with your existing Iris memecoin platform to provide real-time domain analytics and webhook notifications.

## 🎯 Features

### **Event Monitoring**
- **Real-time polling** of Doma Protocol events
- **13 event types** including mints, transfers, listings, sales, offers, and more
- **Automatic event processing** and database storage
- **Webhook notifications** with customizable filters

### **Event Types Supported**
- `NAME_TOKEN_MINTED` - New domains registered
- `NAME_TOKEN_BURNED` - Domains burned/destroyed
- `NAME_TOKEN_TRANSFERRED` - Domain ownership changes
- `NAME_TOKEN_LISTED` - Domains listed for sale
- `NAME_TOKEN_UNLISTED` - Domains removed from sale
- `NAME_TOKEN_SOLD` - Domain sales
- `NAME_TOKEN_OFFERED` - Offers made on domains
- `NAME_TOKEN_OFFER_ACCEPTED` - Offers accepted
- `NAME_TOKEN_OFFER_CANCELLED` - Offers cancelled
- `NAME_TOKEN_EXPIRED` - Domain expirations
- `NAME_TOKEN_RENEWED` - Domain renewals
- `NAME_TOKEN_FRACTIONALIZED` - Domain fractionalization
- `NAME_TOKEN_DEFRACTIONALIZED` - Domain defractionalization

### **Advanced Filtering**
- **Price filters**: Min/max price thresholds
- **Domain length**: Character count limits
- **Extensions**: Filter by domain extensions (.com, .eth, .sol, etc.)
- **Owner**: Filter by specific wallet addresses
- **Expiration**: Domains expiring within X days
- **Custom filters**: JSON-based custom filtering

### **Analytics & Insights**
- **Domain analytics**: Volume, price history, trade counts
- **Trait analysis**: Length, pronounceability, character diversity
- **Trending domains**: Most active domains by timeframe
- **Real-time metrics**: Live event counts and statistics

## 🚀 Quick Start

### **1. Installation**
```bash
cd domain-monitor
npm install
```

### **2. Configuration**
```bash
cp env.example .env
# Edit .env with your API keys
```

### **3. Database Setup**
```bash
node setup-database.mjs
```

### **4. Test the System**
```bash
node test-domain-monitor.mjs
```

### **5. Start Monitoring**
```bash
node index.mjs
```

## 📊 Database Schema

### **domain_events**
Stores all events from Doma Protocol API
```sql
- event_id (BIGINT) - Unique event identifier
- name (TEXT) - Domain name
- token_id (TEXT) - Token identifier
- type (TEXT) - Event type
- event_data (JSONB) - Full event data
- created_at (TIMESTAMP) - Event timestamp
```

### **domain_subscriptions**
User webhook subscriptions
```sql
- user_id (TEXT) - User identifier
- event_type (TEXT) - Event type to monitor
- webhook_url (TEXT) - Webhook endpoint
- filters (JSONB) - Filter criteria
- is_active (BOOLEAN) - Subscription status
```

### **domain_analytics**
Aggregated domain statistics
```sql
- domain_name (TEXT) - Domain name
- total_events (INTEGER) - Total event count
- total_volume_usd (DECIMAL) - Total trading volume
- highest_price_usd (DECIMAL) - Highest recorded price
- trade_count (INTEGER) - Number of trades
- is_fractionalized (BOOLEAN) - Fractionalization status
```

### **domain_traits**
Domain characteristics for scoring
```sql
- domain_name (TEXT) - Domain name
- length (INTEGER) - Character count
- extension (TEXT) - Domain extension
- has_numbers (BOOLEAN) - Contains numbers
- is_palindrome (BOOLEAN) - Is palindrome
- is_pronounceable (BOOLEAN) - Pronunciation score
- character_diversity (INTEGER) - Unique character count
```

## 🔧 API Usage

### **Subscription Management**
```javascript
import SubscriptionManager from './subscription-manager.mjs';

const manager = new SubscriptionManager();

// Create subscription
const subscription = await manager.createSubscription(
  'user123',
  'NAME_TOKEN_LISTED',
  'https://webhook.site/your-webhook',
  {
    minPrice: 1000,
    extensions: ['.com', '.eth'],
    minLength: 3,
    maxLength: 20
  }
);

// Get user subscriptions
const subscriptions = await manager.getUserSubscriptions('user123');

// Update filters
await manager.updateSubscriptionFilters(subscription.id, {
  minPrice: 5000,
  extensions: ['.com']
});
```

### **Analytics Processing**
```javascript
import AnalyticsProcessor from './analytics-processor.mjs';

const processor = new AnalyticsProcessor();

// Get domain analytics
const analytics = await processor.getDomainAnalytics('example.com');

// Get trending domains
const trending = await processor.getTrendingDomains(10, '24h');
```

## 🎛️ Configuration

### **Environment Variables**
```env
# Required
DOMA_API_KEY=your_doma_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

# Optional
POLL_INTERVAL=30000    # Polling interval in ms
BATCH_SIZE=100         # Events per batch
MAX_RETRIES=3          # Max retry attempts
```

### **Polling Configuration**
- **Default interval**: 30 seconds
- **Batch size**: 100 events per poll
- **Retry logic**: 3 attempts with exponential backoff
- **Finalized events only**: Ensures data consistency

## 🔗 Webhook Format

### **Webhook Payload**
```json
{
  "subscription_id": 123,
  "event": {
    "id": 101,
    "name": "example.com",
    "tokenId": "109782310436602119473309635585647935844683647842954156419454133097053284015402",
    "type": "NAME_TOKEN_LISTED",
    "eventData": {
      "networkId": "eip155:1",
      "finalized": true,
      "txHash": "0x...",
      "blockNumber": "11111",
      "owner": "0x...",
      "price": "1000000000000000000",
      "expiresAt": "2026-01-17T13:55:54.099Z"
    },
    "timestamp": "2024-01-17T13:55:54.099Z"
  },
  "metadata": {
    "webhook_url": "https://webhook.site/your-webhook",
    "created_at": "2024-01-17T13:55:54.099Z"
  }
}
```

## 📈 Use Cases

### **1. Domain Traders**
- Monitor high-value domain listings
- Track domain sales and price movements
- Get alerts for domains in your watchlist

### **2. Domain Investors**
- Identify trending domains early
- Track domain portfolio performance
- Monitor market trends and patterns

### **3. Developers**
- Build domain analytics dashboards
- Create domain trading bots
- Integrate domain data into applications

### **4. Researchers**
- Analyze domain market trends
- Study domain naming patterns
- Research Web3 domain adoption

## 🛠️ Integration with Iris

This domain monitoring system integrates seamlessly with your existing Iris memecoin platform:

1. **Shared Database**: Uses the same Supabase instance
2. **Consistent Architecture**: Follows the same patterns as other Iris components
3. **Frontend Integration**: Can be added to the Iris dashboard
4. **Unified Notifications**: Combine domain and memecoin alerts

## 🔍 Monitoring & Debugging

### **Logs**
- Real-time event processing logs
- Webhook delivery status
- Error tracking and retry attempts
- Performance metrics

### **Health Checks**
- API connectivity status
- Database connection health
- Webhook delivery success rates
- Event processing lag

### **Metrics**
- Events processed per minute
- Webhook delivery success rate
- Average processing time
- Error rates by event type

## 🚨 Error Handling

- **API failures**: Automatic retry with exponential backoff
- **Webhook failures**: Logged for debugging and retry
- **Database errors**: Graceful degradation with error logging
- **Invalid events**: Skipped with error logging

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For questions or issues:
- Create an issue in the repository
- Check the logs for error details
- Verify your API keys and configuration
- Test with the provided test script

---

**Made with ❤️ by the Iris Team**



