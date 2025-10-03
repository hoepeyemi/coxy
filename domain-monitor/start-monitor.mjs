#!/usr/bin/env node

import DomainMonitor from './index.mjs';
import AnalyticsProcessor from './analytics-processor.mjs';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

console.log('🚀 Starting Iris Domain Monitor System...\n');

// Check required environment variables
const requiredEnvVars = ['DOMA_API_KEY', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease set these in your .env file');
  process.exit(1);
}

console.log('✅ Environment variables loaded');
console.log('✅ Database connection configured');
console.log('✅ Starting domain event monitoring...\n');

// Create HTTP server for Render deployment
const PORT = process.env.PORT || 3001;
const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check endpoint
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'domain-monitor',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }));
    return;
  }

  // API status endpoint
  if (req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      service: 'Coxy Domain Monitor',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        health: '/health',
        status: '/status'
      }
    }));
    return;
  }

  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

// Start the HTTP server
server.listen(PORT, () => {
  console.log(`🌐 HTTP server listening on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Status: http://localhost:${PORT}/status`);
});

// Create and start the domain monitor
const monitor = new DomainMonitor();
const analyticsProcessor = new AnalyticsProcessor();

// Start both services
monitor.initialize().then(() => {
  console.log('✅ Domain Monitor started successfully');
}).catch(error => {
  console.error('❌ Failed to start Domain Monitor:', error);
  process.exit(1);
});

analyticsProcessor.start();
console.log('✅ Analytics Processor started');

// Graceful shutdown handlers
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Domain Monitor System...');
  monitor.stopPolling();
  analyticsProcessor.stop();
  server.close(() => {
    console.log('✅ HTTP server closed');
    console.log('✅ Shutdown complete');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down Domain Monitor System...');
  monitor.stopPolling();
  analyticsProcessor.stop();
  server.close(() => {
    console.log('✅ HTTP server closed');
    console.log('✅ Shutdown complete');
    process.exit(0);
  });
});

// Keep the process alive
console.log('\n📊 Domain Monitor System is running...');
console.log('Press Ctrl+C to stop\n');



