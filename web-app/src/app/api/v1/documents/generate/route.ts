/**
 * POST /api/v1/documents/generate
 * Generate a new document from a template
 */

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { templateService } from '@/services/template.service';
import { pdfFormServerService } from '@/lib/server/pdf-form.server';
import { storageService } from '@/services/storage.service';
import { createClient } from '@supabase/supabase-js';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

// Template cache to improve performance
const templateCache = new Map<string, Buffer>();

// Define types for the request and response
interface GenerateDocumentRequest {
  templateCode: string;
  formData: Record<string, any>;
  transactionId: string;
}

interface GenerateDocumentResponse {
  success: boolean;
  data?: {
    documentId: string;
    templateCode: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    message: string;
    downloadUrl: string;
    debug?: any;
  };
  error?: string;
}

// List of valid template codes (you can expand this based on your templates)
const VALID_TEMPLATE_CODES = [
  'CA_RPA',
  'BUYER_COUNTER_OFFER',
  'SELLER_COUNTER_OFFER',
  'REQUEST_FOR_REPAIR',
  'BUYER_CONTINGENCY_REMOVAL',
  'LEAD_BASED_PAINT',
  // Add more template codes as needed
];

export async function POST(request: NextRequest) {
  console.log('Document generation API called');
  
  try {
    // Parse request body
    const body = await request.json() as GenerateDocumentRequest;
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    // UUID validation function
    const isValidUUID = (uuid: string): boolean => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(uuid);
    };
    
    // Validate required fields
    if (!body.templateCode) {
      console.error('Missing templateCode');
      return NextResponse.json<GenerateDocumentResponse>(
        {
          success: false,
          error: 'Missing required field: templateCode'
        },
        { status: 400 }
      );
    }
    
    if (!body.formData || typeof body.formData !== 'object') {
      console.error('Missing or invalid formData');
      return NextResponse.json<GenerateDocumentResponse>(
        {
          success: false,
          error: 'Missing or invalid field: formData must be an object'
        },
        { status: 400 }
      );
    }
    
    if (!body.transactionId) {
      console.error('Missing transactionId');
      return NextResponse.json<GenerateDocumentResponse>(
        {
          success: false,
          error: 'Missing required field: transactionId'
        },
        { status: 400 }
      );
    }
    
    // Validate transactionId is a proper UUID
    if (!isValidUUID(body.transactionId)) {
      console.error(`Invalid transactionId format: ${body.transactionId}`);
      return NextResponse.json<GenerateDocumentResponse>(
        {
          success: false,
          error: `Invalid transactionId format. Must be a valid UUID, got: ${body.transactionId}`
        },
        { status: 400 }
      );
    }
    
    // Validate template code
    if (!VALID_TEMPLATE_CODES.includes(body.templateCode)) {
      console.error(`Invalid template code: ${body.templateCode}`);
      return NextResponse.json<GenerateDocumentResponse>(
        {
          success: false,
          error: `Invalid template code: ${body.templateCode}. Valid codes are: ${VALID_TEMPLATE_CODES.join(', ')}`
        },
        { status: 400 }
      );
    }
    
    // Generate document ID
    const documentId = uuidv4();
    console.log(`Generated document ID: ${documentId}`);
    
    // For implemented templates, use real PDF generation
    const implementedTemplates = ['CA_RPA', 'BUYER_COUNTER_OFFER', 'SELLER_COUNTER_OFFER', 'REQUEST_FOR_REPAIR', 'BUYER_CONTINGENCY_REMOVAL', 'LEAD_BASED_PAINT'];
    if (implementedTemplates.includes(body.templateCode)) {
      try {
        // Get the correct template path based on template code
        let templatePath: string;
        if (body.templateCode === 'CA_RPA') {
          templatePath = path.join(process.cwd(), 'src/templates/01-buyers-offer/CA_RPA/California_Residential_Purchase_Agreement___12_24.pdf');
        } else if (body.templateCode === 'BUYER_COUNTER_OFFER') {
          templatePath = path.join(process.cwd(), 'src/templates/03-escrow-contingency/buyer-counter-offer/Buyer Counter Offer #1 - 12_24.pdf');
        } else if (body.templateCode === 'SELLER_COUNTER_OFFER') {
          templatePath = path.join(process.cwd(), 'src/templates/03-escrow-contingency/seller-counter-offer/Seller Counter Offer #1 - 12_24.pdf');
        } else if (body.templateCode === 'REQUEST_FOR_REPAIR') {
          templatePath = path.join(process.cwd(), 'src/templates/01-buyers-offer/request-for-repair/Request_for_Repair___6_24.pdf');
        } else if (body.templateCode === 'BUYER_CONTINGENCY_REMOVAL') {
          templatePath = path.join(process.cwd(), 'src/templates/02-contingency-removal/buyer-contingency-removal/Buyer Contingency Removal #1 - 6_24.pdf');
        } else if (body.templateCode === 'LEAD_BASED_PAINT') {
          templatePath = path.join(process.cwd(), 'src/templates/01-buyers-offer/lead-based-paint/Lead_Based_Paint_Disclosure___12_22.pdf');
        } else {
          throw new Error(`Template path not configured for ${body.templateCode}`);
        }
        
        // Load the template PDF with caching for better performance
        let pdfBuffer: Buffer;
        if (templateCache.has(body.templateCode)) {
          pdfBuffer = templateCache.get(body.templateCode)!;
          console.log(`Using cached template for ${body.templateCode}`);
        } else {
          pdfBuffer = await fs.readFile(templatePath);
          templateCache.set(body.templateCode, pdfBuffer);
          console.log(`Loaded and cached template for ${body.templateCode}`);
        }
        
        // Load the encrypted PDF
        const encryptedPdf = await PDFDocument.load(pdfBuffer, { 
          ignoreEncryption: true,
          throwOnInvalidObject: false 
        });
        
        // Create a new PDF by copying pages (this removes encryption)
        const pdfDoc = await PDFDocument.create();
        const pages = await pdfDoc.copyPages(encryptedPdf, encryptedPdf.getPageIndices());
        pages.forEach(page => pdfDoc.addPage(page));
        
        // Fill the PDF with form data
        const filledPdf = await pdfFormServerService.fillPDF(
          body.templateCode,
          pdfDoc,
          body.formData
        );
        
        // Save the filled PDF (now without encryption)
        const pdfBytes = await filledPdf.save();
        
        // Initialize storage service if not already initialized
        if (!storageService.isAvailable()) {
          storageService.initialize();
        }
        
        // Upload to Supabase Storage
        const fileName = `${body.templateCode}_${documentId}.pdf`;
        const storagePath = `${body.transactionId}/documents/${fileName}`;
        
        let downloadUrl: string;
        
        try {
          // Upload the PDF buffer to Supabase
          const uploadedPath = await storageService.uploadDocument(
            new Blob([pdfBytes], { type: 'application/pdf' }),
            fileName,
            {
              path: storagePath,
              metadata: {
                documentId,
                templateCode: body.templateCode,
                transactionId: body.transactionId,
                generatedAt: new Date().toISOString(),
                formData: JSON.stringify(body.formData)
              }
            }
          );
          
          // Get a signed URL for download (1 hour expiry)
          downloadUrl = await storageService.getSignedUrl(storagePath, 3600);
          
          console.log(`Document uploaded to Supabase Storage: ${storagePath}`);
        } catch (storageError) {
          console.error('Storage upload failed, falling back to local storage:', storageError);
          
          // Fallback to file system if Supabase fails
          const outputDir = path.join(process.cwd(), 'public/generated-documents');
          await fs.mkdir(outputDir, { recursive: true });
          
          const outputPath = path.join(outputDir, `${documentId}.pdf`);
          await fs.writeFile(outputPath, pdfBytes);
          
          downloadUrl = `/generated-documents/${documentId}.pdf`;
          console.warn('Document saved to public directory as fallback');
        }
        
        console.log(`Document generated successfully: ${documentId}`);
        
        // Save document metadata to Supabase database
        let dbSaveResult = null;
        try {
          // Initialize Supabase client
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
          
          console.log('Database save attempt:', {
            documentId,
            hasSupabaseUrl: !!supabaseUrl,
            hasSupabaseKey: !!supabaseKey,
            templateCode: body.templateCode
          });
          
          if (supabaseUrl && supabaseKey) {
            const supabase = createClient(supabaseUrl, supabaseKey!);
            
            // First, get the template ID from the database
            const { data: templateData, error: templateError } = await supabase
              .from('document_templates')
              .select('id')
              .eq('template_code', body.templateCode)
              .single();
            
            console.log('Template lookup:', { templateData, templateError });
            
            // Prepare document record
            const documentRecord = {
              id: documentId,
              template_id: templateData?.id || null,
              transaction_id: body.transactionId,
              property_id: body.formData.propertyId || 'unknown',
              user_id: '00000000-0000-4000-8000-000000000001', // Demo user UUID
              title: `${body.templateCode} - ${body.formData.propertyAddress || 'Document'}`,
              status: 'completed',
              visibility: 'private',
              file_url: storagePath,
              field_data: body.formData,
              metadata: {
                fileName: fileName,
                fileSize: pdfBytes.length,
                mimeType: 'application/pdf',
                generatedAt: new Date().toISOString(),
                templateCode: body.templateCode
              }
            };
            
            console.log('Inserting document record:', documentRecord);
            
            // Validate critical UUIDs before insert
            if (!isValidUUID(documentRecord.id)) {
              throw new Error(`Invalid document ID for database: ${documentRecord.id}`);
            }
            if (!isValidUUID(documentRecord.transaction_id)) {
              throw new Error(`Invalid transaction ID for database: ${documentRecord.transaction_id}`);
            }
            
            // Insert document record
            const { data: savedDocument, error: dbError } = await supabase
              .from('documents')
              .insert(documentRecord)
              .select()
              .single();
            
            if (dbError) {
              console.error('Database insert error:', dbError);
              dbSaveResult = { success: false, error: dbError };
            } else {
              console.log('Document saved to database successfully:', savedDocument?.id);
              dbSaveResult = { success: true, data: savedDocument };
              
              // Log document activity
              try {
                await supabase
                  .from('document_activity')
                  .insert({
                    document_id: documentId,
                    user_id: '00000000-0000-4000-8000-000000000001',
                    activity_type: 'generated',
                    description: `Generated ${body.templateCode} document`,
                    metadata: {
                      templateCode: body.templateCode,
                      transactionId: body.transactionId
                    }
                  });
                console.log('Document activity logged');
              } catch (activityError) {
                console.error('Failed to log document activity:', activityError);
              }
            }
          } else {
            console.error('Missing Supabase configuration');
            dbSaveResult = { success: false, error: 'Missing Supabase configuration' };
          }
        } catch (metadataError) {
          console.error('Failed to save document metadata:', metadataError);
          dbSaveResult = { success: false, error: metadataError };
          // Continue - document is still generated
        }
        
        // Return successful response with download URL
        const response: GenerateDocumentResponse = {
          success: true,
          data: {
            documentId: documentId,
            templateCode: body.templateCode,
            status: 'completed',
            message: 'Document generated successfully',
            downloadUrl: downloadUrl,
            debug: {
              databaseSave: dbSaveResult,
              storagePath: storagePath,
              fileName: fileName
            }
          }
        };
        
        return NextResponse.json(response, { status: 200 });
      } catch (pdfError) {
        console.error('PDF generation error:', pdfError);
        return NextResponse.json<GenerateDocumentResponse>(
          {
            success: false,
            error: `PDF generation failed: ${pdfError instanceof Error ? pdfError.message : 'Unknown error'}`
          },
          { status: 500 }
        );
      }
    }
    
    // For other templates, return mock response
    const mockDocumentId = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log(`Mock document generation for ${body.templateCode}: ${mockDocumentId}`);
    
    const response: GenerateDocumentResponse = {
      success: true,
      data: {
        documentId: mockDocumentId,
        templateCode: body.templateCode,
        status: 'completed',
        message: 'Document generated successfully (mock)',
        downloadUrl: '#'
      }
    };
    
    // Log the response for debugging
    console.log('Response:', JSON.stringify(response, null, 2));
    
    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('Document generation error:', error);
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json<GenerateDocumentResponse>(
        {
          success: false,
          error: 'Invalid JSON in request body'
        },
        { status: 400 }
      );
    }
    
    // General server error
    return NextResponse.json<GenerateDocumentResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// Handle non-POST requests
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: 'Method not allowed. Use POST to generate documents.'
    },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    {
      success: false,
      error: 'Method not allowed. Use POST to generate documents.'
    },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      success: false,
      error: 'Method not allowed. Use POST to generate documents.'
    },
    { status: 405 }
  );
}