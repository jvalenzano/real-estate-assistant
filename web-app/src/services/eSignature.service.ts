/**
 * E-Signature Service
 * Provides e-signature functionality with mock fallback for demo
 */

export interface SignatureRequest {
  documentId: string;
  templateId: string;
  signers: Signer[];
  redirectUrl?: string;
  expiresIn?: number; // Days
}

export interface Signer {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'agent' | 'other';
  order?: number;
}

export interface SignatureStatus {
  documentId: string;
  status: 'pending' | 'sent' | 'viewed' | 'signed' | 'completed' | 'declined';
  signers: SignerStatus[];
  completedAt?: Date;
  expiresAt?: Date;
}

export interface SignerStatus {
  signerId: string;
  status: 'pending' | 'sent' | 'viewed' | 'signed' | 'declined';
  signedAt?: Date;
  ipAddress?: string;
}

export interface SignatureProvider {
  name: string;
  sendForSignature(request: SignatureRequest): Promise<string>; // Returns signing URL
  getStatus(documentId: string): Promise<SignatureStatus>;
  downloadSigned(documentId: string): Promise<Blob>;
  cancelRequest(documentId: string): Promise<void>;
}

/**
 * Mock signature provider for demo/development
 */
class MockSignatureProvider implements SignatureProvider {
  name = 'MockProvider';
  private mockSignatures: Map<string, SignatureStatus> = new Map();

  async sendForSignature(request: SignatureRequest): Promise<string> {
    console.log('[MockSignatureProvider] Creating mock signature request:', request);
    
    // Create mock status
    const status: SignatureStatus = {
      documentId: request.documentId,
      status: 'sent',
      signers: request.signers.map(signer => ({
        signerId: signer.id,
        status: 'sent'
      })),
      expiresAt: new Date(Date.now() + (request.expiresIn || 30) * 24 * 60 * 60 * 1000)
    };
    
    this.mockSignatures.set(request.documentId, status);
    
    // Return mock signing URL
    return `${window.location.origin}/mock-signature/${request.documentId}`;
  }

  async getStatus(documentId: string): Promise<SignatureStatus> {
    const status = this.mockSignatures.get(documentId);
    if (!status) {
      throw new Error(`No signature request found for document ${documentId}`);
    }
    
    // Simulate progression: sent -> viewed -> signed -> completed
    if (status.status === 'sent') {
      // Simulate viewing after 2 seconds
      setTimeout(() => {
        status.status = 'viewed';
        status.signers.forEach(s => s.status = 'viewed');
      }, 2000);
    } else if (status.status === 'viewed') {
      // Simulate signing after 5 seconds
      setTimeout(() => {
        status.status = 'signed';
        status.signers.forEach(s => {
          s.status = 'signed';
          s.signedAt = new Date();
          s.ipAddress = '127.0.0.1';
        });
      }, 5000);
    } else if (status.status === 'signed') {
      // Complete after all signed
      status.status = 'completed';
      status.completedAt = new Date();
    }
    
    return status;
  }

