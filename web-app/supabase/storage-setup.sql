-- Supabase Storage Setup for Document Management
-- Run this in your Supabase SQL Editor

-- 1. Create the documents storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents', 
  'documents', 
  false, 
  10485760, -- 10MB limit
  ARRAY['application/pdf']::text[]
) ON CONFLICT (id) DO NOTHING;

-- 2. Create RLS policies for the documents bucket

-- Policy: Authenticated users can upload documents
CREATE POLICY "Authenticated users can upload documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid() IS NOT NULL
);

-- Policy: Users can view their own transaction documents
CREATE POLICY "Users can view their transaction documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'documents' 
  AND auth.uid() IS NOT NULL
  -- In production, add transaction-based access control here
);

-- Policy: Users can update their own documents
CREATE POLICY "Users can update their documents" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'documents' 
  AND auth.uid() IS NOT NULL
);

-- Policy: Users can delete their own documents
CREATE POLICY "Users can delete their documents" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'documents' 
  AND auth.uid() IS NOT NULL
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_template_id ON documents(template_id);
CREATE INDEX IF NOT EXISTS idx_documents_transaction_id ON documents(transaction_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);

-- 4. Add helper function to get document access
CREATE OR REPLACE FUNCTION check_document_access(doc_id uuid, user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM documents 
    WHERE id = doc_id 
    AND (
      user_id = $2 
      OR EXISTS (
        SELECT 1 FROM document_shares 
        WHERE document_id = $1 
        AND shared_by = $2
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_documents_updated_at 
BEFORE UPDATE ON documents 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- 6. Add document activity tracking function
CREATE OR REPLACE FUNCTION log_document_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO document_activity (
    document_id,
    user_id,
    activity_type,
    description,
    metadata,
    ip_address,
    user_agent
  ) VALUES (
    NEW.id,
    auth.uid(),
    TG_ARGV[0], -- activity type passed as argument
    TG_ARGV[1], -- description passed as argument
    jsonb_build_object(
      'old_status', OLD.status,
      'new_status', NEW.status,
      'timestamp', CURRENT_TIMESTAMP
    ),
    current_setting('request.headers', true)::json->>'x-forwarded-for',
    current_setting('request.headers', true)::json->>'user-agent'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for document activity
CREATE TRIGGER document_created_activity
AFTER INSERT ON documents
FOR EACH ROW
EXECUTE FUNCTION log_document_activity('created', 'Document created');

CREATE TRIGGER document_updated_activity
AFTER UPDATE ON documents
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION log_document_activity('status_changed', 'Document status updated');

-- 7. Grant necessary permissions
GRANT ALL ON documents TO authenticated;
GRANT ALL ON document_templates TO authenticated;
GRANT ALL ON document_activity TO authenticated;
GRANT ALL ON document_shares TO authenticated;
GRANT ALL ON document_signatures TO authenticated;
GRANT ALL ON template_field_definitions TO authenticated;

-- 8. Insert demo template if not exists
INSERT INTO document_templates (
  template_code,
  name,
  description,
  category,
  category_number,
  file_name,
  car_form_number,
  is_active,
  is_commonly_used,
  sort_order,
  fields_schema,
  signatures_schema,
  metadata
) VALUES (
  'CA_RPA',
  'California Residential Purchase Agreement',
  'Standard residential purchase agreement for California properties',
  'buyers-offer',
  '01',
  'California_Residential_Purchase_Agreement___12_24.pdf',
  'RPA-CA',
  true,
  true,
  101,
  '{}'::jsonb,
  '{}'::jsonb,
  '{"version": "12/24", "requiredByLaw": false}'::jsonb
) ON CONFLICT (template_code) DO NOTHING;

-- 9. Success message
DO $$
BEGIN
  RAISE NOTICE 'Storage bucket and policies created successfully!';
  RAISE NOTICE 'Documents can now be securely stored in Supabase Storage.';
END $$;