# 🚀 Render Deployment - Step by Step Guide

This guide will walk you through deploying each service (Frontend, Domain Monitor, and Twitter Bot) to Render.

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ Render account at [render.com](https://render.com)
- ✅ GitHub repository with your code
- ✅ All required API keys and environment variables
- ✅ Supabase database set up with required tables
- ✅ Dockerfiles in each service directory (already created)
- ✅ **Node.js 20+**: Required for Solana packages compatibility

## 🐳 Docker vs Node.js Deployment

### **Docker Deployment (Recommended)**
- ✅ **Consistent Environment**: Same environment across development and production
- ✅ **Dependencies Included**: All system dependencies (Chromium, etc.) included
- ✅ **Isolated**: No conflicts with other services
- ✅ **Reproducible**: Exact same build every time
- ✅ **Easy Scaling**: Can be moved to other platforms easily

### **Node.js Deployment (Alternative)**
- ⚡ **Faster Build**: No Docker layer caching
- 🔧 **Simpler**: Direct Node.js execution
- ⚠️ **Dependencies**: May need additional system packages
- ⚠️ **Environment**: Potential differences between dev and prod

**Recommendation**: Use Docker deployment for production reliability.

## 🔑 Required Environment Variables

Collect these environment variables before deployment:

### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_URL=https://your-project.supabase.co
```

### Doma Protocol API
```
DOMA_API_KEY=your_doma_api_key
```

### Twitter API (for Twitter Bot)
```
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
```

---

## 🌐 Step 1: Deploy Frontend (Web Service)

### 1.1 Create New Web Service
1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Sign in to your account
   - Click **"New +"** button
   - Select **"Web Service"**

2. **Connect Repository**
   - Click **"Connect a repository"**
   - Select your GitHub repository
   - Grant necessary permissions

### 1.2 Configure Frontend Service

**Option A: Docker Deployment (Recommended)**
1. **Basic Settings**
   - **Name**: `coxy-frontend`
   - **Root Directory**: `frontend`
   - **Environment**: `Docker`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)

2. **Docker Settings**
   - **Dockerfile Path**: `frontend/Dockerfile` (auto-detected)
   - **Docker Build Context**: `frontend/`
   - **Docker Build Command**: `docker build -t coxy-frontend .`
   - **Docker Start Command**: `docker run -p 3000:3000 coxy-frontend`

3. **Important Docker Notes**
   - Render will automatically detect the Dockerfile in the `frontend/` directory
   - The Dockerfile is already configured with Next.js standalone output
   - Port 3000 is exposed and will be mapped by Render
   - All environment variables will be passed to the container

**Option B: Node.js Deployment (Alternative)**
1. **Basic Settings**
   - **Name**: `coxy-frontend`
   - **Root Directory**: `frontend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)

2. **Build & Deploy Settings**
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: `20` (required for Solana packages)

### 1.3 Set Environment Variables
1. **Go to Environment Tab**
   - Click on **"Environment"** tab
   - Add the following variables:

```
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DOMA_API_KEY=your_doma_api_key
```

2. **Save Environment Variables**
   - Click **"Save Changes"** after adding each variable

### 1.4 Deploy Frontend
1. **Start Deployment**
   - Click **"Create Web Service"**
   - Wait for build to complete (5-10 minutes)
   - Monitor build logs for any errors

2. **Verify Deployment**
   - Once deployed, you'll get a URL like `https://coxy-frontend.onrender.com`
   - Visit the URL to verify the frontend loads
   - Check that the logo displays correctly

---

## 🔄 Step 2: Deploy Domain Monitor (Background Worker)

### 2.1 Create New Background Worker
1. **Go to Render Dashboard**
   - Click **"New +"** button
   - Select **"Background Worker"**

2. **Connect Repository**
   - Select the same GitHub repository
   - Grant necessary permissions

### 2.2 Configure Domain Monitor Service

**Option A: Docker Deployment (Recommended)**
1. **Basic Settings**
   - **Name**: `coxy-domain-monitor`
   - **Root Directory**: `domain-monitor`
   - **Environment**: `Docker`
   - **Region**: Same as frontend
   - **Branch**: `main`

2. **Docker Settings**
   - **Dockerfile Path**: `domain-monitor/Dockerfile` (auto-detected)
   - **Docker Build Context**: `domain-monitor/`
   - **Docker Build Command**: `docker build -t coxy-domain-monitor .`
   - **Docker Start Command**: `docker run coxy-domain-monitor`

**Option B: Node.js Deployment (Alternative)**
1. **Basic Settings**
   - **Name**: `coxy-domain-monitor`
   - **Root Directory**: `domain-monitor`
   - **Environment**: `Node`
   - **Region**: Same as frontend
   - **Branch**: `main`

2. **Build & Deploy Settings**
   - **Build Command**: `npm install`
   - **Start Command**: `node index.mjs`
   - **Node Version**: `20` (required for Solana packages)

### 2.3 Set Environment Variables
Add these environment variables:

```
NODE_ENV=production
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DOMA_API_KEY=your_doma_api_key
POLL_INTERVAL=30000
BATCH_SIZE=100
MAX_RETRIES=3
```

### 2.4 Deploy Domain Monitor
1. **Start Deployment**
   - Click **"Create Background Worker"**
   - Wait for build to complete
   - Monitor logs for successful startup

2. **Verify Deployment**
   - Check logs for "Domain monitor started successfully"
   - Verify Supabase connection
   - Look for domain events being processed

---

## 🤖 Step 3: Deploy Twitter Bot (Background Worker)

### 3.1 Create New Background Worker
1. **Go to Render Dashboard**
   - Click **"New +"** button
   - Select **"Background Worker"**

