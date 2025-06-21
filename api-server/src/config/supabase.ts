import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './env';

let supabase: SupabaseClient | null = null;

export function initSupabase(): SupabaseClient {
  if (!config.supabase.url || !config.supabase.anonKey) {
    console.warn('⚠️  Supabase credentials not configured - using placeholder client');
    // Return a mock client for development when credentials aren't set
    return createClient('https://placeholder.supabase.co', 'placeholder-key');
  }

  if (!supabase) {
    supabase = createClient(config.supabase.url, config.supabase.anonKey);
    console.log('✅ Supabase client initialized');
  }

  return supabase;
}

export function getSupabaseServiceClient(): SupabaseClient {
  if (!config.supabase.url || !config.supabase.serviceKey) {
    console.warn('⚠️  Supabase service key not configured - using placeholder client');
    return createClient('https://placeholder.supabase.co', 'placeholder-key');
  }

  return createClient(config.supabase.url, config.supabase.serviceKey);
}

export async function testSupabaseConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    const client = initSupabase();
    
    // Skip actual connection test for placeholder values
    if (config.supabase.url.includes('placeholder') || config.supabase.url.includes('your-project')) {
      return { connected: false, error: 'Using placeholder credentials' };
    }

    // Test connection with a simple query
    const { error } = await client.from('_health').select('count').limit(1);
    
    if (error && error.message !== "relation \"_health\" does not exist") {
      // If it's not a "table doesn't exist" error, it's a real connection issue
      return { connected: false, error: error.message };
    }

    return { connected: true };
  } catch (error) {
    return { 
      connected: false, 
      error: error instanceof Error ? error.message : 'Unknown connection error' 
    };
  }
}

// Export the client getter
export const getSupabase = () => initSupabase();