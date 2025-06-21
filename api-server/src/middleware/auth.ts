import { Response, NextFunction } from 'express';
import { AuthRequest, ApiResponse } from '@/types';
import { AuthService } from '@/services/auth.service';

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null;

  if (!token) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Access token required',
        details: {}
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    };
    res.status(401).json(response);
    return;
  }

  try {
    // Verify token
    const payload = AuthService.verifyToken(token);
    
    // Get user from payload
    const user = AuthService.getUserById(payload.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if session exists and is valid
    const session = AuthService.getSession(token);
    if (!session) {
      throw new Error('Session not found');
    }

    // Update session access time
    AuthService.updateSessionAccess(token);

    // Attach user to request
    req.user = user;
    
    next();
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
        details: {}
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    };
    res.status(401).json(response);
  }
};

/**
 * Middleware to check if user has required role
 */
export const requireRole = (roles: string | string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
          details: {}
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
      res.status(401).json(response);
      return;
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    if (!allowedRoles.includes(req.user.role)) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions',
          details: {
            requiredRoles: allowedRoles,
            userRole: req.user.role
          }
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
      res.status(403).json(response);
      return;
    }

    next();
  };
};

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null;

  if (!token) {
    next();
    return;
  }

  try {
    const payload = AuthService.verifyToken(token);
    const user = AuthService.getUserById(payload.userId);
    
    if (user) {
      const session = AuthService.getSession(token);
      if (session) {
        AuthService.updateSessionAccess(token);
        req.user = user;
      }
    }
  } catch (error) {
    // Silently ignore auth errors for optional auth
  }

  next();
};