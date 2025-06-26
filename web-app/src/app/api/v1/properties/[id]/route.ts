import { NextRequest, NextResponse } from 'next/server';
import demoProperties from '@/../../demo-data/properties.json';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Find property by ID or MLS number
    const property = demoProperties.find(p => 
      p.id === id || p.mls_number === id
    );

    if (!property) {
      return NextResponse.json(
        {
          success: false,
          error: 'Property not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: property
    });

  } catch (error) {
    console.error('Get property error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch property'
      },
      { status: 500 }
    );
  }
}