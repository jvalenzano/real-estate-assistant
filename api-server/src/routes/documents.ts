import express, { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { ApiResponse, AuthRequest, DocumentGenerationRequest, DocumentGenerationResponse, DocumentFields } from '@/types';
import { DocumentService } from '@/services/document.service';
import { authenticateToken } from '@/middleware/auth';

const router = express.Router();

/**
 * POST /generate
 * Generate a new document
 */
router.post('/generate', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId, documentType, data }: DocumentGenerationRequest = req.body;

    // Validate input
    if (!propertyId || !documentType) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Property ID and document type are required',
          details: {
            missing: [
              !propertyId && 'propertyId',
              !documentType && 'documentType'
            ].filter(Boolean)
          }
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
      res.status(400).json(response);
      return;
    }

    if (!['rpa', 'disclosure', 'addendum'].includes(documentType)) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'INVALID_DOCUMENT_TYPE',
          message: 'Document type must be rpa, disclosure, or addendum',
          details: { provided: documentType }
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
      res.status(400).json(response);
      return;
    }

    // Generate document
    const document = await DocumentService.generateDocument(
      { propertyId, documentType, data: data || {} },
      req.user!
    );

    const responseData: DocumentGenerationResponse = {
      documentId: document.id,
      status: document.status,
      htmlPreviewUrl: `/api/v1/documents/${document.id}/preview`,
      pdfDownloadUrl: `/api/v1/documents/${document.id}/pdf`
    };

    const response: ApiResponse<DocumentGenerationResponse> = {
      success: true,
      data: responseData,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    };

    res.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Document generation failed';
    
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'GENERATION_FAILED',
        message: errorMessage,
        details: {}
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    };

    res.status(500).json(response);
  }
});

/**
 * GET /stats
 * Get document statistics
 */
router.get('/stats', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const stats = DocumentService.getDocumentStats();

    const response: ApiResponse = {
      success: true,
      data: stats,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'STATS_FAILED',
        message: 'Failed to get document statistics',
        details: {}
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    };

    res.status(500).json(response);
  }
});

/**
 * GET /:id
 * Get document details
 */
router.get('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const document = DocumentService.getDocument(id);

    if (!document) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'DOCUMENT_NOT_FOUND',
          message: `Document not found: ${id}`,
          details: {}
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
      res.status(404).json(response);
      return;
    }

    // Check if user has access to document
    if (document.agentId !== req.user!.id) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You do not have access to this document',
          details: {}
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
      res.status(403).json(response);
      return;
    }

    // Return document without HTML content (too large for JSON)
    const documentResponse = {
      ...document,
      htmlContent: undefined,
      htmlPreviewUrl: `/api/v1/documents/${document.id}/preview`,
      pdfDownloadUrl: `/api/v1/documents/${document.id}/pdf`
    };

    const response: ApiResponse = {
      success: true,
      data: documentResponse,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'DOCUMENT_FETCH_FAILED',
        message: 'Failed to fetch document',
        details: {}
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    };

    res.status(500).json(response);
  }
});

/**
 * GET /:id/preview
 * Get HTML preview of document
 */
router.get('/:id/preview', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const document = DocumentService.getDocument(id);

    if (!document) {
      res.status(404).send('<h1>Document Not Found</h1>');
      return;
    }

    // Check access
    if (document.agentId !== req.user!.id) {
      res.status(403).send('<h1>Access Denied</h1>');
      return;
    }

    if (!document.htmlContent) {
      res.status(404).send('<h1>HTML content not available</h1>');
      return;
    }

    res.setHeader('Content-Type', 'text/html');
    res.send(document.htmlContent);
  } catch (error) {
    res.status(500).send('<h1>Failed to load document preview</h1>');
  }
});

/**
 * GET /:id/pdf
 * Download PDF version of document
 */
router.get('/:id/pdf', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const document = DocumentService.getDocument(id);

    if (!document) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'DOCUMENT_NOT_FOUND',
          message: `Document not found: ${id}`,
          details: {}
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
      res.status(404).json(response);
      return;
    }

    // Check access
    if (document.agentId !== req.user!.id) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You do not have access to this document',
          details: {}
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
      res.status(403).json(response);
      return;
    }

    // Generate PDF if it doesn't exist
    let pdfPath = document.pdfPath;
    if (!pdfPath || !fs.existsSync(pdfPath)) {
      pdfPath = await DocumentService.generatePDF(id);
    }

    // Set headers for PDF download
    const filename = `${document.type}-${document.id}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream the PDF file
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'PDF generation failed';
    
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'PDF_GENERATION_FAILED',
        message: errorMessage,
        details: {}
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    };

    res.status(500).json(response);
  }
});

/**
 * PATCH /:id/fields
 * Update document fields
 */
router.patch('/:id/fields', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const fieldUpdates: Partial<DocumentFields> = req.body;

    const document = DocumentService.getDocument(id);
    if (!document) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'DOCUMENT_NOT_FOUND',
          message: `Document not found: ${id}`,
          details: {}
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
      res.status(404).json(response);
      return;
    }

    // Check access
    if (document.agentId !== req.user!.id) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You do not have access to this document',
          details: {}
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
      res.status(403).json(response);
      return;
    }

    const updatedDocument = DocumentService.updateDocumentFields(id, fieldUpdates);

    const response: ApiResponse = {
      success: true,
      data: {
        documentId: updatedDocument.id,
        status: updatedDocument.status,
        updatedFields: Object.keys(fieldUpdates),
        message: 'Document fields updated successfully'
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    };

    res.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Field update failed';
    
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'FIELD_UPDATE_FAILED',
        message: errorMessage,
        details: {}
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    };

    res.status(500).json(response);
  }
});

/**
 * POST /:id/finalize
 * Finalize document for signing
 */
router.post('/:id/finalize', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const document = DocumentService.getDocument(id);
    if (!document) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'DOCUMENT_NOT_FOUND',
          message: `Document not found: ${id}`,
          details: {}
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
      res.status(404).json(response);
      return;
    }

    // Check access
    if (document.agentId !== req.user!.id) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You do not have access to this document',
          details: {}
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
      res.status(403).json(response);
      return;
    }

    const finalizedDocument = DocumentService.finalizeDocument(id);

    const response: ApiResponse = {
      success: true,
      data: {
        documentId: finalizedDocument.id,
        status: finalizedDocument.status,
        finalizedAt: finalizedDocument.finalizedAt,
        message: 'Document finalized and ready for signing'
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    };

    res.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Document finalization failed';
    
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'FINALIZATION_FAILED',
        message: errorMessage,
        details: {}
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    };

    res.status(500).json(response);
  }
});

export default router;