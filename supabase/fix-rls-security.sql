-- Fix RLS Security Issues for Demo Environment
-- This script adds demo-friendly policies while maintaining security structure

-- First, drop existing restrictive policies that require auth
DROP POLICY IF EXISTS "Users can view their own documents" ON documents;
DROP POLICY IF EXISTS "Users can create their own documents" ON documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON documents;
DROP POLICY IF EXISTS "Users can delete their own draft documents" ON documents;
DROP POLICY IF EXISTS "Users can view documents shared with them" ON documents;
DROP POLICY IF EXISTS "Users can view activity for their documents" ON document_activity;
DROP POLICY IF EXISTS "Users can log activity for their documents" ON document_activity;
DROP POLICY IF EXISTS "Users can view signatures for their documents" ON document_signatures;
DROP POLICY IF EXISTS "Signers can view their own signature requests" ON document_signatures;
DROP POLICY IF EXISTS "Signers can update their own signatures" ON document_signatures;

-- Enable RLS on template tables (if not already enabled)
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_field_definitions ENABLE ROW LEVEL SECURITY;

-- Create demo-friendly policies for document_templates
DROP POLICY IF EXISTS "Allow public read access to document templates" ON public.document_templates;
CREATE POLICY "Allow public read access to document templates" 
ON public.document_templates FOR SELECT 
USING (true);

-- Create demo-friendly policies for template_field_definitions
DROP POLICY IF EXISTS "Allow public read access to template fields" ON public.template_field_definitions;
CREATE POLICY "Allow public read access to template fields" 
ON public.template_field_definitions FOR SELECT 
USING (true);

-- Create demo-friendly policies for documents (allow anonymous access for demo)
DROP POLICY IF EXISTS "Demo: Allow public read access to documents" ON public.documents;
CREATE POLICY "Demo: Allow public read access to documents" 
ON public.documents FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Demo: Allow public insert access to documents" ON public.documents;
CREATE POLICY "Demo: Allow public insert access to documents" 
ON public.documents FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Demo: Allow public update access to documents" ON public.documents;
CREATE POLICY "Demo: Allow public update access to documents" 
ON public.documents FOR UPDATE 
USING (true);

-- Create demo-friendly policies for document_activity
DROP POLICY IF EXISTS "Demo: Allow public read access to document activity" ON public.document_activity;
CREATE POLICY "Demo: Allow public read access to document activity" 
ON public.document_activity FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Demo: Allow public insert access to document activity" ON public.document_activity;
CREATE POLICY "Demo: Allow public insert access to document activity" 
ON public.document_activity FOR INSERT 
WITH CHECK (true);

-- Grant necessary permissions to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.document_templates TO anon;
GRANT SELECT ON public.template_field_definitions TO anon;
GRANT SELECT, INSERT, UPDATE ON public.documents TO anon;
GRANT SELECT, INSERT ON public.document_activity TO anon;

-- Also grant to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.document_templates TO authenticated;
GRANT SELECT ON public.template_field_definitions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.documents TO authenticated;
GRANT SELECT, INSERT ON public.document_activity TO authenticated;

-- Update storage policies to allow anonymous access for demo
DROP POLICY IF EXISTS "Users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;

-- Create demo-friendly storage policies
CREATE POLICY "Demo: Allow public document uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Demo: Allow public document access" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Demo: Allow public document updates" ON storage.objects
  FOR UPDATE USING (bucket_id = 'documents');

CREATE POLICY "Demo: Allow public document deletion" ON storage.objects
  FOR DELETE USING (bucket_id = 'documents');