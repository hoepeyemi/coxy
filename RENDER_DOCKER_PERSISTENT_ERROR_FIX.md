# 🔧 Render Docker Persistent Error Fix - "docker: executable file not found"

## ❌ Persistent Error

Even after updating `render.yaml` files to use Docker configuration, you're still getting:
```
==> There was a problem starting your server: "docker": executable file not found in $PATH
==> Cause of failure could not be determined
```

## 🎯 Root Cause Analysis

This persistent error suggests that Render is not properly recognizing the Docker configuration. Possible causes:

1. **Render Cache**: Old configuration cached
2. **YAML Syntax Issues**: Invalid YAML structure
3. **Render Service Type**: Wrong service type for Docker
4. **Deployment Method**: Using wrong deployment approach

## ✅ Comprehensive Solution

### **Option 1: Manual Dashboard Configuration (Recommended)**

Instead of using `render.yaml`, configure services manually in Render dashboard:

#### **Step 1: Delete render.yaml Files**
```bash
# Remove render.yaml files to avoid conflicts
rm frontend/render.yaml
rm domain-monitor/render.yaml
rm domain-monitor/twitter-bot/render.yaml
```

#### **Step 2: Create Services Manually in Render Dashboard**

1. **Go to [render.com](https://render.com)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure Frontend Service:**
   ```
   Name: coxy-frontend
   Environment: Docker
   Root Directory: frontend
   Dockerfile Path: frontend/Dockerfile
   Docker Build Context: frontend
   Port: 3000
   ```

5. **Click "New +" → "Background Worker"**
6. **Configure Domain Monitor:**
   ```
   Name: coxy-domain-monitor
   Environment: Docker
   Root Directory: domain-monitor
   Dockerfile Path: domain-monitor/Dockerfile
   Docker Build Context: domain-monitor
   ```

7. **Click "New +" → "Background Worker"**
8. **Configure Twitter Bot:**
   ```
   Name: coxy-twitter-bot
   Environment: Docker
   Root Directory: domain-monitor/twitter-bot
   Dockerfile Path: domain-monitor/twitter-bot/Dockerfile
   Docker Build Context: domain-monitor/twitter-bot
   ```

### **Option 2: Fix render.yaml Syntax**

If you prefer to keep using `render.yaml`, try this corrected syntax:

#### **Frontend render.yaml**
```yaml
services:
  - type: web
    name: coxy-frontend
    env: docker
    plan: starter
    dockerfilePath: ./frontend/Dockerfile
    dockerContext: ./frontend
    envVars:
      - key: NODE_ENV
        value: production
      - key: NEXT_PUBLIC_SUPABASE_URL
        sync: false
      - key: NEXT_PUBLIC_SUPABASE_ANON_KEY
        sync: false
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
      - key: DOMA_API_KEY
        sync: false
    healthCheckPath: /api/health
    autoDeploy: true
    branch: main
```

#### **Domain Monitor render.yaml**
```yaml
services:
  - type: worker
    name: coxy-domain-monitor
    env: docker
    plan: starter
    dockerfilePath: ./domain-monitor/Dockerfile
    dockerContext: ./domain-monitor
    envVars:
      - key: NODE_ENV
        value: production
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
      - key: DOMA_API_KEY
        sync: false
      - key: POLL_INTERVAL
        value: 30000
      - key: BATCH_SIZE
        value: 100
      - key: MAX_RETRIES
        value: 3
    autoDeploy: true
    branch: main
```

#### **Twitter Bot render.yaml**
```yaml
services:
  - type: worker
    name: coxy-twitter-bot
    env: docker
    plan: starter
    dockerfilePath: ./domain-monitor/twitter-bot/Dockerfile
    dockerContext: ./domain-monitor/twitter-bot
    envVars:
      - key: NODE_ENV
        value: production
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
      - key: TWITTER_API_KEY
        sync: false
      - key: TWITTER_API_SECRET
        sync: false
      - key: TWITTER_ACCESS_TOKEN
        sync: false
      - key: TWITTER_ACCESS_TOKEN_SECRET
        sync: false
      - key: TWITTER_BEARER_TOKEN
        sync: false
      - key: MAX_TWEETS_PER_DAY
        value: 20
      - key: TWEET_INTERVAL
        value: 3600000
    autoDeploy: true
    branch: main
```

### **Option 3: Use Render CLI**

If you have Render CLI installed:

```bash
# Install Render CLI
npm install -g @render/cli

# Login to Render
render login

# Deploy services
render deploy --dockerfile frontend/Dockerfile --context frontend --name coxy-frontend
render deploy --dockerfile domain-monitor/Dockerfile --context domain-monitor --name coxy-domain-monitor
render deploy --dockerfile domain-monitor/twitter-bot/Dockerfile --context domain-monitor/twitter-bot --name coxy-twitter-bot
```

## 🔍 Troubleshooting Steps

### **Step 1: Verify Docker Configuration**
```bash
# Test Docker build locally
cd frontend
docker build -t coxy-frontend .
docker run -p 3000:3000 coxy-frontend
```

### **Step 2: Check Render Service Status**
1. Go to Render dashboard
2. Check if services are configured as "Docker" environment
3. Verify Dockerfile paths are correct
4. Check build logs for errors

### **Step 3: Clear Render Cache**
1. Delete the service in Render dashboard
2. Wait 5 minutes
3. Recreate the service with correct configuration

### **Step 4: Verify Repository Structure**
```
coxy/
├── frontend/
│   ├── Dockerfile
│   └── ...
├── domain-monitor/
│   ├── Dockerfile
│   └── twitter-bot/
│       └── Dockerfile
└── ...
```

## 🚀 Recommended Action Plan

### **Immediate Steps:**
1. **Delete existing services** in Render dashboard
2. **Remove render.yaml files** to avoid conflicts
3. **Create services manually** using Render dashboard
4. **Set environment to "Docker"** for each service
5. **Configure Dockerfile paths** correctly

### **Service Configuration Order:**
1. **Frontend** (Web Service) - Most important
2. **Domain Monitor** (Background Worker)
3. **Twitter Bot** (Background Worker)

### **Environment Variables:**
Set these in Render dashboard for each service:
- **Frontend**: `NODE_ENV`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DOMA_API_KEY`
- **Domain Monitor**: `NODE_ENV`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DOMA_API_KEY`, `POLL_INTERVAL`, `BATCH_SIZE`, `MAX_RETRIES`
- **Twitter Bot**: `NODE_ENV`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `TWITTER_API_KEY`, `TWITTER_API_SECRET`, `TWITTER_ACCESS_TOKEN`, `TWITTER_ACCESS_TOKEN_SECRET`, `TWITTER_BEARER_TOKEN`, `MAX_TWEETS_PER_DAY`, `TWEET_INTERVAL`

## ✅ Expected Result

After following these steps:
- ✅ Services deploy successfully with Docker
- ✅ No "docker: executable file not found" errors
- ✅ All services start properly
- ✅ Health checks pass

## 🎯 Why This Happens

### **Render Configuration Issues:**
- **YAML Parsing**: Invalid YAML syntax can cause configuration issues
- **Service Type Mismatch**: Wrong service type for Docker deployment
- **Path Resolution**: Incorrect Dockerfile paths
- **Cache Issues**: Old configuration cached by Render

### **Docker Environment:**
- **Docker Not Available**: Service configured for Node.js but trying to use Docker
- **Path Issues**: Docker executable not in PATH
- **Permission Issues**: Docker commands not allowed

## 🚀 Next Steps

1. **Follow Option 1** (Manual Dashboard Configuration) - Most reliable
2. **Set up environment variables** for each service
3. **Deploy services one by one** starting with frontend
4. **Verify each service** is working before deploying the next
5. **Check logs** for any remaining issues

Try the manual dashboard configuration approach - it's the most reliable way to get Docker working on Render! 🎉
