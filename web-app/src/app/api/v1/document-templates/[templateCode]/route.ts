/**
 * GET /api/v1/document-templates/[templateCode]
 * Get a single document template by code
 */

import { NextRequest, NextResponse } from 'next/server';
import { TEMPLATE_REGISTRY } from '@/templates';
import { templateService } from '@/services/template.service';

interface RouteParams {
  params: Promise<{
    templateCode: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { templateCode } = await params;
    
    // Get template from registry
    const template = TEMPLATE_REGISTRY[templateCode];
    
    if (!template) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Template not found: ${templateCode}`
          }
        },
        { status: 404 }
      );
    }

    // Get template details from service
    const templateDetails = await templateService.getTemplate(templateCode);
    
    const responseData = {
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
      fields: templateDetails?.fields || {},
      signatures: templateDetails?.signatures || [],
      metadata: {
        fileName: template.fileName,
        carFormNumber: template.carFormNumber,
        path: template.path,
        ...templateDetails?.metadata
      }
    };

    return NextResponse.json({
      success: true,
      data: responseData,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    });
  } catch (error) {
    console.error('[API] Error fetching template:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch document template'
        }
      },
      { status: 500 }
    );
  }
}