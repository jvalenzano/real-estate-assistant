import express, { Response } from 'express';
import { ApiResponse, AuthRequest, LoginRequest, LoginResponse } from '@/types';
import { AuthService } from '@/services/auth.service';
import { authenticateToken } from '@/middleware/auth';

const router = express.Router();

/**
 * POST /auth/login
 * Authenticate user with email and password
 */
router.post('/login', async (req: express.Request, res: Response) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validate input
    if (!email || !password) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password are required',
          details: {
            missing: [
              !email && 'email',
              !password && 'password'
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

    // Attempt login
    const loginResult = await AuthService.login(email, password);

    const response: ApiResponse<LoginResponse> = {
      success: true,
      data: loginResult,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    };

    res.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'LOGIN_FAILED',
        message: errorMessage,
        details: {}
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    };

    res.status(401).json(response);
  }
});

/**
 * POST /auth/logout
 * Logout user (invalidate token)
 */
router.post('/logout', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.substring(7); // Remove 'Bearer ' prefix

    if (token) {
      AuthService.logout(token);
    }

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: {
        message: 'Logged out successfully'
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
        code: 'LOGOUT_FAILED',
        message: 'Failed to logout',
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
 * GET /auth/me
 * Get current user information
 */
router.get('/me', authenticateToken, (req: AuthRequest, res: Response) => {
  const response: ApiResponse = {
    success: true,
    data: req.user,
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0'
    }
  };

  res.json(response);
});

/**
 * POST /auth/demo/reset
 * Reset demo data for clean demo experience
 */
router.post('/demo/reset', (req: express.Request, res: Response) => {
  try {
    AuthService.resetDemoData();

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: {
        message: 'Demo data reset successfully',
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
        code: 'RESET_FAILED',
        message: 'Failed to reset demo data',
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
 * GET /auth/sessions
 * Get session statistics (for debugging/monitoring)
 */
router.get('/sessions', authenticateToken, (req: AuthRequest, res: Response) => {
  const sessionsCount = AuthService.getActiveSessionsCount();
  const cleanedCount = AuthService.cleanExpiredSessions();

  const response: ApiResponse = {
    success: true,
    data: {
      activeSessions: sessionsCount,
      cleanedSessions: cleanedCount,
      requestUser: req.user?.email
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0'
    }
  };

  res.json(response);
});

export default router;