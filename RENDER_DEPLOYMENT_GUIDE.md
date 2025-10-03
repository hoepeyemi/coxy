# Coxy Render Deployment Guide

This guide will help you deploy the Coxy application (Frontend, Domain Monitor, and Twitter Bot) to Render.

## 🏗️ Architecture Overview

- **Frontend**: Next.js web application (Web Service)
- **Domain Monitor**: Node.js background service (Worker)
- **Twitter Bot**: Node.js background service (Worker)

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Environment Variables**: Collect all required API keys and secrets

## 🔧 Required Environment Variables

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

## 🚀 Deployment Steps

### Step 1: Deploy Frontend (Web Service)

1. **Go to Render Dashboard**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Frontend Service**
   - **Name**: `coxy-frontend`
   - **Root Directory**: `frontend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

3. **Set Environment Variables**
   - Add all Supabase and Doma API variables
   - Set `NODE_ENV=production`

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

### Step 2: Deploy Domain Monitor (Worker)

1. **Create New Worker Service**
   - Click "New +" → "Background Worker"
   - Connect the same GitHub repository

2. **Configure Domain Monitor Service**
   - **Name**: `coxy-domain-monitor`
   - **Root Directory**: `domain-monitor`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.mjs`

3. **Set Environment Variables**
   - Add Supabase and Doma API variables
   - Set `NODE_ENV=production`

4. **Deploy**
   - Click "Create Background Worker"
   - Wait for deployment to complete

### Step 3: Deploy Twitter Bot (Worker)

1. **Create New Worker Service**
   - Click "New +" → "Background Worker"
   - Connect the same GitHub repository

2. **Configure Twitter Bot Service**
   - **Name**: `coxy-twitter-bot`
   - **Root Directory**: `domain-monitor/twitter-bot`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node coxy-optimized-bot.mjs`

3. **Set Environment Variables**
   - Add Supabase and Twitter API variables
   - Set `NODE_ENV=production`

4. **Deploy**
   - Click "Create Background Worker"
   - Wait for deployment to complete

## 🐳 Docker Deployment (Alternative)

If you prefer Docker deployment, you can use the provided Dockerfiles:

### Frontend Docker
```bash
cd frontend
docker build -t coxy-frontend .
docker run -p 3000:3000 --env-file .env.production coxy-frontend
```

### Domain Monitor Docker
```bash
cd domain-monitor
docker build -t coxy-domain-monitor .
docker run --env-file .env.production coxy-domain-monitor
```

### Twitter Bot Docker
```bash
cd domain-monitor/twitter-bot
docker build -t coxy-twitter-bot .
docker run --env-file .env.production coxy-twitter-bot
```

### Docker Compose
```bash
# Copy env.production.template to .env.production and fill in values
cp env.production.template .env.production

# Start all services
docker-compose up -d
```

## 🔍 Verification

After deployment, verify each service:

### Frontend
- Visit your Render URL (e.g., `https://coxy-frontend.onrender.com`)
- Check that the dashboard loads correctly
- Verify API endpoints are working

### Domain Monitor
- Check Render logs for "Domain monitor started successfully"
- Verify it's connecting to Supabase
- Check for domain events being processed

### Twitter Bot
- Check Render logs for "Twitter bot started successfully"
- Verify Twitter API connection
- Check for tweets being posted

## 📊 Monitoring

### Render Dashboard
- Monitor service health in Render dashboard
- Check logs for any errors
- Monitor resource usage

### Application Logs
- Frontend: Check browser console and network tab
- Domain Monitor: Check Render service logs
- Twitter Bot: Check Render service logs

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are in package.json
   - Verify Node.js version compatibility
   - Check for missing environment variables

2. **Runtime Errors**
   - Verify all environment variables are set
   - Check Supabase connection
   - Verify API keys are valid

3. **Service Not Starting**
   - Check start commands in Render configuration
   - Verify file paths and permissions
   - Check for port conflicts

### Debug Commands

```bash
# Check service status
docker ps

# View logs
docker logs <container_name>

# Check environment variables
docker exec <container_name> env
```

## 🔄 Updates and Maintenance

### Automatic Deployments
- Services are configured for auto-deploy on git push
- Make changes in your repository
- Render will automatically rebuild and redeploy

### Manual Deployments
- Go to Render dashboard
- Click "Manual Deploy" on any service
- Select branch and deploy

### Environment Variable Updates
- Go to service settings in Render
- Update environment variables
- Restart service to apply changes

## 📈 Scaling

### Free Tier Limits
- 750 hours per month per service
- Services sleep after 15 minutes of inactivity
- Limited CPU and memory

### Paid Plans
- Always-on services
- More CPU and memory
- Better performance
- Custom domains

## 🛡️ Security

### Environment Variables
- Never commit secrets to git
- Use Render's environment variable system
- Rotate API keys regularly

### Network Security
- Services communicate internally
- Frontend is publicly accessible
- Workers are internal only

## 📞 Support

If you encounter issues:

1. Check Render documentation
2. Review service logs
3. Verify environment variables
4. Check GitHub issues
5. Contact support if needed

## 🎉 Success!

Once deployed, you should have:
- ✅ Frontend accessible via Render URL
- ✅ Domain monitor processing events
- ✅ Twitter bot posting updates
- ✅ All services communicating properly

Your Coxy application is now live on Render! 🚀
