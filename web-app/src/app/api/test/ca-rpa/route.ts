import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

/**
 * GET /api/test/ca-rpa
 * Test CA_RPA template loading without authentication
 */
export async function GET() {
  console.log('Test CA_RPA loading endpoint called');
  
  try {
    // Load the actual CA_RPA PDF template
    const pdfPath = path.join(
      process.cwd(), 
      'src/templates/01-buyers-offer/CA_RPA/California_Residential_Purchase_Agreement___12_24.pdf'
    );
    
    console.log(`Loading CA_RPA template from: ${pdfPath}`);
    
    // Check if file exists
    try {
      await fs.access(pdfPath);
      console.log('CA_RPA template file exists');
    } catch (accessError) {
      console.error('CA_RPA template file not found:', accessError);
      return NextResponse.json(
        { 
          success: false, 
          error: `Template file not found: ${pdfPath}`,
          hint: 'Check if the CA_RPA PDF file exists in the templates directory'
        }, 
        { status: 404 }
      );
    }
    
    const pdfBytes = await fs.readFile(pdfPath);
    console.log(`CA_RPA template loaded, size: ${pdfBytes.length} bytes`);
    
    // Load with encryption bypass (critical for CAR forms)
    const pdfDoc = await PDFDocument.load(pdfBytes, {
      ignoreEncryption: true,
      throwOnInvalidObject: false
    });
    
    console.log(`CA_RPA template parsed successfully, pages: ${pdfDoc.getPageCount()}`);
    
    // Add a test stamp to prove it loaded and can be modified
    const firstPage = pdfDoc.getPage(0);
    const { width, height } = firstPage.getSize();
    
    // Add test stamp in top right corner
    firstPage.drawText('TEST GENERATION SUCCESS', { 
      x: width - 250, 
      y: height - 50, 
      size: 10 
    });
    
    firstPage.drawText(`Loaded: ${new Date().toISOString()}`, { 
      x: width - 250, 
      y: height - 70, 
      size: 8 
    });
    
    const savedPdf = await pdfDoc.save();
    console.log(`CA_RPA test PDF saved successfully, size: ${savedPdf.length} bytes`);
    
    return new NextResponse(savedPdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="ca-rpa-test.pdf"',
        'Content-Length': savedPdf.length.toString()
      }
    });
    
  } catch (error) {
    console.error('CA_RPA test loading error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        hint: 'Check server logs for detailed error information'
      }, 
      { status: 500 }
    );
  }
}