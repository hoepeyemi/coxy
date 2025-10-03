# 🌐 Coxy - Domain Intelligence Platform

**Coxy** is an autonomous AI-powered market intelligence platform designed for crypto enthusiasts and traders. It bridges the gap between market data and emerging opportunities by leveraging real-time analytics, blockchain data, and domain monitoring.

> **Tagline**: *"An Autonomous AI Agent that browses TikTok to help you find the hottest memecoins before they pump."*

## 🎯 **Project Overview**

Coxy is a comprehensive market intelligence platform that combines:
- **Real-time Web3 domain monitoring** using Doma Protocol API
- **AI-powered Twitter bot** for automated opportunity sharing
- **Modern React frontend** with Solana wallet integration
- **Blockchain data scraping** for market analysis
- **Advanced analytics** and trend detection

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Domain Monitor │    │  Twitter Bot    │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   (Node.js)     │
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • Event Polling │    │ • AI Content    │
│ • Analytics     │    │ • Data Storage  │    │ • Auto Posting  │
│ • Wallet Conn.  │    │ • Webhooks      │    │ • Engagement    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Supabase      │
                    │   Database      │
                    │                 │
                    │ • domain_events │
                    │ • analytics     │
                    │ • subscriptions │
                    │ • tweets        │
                    └─────────────────┘
```

## 🚀 **Key Features**

### **🌐 Domain Intelligence**
- **Real-time monitoring** of 13+ Web3 domain event types
- **Advanced filtering** by price, length, extensions, and ownership
- **Trend analysis** and opportunity scoring
- **Webhook notifications** with customizable alerts
- **Analytics dashboard** with real-time metrics

### **🤖 AI-Powered Twitter Bot**
- **Automated posting** of domain opportunities
- **GPT-4 content generation** for engaging tweets
- **Smart filtering** for high-value opportunities
- **Engagement tracking** and performance analytics
- **Community building** around domain investing

### **📊 Market Analytics**
- **Real-time data visualization** with interactive charts
- **Trend detection** and pattern recognition
- **Price tracking** and volume analysis
- **Historical data** and performance metrics
- **Custom dashboards** for different user types

### **🔗 Blockchain Integration**
- **Market data** scraping from multiple sources
- **Real-time analytics** and trend detection
- **AI-powered insights** and recommendations

## 📁 **Project Structure**

```
coxy/
├── frontend/                 # Next.js React application
│   ├── app/                 # App router pages and API routes
│   ├── components/          # Reusable UI components
│   │   ├── dashboard/       # Dashboard-specific components
│   │   ├── sections/        # Page sections
│   │   └── ui/             # Base UI components (ShadCN)
│   ├── lib/                # Utility functions and configurations
│   └── hooks/              # Custom React hooks
│
├── domain-monitor/          # Domain monitoring service
│   ├── twitter-bot/        # AI-powered Twitter bot
│   ├── analytics-processor.mjs
│   ├── subscription-manager.mjs
│   └── index.mjs           # Main monitoring service
│
├── bitquery/               # Blockchain data fetching
│   ├── scripts/           # Data collection scripts
│   └── results/           # Collected data storage
│
├── js-scraper/            # Alternative web scraper
│   └── [scraping modules]
│
└── docker-compose.yml     # Container orchestration
```

## 🛠️ **Technology Stack**

### **Frontend**
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS + ShadCN/UI
- **State Management**: Zustand
- **Charts**: Recharts + Lightweight Charts
- **Blockchain**: Web3 data integration

### **Backend Services**
- **Runtime**: Node.js with ES Modules
- **Database**: Supabase (PostgreSQL)
- **APIs**: Doma Protocol, Bitquery, OpenAI
- **Scheduling**: Node-cron
- **HTTP Client**: Axios

### **Infrastructure**
- **Deployment**: Docker + Render
- **Database**: Supabase (PostgreSQL)
- **Environment**: dotenv
- **Monitoring**: Built-in logging and analytics

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ and Yarn
- Supabase account
- Doma Protocol API key
- Twitter API credentials (for bot)
- OpenAI API key (for bot)

### **1. Clone Repository**
```bash
git clone https://github.com/your-username/coxy.git
cd coxy
```

### **2. Frontend Setup**
```bash
cd frontend
yarn install
cp env-template.txt .env.local
# Edit .env.local with your API keys
yarn dev
```

### **3. Domain Monitor Setup**
```bash
cd domain-monitor
yarn install
cp env.example .env
# Edit .env with your API keys
yarn setup
yarn start
```

### **4. Twitter Bot Setup**
```bash
cd domain-monitor/twitter-bot
yarn install
cp env.example .env
# Edit .env with your API keys
yarn setup
yarn start
```

## 🔧 **Configuration**

### **Environment Variables**

#### **Frontend (.env.local)**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
BITQUERY_API_KEY=your_bitquery_api_key
ACCESS_TOKEN=your_bitquery_access_token
```

