# 🚀 Render Deployment - Quick Reference

## 📋 Service Configuration Summary

### 🌐 Frontend (Web Service)
```
Name: coxy-frontend
Type: Web Service
Root Directory: frontend
Environment: Docker (Recommended) or Node
Dockerfile: frontend/Dockerfile (auto-detected)
Port: 3000
Environment Variables:
  - NODE_ENV=production
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
  - DOMA_API_KEY
```

### 🔄 Domain Monitor (Background Worker)
```
Name: coxy-domain-monitor
Type: Background Worker
Root Directory: domain-monitor
Environment: Docker (Recommended) or Node
Dockerfile: domain-monitor/Dockerfile (auto-detected)
Environment Variables:
  - NODE_ENV=production
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
  - DOMA_API_KEY
  - POLL_INTERVAL=30000
  - BATCH_SIZE=100
  - MAX_RETRIES=3
```

### 🤖 Twitter Bot (Background Worker)
```
Name: coxy-twitter-bot
Type: Background Worker
Root Directory: domain-monitor/twitter-bot
Environment: Docker (Recommended) or Node
Dockerfile: domain-monitor/twitter-bot/Dockerfile (auto-detected)
Environment Variables:
  - NODE_ENV=production
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
  - TWITTER_API_KEY
  - TWITTER_API_SECRET
  - TWITTER_ACCESS_TOKEN
  - TWITTER_ACCESS_TOKEN_SECRET
  - TWITTER_BEARER_TOKEN
  - MAX_TWEETS_PER_DAY=20
  - TWEET_INTERVAL=3600000
```

## 🔑 Required API Keys

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Doma Protocol
- `DOMA_API_KEY`

### Twitter API
- `TWITTER_API_KEY`
- `TWITTER_API_SECRET`
- `TWITTER_ACCESS_TOKEN`
- `TWITTER_ACCESS_TOKEN_SECRET`
- `TWITTER_BEARER_TOKEN`

## 🐳 Docker Configuration in Render

### **Docker Settings for Each Service**
- **Environment**: Select "Docker" instead of "Node"
- **Dockerfile**: Auto-detected in root directory
- **Build Context**: Same as root directory
- **Port**: 3000 (for frontend), not needed for workers

### **Docker Benefits**
- ✅ **Consistent Environment**: Same as local development
- ✅ **System Dependencies**: Chromium, Puppeteer included
- ✅ **Isolation**: No conflicts between services
- ✅ **Reproducible**: Exact same build every time

## 🚀 Deployment Order

1. **Frontend** (Web Service) - Docker recommended
2. **Domain Monitor** (Background Worker) - Docker recommended  
3. **Twitter Bot** (Background Worker) - Docker recommended

## ✅ Verification Checklist

- [ ] Frontend loads at `https://coxy-frontend.onrender.com`
- [ ] Health check works: `/api/health`
- [ ] Coxy logo displays correctly
- [ ] Domain Monitor processes events
- [ ] Twitter Bot posts tweets
- [ ] All services show "Live" status
- [ ] Auto-deploy enabled for all services

## 🛠️ Troubleshooting

### Build Failures
- Check Node.js version (18+)
- Verify package.json dependencies
- Check for missing environment variables

### Runtime Errors
- Verify all environment variables are set
- Check service logs for specific errors
- Test API connections

### Service Not Starting
- Verify start commands are correct
- Check file paths in root directory
- Review service logs

## 📞 Quick Links

- [Render Dashboard](https://render.com/dashboard)
- [Render Documentation](https://render.com/docs)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Twitter Developer Portal](https://developer.twitter.com/)

## 🎯 Success Indicators

- **Frontend**: Page loads with Coxy branding
- **Domain Monitor**: Logs show "started successfully"
- **Twitter Bot**: Logs show "started successfully"
- **Database**: Tables accessible and populated
- **APIs**: All external APIs responding
