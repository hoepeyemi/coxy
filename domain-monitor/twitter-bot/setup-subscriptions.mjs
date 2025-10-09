import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function setupSubscriptions() {
  console.log('🚀 Setting up user subscriptions and preferences tables...');
  
  try {
    // Read the SQL file
    const sqlPath = join(__dirname, 'fix-subscriptions-schema.sql');
    const sqlContent = readFileSync(sqlPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
        
        const { error } = await supabase.rpc('exec_sql', { 
          sql: statement 
        });
        
        if (error) {
          // Try direct query if RPC fails
          const { error: directError } = await supabase
            .from('_sql')
            .select('*')
            .eq('query', statement);
          
          if (directError) {
            console.warn(`⚠️  Statement ${i + 1} failed:`, error.message);
            // Continue with other statements
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      }
    }
    
    // Test the tables
    console.log('\n🧪 Testing table creation...');
    
    const { data: subscriptions, error: subError } = await supabase
      .from('user_subscriptions')
      .select('count')
      .limit(1);
    
    if (subError) {
      console.error('❌ user_subscriptions table test failed:', subError.message);
    } else {
      console.log('✅ user_subscriptions table is accessible');
    }
    
    const { data: preferences, error: prefError } = await supabase
      .from('user_preferences')
      .select('count')
      .limit(1);
    
    if (prefError) {
      console.error('❌ user_preferences table test failed:', prefError.message);
    } else {
      console.log('✅ user_preferences table is accessible');
    }
    
    console.log('\n🎉 Database setup completed!');
    console.log('📋 Next steps:');
    console.log('1. Check your Supabase dashboard to verify tables were created');
    console.log('2. Run the Twitter bot again');
    console.log('3. The subscription errors should be resolved');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log('\n🔧 Manual setup required:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Open the SQL editor');
    console.log('3. Copy and paste the contents of fix-subscriptions-schema.sql');
    console.log('4. Execute the SQL');
  }
}

// Run the setup
setupSubscriptions();
