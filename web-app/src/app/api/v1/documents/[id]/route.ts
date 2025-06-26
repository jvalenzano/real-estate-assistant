import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id;
    console.log('Getting document:', documentId);
    
    // Mock document response
    return NextResponse.json({
      success: true,
      data: {
        id: documentId,
        documentId: documentId,
        templateCode: 'CA_RPA',
        status: 'completed',
        type: 'rpa',
        pdfUrl: '#',
        pdfDownloadUrl: '#',
        htmlPreviewUrl: '#',
        createdAt: new Date().toISOString(),
        propertyAddress: '789 Ocean View Dr, San Diego, CA'
      }
    });
  } catch (error) {
    console.error('Get document error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}