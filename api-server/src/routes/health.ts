import express from 'express';
import { ApiResponse } from '@/types';
import { config, isDevelopment } from '@/config/env';
import { testSupabaseConnection } from '@/config/supabase';

const router = express.Router();

interface HealthData {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  database: 'connected' | 'disconnected' | 'error';
  uptime: number;
}

router.get('/health', async (req, res) => {
  try {
    // Test database connection
    const dbStatus = await testSupabaseConnection();
    
    const healthData: HealthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: config.node_env,
      database: dbStatus.connected ? 'connected' : 'disconnected',
      uptime: process.uptime()
    };

    const response: ApiResponse<HealthData> = {
      success: true,
      data: healthData,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    };

    res.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'HEALTH_CHECK_FAILED',
        message: 'Health check failed',
        details: isDevelopment ? { error: errorMessage } : {}
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