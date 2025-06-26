/**
 * GET /api/v1/document-templates
 * List all available document templates
 */

import { NextRequest, NextResponse } from 'next/server';
import { TEMPLATE_REGISTRY, getFormsByCategory, getCommonlyUsedForms } from '@/templates';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const commonlyUsed = searchParams.get('commonlyUsed') === 'true';
    const implemented = searchParams.get('implemented') === 'true';

    let templates = Object.values(TEMPLATE_REGISTRY);

    // Filter by category
    if (category) {
      templates = templates.filter(t => t.categoryNumber === category);
    }

    // Filter by commonly used
    if (commonlyUsed) {
      templates = templates.filter(t => t.commonlyUsed);
    }

    // Filter by implemented
    if (implemented) {
      templates = templates.filter(t => t.implemented);
    }

    // Sort by sort order
    templates.sort((a, b) => a.sortOrder - b.sortOrder);

    // Transform to API response format
    const responseData = templates.map(template => ({
      id: template.id,
      code: template.id,
      name: template.name,
      description: `CAR Form ${template.carFormNumber || 'N/A'}`,
      category: template.category,
      categoryNumber: template.categoryNumber,
      isActive: true,
      isCommonlyUsed: template.commonlyUsed,
      isImplemented: template.implemented,
      sortOrder: template.sortOrder,
      version: '1.0.0',
      metadata: {
        fileName: template.fileName,
        carFormNumber: template.carFormNumber,
        path: template.path
      }
    }));

    return NextResponse.json({
      success: true,
      data: responseData,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        total: responseData.length
      }
    });
  } catch (error) {
    console.error('[API] Error fetching templates:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch document templates'
        }
      },
      { status: 500 }
    );
  }
}