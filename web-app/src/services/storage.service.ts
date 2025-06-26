/**
 * Storage Service
 * Handles document storage with Supabase
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface StorageDocument {
  id: string;
  userId: string;
  templateId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  status: 'draft' | 'final' | 'signed';
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface StorageUploadOptions {
  bucket?: string;
  path?: string;
  public?: boolean;
  metadata?: Record<string, any>;
}

export class StorageService {
  private static instance: StorageService;
  private supabase: SupabaseClient | null = null;
  private defaultBucket = 'documents';
  private initialized = false;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  /**
   * Initialize with Supabase credentials
   */
  initialize(supabaseUrl?: string, supabaseKey?: string): void {
    const url = supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = supabaseKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      console.warn('[StorageService] No Supabase credentials provided. Storage features will be limited.');
      return;
    }

    try {
      this.supabase = createClient(url, key);
      this.initialized = true;
      console.log('[StorageService] Initialized with Supabase');
    } catch (error) {
      console.error('[StorageService] Failed to initialize Supabase:', error);
    }
  }

  /**
   * Upload a document
   */
  async uploadDocument(
    file: File | Blob,
    fileName: string,
    options: StorageUploadOptions = {}
  ): Promise<string> {
    if (!this.initialized || !this.supabase) {
      // Fallback to local storage simulation
      return this.uploadToLocalStorage(file, fileName, options);
    }

    const bucket = options.bucket || this.defaultBucket;
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = options.path || `${timestamp}_${sanitizedFileName}`;

    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
          metadata: options.metadata
        });

      if (error) throw error;

      // Get public URL if requested
      if (options.public) {
        const { data: urlData } = this.supabase.storage
          .from(bucket)
          .getPublicUrl(path);
        
        return urlData.publicUrl;
      }

      // Return the path for private files
      return `${bucket}/${path}`;
    } catch (error) {
      console.error('[StorageService] Upload error:', error);
      throw new Error('Failed to upload document');
    }
  }

  /**
   * Download a document
   */
  async downloadDocument(path: string, bucket?: string): Promise<Blob> {
    if (!this.initialized || !this.supabase) {
      // Fallback to local storage simulation
      return this.downloadFromLocalStorage(path);
    }

    const bucketName = bucket || this.defaultBucket;

    try {
      const { data, error } = await this.supabase.storage
        .from(bucketName)
        .download(path);

      if (error) throw error;
      if (!data) throw new Error('No data received');

      return data;
    } catch (error) {
      console.error('[StorageService] Download error:', error);
      throw new Error('Failed to download document');
    }
  }

  /**
   * Get signed URL for temporary access
   */
  async getSignedUrl(path: string, expiresIn = 3600, bucket?: string): Promise<string> {
    if (!this.initialized || !this.supabase) {
      // Return mock URL for local storage
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      return `${origin}/mock-storage/${path}`;
    }

    const bucketName = bucket || this.defaultBucket;

    try {
      const { data, error } = await this.supabase.storage
        .from(bucketName)
        .createSignedUrl(path, expiresIn);

      if (error) throw error;
      if (!data?.signedUrl) throw new Error('No signed URL generated');

      return data.signedUrl;
    } catch (error) {
      console.error('[StorageService] Signed URL error:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(path: string, bucket?: string): Promise<void> {
    if (!this.initialized || !this.supabase) {
      // Simulate deletion in local storage
      this.deleteFromLocalStorage(path);
      return;
    }

    const bucketName = bucket || this.defaultBucket;

    try {
      const { error } = await this.supabase.storage
        .from(bucketName)
        .remove([path]);

      if (error) throw error;
    } catch (error) {
      console.error('[StorageService] Delete error:', error);
      throw new Error('Failed to delete document');
    }
  }

  /**
   * List documents in a path
   */
  async listDocuments(path: string = '', bucket?: string): Promise<any[]> {
    if (!this.initialized || !this.supabase) {
      // Return empty list for local storage
      return [];
    }

    const bucketName = bucket || this.defaultBucket;

    try {
      const { data, error } = await this.supabase.storage
        .from(bucketName)
        .list(path, {
          limit: 100,
          offset: 0
        });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('[StorageService] List error:', error);
      throw new Error('Failed to list documents');
    }
  }

  /**
   * Save document metadata to database
   */
  async saveDocumentMetadata(document: Partial<StorageDocument>): Promise<StorageDocument> {
    if (!this.initialized || !this.supabase) {
      // Return mock document for local storage
      return {
        id: `doc_${Date.now()}`,
        userId: 'mock_user',
        templateId: document.templateId || '',
        fileName: document.fileName || '',
        fileUrl: document.fileUrl || '',
        fileSize: document.fileSize || 0,
        mimeType: document.mimeType || 'application/pdf',
        status: document.status || 'draft',
        metadata: document.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
        ...document
      } as StorageDocument;
    }

    try {
      const { data, error } = await this.supabase
        .from('documents')
        .insert({
          ...document,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return this.mapToStorageDocument(data);
    } catch (error) {
      console.error('[StorageService] Save metadata error:', error);
      throw new Error('Failed to save document metadata');
    }
  }

  /**
   * Get document metadata
   */
  async getDocumentMetadata(documentId: string): Promise<StorageDocument | null> {
    if (!this.initialized || !this.supabase) {
      return null;
    }

    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (error) throw error;
      if (!data) return null;

      return this.mapToStorageDocument(data);
    } catch (error) {
      console.error('[StorageService] Get metadata error:', error);
      return null;
    }
  }

  /**
   * Update document metadata
   */
  async updateDocumentMetadata(
    documentId: string,
    updates: Partial<StorageDocument>
  ): Promise<StorageDocument> {
    if (!this.initialized || !this.supabase) {
      throw new Error('Storage service not initialized');
    }

    try {
      const { data, error } = await this.supabase
        .from('documents')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId)
        .select()
        .single();

      if (error) throw error;

      return this.mapToStorageDocument(data);
    } catch (error) {
      console.error('[StorageService] Update metadata error:', error);
      throw new Error('Failed to update document metadata');
    }
  }

  // Local storage fallback methods
  private async uploadToLocalStorage(
    file: File | Blob,
    fileName: string,
    options: StorageUploadOptions
  ): Promise<string> {
    console.log('[StorageService] Using local storage fallback for upload');
    
    // In server context, just return a mock URL
    if (typeof window === 'undefined') {
      const key = `doc_${Date.now()}_${fileName}`;
      return `/mock-storage/${key}`;
    }
    
    // Convert to base64
    const reader = new FileReader();
    const base64 = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const key = `doc_${Date.now()}_${fileName}`;
    localStorage.setItem(key, base64);
    
    return key;
  }

  private async downloadFromLocalStorage(key: string): Promise<Blob> {
    console.log('[StorageService] Using local storage fallback for download');
    
    const base64 = localStorage.getItem(key);
    if (!base64) {
      throw new Error('Document not found in local storage');
    }

    // Convert base64 to blob
    const response = await fetch(base64);
    return response.blob();
  }

  private deleteFromLocalStorage(key: string): void {
    console.log('[StorageService] Using local storage fallback for delete');
    localStorage.removeItem(key);
  }

  private mapToStorageDocument(data: any): StorageDocument {
    return {
      id: data.id,
      userId: data.user_id,
      templateId: data.template_id,
      fileName: data.file_name,
      fileUrl: data.file_url,
      fileSize: data.file_size,
      mimeType: data.mime_type,
      status: data.status,
      metadata: data.metadata || {},
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  /**
   * Check if storage is available
   */
  isAvailable(): boolean {
    return this.initialized && this.supabase !== null;
  }

  /**
   * Get storage usage statistics
   */
  async getStorageStats(userId: string): Promise<{
    totalDocuments: number;
    totalSize: number;
    documentsByStatus: Record<string, number>;
  }> {
    if (!this.initialized || !this.supabase) {
      return {
        totalDocuments: 0,
        totalSize: 0,
        documentsByStatus: {}
      };
    }

    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select('file_size, status')
        .eq('user_id', userId);

      if (error) throw error;

      const stats = {
        totalDocuments: data?.length || 0,
        totalSize: data?.reduce((sum, doc) => sum + (doc.file_size || 0), 0) || 0,
        documentsByStatus: {} as Record<string, number>
      };

      data?.forEach(doc => {
        stats.documentsByStatus[doc.status] = (stats.documentsByStatus[doc.status] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('[StorageService] Get stats error:', error);
      return {
        totalDocuments: 0,
        totalSize: 0,
        documentsByStatus: {}
      };
    }
  }

  /**
   * Upload generated PDF document
   */
  async uploadGeneratedDocument(
    pdfBuffer: Buffer,
    documentId: string,
    templateCode: string,
    userId: string
  ): Promise<string> {
    const fileName = `${templateCode}_${documentId}_${Date.now()}.pdf`;
    const path = `${userId}/generated/${fileName}`;
    
    const file = new Blob([pdfBuffer], { type: 'application/pdf' });
    
    return this.uploadDocument(file, fileName, {
      path,
      metadata: {
        documentId,
        templateCode,
        generatedAt: new Date().toISOString()
      }
    });
  }

  /**
   * Get documents by property ID
   */
  async getDocumentsByProperty(propertyId: string, userId: string): Promise<StorageDocument[]> {
    if (!this.initialized || !this.supabase) {
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select('*')
        .eq('property_id', propertyId)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(this.mapToStorageDocument);
    } catch (error) {
      console.error('[StorageService] Get documents by property error:', error);
      return [];
    }
  }

  /**
   * Get documents by template
   */
  async getDocumentsByTemplate(templateId: string, userId: string): Promise<StorageDocument[]> {
    if (!this.initialized || !this.supabase) {
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select('*')
        .eq('template_id', templateId)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(this.mapToStorageDocument);
    } catch (error) {
      console.error('[StorageService] Get documents by template error:', error);
      return [];
    }
  }

  /**
   * Archive a document
   */
  async archiveDocument(documentId: string): Promise<void> {
    if (!this.initialized || !this.supabase) {
      throw new Error('Storage service not initialized');
    }

    try {
      const { error } = await this.supabase
        .from('documents')
        .update({
          status: 'archived',
          archived_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);

      if (error) throw error;
    } catch (error) {
      console.error('[StorageService] Archive document error:', error);
      throw new Error('Failed to archive document');
    }
  }

  /**
   * Upload HTML content
   */
  async uploadHtml(path: string, htmlContent: string): Promise<string> {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    return this.uploadDocument(blob, path, {
      path,
      public: true,
      metadata: {
        contentType: 'text/html'
      }
    });
  }

  /**
   * Upload PDF buffer
   */
  async uploadPdf(path: string, pdfBuffer: Buffer): Promise<string> {
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    return this.uploadDocument(blob, path, {
      path,
      public: true,
      metadata: {
        contentType: 'application/pdf'
      }
    });
  }

  /**
   * Upload JSON data
   */
  async uploadJson(path: string, data: any): Promise<string> {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    return this.uploadDocument(blob, path, {
      path,
      metadata: {
        contentType: 'application/json'
      }
    });
  }
}

// Export singleton instance
export const storageService = StorageService.getInstance();