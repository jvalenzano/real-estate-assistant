/**
 * GET /api/v1/documents/[id]
 * Retrieve a generated document
 * 
 * GET /api/v1/documents/[id]/download
 * Download a generated document
 */

import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/services/storage.service';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';

interface DocumentParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Get document metadata
 */
export async function GET(request: NextRequest, { params }: DocumentParams) {
  try {
    const { id: documentId } = await params;
    console.log(`Retrieving document: ${documentId}`);

    // Initialize storage service if needed
    if (!storageService.isAvailable()) {
      storageService.initialize();
    }

    // Check if this is a download request
    const url = new URL(request.url);
    const isDownload = url.pathname.endsWith('/download');

    // Try to get document from Supabase database directly
    let document = null;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('id', documentId)
          .single();
        
        if (!error && data) {
          document = data;
        }
      } catch (dbError) {
        console.error('Database query error:', dbError);
      }
    }
    
    if (document) {
      // Document found in database
      if (isDownload) {
        try {
          // Initialize storage service
          if (!storageService.isAvailable()) {
            storageService.initialize();
          }
          
          // Get signed URL for download
          const signedUrl = await storageService.getSignedUrl(document.file_url, 3600);
          
          // For server-side download, fetch the file and return it
          const response = await fetch(signedUrl);
          const blob = await response.blob();
          const buffer = await blob.arrayBuffer();
          
          return new NextResponse(buffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="${document.metadata?.fileName || `document_${documentId}.pdf`}"`,
              'Cache-Control': 'private, max-age=3600'
            }
          });
        } catch (error) {
          console.error('Error downloading from Supabase:', error);
          // Fall through to local file check
        }
      } else {
        // Return document metadata
        return NextResponse.json({
          success: true,
          data: {
            id: document.id,
            template_code: document.template_code,
            status: document.status,
            created_at: document.created_at,
            file_url: document.file_url,
            field_data: document.field_data,
            metadata: document.metadata,
            title: document.title
          }
        });
      }
    }

    // Fallback: Check local file system (for backwards compatibility)
    const localPath = path.join(process.cwd(), 'public/generated-documents', `${documentId}.pdf`);
    
    try {
      const fileExists = await fs.access(localPath).then(() => true).catch(() => false);
      
      if (fileExists) {
        if (isDownload) {
          // Read and return the file
          const fileBuffer = await fs.readFile(localPath);
          
          return new NextResponse(fileBuffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="document_${documentId}.pdf"`,
              'Cache-Control': 'private, max-age=3600'
            }
          });
        } else {
          // Return metadata for local file
          const stats = await fs.stat(localPath);
          
          return NextResponse.json({
            success: true,
            data: {
              id: documentId,
              fileName: `document_${documentId}.pdf`,
              status: 'completed',
              createdAt: stats.birthtime,
              size: stats.size,
              downloadUrl: `/generated-documents/${documentId}.pdf`,
              storage: 'local'
            }
          });
        }
      }
    } catch (error) {
      console.error('Error checking local file:', error);
    }

    // Document not found
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Document ${documentId} not found`
        }
      },
      { status: 404 }
    );
  } catch (error) {
    console.error('[API] Error retrieving document:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve document'
        }
      },
      { status: 500 }
    );
  }
}

/**
 * Delete a document
 */
export async function DELETE(request: NextRequest, { params }: DocumentParams) {
  try {
    const { id: documentId } = await params;
    console.log(`Deleting document: ${documentId}`);

    // TODO: Add authentication check
    // const session = await getSession(request);
    // if (!session) {
    //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    // }

    // Initialize storage service if needed
    if (!storageService.isAvailable()) {
      storageService.initialize();
    }

    // Get document metadata
    const metadata = await storageService.getDocumentMetadata(documentId);
    
    if (metadata && metadata.fileUrl) {
      // Delete from Supabase Storage
      await storageService.deleteDocument(metadata.fileUrl);
      
      // Archive the document metadata (soft delete)
      await storageService.archiveDocument(documentId);
      
      return NextResponse.json({
        success: true,
        message: 'Document deleted successfully'
      });
    }

    // Check and delete from local storage
    const localPath = path.join(process.cwd(), 'public/generated-documents', `${documentId}.pdf`);
    
    try {
      await fs.unlink(localPath);
      return NextResponse.json({
        success: true,
        message: 'Document deleted from local storage'
      });
    } catch (error) {
      // File doesn't exist
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Document ${documentId} not found`
          }
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('[API] Error deleting document:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete document'
        }
      },
      { status: 500 }
    );
  }
}