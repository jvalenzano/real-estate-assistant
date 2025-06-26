/**
 * Document-related TypeScript interfaces
 */

export interface Document {
  id: string;
  templateId: string;
  templateName: string;
  status: DocumentStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  metadata: DocumentMetadata;
  fields: DocumentFields;
  signatures?: SignatureData[];
}

export type DocumentStatus = 
  | 'draft'
  | 'pending_review'
  | 'pending_signature'
  | 'signed'
  | 'completed'
  | 'cancelled'
  | 'expired';

export interface DocumentMetadata {
  propertyId: string;
  propertyAddress: string;
  buyerId?: string;
  sellerId?: string;
  agentId?: string;
  transactionId?: string;
  category: string;
  categoryNumber: string;
  version: string;
  pageCount: number;
}

export interface DocumentFields {
  [key: string]: any;
  // Common fields
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  sellerName?: string;
  sellerEmail?: string;
  sellerPhone?: string;
  propertyAddress?: string;
  purchasePrice?: number;
  closingDate?: string;
  // Additional dynamic fields based on template
}

export interface SignatureData {
  fieldId: string;
  signerId: string;
  signerRole: 'buyer' | 'seller' | 'agent' | 'other';
  type: 'signature' | 'initial' | 'date';
  value?: string;
  signedAt?: Date;
  ipAddress?: string;
}

export interface DocumentGenerationRequest {
  templateId: string;
  propertyId: string;
  fields: DocumentFields;
  sendForSignature?: boolean;
  signers?: DocumentSigner[];
}

export interface DocumentSigner {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'agent' | 'other';
  order?: number;
}

export interface DocumentGenerationResponse {
  success: boolean;
  documentId: string;
  documentUrl?: string;
  signatureUrl?: string;
  previewUrl?: string;
  pdfUrl?: string;
  error?: string;
}

export interface DocumentListItem {
  id: string;
  templateId: string;
  templateName: string;
  propertyAddress: string;
  status: DocumentStatus;
  createdAt: Date;
  updatedAt: Date;
  thumbnailUrl?: string;
}

export interface DocumentFilter {
  status?: DocumentStatus[];
  templateId?: string[];
  propertyId?: string;
  createdBy?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchText?: string;
}

export interface DocumentActivity {
  id: string;
  documentId: string;
  action: DocumentAction;
  userId: string;
  userName: string;
  timestamp: Date;
  details?: string;
  ipAddress?: string;
}

export type DocumentAction =
  | 'created'
  | 'updated'
  | 'viewed'
  | 'downloaded'
  | 'sent_for_signature'
  | 'signed'
  | 'completed'
  | 'cancelled'
  | 'expired';

export interface DocumentStatistics {
  total: number;
  byStatus: Record<DocumentStatus, number>;
  byTemplate: Record<string, number>;
  recentActivity: DocumentActivity[];
  completionRate: number;
  averageCompletionTime: number; // in hours
}