import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Testing Environment Variables...');
console.log('DOMA_API_KEY exists:', !!process.env.DOMA_API_KEY);
console.log('SUPABASE_URL exists:', !!process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY exists:', !!process.env.SUPABASE_ANON_KEY);

if (process.env.DOMA_API_KEY) {
  console.log('DOMA_API_KEY length:', process.env.DOMA_API_KEY.length);
  console.log('DOMA_API_KEY starts with:', process.env.DOMA_API_KEY.substring(0, 10) + '...');
}

if (process.env.SUPABASE_URL) {
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
}

console.log('✅ Environment test complete');



