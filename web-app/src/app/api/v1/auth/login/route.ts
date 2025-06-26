import { NextRequest, NextResponse } from 'next/server';

// Mock user database
const MOCK_USERS = [
  {
    id: '1',
    email: 'agent@demo.com',
    password: 'demo123', // In production, this would be hashed
    name: 'Demo Agent',
    role: 'agent'
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email and password are required'
        },
        { status: 400 }
      );
    }

    // Find user (in production, this would query a database)
    const user = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password'
        },
        { status: 401 }
      );
    }

    // Generate mock JWT token (in production, use proper JWT library)
    const token = `mock-jwt-token-${Date.now()}-${user.id}`;

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: 'Method not allowed. Use POST for login.'
    },
    { status: 405 }
  );
}