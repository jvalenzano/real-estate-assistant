import api from './nextjs-api';
// PDF processing is now handled server-side only
// import { TemplateService } from './template.service';
// import { StorageService } from './storage.service';

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
  // PDF processing is now handled server-side through API calls only
  // No direct PDF service instances needed on client side

  constructor() {
    // Client-side service only makes API calls
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
      // Try to fetch from Supabase first
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        try {
          const response = await fetch('/api/v1/documents/' + documentId, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
              // Map database response to UI format
              const doc = result.data;
              return {
                documentId: doc.id || documentId,
                status: doc.status || 'completed',
                type: doc.template_code || 'CA_RPA',
                pdfUrl: doc.file_url ? `/api/v1/documents/${documentId}/download` : undefined,
                createdAt: doc.created_at || doc.createdAt,
                formData: doc.field_data || {}
              };
            }
          }
        } catch (fetchError) {
          console.error('Failed to fetch from database, using mock data:', fetchError);
        }
      }
      
      // Fallback to mock data with correct field names
      return {
        documentId: documentId,
        status: 'completed',
        type: 'CA_RPA',
        pdfUrl: `/api/v1/documents/${documentId}/download`,
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
    const url = `/api/v1/documents/${documentId}/download`;
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

  // PDF processing methods removed - all PDF handling is server-side only
  // Use generateDocument() API method which handles everything server-side
}

// Export singleton instance
export const documentService = new DocumentService();
export default documentService;