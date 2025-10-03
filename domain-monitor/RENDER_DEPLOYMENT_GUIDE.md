# 🚀 Render Deployment Guide for Domain Monitor

## Overview
This guide will help you deploy the Coxy Domain Monitor service to Render.com.

## Prerequisites
- Render.com account
- Supabase project with database configured
- Doma Protocol API key

## Deployment Steps

### 1. Prepare Your Repository
Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your repository
4. Select the `domain-monitor` folder as the root directory

### 3. Configure the Service

**Basic Settings:**
- **Name**: `coxy-domain-monitor` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `domain-monitor`

**Build & Deploy:**
- **Build Command**: `yarn install --frozen-lockfile`
- **Start Command**: `node start-monitor.mjs`

### 4. Environment Variables

Add these environment variables in the Render dashboard:

```bash
# Required
DOMA_API_KEY=your_doma_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional (with defaults)
POLL_INTERVAL=30000
BATCH_SIZE=100
MAX_RETRIES=3
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
- **Health**: `{"status":"healthy","service":"domain-monitor","timestamp":"...","uptime":...}`
- **Status**: `{"service":"Coxy Domain Monitor","version":"1.0.0","status":"running",...}`

## Troubleshooting

### Common Issues

1. **Port Scan Timeout**
   - ✅ **Fixed**: The service now binds to port 3001 and provides health endpoints

2. **Environment Variables Missing**
   - Check all required variables are set in Render dashboard
   - Verify variable names match exactly (case-sensitive)

3. **Database Connection Issues**
   - Verify Supabase URL and key are correct
   - Check if your Supabase project allows connections from Render's IPs

4. **API Key Issues**
   - Verify Doma API key is valid and active
   - Check API key permissions

### Logs

Check the Render service logs for detailed error information:
1. Go to your service dashboard
2. Click on "Logs" tab
3. Look for error messages or warnings

## Service Endpoints

The deployed service provides these endpoints:

- `GET /` - Health check (same as /health)
- `GET /health` - Health status with uptime
- `GET /status` - Service information and available endpoints
- `GET /*` - Returns 404 for unknown routes

## Monitoring

The service will:
- ✅ Start domain event monitoring automatically
- ✅ Process analytics data
- ✅ Respond to health checks
- ✅ Log all activities to Render logs

## Next Steps

After successful deployment:
1. Test the health endpoints
2. Monitor the logs for domain events
3. Verify data is being stored in Supabase
4. Configure your frontend to use the service URL

## Support

If you encounter issues:
1. Check the service logs
2. Verify all environment variables
3. Test the health endpoints
4. Contact support with specific error messages
