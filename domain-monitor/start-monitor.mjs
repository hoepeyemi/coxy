#!/usr/bin/env node

import DomainMonitor from './index.mjs';
import AnalyticsProcessor from './analytics-processor.mjs';
import dotenv from 'dotenv';

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
  console.log('✅ Shutdown complete');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down Domain Monitor System...');
  monitor.stopPolling();
  analyticsProcessor.stop();
  console.log('✅ Shutdown complete');
  process.exit(0);
});

// Keep the process alive
console.log('\n📊 Domain Monitor System is running...');
console.log('Press Ctrl+C to stop\n');



