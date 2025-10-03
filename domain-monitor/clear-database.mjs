import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function clearDatabase() {
  console.log('🧹 Clearing domain monitoring database...\n');

  try {
    // Clear all tables in the correct order (respecting foreign key constraints)
    const tables = [
      'webhook_deliveries',
      'domain_events', 
      'domain_analytics',
      'domain_traits',
      'domain_subscriptions'
    ];

    for (const table of tables) {
      console.log(`Clearing ${table}...`);
      
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', 0); // Delete all rows (using a condition that's always true)
      
      if (error) {
        console.error(`Error clearing ${table}:`, error);
      } else {
        console.log(`✅ Cleared ${table}`);
      }
    }

    console.log('\n🎉 Database cleared successfully!');
    console.log('You can now start the domain monitor fresh with: yarn start-working');

  } catch (error) {
    console.error('Error clearing database:', error);
  }
}

clearDatabase();


