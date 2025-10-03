# 🐳 Render Docker Deployment Guide

This guide focuses specifically on deploying your Coxy application using Docker on Render.

## 🎯 Why Docker?

Docker deployment is **recommended** for your Coxy application because:

- ✅ **System Dependencies**: Includes Chromium for Puppeteer (Domain Monitor & Twitter Bot)
- ✅ **Consistent Environment**: Same environment as your local development
- ✅ **Isolation**: No conflicts between services
- ✅ **Reproducible Builds**: Exact same result every time
- ✅ **Easy Migration**: Can move to other platforms easily

## 📋 Prerequisites

- ✅ Render account at [render.com](https://render.com)
- ✅ GitHub repository with your code
- ✅ Dockerfiles already created in each service directory
- ✅ All required environment variables

## 🐳 Docker Configuration

### **Frontend Dockerfile** (`frontend/Dockerfile`)
```dockerfile
FROM node:20-alpine AS base
# Multi-stage build for Next.js
# Includes standalone output for production
# Optimized for Render deployment
# Node 20 required for Solana packages
# Python & build tools for native module compilation
```

### **Domain Monitor Dockerfile** (`domain-monitor/Dockerfile`)
```dockerfile
FROM node:20-alpine
# Includes Chromium for Puppeteer
# System dependencies for web scraping
# Optimized for background processing
# Node 20 required for Solana packages
# Python & build tools for native module compilation
```

### **Twitter Bot Dockerfile** (`domain-monitor/twitter-bot/Dockerfile`)
```dockerfile
FROM node:20-alpine
# Includes Chromium for Puppeteer
# Twitter API integration
# Background worker configuration
# Node 20 required for Solana packages
# Python & build tools for native module compilation
```

## 🚀 Step-by-Step Docker Deployment

### Step 1: Deploy Frontend (Docker)

1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Docker Settings**
   ```
   Name: coxy-frontend
   Root Directory: frontend
   Environment: Docker
   Region: Choose closest to your users
   Branch: main
   ```

3. **Docker Configuration**
   - **Dockerfile Path**: `frontend/Dockerfile` (auto-detected)
   - **Docker Build Context**: `frontend/`
   - **Port**: 3000 (exposed in Dockerfile)

4. **Environment Variables**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   DOMA_API_KEY=your_doma_api_key
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for Docker build to complete
   - Verify at `https://coxy-frontend.onrender.com`

### Step 2: Deploy Domain Monitor (Docker)

1. **Create Background Worker**
   - Click "New +" → "Background Worker"
   - Connect the same GitHub repository

2. **Configure Docker Settings**
   ```
   Name: coxy-domain-monitor
   Root Directory: domain-monitor
   Environment: Docker
   Region: Same as frontend
   Branch: main
   ```

3. **Docker Configuration**
   - **Dockerfile Path**: `domain-monitor/Dockerfile` (auto-detected)
   - **Docker Build Context**: `domain-monitor/`
   - **No Port**: Background worker doesn't need port

4. **Environment Variables**
   ```
   NODE_ENV=production
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   DOMA_API_KEY=your_doma_api_key
   POLL_INTERVAL=30000
   BATCH_SIZE=100
   MAX_RETRIES=3
   ```

5. **Deploy**
   - Click "Create Background Worker"
   - Wait for Docker build to complete
   - Check logs for "Domain monitor started successfully"

### Step 3: Deploy Twitter Bot (Docker)

1. **Create Background Worker**
   - Click "New +" → "Background Worker"
   - Connect the same GitHub repository

2. **Configure Docker Settings**
   ```
   Name: coxy-twitter-bot
   Root Directory: domain-monitor/twitter-bot
   Environment: Docker
   Region: Same as other services
   Branch: main
   ```

3. **Docker Configuration**
   - **Dockerfile Path**: `domain-monitor/twitter-bot/Dockerfile` (auto-detected)
   - **Docker Build Context**: `domain-monitor/twitter-bot/`
   - **No Port**: Background worker doesn't need port

4. **Environment Variables**
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

5. **Deploy**
   - Click "Create Background Worker"
   - Wait for Docker build to complete
   - Check logs for "Twitter bot started successfully"

## 🔍 Docker-Specific Verification

### **Frontend Verification**
1. **Visit URL**: `https://coxy-frontend.onrender.com`
2. **Check Health**: `https://coxy-frontend.onrender.com/api/health`
3. **Verify Logo**: Coxy logo should display correctly
4. **Test Navigation**: All pages should load properly

### **Domain Monitor Verification**
1. **Check Logs**: Go to service → Logs tab
2. **Look for**: "Domain monitor started successfully"
3. **Verify**: Supabase connection established
4. **Monitor**: Domain events being processed

### **Twitter Bot Verification**
1. **Check Logs**: Go to service → Logs tab
2. **Look for**: "Twitter bot started successfully"
3. **Verify**: Twitter API connection established
4. **Monitor**: Tweets being posted automatically

## 🛠️ Docker Troubleshooting

### **Build Failures**
- **Issue**: Docker build fails
- **Solution**: Check Dockerfile syntax and dependencies
- **Debug**: Review build logs for specific errors

### **Runtime Errors**
- **Issue**: Container starts but crashes
- **Solution**: Check environment variables and dependencies
- **Debug**: Review runtime logs

### **System Dependencies**
- **Issue**: Puppeteer/Chromium not working
- **Solution**: Dockerfile includes all system dependencies
- **Debug**: Check if Chromium is properly installed

### **Memory Issues**
- **Issue**: Container runs out of memory
- **Solution**: Upgrade Render plan or optimize Dockerfile
- **Debug**: Monitor resource usage in Render dashboard

## 📊 Docker Benefits in Production

### **Consistency**
- Same environment across development, staging, and production
- No "works on my machine" issues
- Predictable deployments

### **Isolation**
- Each service runs in its own container
- No conflicts between services
- Easy to scale individual services

### **Reproducibility**
- Exact same build every time
- Version-controlled environment
- Easy rollbacks

### **Portability**
- Can run on any Docker-compatible platform
- Easy migration between cloud providers
- Local development matches production

## 🚀 Advanced Docker Configuration

### **Multi-Stage Builds**
Your Dockerfiles use multi-stage builds for optimization:
- **Base Stage**: Install dependencies
- **Builder Stage**: Build the application
- **Runner Stage**: Minimal production image

### **Layer Caching**
Docker layers are cached for faster builds:
- Dependencies installed in separate layer
- Code changes don't require dependency reinstall
- Faster subsequent deployments

### **Security**
- Non-root user for security
- Minimal attack surface
- Regular base image updates

## ✅ Success Checklist

After Docker deployment:

- [ ] **Frontend**: Loads with Coxy branding
- [ ] **Domain Monitor**: Processes domain events
- [ ] **Twitter Bot**: Posts tweets automatically
- [ ] **Docker Builds**: All services build successfully
- [ ] **Environment**: All variables properly set
- [ ] **Logs**: No critical errors in any service
- [ ] **Performance**: Services running smoothly

## 🎉 You're Done!

Your Coxy application is now running on Render with Docker! 

**Benefits you're getting:**
- ✅ Consistent, reproducible deployments
- ✅ All system dependencies included
- ✅ Isolated, scalable services
- ✅ Easy maintenance and updates

**Next steps:**
- Monitor service health
- Set up custom domain (optional)
- Configure monitoring and alerts
- Scale services as needed

Your Docker-deployed Coxy application is production-ready! 🚀
