/**
 * GET /api/v1/documents/[id]/download
 * Download a generated document
 */

import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/services/storage.service';
import { createClient } from '@supabase/supabase-js';

interface DocumentParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Download document by ID
 */
export async function GET(request: NextRequest, { params }: DocumentParams) {
  try {
    const { id: documentId } = await params;
    console.log(`Downloading document: ${documentId}`);

    // Initialize storage service if needed
    if (!storageService.isAvailable()) {
      storageService.initialize();
    }

    // Get document from Supabase database
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { success: false, error: 'Database configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();
    
    if (error || !document) {
      console.error('Document not found in database:', error);
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    try {
      // Generate fresh signed URL for download
      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.file_url, 3600); // 1 hour expiry
      
      if (urlError || !signedUrlData?.signedUrl) {
        console.error('Failed to generate signed URL:', urlError);
        return NextResponse.json(
          { success: false, error: 'Failed to generate download URL' },
          { status: 500 }
        );
      }

      // Fetch the PDF from Supabase Storage
      const response = await fetch(signedUrlData.signedUrl);
      
      if (!response.ok) {
        console.error('Failed to fetch PDF from storage:', response.status, response.statusText);
        return NextResponse.json(
          { success: false, error: 'Failed to fetch document from storage' },
          { status: 500 }
        );
      }

      const blob = await response.blob();
      const buffer = await blob.arrayBuffer();
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${document.metadata?.fileName || `document_${documentId}.pdf`}"`,
          'Cache-Control': 'private, max-age=3600',
          'Content-Length': buffer.byteLength.toString()
        }
      });
      
    } catch (error) {
      console.error('Error downloading document:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to download document' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('[API] Error downloading document:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}