import express from 'express';
import { config } from '@/config/env';
import { initSupabase, testSupabaseConnection } from '@/config/supabase';
import { DocumentService } from '@/services/document.service';
import { setupMiddleware, errorHandler, notFoundHandler } from '@/middleware';
import healthRouter from '@/routes/health';
import authRouter from '@/routes/auth';
import propertyRouter from '@/routes/properties';
import documentRouter from '@/routes/documents';

const app = express();

// Setup middleware
setupMiddleware(app);

// Initialize Supabase
initSupabase();

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'RealeAgent API' });
});

// API routes
app.use('/api/v1', healthRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/properties', propertyRouter);
app.use('/api/v1/documents', documentRouter);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection on startup
    const dbStatus = await testSupabaseConnection();
    if (dbStatus.connected) {
      console.log('✅ Database connection established');
    } else {
      console.log(`⚠️  Database connection failed: ${dbStatus.error}`);
    }

    // Initialize document service
    await DocumentService.initialize();

    app.listen(config.port, () => {
      console.log(`🚀 RealeAgent API server running on port ${config.port}`);
      console.log(`📍 Local: http://localhost:${config.port}`);
      console.log(`🌍 Environment: ${config.node_env}`);
      console.log(`📊 Health check: http://localhost:${config.port}/api/v1/health`);
      console.log(`📄 Document generation: http://localhost:${config.port}/api/v1/documents`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;