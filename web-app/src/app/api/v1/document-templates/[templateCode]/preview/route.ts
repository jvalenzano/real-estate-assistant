/**
 * GET /api/v1/document-templates/[templateCode]/preview
 * Preview a document template with sample data
 */

import { NextRequest, NextResponse } from 'next/server';
import { templateService } from '@/services/template.service';
import { TEMPLATE_REGISTRY } from '@/templates';

interface Params {
  params: {
    templateCode: string;
  };
}

// Sample data for previews
const SAMPLE_DATA = {
  property: {
    address: '123 Main Street',
    city: 'San Francisco',
    county: 'San Francisco',
    zipCode: '94105',
    apn: '1234-567-890',
    legalDescription: 'Lot 1, Block 2, Sunset District'
  },
  price: {
    purchasePrice: 1500000,
    initialDeposit: 50000,
    increasedDeposit: 100000,
    downPayment: 300000,
    loanAmount: 1200000
  },
  parties: {
    buyers: [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '(555) 123-4567'
      }
    ],
    sellers: [
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '(555) 987-6543'
      }
    ],
    buyerAgent: {
      name: 'Agent Johnson',
      email: 'agent@realeagent.com',
      phone: '(555) 555-5555',
      license: 'DRE #12345678'
    },
    sellerAgent: {
      name: 'Agent Williams',
      email: 'williams@realty.com',
      phone: '(555) 666-6666',
      license: 'DRE #87654321'
    }
  },
  dates: {
    offerDate: new Date().toISOString(),
    acceptanceDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    possessionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  contingencies: {
    inspection: {
      included: true,
      days: 17
    },
    appraisal: {
      included: true,
      days: 17
    },
    loan: {
      included: true,
      days: 21
    },
    saleOfBuyerProperty: {
      included: false
    }
  },
  escrow: {
    escrowHolder: 'First American Title Company',
    escrowNumber: 'ESC-2024-001234',
    titleCompany: 'First American Title Company'
  }
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { templateCode } = params;
    
    // Check if template exists
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

    // Check if template is implemented
    if (!template.implemented) {
      // Return a placeholder HTML for non-implemented templates
      const placeholderHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${template.name} - Preview</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              margin: 0;
              padding: 40px;
              background: #f5f5f5;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            h1 {
              color: #333;
              margin-bottom: 10px;
            }
            .form-number {
              color: #666;
              font-size: 14px;
              margin-bottom: 20px;
            }
            .placeholder {
              background: #f8f9fa;
              border: 2px dashed #dee2e6;
              border-radius: 4px;
              padding: 40px;
              text-align: center;
              color: #6c757d;
            }
            .placeholder h2 {
              margin: 0 0 10px 0;
              color: #495057;
            }
            .info {
              margin-top: 30px;
              padding: 20px;
              background: #e9ecef;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${template.name}</h1>
            <div class="form-number">CAR Form ${template.carFormNumber || 'N/A'}</div>
            
            <div class="placeholder">
              <h2>Template Not Yet Implemented</h2>
              <p>This template is part of the RealeAgent document management system but has not been fully implemented yet.</p>
              <p>Template Code: <strong>${templateCode}</strong></p>
            </div>
            
            <div class="info">
              <h3>Template Information</h3>
              <ul>
                <li><strong>Category:</strong> ${template.category}</li>
                <li><strong>File Name:</strong> ${template.fileName}</li>
                <li><strong>Commonly Used:</strong> ${template.commonlyUsed ? 'Yes' : 'No'}</li>
              </ul>
            </div>
          </div>
        </body>
        </html>
      `;
      
      return new NextResponse(placeholderHtml, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    // Render the template with sample data
    const html = await templateService.renderTemplate(templateCode, SAMPLE_DATA);
    
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('[API] Error generating preview:', error);
    
    // Return error page
    const errorHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Preview Error</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0;
            padding: 40px;
            background: #f5f5f5;
          }
          .error {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
          }
          h1 {
            color: #dc3545;
            margin-bottom: 20px;
          }
          p {
            color: #666;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <div class="error">
          <h1>Preview Error</h1>
          <p>We encountered an error while generating the preview.</p>
          <p>Please try again later or contact support if the problem persists.</p>
        </div>
      </body>
      </html>
    `;
    
    return new NextResponse(errorHtml, {
      status: 500,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  }
}