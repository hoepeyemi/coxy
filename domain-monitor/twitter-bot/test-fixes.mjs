#!/usr/bin/env node

import http from 'http';

// Test the fixed start-bot.mjs functionality
const PORT = process.env.PORT || 3002;
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Mock bot object with getBotStatus method
  const mockBot = {
    getBotStatus: () => ({
      isRunning: true,
      tweetCount: 0,
      dailyTweetCount: 0,
      lastTweetTime: null,
      performanceMetrics: {},
      conversionFunnel: {}
    })
  };

  // Health check endpoint
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'coxy-twitter-bot-test',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      botStatus: mockBot && typeof mockBot.getBotStatus === 'function' ? mockBot.getBotStatus() : { isRunning: false }
    }));
    return;
  }

  // Status endpoint
  if (req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      service: 'Coxy Twitter Bot Test',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        health: '/health',
        status: '/status'
      },
      botInfo: mockBot && typeof mockBot.getBotStatus === 'function' ? mockBot.getBotStatus() : { isRunning: false }
    }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`🌐 Test server listening on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Status: http://localhost:${PORT}/status`);
  console.log('\n✅ Test server is running! Press Ctrl+C to stop.');
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down test server...');
  server.close(() => {
    console.log('✅ Test server closed');
    process.exit(0);
  });
});
