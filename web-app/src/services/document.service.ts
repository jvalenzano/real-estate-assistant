import api from './nextjs-api';
import { PDFFormService } from './pdf-form.service';
import { TemplateService } from './template.service';
import { StorageService } from './storage.service';

export interface RPAFormData {
  propertyId: string;
  buyerName: string;
  offerPrice: number;
  closingDate?: string;
  contingencies?: string[];
  additionalTerms?: string;
}

export interface DocumentResponse {
  documentId: string;
  status?: string;
  type?: string;
  pdfUrl?: string;
  htmlPreviewUrl?: string;
  pdfDownloadUrl?: string;
  createdAt?: string;
}

export interface DocumentGenerationParams {
  templateCode: string;
  formData: Record<string, any>;
  transactionId: string;
  propertyId?: string;
}

export interface DocumentGenerationResult {
  documentId: string;
  templateCode: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  error?: string;
}

export class DocumentService {
  private pdfFormService: PDFFormService;
  private templateService: TemplateService;
  private storageService: StorageService;

  constructor() {
    this.pdfFormService = new PDFFormService();
    this.templateService = new TemplateService();
    this.storageService = new StorageService();
  }

  /**
   * Generate RPA document via API
   */
  async generateRPA(data: RPAFormData): Promise<DocumentResponse> {
    return this.generateDocument('CA_RPA', data);
  }

  /**
   * Generate document with any template code
   */
  async generateDocument(params: DocumentGenerationParams): Promise<DocumentGenerationResult> {
    console.log('Generating document:', params);

    try {
      // Call the Next.js API endpoint instead of external API
      const response = await fetch('/api/v1/documents/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateCode: params.templateCode,
          formData: params.formData,
          transactionId: params.transactionId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate document');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Document generation failed');
      }

      return result.data;
    } catch (error) {
      console.error('Document generation error:', error);
      throw error;
    }
  }

  /**
   * Get document details
   */
  async getDocument(documentId: string) {
    try {
      // For now, return mock data until Supabase is set up
      // TODO: Implement actual document fetching when backend is ready
      return {
        id: documentId,
        templateCode: 'CA_RPA',
        status: 'completed',
        createdAt: new Date().toISOString(),
        formData: {
          propertyAddress: '789 Ocean View Dr, San Diego, CA 92037',
          buyerName: 'Demo Buyer',
          offerPrice: 1250000
        }
      };
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  }

  /**
   * Download document PDF
   */
  async downloadDocument(documentId: string): Promise<Blob> {
    const url = `/documents/${documentId}/pdf`;
    console.log('Attempting PDF download from:', url);
    
    try {
      const blob = await api.getBlob(url);
      console.log('PDF downloaded successfully');
      return blob;
    } catch (error: any) {
      console.error('Download failed with status:', error.response?.status);
      console.error('Failed URL:', error.config?.url);
      console.error('Response:', error.response?.data);
      
      // Don't log 404 errors as they're expected when PDF hasn't been generated yet
      if (error.response?.status !== 404) {
        console.error('Download document error details:', error);
      }
      throw error;
    }
  }

  async listDocuments(transactionId?: string) {
    try {
      // For now, return mock data until Supabase is set up
      // TODO: Implement actual document listing when backend is ready
      return [
        {
          id: 'doc-001',
          templateCode: 'CA_RPA',
          status: 'completed',
          createdAt: new Date().toISOString(),
          transactionId: transactionId || 'trans-001',
          propertyAddress: '789 Ocean View Dr, San Diego, CA 92037'
        }
      ];
    } catch (error) {
      console.error('Error listing documents:', error);
      throw error;
    }
  }

  async updateDocumentStatus(
    documentId: string, 
    status: 'pending' | 'processing' | 'completed' | 'failed',
    error?: string
  ) {
    try {
      // For now, return mock data until Supabase is set up
      // TODO: Implement actual status update when backend is ready
      console.log('Updating document status:', { documentId, status, error });
      
      return {
        id: documentId,
        status,
        updated_at: new Date().toISOString(),
        error
      };
    } catch (error) {
      console.error('Error updating document status:', error);
      throw error;
    }
  }

  // TODO: Implement these methods when PDF generation is ready
  async fillPDFForm(templateCode: string, formData: Record<string, any>): Promise<Uint8Array> {
    // This will use pdfFormService to fill the PDF
    // For now, throw not implemented
    throw new Error('PDF form filling not yet implemented');
  }

  async uploadToSupabase(pdfBytes: Uint8Array, fileName: string): Promise<string> {
    // This will use storageService to upload to Supabase
    // For now, throw not implemented
    throw new Error('Supabase upload not yet implemented');
  }
}

// Export singleton instance
export const documentService = new DocumentService();
export default documentService;