2. **Connect Repository**
   - Select the same GitHub repository
   - Grant necessary permissions

### 3.2 Configure Twitter Bot Service

**Option A: Docker Deployment (Recommended)**
1. **Basic Settings**
   - **Name**: `coxy-twitter-bot`
   - **Root Directory**: `domain-monitor/twitter-bot`
   - **Environment**: `Docker`
   - **Region**: Same as other services
   - **Branch**: `main`

2. **Docker Settings**
   - **Dockerfile Path**: `domain-monitor/twitter-bot/Dockerfile` (auto-detected)
   - **Docker Build Context**: `domain-monitor/twitter-bot/`
   - **Docker Build Command**: `docker build -t coxy-twitter-bot .`
   - **Docker Start Command**: `docker run coxy-twitter-bot`

**Option B: Node.js Deployment (Alternative)**
1. **Basic Settings**
   - **Name**: `coxy-twitter-bot`
   - **Root Directory**: `domain-monitor/twitter-bot`
   - **Environment**: `Node`
   - **Region**: Same as other services
   - **Branch**: `main`

2. **Build & Deploy Settings**
   - **Build Command**: `npm install`
   - **Start Command**: `node coxy-optimized-bot.mjs`
   - **Node Version**: `20` (required for Solana packages)

### 3.3 Set Environment Variables
Add these environment variables:

```
NODE_ENV=production
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
MAX_TWEETS_PER_DAY=20
TWEET_INTERVAL=3600000
```

### 3.4 Deploy Twitter Bot
1. **Start Deployment**
   - Click **"Create Background Worker"**
   - Wait for build to complete
   - Monitor logs for successful startup

2. **Verify Deployment**
   - Check logs for "Twitter bot started successfully"
   - Verify Twitter API connection
   - Look for tweets being posted

---

## 🔍 Step 4: Verify All Services

### 4.1 Check Service Status
1. **Go to Render Dashboard**
   - You should see all 3 services listed
   - Check that all services show "Live" status

2. **Service URLs**
   - **Frontend**: `https://coxy-frontend.onrender.com`
   - **Domain Monitor**: Background service (no URL)
   - **Twitter Bot**: Background service (no URL)

### 4.2 Test Frontend
1. **Visit Frontend URL**
   - Open the frontend URL in your browser
   - Verify the page loads correctly
   - Check that the Coxy logo displays
   - Test navigation between pages

2. **Test API Endpoints**
   - Visit `https://coxy-frontend.onrender.com/api/health`
   - Should return a health check response

### 4.3 Monitor Background Services
1. **Check Domain Monitor Logs**
   - Go to Domain Monitor service
   - Click "Logs" tab
   - Look for successful startup messages
   - Check for domain events being processed

2. **Check Twitter Bot Logs**
   - Go to Twitter Bot service
   - Click "Logs" tab
   - Look for successful startup messages
   - Check for tweets being posted

---

## 🛠️ Step 5: Troubleshooting

### 5.1 Common Issues

**Build Failures**
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check for missing environment variables

**Runtime Errors**
- Verify all environment variables are set correctly
- Check Supabase connection
- Verify API keys are valid

**Service Not Starting**
- Check start commands in Render configuration
- Verify file paths are correct
- Check for port conflicts

### 5.2 Debug Commands

**Check Service Logs**
- Go to service dashboard
- Click "Logs" tab
- Look for error messages
- Check startup sequence

**Test Environment Variables**
- Go to service settings
- Verify all required variables are set
- Check for typos in variable names

---

## 🔄 Step 6: Auto-Deploy Setup

### 6.1 Enable Auto-Deploy
1. **Go to Each Service**
   - Click on service name
   - Go to "Settings" tab
   - Enable "Auto-Deploy" for main branch

2. **Test Auto-Deploy**
   - Make a small change to your code
   - Push to main branch
   - Verify services automatically redeploy

### 6.2 Monitor Deployments
1. **Deployment History**
   - Check "Deploys" tab for each service
   - Monitor deployment success/failure
   - Review deployment logs

---

## 📊 Step 7: Production Monitoring

### 7.1 Set Up Monitoring
1. **Health Checks**
   - Frontend: `GET /api/health`
   - Monitor service uptime
   - Set up alerts for downtime

2. **Log Monitoring**
   - Regularly check service logs
   - Look for errors or warnings
   - Monitor resource usage

### 7.2 Performance Optimization
1. **Resource Usage**
   - Monitor CPU and memory usage
   - Upgrade plans if needed
   - Optimize code for better performance

2. **Database Performance**
   - Monitor Supabase usage
   - Check query performance
   - Optimize database queries

---

## 🎉 Success Checklist

After deployment, verify:

- ✅ **Frontend**: Loads correctly with Coxy logo
- ✅ **Domain Monitor**: Processing domain events
- ✅ **Twitter Bot**: Posting tweets automatically
- ✅ **Database**: All tables created and accessible
- ✅ **API Keys**: All services connecting successfully
- ✅ **Auto-Deploy**: Working for all services
- ✅ **Monitoring**: Health checks passing

---

## 🆘 Support

If you encounter issues:

1. **Check Render Documentation**: [render.com/docs](https://render.com/docs)
2. **Review Service Logs**: Look for error messages
3. **Verify Environment Variables**: Ensure all are set correctly
4. **Test Locally**: Run services locally to debug
5. **Contact Support**: Use Render support if needed

---

## 🚀 Next Steps

Once deployed:

1. **Custom Domain**: Set up custom domain for frontend
2. **SSL Certificates**: Automatically handled by Render
3. **CDN**: Consider adding CDN for better performance
4. **Monitoring**: Set up external monitoring services
5. **Backups**: Configure database backups

Your Coxy application is now live on Render! 🎉
