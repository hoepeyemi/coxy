import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

class DatabaseSetup {
  constructor() {
    this.sqlFile = path.join(process.cwd(), 'supabase-enhanced-schema.sql');
  }

  async setup() {
    console.log('🗄️ Setting up Twitter Bot Database Schema...\n');
    
    try {
      // Check if SQL file exists
      if (!fs.existsSync(this.sqlFile)) {
        throw new Error(`SQL file not found: ${this.sqlFile}`);
      }

      // Read SQL file
      const sqlContent = fs.readFileSync(this.sqlFile, 'utf8');
      console.log('📄 SQL file loaded successfully');

      // Split SQL into individual statements
      const statements = this.splitSQLStatements(sqlContent);
      console.log(`📝 Found ${statements.length} SQL statements to execute`);

      // Execute statements one by one
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i].trim();
        
        if (!statement || statement.startsWith('--')) {
          continue; // Skip empty lines and comments
        }

        try {
          console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
          
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          
          if (error) {
            console.log(`⚠️ Statement ${i + 1} warning: ${error.message}`);
            errorCount++;
          } else {
            successCount++;
          }
        } catch (err) {
          console.log(`❌ Statement ${i + 1} error: ${err.message}`);
          errorCount++;
        }
      }

      console.log(`\n📊 Execution Summary:`);
      console.log(`✅ Successful: ${successCount}`);
      console.log(`⚠️ Warnings/Errors: ${errorCount}`);

      // Verify tables were created
      await this.verifyTables();

      console.log('\n🎉 Database setup completed!');
      console.log('\n📋 Next steps:');
      console.log('1. Run: npm test (to test the bot)');
      console.log('2. Run: npm start (to start the bot)');
      console.log('3. Check Supabase dashboard to verify tables');

    } catch (error) {
      console.error('❌ Database setup failed:', error.message);
      console.log('\n🔧 Manual Setup Instructions:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy and paste the contents of supabase-enhanced-schema.sql');
      console.log('4. Run the SQL script');
      process.exit(1);
    }
  }

  splitSQLStatements(sqlContent) {
    // Split by semicolon, but be careful with semicolons inside strings
    const statements = [];
    let currentStatement = '';
    let inString = false;
    let stringChar = '';

    for (let i = 0; i < sqlContent.length; i++) {
      const char = sqlContent[i];
      const prevChar = i > 0 ? sqlContent[i - 1] : '';

      if (char === "'" || char === '"') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar && prevChar !== '\\') {
          inString = false;
          stringChar = '';
        }
      }

      currentStatement += char;

      if (char === ';' && !inString) {
        statements.push(currentStatement.trim());
        currentStatement = '';
      }
    }

    if (currentStatement.trim()) {
      statements.push(currentStatement.trim());
    }

    return statements.filter(stmt => stmt.length > 0);
  }

  async verifyTables() {
    console.log('\n🔍 Verifying tables...');
    
    const expectedTables = [
      'twitter_tweets',
      'twitter_analytics',
      'twitter_bot_config',
      'twitter_opportunities',
      'twitter_engagement',
      'twitter_followers'
    ];

    try {
      const { data: tables, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .in('table_name', expectedTables);

      if (error) throw error;

      const existingTables = tables.map(t => t.table_name);
      const missingTables = expectedTables.filter(t => !existingTables.includes(t));

      if (missingTables.length === 0) {
        console.log('✅ All required tables found');
      } else {
        console.log(`⚠️ Missing tables: ${missingTables.join(', ')}`);
      }

      // Check configuration
      const { data: config, error: configError } = await supabase
        .from('twitter_bot_config')
        .select('config_key, config_value');

      if (!configError && config) {
        console.log(`✅ Configuration loaded: ${config.length} settings`);
      }

    } catch (error) {
      console.log(`⚠️ Could not verify tables: ${error.message}`);
    }
  }
}

// Run setup
const setup = new DatabaseSetup();
setup.setup().catch(console.error);

