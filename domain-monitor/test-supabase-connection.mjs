import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...');
console.log('SUPABASE_URL:', SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_KEY:', SUPABASE_KEY ? '✅ Set' : '❌ Missing');

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing required environment variables!');
  console.log('Please check your .env file and ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testConnection() {
  try {
    console.log('🔄 Testing database connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('domain_events')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error);
      return;
    }
    
    console.log('✅ Database connection successful!');
    console.log('📊 Sample data:', data);
    
    // Test table existence
    const { data: tables, error: tableError } = await supabase
      .from('domain_events')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Table access failed:', tableError);
      console.log('💡 Make sure the database schema has been set up correctly.');
      return;
    }
    
    console.log('✅ Table access successful!');
    console.log('🎉 Supabase connection is working properly!');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

testConnection();



