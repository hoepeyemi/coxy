# 🌐 Coxy - Domain Intelligence Platform

**Coxy** is an autonomous AI-powered market intelligence platform designed for crypto enthusiasts and traders. It provides real-time Web3 domain analytics, market trends, and investment opportunities through advanced monitoring, AI-driven insights, and automated social media engagement.

## 🚀 **Overview**

Coxy combines cutting-edge technology to deliver comprehensive domain intelligence:

- **Real-time market analysis** with pattern recognition and investment opportunity scoring
- **Domain monitoring** using Doma Protocol API for Web3 domain events
- **AI-powered Twitter bot** for automated social media posting and engagement
- **Modern web interface** with advanced data visualization and analytics
- **Blockchain integration** for comprehensive market data collection

## 🏗️ **Architecture**

### **Multi-Component System**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Domain Monitor │    │  Twitter Bot    │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   (Node.js)     │
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • Event Monitor │    │ • AI Tweets     │
│ • Analytics     │    │ • Data Processor│    │ • Opportunity   │
│ • Real-time UI  │    │ • HTTP Server   │    │   Detection     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Supabase      │
                    │   Database      │
                    │                 │
                    │ • Domain Events │
                    │ • Analytics     │
                    │ • User Data     │
                    └─────────────────┘
```

## 📁 **Project Structure**

```
coxy/
├── frontend/                 # Next.js web application
│   ├── app/                 # Next.js 14 app router
│   ├── components/          # React components
│   ├── lib/                 # Utilities and types
│   └── public/              # Static assets
│
├── domain-monitor/          # Domain monitoring service
│   ├── start-monitor.mjs    # Main service entry point
│   ├── index.mjs           # Domain monitoring logic
│   ├── analytics-processor.mjs
│   └── twitter-bot/         # Twitter bot service
│       ├── start-bot.mjs    # Bot entry point
│       ├── coxy-optimized-bot.mjs
│       └── enhanced-event-processor.mjs
│
├── bitquery/                # Blockchain data collection
│   ├── index.mjs           # Main Bitquery service
│   ├── scripts/            # Data collection scripts
│   └── results/            # Collected data
│
├── js-scraper/             # Web scraping service
│   ├── index.mjs           # Main scraper
│   └── scrapers/           # Individual scrapers
│
└── docker-compose.yml      # Docker orchestration
```

## 🛠️ **Technology Stack**

### **Frontend**
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS + ShadCN/UI
- **State Management**: Zustand
- **Charts**: Recharts + Lightweight Charts
- **UI Components**: Radix UI primitives

### **Backend Services**
- **Runtime**: Node.js with ES Modules
- **Database**: Supabase (PostgreSQL)
- **APIs**: Doma Protocol, Bitquery, OpenAI
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime

### **Data Collection**
- **Web Scraping**: Selenium (Python) + Puppeteer (Node.js)
- **Blockchain Data**: Bitquery API (GraphQL)
- **Domain Events**: Doma Protocol API
- **AI Integration**: OpenAI GPT-3.5-turbo

### **Deployment**
- **Platform**: Render.com
- **Containerization**: Docker
- **CI/CD**: Git-based deployment

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 20+
- Yarn package manager
- Supabase account
- Doma Protocol API key
- OpenAI API key
- Twitter API credentials (for bot)

### **1. Clone Repository**
```bash
git clone <repository-url>
cd coxy
```

### **2. Install Dependencies**
```bash
# Frontend
cd frontend
yarn install

# Domain Monitor
cd ../domain-monitor
yarn install

# Twitter Bot
cd twitter-bot
yarn install

# Bitquery Service
cd ../../bitquery
yarn install

# JS Scraper
cd ../js-scraper
yarn install
```

### **3. Environment Setup**

#### **Frontend (.env.local)**
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### **Domain Monitor (.env)**
```bash
DOMA_API_KEY=your_doma_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### **Twitter Bot (.env)**
```bash
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
FRONTEND_URL=https://coxy.onrender.com
```

### **4. Database Setup**
```bash
# Run database setup scripts
cd domain-monitor
yarn setup

cd twitter-bot
yarn setup
```

### **5. Start Services**

#### **Development Mode**
```bash
# Frontend
cd frontend
yarn dev

# Domain Monitor
cd domain-monitor
yarn dev

# Twitter Bot
cd twitter-bot
yarn dev
```

