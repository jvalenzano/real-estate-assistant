import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // In a real app, this would reset demo data in the database
  // For now, we'll just return success
  
  console.log('Demo data reset requested');
  
  return NextResponse.json({
    success: true,
    message: 'Demo data reset successfully',
    data: {
      resetAt: new Date().toISOString(),
      itemsReset: {
        properties: 5,
        documents: 0,
        users: 1
      }
    }
  });
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: 'Method not allowed. Use POST to reset demo data.'
    },
    { status: 405 }
  );
}