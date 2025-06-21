import express from 'express';
import cors from 'cors';
import { ApiResponse } from '@/types';
import { isDevelopment } from '@/config/env';

// Request logging middleware
export const requestLogger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const method = req.method;
    const path = req.path;
    
    // Color coding for status
    const statusColor = status >= 400 ? '\x1b[31m' : status >= 300 ? '\x1b[33m' : '\x1b[32m';
    const resetColor = '\x1b[0m';
    
    console.log(`${statusColor}${method} ${path} - ${status} - ${duration}ms${resetColor}`);
  });
  
  next();
};

// Enhanced error handling middleware
export const errorHandler = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.error('Error Details:', {
    message: err.message,
    stack: isDevelopment ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error response
  const errorResponse: ApiResponse = {
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Something went wrong',
      details: isDevelopment ? { stack: err.stack } : {}
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0'
    }
  };

  // Set status code based on error type
  let statusCode = 500;
  if (err.code === 'VALIDATION_ERROR') statusCode = 400;
  if (err.code === 'UNAUTHORIZED') statusCode = 401;
  if (err.code === 'FORBIDDEN') statusCode = 403;
  if (err.code === 'NOT_FOUND') statusCode = 404;

  res.status(statusCode).json(errorResponse);
};

// 404 handler for unmatched routes
export const notFoundHandler = (req: express.Request, res: express.Response) => {
  const response: ApiResponse = {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
      details: {}
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0'
    }
  };

  res.status(404).json(response);
};

// Standard middleware setup
export const setupMiddleware = (app: express.Application) => {
  // Request parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // CORS configuration
  app.use(cors({
    origin: isDevelopment ? true : process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8081'],
    credentials: true
  }));

  // Request logging
  app.use(requestLogger);
};