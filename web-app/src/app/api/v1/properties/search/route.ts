import { NextRequest, NextResponse } from 'next/server';
import { demoProperties } from '@/data/demo-properties';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Get query parameters
    const search = searchParams.get('search') || '';
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined;
    const bedrooms = searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : undefined;
    const bathrooms = searchParams.get('bathrooms') ? parseInt(searchParams.get('bathrooms')!) : undefined;
    const propertyType = searchParams.get('propertyType') || '';
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Start with all properties
    let filteredProperties = [...demoProperties];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProperties = filteredProperties.filter(property => 
        property.mls_number.toLowerCase().includes(searchLower) ||
        property.address.line1.toLowerCase().includes(searchLower) ||
        property.address.city.toLowerCase().includes(searchLower) ||
        property.address.zip_code.includes(search) ||
        property.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply price filters
    if (minPrice !== undefined) {
      filteredProperties = filteredProperties.filter(p => p.list_price >= minPrice);
    }
    if (maxPrice !== undefined) {
      filteredProperties = filteredProperties.filter(p => p.list_price <= maxPrice);
    }

    // Apply bedroom filter
    if (bedrooms !== undefined) {
      filteredProperties = filteredProperties.filter(p => p.bedrooms >= bedrooms);
    }

    // Apply bathroom filter  
    if (bathrooms !== undefined) {
      filteredProperties = filteredProperties.filter(p => p.bathrooms >= bathrooms);
    }

    // Apply property type filter
    if (propertyType) {
      filteredProperties = filteredProperties.filter(p => 
        p.property_type.toLowerCase() === propertyType.toLowerCase()
      );
    }

    // Apply sorting
    switch (sort) {
      case 'price-asc':
        filteredProperties.sort((a, b) => a.list_price - b.list_price);
        break;
      case 'price-desc':
        filteredProperties.sort((a, b) => b.list_price - a.list_price);
        break;
      case 'newest':
        filteredProperties.sort((a, b) => 
          new Date(b.listing_date).getTime() - new Date(a.listing_date).getTime()
        );
        break;
      case 'sqft':
        filteredProperties.sort((a, b) => b.square_feet - a.square_feet);
        break;
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedProperties,
      meta: {
        total: filteredProperties.length,
        page,
        limit,
        totalPages: Math.ceil(filteredProperties.length / limit)
      }
    });

  } catch (error) {
    console.error('Properties search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search properties'
      },
      { status: 500 }
    );
  }
}