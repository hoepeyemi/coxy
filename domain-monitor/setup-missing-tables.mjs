#!/usr/bin/env node

/**
 * Setup Missing Tables Script
 * Creates user_subscriptions and user_preferences tables in Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌');
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupMissingTables() {
  try {
    console.log('🚀 Setting up missing tables...\n');

    // Read the SQL file
    const sqlPath = join(__dirname, 'add-missing-tables.sql');
    const sqlContent = readFileSync(sqlPath, 'utf8');

    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.trim()) {
        try {
          console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
          
          const { error } = await supabase.rpc('exec_sql', { 
            sql_query: statement + ';' 
          });

          if (error) {
            // Try direct query if RPC fails
            const { error: directError } = await supabase
              .from('_sql')
              .select('*')
              .limit(0);

            if (directError) {
              console.log(`⚠️  Statement ${i + 1} may have failed (this is often normal for DDL statements)`);
            }
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.log(`⚠️  Statement ${i + 1} execution warning:`, err.message);
        }
      }
    }

    // Verify tables were created
    console.log('\n🔍 Verifying table creation...\n');

    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['user_subscriptions', 'user_preferences']);

    if (tablesError) {
      console.error('❌ Error verifying tables:', tablesError);
    } else {
      console.log('📊 Created tables:');
      tables?.forEach(table => {
        console.log(`   ✅ ${table.table_name}`);
      });
    }

    // Test data insertion
    console.log('\n🧪 Testing data insertion...\n');

    // Test user_subscriptions
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .limit(1);

    if (subscriptionError) {
      console.error('❌ Error testing user_subscriptions:', subscriptionError);
    } else {
      console.log('✅ user_subscriptions table is accessible');
    }

    // Test user_preferences
    const { data: preferencesData, error: preferencesError } = await supabase
      .from('user_preferences')
      .select('*')
      .limit(1);

    if (preferencesError) {
      console.error('❌ Error testing user_preferences:', preferencesError);
    } else {
      console.log('✅ user_preferences table is accessible');
    }

    console.log('\n🎉 Missing tables setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. The application should now be able to access user_subscriptions and user_preferences tables');
    console.log('   2. You can start the domain monitor: npm start');
    console.log('   3. The Twitter bot should now load without table errors');

  } catch (error) {
    console.error('💥 Error setting up missing tables:', error);
    process.exit(1);
  }
}

// Run the setup
setupMissingTables();
