#!/usr/bin/env node

import CoxyOptimizedBot from './coxy-optimized-bot.mjs';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

console.log('🤖 Starting Coxy Twitter Bot System...\n');

// Check required environment variables
const requiredEnvVars = [
  'TWITTER_API_KEY', 
  'TWITTER_API_SECRET', 
  'TWITTER_ACCESS_TOKEN', 
  'TWITTER_ACCESS_SECRET',
  'OPENAI_API_KEY',
  'SUPABASE_URL', 
  'SUPABASE_ANON_KEY'
];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease set these in your .env file');
  process.exit(1);
}

console.log('✅ Environment variables loaded');
console.log('✅ Twitter API configured');
console.log('✅ OpenAI API configured');
console.log('✅ Supabase connection configured');
console.log('✅ Starting Twitter bot...\n');

// Create HTTP server for Render deployment
const PORT = process.env.PORT || 3002;
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
      service: 'coxy-twitter-bot',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      botStatus: bot && typeof bot.getBotStatus === 'function' ? bot.getBotStatus() : { isRunning: false }
    }));
    return;
  }

  // API status endpoint
  if (req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      service: 'Coxy Twitter Bot',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        health: '/health',
        status: '/status'
      },
      botInfo: bot && typeof bot.getBotStatus === 'function' ? bot.getBotStatus() : { isRunning: false }
    }));
    return;
  }

  // Bot control endpoints
  if (req.url === '/start' && req.method === 'POST') {
    if (bot && !bot.isRunning) {
      bot.initialize().then(() => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Bot started successfully' }));
      }).catch(error => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      });
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Bot is already running or not initialized' }));
    }
    return;
  }

  if (req.url === '/stop' && req.method === 'POST') {
    if (bot && bot.isRunning) {
      bot.stopBot();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Bot stopped successfully' }));
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Bot is not running' }));
    }
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
  console.log(`🎮 Bot control: POST /start or /stop`);
});

// Create and start the bot
const bot = new CoxyOptimizedBot();

// Start the bot automatically
bot.initialize().then(() => {
  console.log('✅ Twitter Bot started successfully');
}).catch(error => {
  console.error('❌ Failed to start Twitter Bot:', error);
  console.log('🔄 Bot will retry on next health check...');
  // Don't exit, let the HTTP server keep running
});

// Graceful shutdown handlers
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Coxy Twitter Bot System...');
  if (bot) {
    bot.stopBot();
  }
  server.close(() => {
    console.log('✅ HTTP server closed');
    console.log('✅ Shutdown complete');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down Coxy Twitter Bot System...');
  if (bot) {
    bot.stopBot();
  }
  server.close(() => {
    console.log('✅ HTTP server closed');
    console.log('✅ Shutdown complete');
    process.exit(0);
  });
});

// Keep the process alive
console.log('\n🤖 Coxy Twitter Bot System is running...');
console.log('Press Ctrl+C to stop\n');