#### **Domain Monitor (.env)**
```env
DOMA_API_KEY=your_doma_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### **Twitter Bot (.env)**
```env
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 **Database Schema**

### **Core Tables**
- **`domain_events`** - All domain events from Doma Protocol
- **`domain_subscriptions`** - User webhook subscriptions
- **`domain_analytics`** - Aggregated domain statistics
- **`domain_traits`** - Domain characteristics and scoring
- **`twitter_tweets`** - Bot tweets and engagement data
- **`twitter_analytics`** - Daily performance metrics

## 🎯 **Use Cases**

### **For Domain Traders**
- Monitor high-value domain listings
- Track domain sales and price movements
- Get real-time alerts for opportunities
- Analyze market trends and patterns

### **For Domain Investors**
- Identify trending domains early
- Track portfolio performance
- Discover undervalued opportunities
- Access comprehensive market data

### **For Developers**
- Build domain analytics dashboards
- Create domain trading bots
- Integrate domain data into applications
- Access real-time market APIs

### **For Researchers**
- Analyze domain market trends
- Study domain naming patterns
- Research Web3 domain adoption
- Access historical market data

## 🔄 **API Endpoints**

### **Domain Monitor API**
- `GET /api/domain-monitor?action=analytics` - General statistics
- `GET /api/domain-monitor?action=events` - Recent domain events
- `GET /api/domain-monitor?action=trends` - Trending domains
- `GET /api/domain-monitor?action=prices` - Domain prices
- `POST /api/domain-monitor?action=subscribe` - Create subscription

### **Webhook Integration**
- Real-time event notifications
- Customizable filtering criteria
- JSON payload format
- Retry logic and error handling

## 🚀 **Deployment**

### **Docker Deployment**
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### **Render Deployment**
1. Connect your GitHub repository
2. Set environment variables
3. Deploy each service separately
4. Configure database connections

### **Manual Deployment**
```bash
# Frontend (Vercel/Netlify)
cd frontend
yarn build
yarn start

# Domain Monitor (Render/Heroku)
cd domain-monitor
yarn start

# Twitter Bot (Render/Heroku)
cd domain-monitor/twitter-bot
yarn start
```

## 📈 **Monitoring & Analytics**

### **Built-in Monitoring**
- Real-time event processing logs
- API connectivity status
- Database connection health
- Webhook delivery success rates
- Performance metrics and error tracking

### **Analytics Dashboard**
- Domain activity metrics
- Market trend analysis
- Bot engagement statistics
- User subscription analytics
- Real-time data visualization

## 🛡️ **Security & Privacy**

- **API Key Management**: Secure environment variable storage
- **Database Security**: Row Level Security (RLS) policies
- **CORS Protection**: Configured for cross-origin requests
- **Rate Limiting**: Respects API limits and quotas
- **Error Handling**: Graceful degradation and logging

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 **Support**

- **Documentation**: Check individual component READMEs
- **Issues**: Create GitHub issues for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the development team

## 🌟 **Acknowledgments**

- **Doma Protocol** for domain event data
- **Supabase** for database and real-time features
- **OpenAI** for AI-powered content generation
- **Next.js** and **React** for the frontend framework

## 🔗 **Links**

- **Live App**: [https://zorox-ai.vercel.app/](https://zorox-ai.vercel.app/)
- **Demo Video**: [Watch Demo](https://www.canva.com/design/DAGZKlSQ674/sKdyTpeTJ7oqJn85P8o2cg/watch)
- **Presentation Deck**: [View Deck](https://www.canva.com/design/DAGZKe_9vEc/eRRZxCtQpk1QxFSjz3ZT2A/view)
- **Twitter**: [@CoxyDo1130](https://x.com/CoxyDo1130)
- **GitHub**: [Repository](https://github.com/gabrielantonyxaviour/zorox)

---

**Made with ❤️ by Gabriel Antony Xaviour**

*Building the future of domain investment intelligence*

[![Twitter Follow](https://img.shields.io/twitter/follow/gabrielaxyeth?style=social)](https://twitter.com/gabrielaxyeth)
[![GitHub Stars](https://img.shields.io/github/stars/gabrielantonyxaviour/zorox?style=social)](https://github.com/gabrielantonyxaviour/zorox)
