-- Document Management System Schema
-- Based on Section 2.2 of the specification

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create ENUMs
CREATE TYPE document_status AS ENUM (
  'draft',
  'pending_signature',
  'partially_signed',
  'completed',
  'expired',
  'cancelled'
);

CREATE TYPE document_visibility AS ENUM (
  'private',
  'shared',
  'public'
);

CREATE TYPE signature_status AS ENUM (
  'pending',
  'signed',
  'declined',
  'expired'
);

CREATE TYPE activity_type AS ENUM (
  'created',
  'viewed',
  'edited',
  'signed',
  'shared',
  'downloaded',
  'completed',
  'expired',
  'cancelled'
);

-- Document Templates Table
CREATE TABLE document_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  template_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  category_number VARCHAR(2) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  car_form_number VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  is_commonly_used BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  version VARCHAR(20) DEFAULT '1.0.0',
  fields_schema JSONB NOT NULL DEFAULT '{}',
  signatures_schema JSONB NOT NULL DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for template lookups
CREATE INDEX idx_document_templates_code ON document_templates(template_code);
CREATE INDEX idx_document_templates_category ON document_templates(category, category_number);
CREATE INDEX idx_document_templates_active ON document_templates(is_active) WHERE is_active = true;

-- Documents Table
CREATE TABLE documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  template_id UUID REFERENCES document_templates(id) ON DELETE RESTRICT,
  property_id VARCHAR(20) NOT NULL,
  user_id UUID NOT NULL,
  transaction_id UUID,
  title VARCHAR(255) NOT NULL,
  status document_status DEFAULT 'draft',
  visibility document_visibility DEFAULT 'private',
  version INTEGER DEFAULT 1,
  field_data JSONB NOT NULL DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  file_url TEXT,
  thumbnail_url TEXT,
  expires_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for document queries
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_property_id ON documents(property_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX idx_documents_template_id ON documents(template_id);

-- Document Signatures Table
CREATE TABLE document_signatures (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  signer_email VARCHAR(255) NOT NULL,
  signer_name VARCHAR(255) NOT NULL,
  signer_role VARCHAR(50) NOT NULL,
  signature_field_id VARCHAR(100) NOT NULL,
  status signature_status DEFAULT 'pending',
  signature_data TEXT,
  signed_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for signature queries
CREATE INDEX idx_document_signatures_document_id ON document_signatures(document_id);
CREATE INDEX idx_document_signatures_signer_email ON document_signatures(signer_email);
CREATE INDEX idx_document_signatures_status ON document_signatures(status);

-- Document Activity Log Table
CREATE TABLE document_activity (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  activity_type activity_type NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for activity queries
CREATE INDEX idx_document_activity_document_id ON document_activity(document_id);
CREATE INDEX idx_document_activity_user_id ON document_activity(user_id);
CREATE INDEX idx_document_activity_created_at ON document_activity(created_at DESC);

-- Document Shares Table
CREATE TABLE document_shares (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL,
  shared_with_email VARCHAR(255) NOT NULL,
  permissions JSONB DEFAULT '{"view": true, "edit": false, "sign": false}',
  access_token VARCHAR(255) UNIQUE,
  expires_at TIMESTAMPTZ,
  accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for share queries
CREATE INDEX idx_document_shares_document_id ON document_shares(document_id);
CREATE INDEX idx_document_shares_access_token ON document_shares(access_token);
CREATE INDEX idx_document_shares_shared_with_email ON document_shares(shared_with_email);

-- Template Field Definitions Table (for dynamic forms)
CREATE TABLE template_field_definitions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  template_id UUID REFERENCES document_templates(id) ON DELETE CASCADE,
  field_id VARCHAR(100) NOT NULL,
  field_name VARCHAR(255) NOT NULL,
  field_type VARCHAR(50) NOT NULL,
  is_required BOOLEAN DEFAULT false,
  default_value TEXT,
  validation_rules JSONB DEFAULT '{}',
  display_options JSONB DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(template_id, field_id)
);

-- Create index for field lookups
CREATE INDEX idx_template_field_definitions_template_id ON template_field_definitions(template_id);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_document_templates_updated_at BEFORE UPDATE ON document_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_signatures_updated_at BEFORE UPDATE ON document_signatures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_shares ENABLE ROW LEVEL SECURITY;

-- Documents policies
CREATE POLICY "Users can view their own documents" ON documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own draft documents" ON documents
  FOR DELETE USING (auth.uid() = user_id AND status = 'draft');

-- Document shares policies
CREATE POLICY "Users can view documents shared with them" ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM document_shares
      WHERE document_shares.document_id = documents.id
      AND document_shares.shared_with_email = auth.email()
      AND (document_shares.expires_at IS NULL OR document_shares.expires_at > NOW())
    )
  );

-- Document activity policies
CREATE POLICY "Users can view activity for their documents" ON document_activity
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM documents
      WHERE documents.id = document_activity.document_id
      AND documents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can log activity for their documents" ON document_activity
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM documents
      WHERE documents.id = document_activity.document_id
      AND documents.user_id = auth.uid()
    )
  );

-- Document signatures policies
CREATE POLICY "Users can view signatures for their documents" ON document_signatures
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM documents
      WHERE documents.id = document_signatures.document_id
      AND documents.user_id = auth.uid()
    )
  );

CREATE POLICY "Signers can view their own signature requests" ON document_signatures
  FOR SELECT USING (signer_email = auth.email());

CREATE POLICY "Signers can update their own signatures" ON document_signatures
  FOR UPDATE USING (signer_email = auth.email() AND status = 'pending');

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false);

-- Storage policies
CREATE POLICY "Users can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );