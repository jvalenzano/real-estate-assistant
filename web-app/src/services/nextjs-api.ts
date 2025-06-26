import { TOKEN_KEY } from './api';

/**
 * API service for Next.js internal API routes
 * This replaces the external API calls with Next.js API routes
 */

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    version: string;
  };
}

class NextJsApi {
  private async getAuthToken(): Promise<string | null> {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  private async fetchWithAuth<T = any>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = await this.getAuthToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle empty responses
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return { success: true, data: null } as ApiResponse<T>;
      }

      const data = await response.json();

      if (!response.ok) {
        console.error('API Error:', response.status, data);
        throw new Error(data.error?.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async post<T = any>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    // Convert relative paths to Next.js API routes
    const url = endpoint.startsWith('/') ? `/api/v1${endpoint}` : `/api/v1/${endpoint}`;
    
    return this.fetchWithAuth<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async get<T = any>(endpoint: string, options?: { params?: Record<string, any> }): Promise<ApiResponse<T>> {
    // Convert relative paths to Next.js API routes
    let url = endpoint.startsWith('/') ? `/api/v1${endpoint}` : `/api/v1/${endpoint}`;
    
    // Add query parameters if provided
    if (options?.params) {
      const queryString = new URLSearchParams(
        Object.entries(options.params)
          .filter(([_, value]) => value !== undefined && value !== null)
          .map(([key, value]) => [key, String(value)])
      ).toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    return this.fetchWithAuth<T>(url, {
      method: 'GET',
    });
  }

  async getBlob(endpoint: string): Promise<Blob> {
    // Convert relative paths to Next.js API routes
    const url = endpoint.startsWith('/') ? `/api/v1${endpoint}` : `/api/v1/${endpoint}`;
    
    const token = await this.getAuthToken();
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.blob();
  }
}

export default new NextJsApi();