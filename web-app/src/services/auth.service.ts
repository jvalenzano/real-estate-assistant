import storage from './storage';
import api, { TOKEN_KEY } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'agent' | 'broker' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Attempting login with:', credentials.email);
      const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', credentials);
      console.log('Login response:', response.data);
      
      // Extract token and user from the wrapped response
      const { token, user } = response.data.data;
      
      // Store token in storage
      await storage.setItem(TOKEN_KEY, token);
      console.log('Token stored successfully');
      
      // Transform user data to match our interface
      const transformedUser: User = {
        id: user.id,
        email: user.email,
        name: `${(user as any).firstName} ${(user as any).lastName}`,
        role: user.role
      };
      
      return { token, user: transformedUser };
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      }
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/register', data);
      const { token, user } = response.data.data;
      
      // Store token in storage
      await storage.setItem(TOKEN_KEY, token);
      
      return { token, user };
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error('Email already exists');
      }
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if it exists
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with local logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      // Always remove token from storage
      await storage.removeItem(TOKEN_KEY);
    }
  }

  /**
   * Get stored authentication token
   */
  async getToken(): Promise<string | null> {
    try {
      return await storage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated by verifying token exists
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<string | null> {
    try {
      const response = await api.post<{ token: string }>('/auth/refresh');
      const { token } = response.data;
      
      await AsyncStorage.setItem(TOKEN_KEY, token);
      return token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }
}

export default new AuthService();