  async downloadSigned(documentId: string): Promise<Blob> {
    console.log('[MockSignatureProvider] Downloading mock signed document:', documentId);
    
    // In a real implementation, this would download the signed PDF
    // For mock, we'll return a simple PDF blob
    const mockPdfContent = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Resources<</Font<</F1 4 0 R>>>>endobj
4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
5 0 obj<</Length 200>>stream
BT /F1 12 Tf 100 700 Td (Mock Signed Document) Tj ET
BT /F1 10 Tf 100 680 Td (Document ID: ${documentId}) Tj ET
BT /F1 10 Tf 100 660 Td (Status: Signed and Completed) Tj ET
BT /F1 10 Tf 100 640 Td (Date: ${new Date().toLocaleString()}) Tj ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000056 00000 n
0000000111 00000 n
0000000203 00000 n
0000000281 00000 n
trailer<</Size 6/Root 1 0 R>>
startxref
644
%%EOF`;
    
    return new Blob([mockPdfContent], { type: 'application/pdf' });
  }

  async cancelRequest(documentId: string): Promise<void> {
    console.log('[MockSignatureProvider] Cancelling mock signature request:', documentId);
    this.mockSignatures.delete(documentId);
  }
}

/**
 * DocuSign provider (requires API credentials)
 */
class DocuSignProvider implements SignatureProvider {
  name = 'DocuSign';
  private apiKey: string;
  private accountId: string;
  
  constructor(apiKey: string, accountId: string) {
    this.apiKey = apiKey;
    this.accountId = accountId;
  }

  async sendForSignature(request: SignatureRequest): Promise<string> {
    // Implementation would use DocuSign API
    throw new Error('DocuSign integration not implemented. Using mock provider.');
  }

  async getStatus(documentId: string): Promise<SignatureStatus> {
    throw new Error('DocuSign integration not implemented. Using mock provider.');
  }

  async downloadSigned(documentId: string): Promise<Blob> {
    throw new Error('DocuSign integration not implemented. Using mock provider.');
  }

  async cancelRequest(documentId: string): Promise<void> {
    throw new Error('DocuSign integration not implemented. Using mock provider.');
  }
}

/**
 * Main e-signature service
 */
export class ESignatureService {
  private static instance: ESignatureService;
  private provider: SignatureProvider;
  
  private constructor() {
    // Default to mock provider
    this.provider = new MockSignatureProvider();
  }

  static getInstance(): ESignatureService {
    if (!ESignatureService.instance) {
      ESignatureService.instance = new ESignatureService();
    }
    return ESignatureService.instance;
  }

  /**
   * Initialize with a specific provider
   */
  initialize(provider?: SignatureProvider): void {
    if (provider) {
      this.provider = provider;
      console.log(`[ESignatureService] Initialized with ${provider.name}`);
    } else {
      console.log('[ESignatureService] Using mock provider for demo');
    }
  }

  /**
   * Send document for signature
   */
  async sendForSignature(request: SignatureRequest): Promise<string> {
    console.log('[ESignatureService] Sending document for signature:', request.documentId);
    
    try {
      return await this.provider.sendForSignature(request);
    } catch (error) {
      console.error('[ESignatureService] Error sending for signature:', error);
      
      // Fallback to mock if real provider fails
      if (!(this.provider instanceof MockSignatureProvider)) {
        console.log('[ESignatureService] Falling back to mock provider');
        const mockProvider = new MockSignatureProvider();
        return await mockProvider.sendForSignature(request);
      }
      
      throw error;
    }
  }

  /**
   * Check signature status
   */
  async getSignatureStatus(documentId: string): Promise<SignatureStatus> {
    return await this.provider.getStatus(documentId);
  }

  /**
   * Download signed document
   */
  async downloadSignedDocument(documentId: string): Promise<Blob> {
    return await this.provider.downloadSigned(documentId);
  }

  /**
   * Cancel signature request
   */
  async cancelSignatureRequest(documentId: string): Promise<void> {
    return await this.provider.cancelRequest(documentId);
  }

  /**
   * Create signature request from template
   */
  createSignatureRequest(
    documentId: string,
    templateId: string,
    buyerEmail: string,
    sellerEmail: string,
    agentEmail: string
  ): SignatureRequest {
    return {
      documentId,
      templateId,
      signers: [
        {
          id: 'buyer-1',
          name: 'Buyer',
          email: buyerEmail,
          role: 'buyer',
          order: 1
        },
        {
          id: 'seller-1',
          name: 'Seller',
          email: sellerEmail,
          role: 'seller',
          order: 2
        },
        {
          id: 'agent-1',
          name: 'Agent',
          email: agentEmail,
          role: 'agent',
          order: 3
        }
      ],
      redirectUrl: `${window.location.origin}/documents/${documentId}/signed`,
      expiresIn: 30
    };
  }

  /**
   * Get available providers
   */
  getAvailableProviders(): string[] {
    return ['MockProvider', 'DocuSign', 'HelloSign', 'AdobeSign'];
  }

  /**
   * Check if using mock provider
   */
  isUsingMockProvider(): boolean {
    return this.provider instanceof MockSignatureProvider;
  }
}

// Export singleton instance
export const eSignatureService = ESignatureService.getInstance();