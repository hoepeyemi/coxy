-- Fix RLS Policies for Domain Events
-- Run this in your Supabase SQL editor if you already have the tables

-- Add missing INSERT and UPDATE policies for domain_events
CREATE POLICY "Allow public insert access to domain_events" 
ON domain_events FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access to domain_events" 
ON domain_events FOR UPDATE 
USING (true);

-- Add missing UPDATE policy for domain_traits
CREATE POLICY "Allow public update access to domain_traits" 
ON domain_traits FOR UPDATE 
USING (true);

-- Verify the policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('domain_events', 'domain_subscriptions', 'webhook_deliveries', 'domain_analytics', 'domain_traits')
ORDER BY tablename, policyname;


