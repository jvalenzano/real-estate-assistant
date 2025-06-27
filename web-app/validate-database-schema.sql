-- Database Schema Validation Script
-- Run this in Supabase SQL Editor to check schema integrity

-- 1. Check all UUID columns in the documents table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'documents'
  AND data_type = 'uuid'
ORDER BY ordinal_position;

-- 2. Check foreign key constraints
SELECT 
  conname as constraint_name,
  conrelid::regclass as table_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE contype = 'f'
  AND conrelid::regclass::text = 'documents';

-- 3. Check for any invalid UUID values in existing data
SELECT 
  id,
  transaction_id,
  template_id,
  user_id,
  created_at
FROM documents 
WHERE 
  id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  OR transaction_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  OR (template_id IS NOT NULL AND template_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$')
  OR user_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';

-- 4. Check if document_templates table exists and has proper UUIDs
SELECT 
  id,
  template_code,
  created_at
FROM document_templates 
WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
LIMIT 5;

-- 5. Verify table structure matches expected schema
\d documents;
\d document_templates;

-- 6. Check RLS policies are in place
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('documents', 'document_templates', 'document_activity')
ORDER BY tablename, policyname;