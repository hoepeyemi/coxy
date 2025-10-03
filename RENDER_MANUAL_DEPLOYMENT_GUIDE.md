# 🚀 Render Manual Deployment Guide - No render.yaml Files

## 🎯 **Why Remove render.yaml Files?**

The persistent "docker: executable file not found" error occurs because:
- Render has issues parsing `render.yaml` files for Docker services
- Configuration conflicts between YAML and dashboard settings
- Cached configurations causing deployment failures

**Solution**: Use manual dashboard configuration instead of `render.yaml` files.

## 📋 **Prerequisites**

Before starting, ensure you have:
- ✅ Render account at [render.com](https://render.com)
- ✅ GitHub repository with your code
- ✅ All required API keys and environment variables
- ✅ Dockerfiles in each service directory (already created)

## 🚀 **Step-by-Step Manual Deployment**

### **Step 1: Deploy Frontend (Web Service)**

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Click "Connect a repository"
   - Select your GitHub repository
   - Grant necessary permissions

3. **Configure Service**
   ```
   Name: coxy-frontend
   Environment: Docker
   Region: Choose closest to your users
   Branch: main
   Root Directory: frontend
   Dockerfile Path: frontend/Dockerfile
   Docker Build Context: frontend
   ```

4. **Set Environment Variables**
   - Click "Environment" tab
   - Add the following variables:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   DOMA_API_KEY=your_doma_api_key
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for Docker build to complete
   - Verify at `https://coxy-frontend.onrender.com`

### **Step 2: Deploy Domain Monitor (Background Worker)**

1. **Create Background Worker**
   - Click "New +" → "Background Worker"
   - Connect the same GitHub repository

2. **Configure Service**
   ```
   Name: coxy-domain-monitor
   Environment: Docker
   Region: Same as frontend
   Branch: main
   Root Directory: domain-monitor
   Dockerfile Path: domain-monitor/Dockerfile
   Docker Build Context: domain-monitor
   ```

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   DOMA_API_KEY=your_doma_api_key
   POLL_INTERVAL=30000
   BATCH_SIZE=100
   MAX_RETRIES=3
   ```

4. **Deploy**
   - Click "Create Background Worker"
   - Wait for Docker build to complete
   - Check logs for "Domain monitor started successfully"

### **Step 3: Deploy Twitter Bot (Background Worker)**

1. **Create Background Worker**
   - Click "New +" → "Background Worker"
   - Connect the same GitHub repository

2. **Configure Service**
   ```
   Name: coxy-twitter-bot
   Environment: Docker
   Region: Same as other services
   Branch: main
   Root Directory: domain-monitor/twitter-bot
   Dockerfile Path: domain-monitor/twitter-bot/Dockerfile
   Docker Build Context: domain-monitor/twitter-bot
   ```

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   TWITTER_API_KEY=your_twitter_api_key
   TWITTER_API_SECRET=your_twitter_api_secret
   TWITTER_ACCESS_TOKEN=your_twitter_access_token
   TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
   TWITTER_BEARER_TOKEN=your_twitter_bearer_token
   MAX_TWEETS_PER_DAY=20
   TWEET_INTERVAL=3600000
   ```

4. **Deploy**
   - Click "Create Background Worker"
   - Wait for Docker build to complete
   - Check logs for "Twitter bot started successfully"

## 🔍 **Verification Steps**

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

## 🛠️ **Troubleshooting**

### **If Frontend Fails to Start**
- Check environment variables are set correctly
- Verify `NEXT_PUBLIC_` variables are prefixed correctly
- Check Docker build logs for errors

### **If Domain Monitor Fails to Start**
- Verify Supabase credentials
- Check DOMA API key is valid
- Look for connection errors in logs

### **If Twitter Bot Fails to Start**
- Verify all Twitter API credentials
- Check Twitter API permissions
- Look for authentication errors in logs

### **If Docker Build Fails**
- Check Dockerfile syntax
- Verify all dependencies are included
- Look for build errors in logs

## 📊 **Service Configuration Summary**

| Service | Type | Environment | Root Directory | Dockerfile Path |
|---------|------|-------------|----------------|-----------------|
| Frontend | Web Service | Docker | frontend | frontend/Dockerfile |
| Domain Monitor | Background Worker | Docker | domain-monitor | domain-monitor/Dockerfile |
| Twitter Bot | Background Worker | Docker | domain-monitor/twitter-bot | domain-monitor/twitter-bot/Dockerfile |

## 🎯 **Key Points to Remember**

1. **Always select "Docker" environment** - not Node.js
2. **Set correct root directory** - where the service code is located
3. **Set correct Dockerfile path** - relative to repository root
4. **Set correct Docker build context** - same as root directory
5. **Add all required environment variables** - check each service's requirements

## ✅ **Expected Result**

After following these steps:
- ✅ All services deploy successfully with Docker
- ✅ No "docker: executable file not found" errors
- ✅ Frontend loads with Coxy branding
- ✅ Domain Monitor processes domain events
- ✅ Twitter Bot posts tweets automatically

## 🚀 **Next Steps After Deployment**

1. **Set up custom domain** (optional)
2. **Configure monitoring and alerts**
3. **Set up database backups**
4. **Monitor service health**
5. **Scale services as needed**

Your Coxy application should now be running successfully on Render! 🎉

## 📞 **Support**

If you encounter any issues:
1. Check the service logs in Render dashboard
2. Verify all environment variables are set
3. Ensure Docker builds complete successfully
4. Check that all services are running

The manual configuration approach should resolve the persistent Docker errors you were experiencing.
