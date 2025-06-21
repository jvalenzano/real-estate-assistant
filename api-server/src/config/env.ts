import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Config {
  node_env: string;
  port: number;
  jwt: {
    secret: string;
  };
  supabase: {
    url: string;
    anonKey: string;
    serviceKey: string;
  };
  ai: {
    geminiApiKey: string;
  };
  docusign: {
    integrationKey: string;
    userId: string;
    accountId: string;
  };
}

function validateEnvVar(name: string, value: string | undefined, required: boolean = true): string {
  if (!value && required) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value || '';
}

function createConfig(): Config {
  return {
    node_env: validateEnvVar('NODE_ENV', process.env.NODE_ENV, false) || 'development',
    port: parseInt(validateEnvVar('PORT', process.env.PORT, false) || '3001', 10),
    jwt: {
      secret: validateEnvVar('JWT_SECRET', process.env.JWT_SECRET, false) || 'fallback-secret',
    },
    supabase: {
      url: validateEnvVar('SUPABASE_URL', process.env.SUPABASE_URL, false),
      anonKey: validateEnvVar('SUPABASE_ANON_KEY', process.env.SUPABASE_ANON_KEY, false),
      serviceKey: validateEnvVar('SUPABASE_SERVICE_KEY', process.env.SUPABASE_SERVICE_KEY, false),
    },
    ai: {
      geminiApiKey: validateEnvVar('GEMINI_API_KEY', process.env.GEMINI_API_KEY, false),
    },
    docusign: {
      integrationKey: validateEnvVar('DOCUSIGN_INTEGRATION_KEY', process.env.DOCUSIGN_INTEGRATION_KEY, false),
      userId: validateEnvVar('DOCUSIGN_USER_ID', process.env.DOCUSIGN_USER_ID, false),
      accountId: validateEnvVar('DOCUSIGN_ACCOUNT_ID', process.env.DOCUSIGN_ACCOUNT_ID, false),
    },
  };
}

export const config = createConfig();

export const isDevelopment = config.node_env === 'development';
export const isProduction = config.node_env === 'production';