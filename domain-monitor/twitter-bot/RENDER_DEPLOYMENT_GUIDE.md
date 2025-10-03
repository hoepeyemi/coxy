# 🤖 Render Deployment Guide for Twitter Bot

## Overview
This guide will help you deploy the Coxy Twitter Bot service to Render.com.

## Prerequisites
- Render.com account
- Supabase project with database configured
- Twitter API credentials (API v2)
- OpenAI API key

## Deployment Steps

### 1. Prepare Your Repository
Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your repository
4. Select the `domain-monitor/twitter-bot` folder as the root directory

### 3. Configure the Service

**Basic Settings:**
- **Name**: `coxy-twitter-bot` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `domain-monitor/twitter-bot`

**Build & Deploy:**
- **Build Command**: `yarn install --frozen-lockfile`
- **Start Command**: `node start-bot.mjs`

### 4. Environment Variables

Add these environment variables in the Render dashboard:

```bash
# Required - Twitter API v2
TWITTER_API_KEY=your_twitter_api_key_here
TWITTER_API_SECRET=your_twitter_api_secret_here
TWITTER_ACCESS_TOKEN=your_twitter_access_token_here
TWITTER_ACCESS_SECRET=your_twitter_access_secret_here

# Required - OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# Required - Supabase
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Required - Frontend
FRONTEND_URL=https://coxy.onrender.com

# Optional (with defaults)
HIGH_VALUE_THRESHOLD=1000
TRENDING_THRESHOLD=5
TWEET_INTERVAL_MINUTES=30
MAX_TWEETS_PER_DAY=20
```

**Note**: `PORT` is automatically set by Render - don't add it manually.

### 5. Advanced Settings

**Health Check Path**: `/health`

**Auto-Deploy**: Enable if you want automatic deployments on git push.

### 6. Deploy

Click "Create Web Service" and wait for the deployment to complete.

## Verification

Once deployed, you can verify the service is running:

1. **Health Check**: `https://your-service-name.onrender.com/health`
2. **Status**: `https://your-service-name.onrender.com/status`

Expected responses:
- **Health**: `{"status":"healthy","service":"coxy-twitter-bot","timestamp":"...","uptime":...,"botStatus":...}`
- **Status**: `{"service":"Coxy Twitter Bot","version":"1.0.0","status":"running",...}`

## Bot Control Endpoints

The deployed service provides these control endpoints:

- `POST /start` - Start the Twitter bot
- `POST /stop` - Stop the Twitter bot
- `GET /health` - Health status with bot status
- `GET /status` - Service information

## Troubleshooting

### Common Issues

1. **Port Scan Timeout**
   - ✅ **Fixed**: The service now binds to port 3002 and provides health endpoints

2. **Twitter API Issues**
   - Verify all Twitter API credentials are correct
   - Check if your Twitter app has the right permissions
   - Ensure you're using Twitter API v2 credentials

3. **OpenAI API Issues**
   - Verify OpenAI API key is valid and has credits
   - Check API key permissions

4. **Database Connection Issues**
   - Verify Supabase URL and key are correct
   - Check if your Supabase project allows connections from Render's IPs

5. **Bot Not Tweeting**
   - Check the service logs for error messages
   - Verify the bot is running (check /health endpoint)
   - Ensure there are domain events in the database

### Logs

Check the Render service logs for detailed information:
1. Go to your service dashboard
2. Click on "Logs" tab
3. Look for error messages, tweet attempts, and bot status

## Service Features

The deployed Twitter bot will:
- ✅ Monitor domain events from Supabase
- ✅ Generate AI-powered tweets about domain opportunities
- ✅ Post tweets at configured intervals
- ✅ Track performance metrics
- ✅ Respond to health checks
- ✅ Provide bot control endpoints

## Configuration Options

### Tweet Frequency
- `TWEET_INTERVAL_MINUTES`: How often to check for new opportunities (default: 30)
- `MAX_TWEETS_PER_DAY`: Maximum tweets per day (default: 20)

### Content Filtering
- `HIGH_VALUE_THRESHOLD`: Minimum value for high-value domains (default: 1000)
- `TRENDING_THRESHOLD`: Minimum events for trending domains (default: 5)

## Monitoring

The service provides:
- Real-time health status
- Bot running status
- Tweet count and performance metrics
- Error logging and debugging

## Next Steps

After successful deployment:
1. Test the health endpoints
2. Monitor the logs for tweet activity
3. Verify tweets are being posted to Twitter
4. Check bot performance metrics
5. Configure tweet frequency if needed

## Support

If you encounter issues:
1. Check the service logs
2. Verify all environment variables
3. Test the health endpoints
4. Check Twitter API status
5. Contact support with specific error messages
