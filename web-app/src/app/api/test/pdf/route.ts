import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

/**
 * GET /api/test/pdf
 * Test basic PDF generation without authentication
 */
export async function GET() {
  console.log('Test PDF generation endpoint called');
  
  try {
    // Create a simple test PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    
    // Add test content
    page.drawText('Test PDF Generation Working!', { 
      x: 50, 
      y: 350, 
      size: 30 
    });
    
    page.drawText(`Generated at: ${new Date().toISOString()}`, { 
      x: 50, 
      y: 300, 
      size: 12 
    });
    
    page.drawText('This proves basic PDF generation is functional', { 
      x: 50, 
      y: 250, 
      size: 14 
    });
    
    const pdfBytes = await pdfDoc.save();
    console.log(`Test PDF generated successfully, size: ${pdfBytes.length} bytes`);
    
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="test-basic.pdf"',
        'Content-Length': pdfBytes.length.toString()
      }
    });
  } catch (error) {
    console.error('Test PDF generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}