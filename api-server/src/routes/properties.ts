import express, { Request, Response } from 'express';
import { ApiResponse, PropertySearchParams, PropertySearchResponse, AuthRequest } from '@/types';
import { PropertyService } from '@/services/property.service';
import { optionalAuth, authenticateToken } from '@/middleware/auth';

const router = express.Router();

/**
 * GET /search
 * Search properties with filters
 */
router.get('/search', optionalAuth, (req: Request, res: Response) => {
  try {
    const params: PropertySearchParams = {
      q: req.query.q as string,
      minPrice: req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined,
      bedrooms: req.query.bedrooms ? parseInt(req.query.bedrooms as string) : undefined,
      bathrooms: req.query.bathrooms ? parseFloat(req.query.bathrooms as string) : undefined,
      propertyType: req.query.propertyType as string,
      city: req.query.city as string,
      sortBy: req.query.sortBy as any,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };

    const searchResult = PropertyService.searchProperties(params);

    const response: ApiResponse<PropertySearchResponse> = {
      success: true,
      data: searchResult,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    };

    res.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Property search failed';
    
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'SEARCH_FAILED',
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
 * GET /featured
 * Get featured properties for homepage
 */
router.get('/featured', (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
    const properties = PropertyService.getFeaturedProperties(limit);

    const response: ApiResponse = {
      success: true,
      data: {
        properties,
        total: properties.length
      },
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
        code: 'FEATURED_FAILED',
        message: 'Failed to get featured properties',
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
 * Get property statistics
 */
router.get('/stats', (req: Request, res: Response) => {
  try {
    const stats = PropertyService.getPropertyStats();

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
        message: 'Failed to get property statistics',
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
 * Get single property by ID or MLS number
 */
router.get('/:id', optionalAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Try to find by ID first, then by MLS number
    let property = PropertyService.getPropertyById(id);
    if (!property && id.toUpperCase().startsWith('ML')) {
      property = PropertyService.getPropertyByMLS(id.toUpperCase());
    }

    if (!property) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'PROPERTY_NOT_FOUND',
          message: `Property with ID/MLS ${id} not found`,
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

    const response: ApiResponse = {
      success: true,
      data: property,
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
        code: 'PROPERTY_FETCH_FAILED',
        message: 'Failed to fetch property',
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
 * POST /:id/favorite
 * Mark property as favorite (protected route)
 */
router.post('/:id/favorite', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const property = PropertyService.getPropertyById(id) || PropertyService.getPropertyByMLS(id.toUpperCase());

    if (!property) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'PROPERTY_NOT_FOUND',
          message: `Property with ID/MLS ${id} not found`,
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

    // In a real app, this would save to database
    const response: ApiResponse = {
      success: true,
      data: {
        message: `Property ${property.mls_number} marked as favorite`,
        property: {
          id: property.id,
          mls_number: property.mls_number,
          address: property.address.line1
        },
        user: req.user?.email
      },
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
        code: 'FAVORITE_FAILED',
        message: 'Failed to mark property as favorite',
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
 * GET /demo/:scenario
 * Get properties by demo scenario
 */
router.get('/demo/:scenario', (req: Request, res: Response) => {
  try {
    const { scenario } = req.params;
    const properties = PropertyService.getPropertiesByScenario(scenario);

    const response: ApiResponse = {
      success: true,
      data: {
        scenario,
        properties,
        total: properties.length
      },
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
        code: 'DEMO_SCENARIO_FAILED',
        message: 'Failed to get demo scenario properties',
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