# Quick Start Guide - Domain Monitor Twitter Bot

Get your domain monitoring Twitter bot up and running in 5 minutes! 🚀

## 🚀 Quick Setup

### 1. Prerequisites
- Node.js 18+ installed
- Twitter Developer Account
- OpenAI API key
- Supabase account with domain data

### 2. Install & Setup
```bash
cd domain-monitor/twitter-bot
npm install
npm run setup
```

### 3. Configure API Keys
Edit the `.env` file with your credentials:
```env
TWITTER_API_KEY=your_key_here
TWITTER_API_SECRET=your_secret_here
TWITTER_ACCESS_TOKEN=your_token_here
TWITTER_ACCESS_SECRET=your_secret_here
OPENAI_API_KEY=your_openai_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_key_here
```

### 4. Test the Bot
```bash
npm test
```

### 5. Start the Bot
```bash
npm start
```

## 🎯 What the Bot Does

- **Discovers** high-value domain opportunities automatically
- **Analyzes** domain trends and market activity
- **Generates** engaging, actionable tweets using AI
- **Posts** intelligent content every 30 minutes
- **Tracks** performance and engagement

## 📊 Sample Tweets

```
💰 HIGH-VALUE ALERT: crypto.com sold for $5000! 🚀

#DomainInvesting #Web3 #DigitalAssets #Coxy
```

```
🔥 TRENDING: nft.eth with 8 recent events! 📈

#DomainTrends #Web3 #DigitalAssets #Coxy
```

```
⏰ EXPIRED: premium.io is now available! 💎

#DomainInvesting #Web3 #DigitalAssets #Coxy
```

## ⚙️ Configuration

Adjust settings in `.env`:
- `HIGH_VALUE_THRESHOLD=1000` - Minimum price for alerts
- `TRENDING_THRESHOLD=5` - Events needed for trending
- `TWEET_INTERVAL_MINUTES=30` - Time between tweets

## 🔍 Monitoring

Watch the console for:
- ✅ API connection status
- 🔍 Opportunity detection
- 📝 Tweet generation
- ✅ Tweet posting success

## 🛠️ Troubleshooting

**No opportunities found?**
- Ensure domain monitor is running
- Check Supabase has domain data
- Lower threshold values

**API errors?**
- Verify all API keys are correct
- Check API quotas and limits
- Ensure proper permissions

**Need help?**
- Check `README-ENHANCED.md` for detailed docs
- Run `npm test` to diagnose issues
- Review console logs for errors

---

**Ready to automate your domain investment intelligence! 🎉**

