import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // In a real app, you might want to invalidate the token server-side
  // For now, we'll just return success and let the client clear the token
  
  return NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: 'Method not allowed. Use POST for logout.'
    },
    { status: 405 }
  );
}