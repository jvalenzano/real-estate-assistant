/**
 * DEBUG ENDPOINT - GET /api/debug/documents
 * Check what documents are actually saved in the database
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        error: 'Supabase configuration missing',
        env: {
          supabaseUrl: !!supabaseUrl,
          supabaseKey: !!supabaseKey
        }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get all documents from the database
    const { data: documents, error: documentsError } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    // Get storage files
    const { data: storageFiles, error: storageError } = await supabase
      .storage
      .from('documents')
      .list('', { limit: 100 });
    
    // Get document templates
    const { data: templates, error: templatesError } = await supabase
      .from('document_templates')
      .select('*')
      .limit(5);

    return NextResponse.json({
      success: true,
      debug: {
        database: {
          documents: {
            count: documents?.length || 0,
            data: documents || [],
            error: documentsError
          },
          templates: {
            count: templates?.length || 0,
            data: templates || [],
            error: templatesError
          }
        },
        storage: {
          files: {
            count: storageFiles?.length || 0,
            data: storageFiles || [],
            error: storageError
          }
        },
        environment: {
          supabaseUrl: supabaseUrl.substring(0, 30) + '...',
          hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        }
      }
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      error: 'Debug endpoint failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}