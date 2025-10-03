import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function setupDatabase() {
  console.log('🌐 Domain Monitor Database Setup');
  console.log('================================\n');

  try {
    // Test database connection first
    console.log('1️⃣ Testing database connection...');
    
    const { data: testData, error: testError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .limit(1);

    if (testError) {
      console.log('⚠️  Cannot access system tables, but connection may still work');
      console.log('   Proceeding with table verification...\n');
    } else {
      console.log('✅ Database connection successful\n');
    }

    // Check if tables already exist
    console.log('2️⃣ Checking existing tables...');
    
    const tablesToCheck = [
      'domain_events',
      'domain_subscriptions', 
      'webhook_deliveries',
      'domain_analytics',
      'domain_traits'
    ];

    let existingTables = [];
    let missingTables = [];

    for (const tableName of tablesToCheck) {
      try {
        const { error } = await supabase
          .from(tableName)
          .select('count')
          .limit(1);
        
        if (error) {
          missingTables.push(tableName);
        } else {
          existingTables.push(tableName);
        }
      } catch (err) {
        missingTables.push(tableName);
      }
    }

    if (existingTables.length > 0) {
      console.log('✅ Existing tables found:');
      existingTables.forEach(table => console.log(`   - ${table}`));
    }

    if (missingTables.length > 0) {
      console.log('❌ Missing tables:');
      missingTables.forEach(table => console.log(`   - ${table}`));
    }

    if (missingTables.length === 0) {
      console.log('\n🎉 All required tables already exist!');
      console.log('You can start the domain monitor with: npm start');
      return;
    }

    // Provide SQL file instructions
    console.log('\n3️⃣ Database setup required');
    console.log('================================');
    console.log('Please run the following SQL commands in your Supabase dashboard:');
    console.log('\n📋 Instructions:');
    console.log('1. Go to: https://supabase.com/dashboard/project/[your-project]/sql');
    console.log('2. Copy the contents of: supabase-schema.sql');
    console.log('3. Paste and execute the SQL commands');
    console.log('4. Run this script again to verify setup\n');

    // Read and display the SQL file
    const sqlFilePath = path.join(process.cwd(), 'supabase-schema.sql');
    
    if (fs.existsSync(sqlFilePath)) {
      console.log('📄 SQL Schema File Contents:');
      console.log('================================');
      const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
      console.log(sqlContent);
    } else {
      console.log('❌ supabase-schema.sql file not found');
      console.log('Please make sure the file exists in the domain-monitor directory');
    }

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.log('\nTroubleshooting:');
    console.log('1. Check your SUPABASE_URL and SUPABASE_ANON_KEY in .env file');
    console.log('2. Ensure your Supabase project is active');
    console.log('3. Verify you have the correct permissions');
  }
}

setupDatabase();


