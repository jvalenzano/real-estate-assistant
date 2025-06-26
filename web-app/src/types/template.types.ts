/**
 * Template-related TypeScript interfaces
 */

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryNumber: string;
  version: string;
  pageCount: number;
  fields: TemplateField[];
  signatureFields: SignatureField[];
  metadata: TemplateMetadata;
}

export interface TemplateField {
  name: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  section: string;
  defaultValue?: any;
  validation?: FieldValidation;
  options?: FieldOption[];
  dependsOn?: FieldDependency;
  implemented: boolean;
}

export type FieldType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'email'
  | 'phone'
  | 'address'
  | 'currency'
  | 'percentage'
  | 'text'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox';

export interface FieldValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  custom?: (value: any) => boolean | string;
}

export interface FieldOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FieldDependency {
  field: string;
  condition: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
  value: any;
}

export interface SignatureField {
  id: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  role: SignerRole;
  type: SignatureType;
  required: boolean;
  label: string;
  group?: string;
  implemented: boolean;
}

export type SignerRole = 'buyer' | 'seller' | 'agent' | 'broker' | 'escrow' | 'other';
export type SignatureType = 'signature' | 'initial' | 'date' | 'text' | 'checkbox';

export interface TemplateMetadata {
  templateId: string;
  templateName: string;
  originalFileName: string;
  carFormNumber?: string;
  formRevisionDate?: string;
  requiredByLaw: boolean;
  commonlyUsed: boolean;
  dependencies: string[];
  relatedForms: string[];
  requiredDisclosures: string[];
  legalNotes?: string;
  usageNotes?: string;
  keywords: string[];
  implementationStatus: ImplementationStatus;
}

export interface ImplementationStatus {
  template: boolean;
  fields: boolean;
  signatures: boolean;
  testing: boolean;
}

export interface TemplateSection {
  id: string;
  name: string;
  description: string;
  order: number;
  fields: string[]; // Field names
  required?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export interface TemplateCategory {
  number: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  templates: string[]; // Template IDs
}

export interface TemplateSearchResult {
  template: Template;
  score: number;
  matches: {
    field: string;
    snippet: string;
  }[];
}

export interface TemplateUsageStats {
  templateId: string;
  usageCount: number;
  lastUsed: Date;
  averageCompletionTime: number;
  completionRate: number;
  commonErrors: {
    field: string;
    errorType: string;
    count: number;
  }[];
}