#### **Production Mode**
```bash
# Frontend
cd frontend
yarn build
yarn start

# Domain Monitor
cd domain-monitor
yarn start

# Twitter Bot
cd twitter-bot
yarn start
```

## 🔧 **Configuration**

### **Domain Monitor**
- **Poll Interval**: 30 seconds (configurable)
- **Event Types**: Mints, transfers, listings, sales, offers, expirations, renewals
- **Analytics**: Real-time processing and trend detection

### **Twitter Bot**
- **Tweet Interval**: 15 minutes (configurable)
- **Max Daily Tweets**: 20 (configurable)
- **AI Model**: GPT-3.5-turbo
- **Content**: Domain opportunities, market insights, trending domains

### **Frontend**
- **Real-time Updates**: Supabase Realtime
- **Data Refresh**: Automatic every 30 seconds
- **Responsive Design**: Mobile-first approach

## 📊 **Features**

### **Domain Intelligence**
- **Real-time Monitoring**: Track Web3 domain events across multiple protocols
- **Trend Analysis**: Identify trending domains and market patterns
- **Opportunity Detection**: AI-powered identification of investment opportunities
- **Price Tracking**: Monitor domain prices and market movements

### **Analytics Dashboard**
- **Interactive Charts**: Real-time data visualization
- **Market Overview**: Comprehensive market statistics
- **Trending Domains**: Top performing domains
- **Recent Events**: Latest domain activities

### **AI-Powered Twitter Bot**
- **Automated Posting**: Share domain opportunities on Twitter
- **AI Content Generation**: GPT-3.5-turbo powered tweet creation
- **Engagement Tracking**: Monitor tweet performance and engagement
- **Opportunity Alerts**: Real-time notifications for high-value domains

### **Data Collection**
- **Web Scraping**: Collect market data from various sources
- **Blockchain Integration**: Fetch data from multiple blockchain networks
- **API Integration**: Connect with external data providers
- **Real-time Processing**: Process and analyze data in real-time

## 🚀 **Deployment**

### **Render.com Deployment**

#### **Domain Monitor**
1. Connect repository to Render
2. Set root directory to `domain-monitor`
3. Build command: `yarn install --frozen-lockfile`
4. Start command: `node start-monitor.mjs`
5. Health check path: `/health`

#### **Twitter Bot**
1. Connect repository to Render
2. Set root directory to `domain-monitor/twitter-bot`
3. Build command: `yarn install --frozen-lockfile`
4. Start command: `node start-bot.mjs`
5. Health check path: `/health`

#### **Frontend**
1. Connect repository to Render
2. Set root directory to `frontend`
3. Build command: `yarn install && yarn build`
4. Start command: `yarn start`

### **Docker Deployment**
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 📈 **Monitoring & Health Checks**

### **Service Endpoints**
- **Domain Monitor**: `https://your-domain-monitor.onrender.com/health`
- **Twitter Bot**: `https://your-twitter-bot.onrender.com/health`
- **Frontend**: `https://your-frontend.onrender.com`

### **Health Check Responses**
```json
{
  "status": "healthy",
  "service": "domain-monitor",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 3600
}
```

## 🔒 **Security**

- **Environment Variables**: All sensitive data stored in environment variables
- **API Keys**: Secure storage and rotation
- **Database**: Row Level Security (RLS) enabled
- **CORS**: Properly configured for cross-origin requests
- **Authentication**: Supabase Auth integration

## 📚 **API Documentation**

### **Domain Monitor API**
- `GET /health` - Health check
- `GET /status` - Service status
- `POST /events` - Process domain events
- `GET /analytics` - Get analytics data

### **Twitter Bot API**
- `GET /health` - Health check with bot status
- `GET /status` - Service and bot information
- `POST /start` - Start the bot
- `POST /stop` - Stop the bot

### **Frontend API Routes**
- `/api/domain-monitor` - Domain data proxy
- `/api/supabase/*` - Supabase integration
- `/api/dashboard/*` - Dashboard data

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 **Links**

- **Live App**: [https://coxy.onrender.com](https://coxy.onrender.com)
- **Twitter**: [@CoxyDo1130](https://x.com/CoxyDo1130)
- **GitHub**: [Repository](https://github.com/your-username/coxy)

## 🆘 **Support**

For support and questions:
- Check the documentation in each service directory
- Review the deployment guides
- Open an issue on GitHub
- Contact the development team

---

**Made with ❤️ by the Coxy Team**

*Empowering domain investors with AI-driven market intelligence*
