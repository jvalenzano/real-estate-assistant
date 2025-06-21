import { Request } from 'express';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta: {
    timestamp: string;
    version: string;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// User Types
export interface User {
  id: string;
  email: string;
  role: 'agent' | 'broker' | 'admin';
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

// Property Types
export interface PropertyAddress {
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  zip_code: string;
  county: string;
}

export interface PropertyFeatures {
  exterior: string[];
  interior: string[];
  utilities: string[];
}

export interface PropertyImage {
  url: string;
  alt_text: string;
  is_primary: boolean;
  display_order: number;
}

export interface Property {
  id: string;
  mls_number: string;
  address: PropertyAddress;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  lot_size_sqft: number;
  year_built: number;
  list_price: number;
  price_per_sqft: number;
  estimated_monthly_payment: number;
  property_taxes_annual: number;
  hoa_fees_monthly: number;
  listing_status: 'active' | 'pending' | 'sold' | 'off-market';
  days_on_market: number;
  listing_date: string;
  demo_scenario?: string;
  demo_priority?: number;
  description?: string;
  features?: PropertyFeatures;
  images?: PropertyImage[];
}

export interface PropertySearchParams {
  q?: string; // General search query
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  city?: string;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'days_on_market';
  limit?: number;
  offset?: number;
}

export interface PropertySearchResponse {
  properties: Property[];
  total: number;
  query: string;
  searchTime: number;
  filters: PropertySearchParams;
  suggestions?: string[];
}

// Document Types
export interface Document {
  id: string;
  type: 'rpa' | 'disclosure' | 'addendum';
  propertyId: string;
  buyerId: string;
  sellerId: string;
  agentId: string;
  status: 'draft' | 'generated' | 'finalized' | 'sent' | 'signed' | 'completed';
  fields: DocumentFields;
  docusignEnvelopeId?: string;
  htmlContent?: string;
  pdfPath?: string;
  createdAt: string;
  updatedAt: string;
  finalizedAt?: string;
}

export interface DocumentFields {
  // Property details
  apn?: string;
  
  // Financial terms
  offerPrice: number;
  initialDeposit: number;
  additionalDeposit?: number;
  downPayment: number;
  loanAmount: number;
  
  // Loan information
  loanType: {
    conventional?: boolean;
    fha?: boolean;
    va?: boolean;
    cash?: boolean;
  };
  
  // Buyer information
  buyerName: string;
  buyerAddress: string;
  buyerPhone: string;
  buyerEmail: string;
  secondBuyerName?: string;
  
  // Seller information
  sellerName: string;
  sellerAddress: string;
  secondSellerName?: string;
  
  // Escrow details
  escrowCompany: string;
  escrowOfficer: string;
  closeDate: string;
  escrowDays: number;
  
  // Contingencies
  contingencies: {
    inspection: boolean;
    loan: boolean;
    appraisal: boolean;
    saleOfProperty: boolean;
  };
  
  contingencyPeriods: {
    inspection: number;
    loan: number;
    appraisal: number;
  };
  
  // Included/Excluded items
  includedItems?: string;
  excludedItems?: string;
  
  // Additional terms
  additionalTerms?: string;
  
  // Agent information
  listingAgent?: string;
  listingAgentLicense?: string;
}

export interface DocumentGenerationRequest {
  propertyId: string;
  documentType: 'rpa' | 'disclosure' | 'addendum';
  data: Partial<DocumentFields>;
}

export interface DocumentGenerationResponse {
  documentId: string;
  status: string;
  htmlPreviewUrl: string;
  pdfDownloadUrl: string;
}

export interface DocumentField {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select';
  label: string;
  value: any;
  required: boolean;
  editable: boolean;
  options?: string[]; // for select fields
}

// Transaction Types
export interface Transaction {
  id: string;
  propertyId: string;
  buyerId: string;
  sellerId: string;
  agentId: string;
  status: 'initiated' | 'documents-pending' | 'signatures-pending' | 'completed' | 'cancelled';
  offerPrice: number;
  documents: string[];
  timeline: TransactionEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface TransactionEvent {
  id: string;
  type: 'offer-submitted' | 'documents-generated' | 'documents-signed' | 'closing-scheduled';
  timestamp: string;
  description: string;
  userId: string;
}

// Authentication Types
export interface AuthRequest extends Request {
  user?: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Session Types
export interface UserSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
  lastAccessedAt: string;
  ipAddress?: string;
  userAgent?: string;
}