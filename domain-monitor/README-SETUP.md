# 🗄️ Database Setup Guide

## Quick Setup

### Option 1: Using SQL File (Recommended)

1. **Copy the SQL schema:**
   ```bash
   # The SQL file is already created: supabase-schema.sql
   cat supabase-schema.sql
   ```

2. **Run in Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard/project/[your-project]/sql
   - Copy the entire contents of `supabase-schema.sql`
   - Paste and execute the SQL commands

3. **Verify setup:**
   ```bash
   npm run setup
   ```

### Option 2: Manual Table Creation

If you prefer to create tables manually, here are the essential tables:

#### 1. domain_events
```sql
CREATE TABLE domain_events (
  id SERIAL PRIMARY KEY,
  event_id BIGINT UNIQUE NOT NULL,
  name TEXT,
  token_id TEXT,
  type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. domain_subscriptions
```sql
CREATE TABLE domain_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  event_type TEXT NOT NULL,
  webhook_url TEXT NOT NULL,
  filters JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. domain_analytics
```sql
CREATE TABLE domain_analytics (
  id SERIAL PRIMARY KEY,
  domain_name TEXT NOT NULL,
  total_events INTEGER DEFAULT 0,
  total_volume_usd DECIMAL(20,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Verification

After running the SQL, verify the setup:

```bash
npm run setup
```

You should see:
```
✅ All required tables already exist!
You can start the domain monitor with: npm start
```

## Troubleshooting

### Common Issues

1. **Permission Denied**
   - Ensure you're using the correct Supabase project
   - Check that your API keys have the right permissions

2. **Tables Not Found**
   - Make sure you ran the SQL in the correct Supabase project
   - Check the table names match exactly

3. **Connection Issues**
   - Verify your `.env` file has correct `SUPABASE_URL` and `SUPABASE_ANON_KEY`
   - Ensure your Supabase project is active

### Environment Variables

Make sure your `.env` file contains:

```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
DOMA_API_KEY=your_doma_api_key_here
```

## Next Steps

Once the database is set up:

1. **Test the system:**
   ```bash
   npm test
   ```

2. **Start monitoring:**
   ```bash
   npm start
   ```

3. **View in frontend:**
   - The domain monitor will appear in your Iris dashboard
   - Navigate to the home page to see the domain monitoring section


