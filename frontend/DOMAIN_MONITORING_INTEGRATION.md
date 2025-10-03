# 🌐 Domain Monitoring Integration

## Overview

The Iris platform now includes comprehensive Web3 domain monitoring capabilities, allowing users to track domain events, analyze market trends, and set up automated notifications for valuable domain opportunities.

## 🚀 Features

### 1. **Real-Time Domain Events**
- Live monitoring of 8 different domain event types
- Real-time updates every 30 seconds
- Event filtering and search capabilities
- Detailed event metadata and transaction information

### 2. **Domain Analytics Dashboard**
- Comprehensive market analysis
- Price tracking and volume metrics
- Trading statistics and offer counts
- Fractionalization status monitoring
- Time-based filtering (1h, 24h, 7d, 30d)

### 3. **Subscription Management**
- Custom webhook notifications
- Advanced filtering options
- Price range and length filters
- Fractionalization preferences
- Active/inactive subscription management

### 4. **Event Types Monitored**
- `NAME_TOKEN_MINTED` - New domain token created
- `NAME_TOKENIZED` - Domain converted to token
- `NAME_CLAIMED` - Domain ownership claimed
- `NAME_TOKEN_TRANSFERRED` - Domain token transferred
- `COMMAND_SUCCEEDED` - Command executed successfully
- `COMMAND_UPDATED` - Command status updated
- `COMMAND_CREATED` - New command created
- `NAME_TOKENIZATION_REQUESTED` - Tokenization request made

## 📁 File Structure

```
frontend/
├── app/
│   ├── api/domain-monitor/
│   │   └── route.ts                    # API endpoints for domain monitoring
│   ├── dashboard/
│   │   ├── page.tsx                    # Main dashboard with domain monitoring
│   │   └── dashboard-client.tsx        # Dashboard client with domain components
│   └── domain-monitor/
│       ├── page.tsx                    # Dedicated domain monitor page
│       └── domain-monitor-client.tsx   # Domain monitor client component
├── components/dashboard/
│   ├── domain-monitor-overview.tsx     # Real-time events overview
│   ├── domain-analytics.tsx           # Market analytics dashboard
│   └── domain-subscriptions.tsx       # Subscription management
└── test-domain-monitor.mjs            # API testing script
```

## 🔧 API Endpoints

### GET `/api/domain-monitor`

**Query Parameters:**
- `action` - Endpoint action (events, analytics, trending, subscriptions)
- `limit` - Number of results to return (default: 50)
- `offset` - Pagination offset (default: 0)
- `eventType` - Filter by specific event type
- `domainName` - Filter by domain name
- `timeframe` - Time filter (1h, 24h, 7d, 30d)
- `userId` - User ID for subscriptions

**Actions:**
- `events` - Get domain events
- `analytics` - Get domain analytics
- `trending` - Get trending domains
- `subscriptions` - Get user subscriptions

### POST `/api/domain-monitor`

**Actions:**
- `subscribe` - Create new subscription
- `unsubscribe` - Delete subscription
- `update-filters` - Update subscription filters

## 🎨 UI Components

### 1. **DomainMonitorOverview**
- Real-time event feed
- Event type badges with color coding
- Domain name and metadata display
- Time-based filtering
- Auto-refresh functionality

### 2. **DomainAnalytics**
- Market summary statistics
- Price tracking (high, low, volume)
- Trading metrics (trades, offers)
- Fractionalization status
- Sortable columns
- Time-based filtering

### 3. **DomainSubscriptions**
- Subscription management interface
- Webhook URL configuration
- Advanced filtering options
- Active/inactive toggle
- Create/edit/delete operations

## 🚀 Getting Started

### 1. **Prerequisites**
- Frontend running on `http://localhost:3000`
- Supabase database with domain monitoring tables
- Domain monitor service running and collecting data

### 2. **Access Domain Monitoring**
- **Dashboard**: Visit `/dashboard` to see domain monitoring in the main dashboard
- **Dedicated Page**: Visit `/domain-monitor` for detailed domain monitoring interface

### 3. **Test the Integration**
```bash
# Run the test script
node test-domain-monitor.mjs
```

## 📊 Data Flow

```
Doma Protocol API → Domain Monitor Service → Supabase Database → Frontend API → UI Components
```

1. **Data Collection**: Domain monitor service polls Doma Protocol API
2. **Data Storage**: Events stored in Supabase with proper field mapping
3. **API Layer**: Next.js API routes provide data to frontend
4. **UI Display**: React components display real-time data with filtering

## 🔍 Key Features

### **Real-Time Updates**
- Automatic refresh every 30 seconds
- Live event streaming
- Real-time analytics updates
- Status indicators for all systems

### **Advanced Filtering**
- Event type filtering
- Domain name search
- Price range filtering
- Time-based filtering
- Length-based filtering

### **Market Intelligence**
- Price tracking and analysis
- Volume metrics
- Trading statistics
- Fractionalization monitoring
- Trend analysis

### **Subscription Management**
- Webhook notifications
- Custom filtering rules
- Active/inactive management
- Real-time updates

## 🎯 Use Cases

### **Domain Investors**
- Track valuable domain opportunities
- Monitor price changes and trends
- Set up alerts for specific criteria
- Analyze market patterns

### **Developers**
- Monitor domain tokenization events
- Track command execution status
- Analyze domain usage patterns
- Build domain-based applications

### **Traders**
- Identify trading opportunities
- Monitor volume and price changes
- Track offer activity
- Analyze market trends

## 🔧 Configuration

### **Environment Variables**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### **Database Tables**
- `domain_events` - Raw domain events
- `domain_analytics` - Aggregated analytics
- `domain_subscriptions` - User subscriptions
- `webhook_deliveries` - Webhook delivery logs

## 📈 Performance

### **Optimizations**
- Efficient database queries with proper indexing
- Real-time updates with minimal API calls
- Cached data for better performance
- Pagination for large datasets

### **Monitoring**
- Real-time status indicators
- Error handling and user feedback
- Performance metrics tracking
- System health monitoring

## 🚀 Future Enhancements

### **Planned Features**
- Advanced charting and visualization
- Machine learning-based predictions
- Social sentiment analysis for domains
- Integration with more domain registries
- Mobile app support

### **API Improvements**
- GraphQL support
- WebSocket real-time updates
- Advanced caching strategies
- Rate limiting and throttling

## 🐛 Troubleshooting

### **Common Issues**
1. **No data showing**: Check if domain monitor service is running
2. **API errors**: Verify Supabase connection and credentials
3. **Slow loading**: Check database performance and indexing
4. **Missing events**: Verify event type filtering and time ranges

### **Debug Steps**
1. Check browser console for errors
2. Verify API endpoints with test script
3. Check Supabase database for data
4. Verify domain monitor service status

## 📚 Documentation

- [Domain Monitor API Documentation](./API_DOCUMENTATION.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Component Documentation](./COMPONENT_DOCS.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include error handling
4. Write comprehensive tests
5. Update documentation

## 📄 License

This domain monitoring integration is part of the Iris platform and follows the same licensing terms.



