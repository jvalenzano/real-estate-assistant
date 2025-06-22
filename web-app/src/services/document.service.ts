import api from './api';

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
  type: string;
  pdfUrl: string;
  createdAt: string;
}

class DocumentService {
  async generateRPA(data: RPAFormData): Promise<DocumentResponse> {
    try {
      const response = await api.post<{ success: boolean; data: DocumentResponse }>('/documents/generate', {
        type: 'residential_purchase_agreement',
        propertyId: data.propertyId,
        data: {
          buyer: {
            name: data.buyerName
          },
          offer: {
            purchasePrice: data.offerPrice,
            closingDate: data.closingDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            contingencies: data.contingencies || ['inspection', 'financing', 'appraisal'],
            additionalTerms: data.additionalTerms || ''
          }
        }
      });
      
      return response.data.data;
    } catch (error: any) {
      console.error('Document generation error:', error);
      throw new Error(error.response?.data?.message || 'Failed to generate document');
    }
  }

  async getDocument(documentId: string): Promise<DocumentResponse> {
    try {
      const response = await api.get<{ success: boolean; data: DocumentResponse }>(`/documents/${documentId}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Get document error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch document');
    }
  }

  async downloadDocument(documentId: string): Promise<Blob> {
    try {
      const response = await api.get(`/documents/${documentId}/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      console.error('Download document error:', error);
      throw new Error(error.response?.data?.message || 'Failed to download document');
    }
  }
}

export default new DocumentService();