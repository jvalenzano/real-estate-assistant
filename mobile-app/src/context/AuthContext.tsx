import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import authService, { User, LoginCredentials, RegisterData } from '../services/auth.service';

interface AuthContextData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Start with false to show login immediately

  // Check authentication status on app startup
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      console.log('Checking auth status...');
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auth check timeout')), 5000)
      );
      
      const checkPromise = async () => {
        // Check if token exists
        const storedToken = await authService.getToken();
        console.log('Stored token exists:', !!storedToken);
        
        if (storedToken) {
          setToken(storedToken);
          
          // Skip user fetch on initial load to prevent blocking
          // User data will be fetched when needed
          console.log('Token found, skipping user fetch for faster load');
        }
      };
      
      await Promise.race([checkPromise(), timeoutPromise]);
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Clear auth state on error
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
      console.log('Auth check complete');
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('AuthContext: Starting login...');
      const { token: newToken, user: userData } = await authService.login(credentials);
      console.log('AuthContext: Login successful, setting state...');
      setToken(newToken);
      setUser(userData);
      console.log('AuthContext: State updated, isAuthenticated will be:', !!newToken);
    } catch (error) {
      console.error('AuthContext: Login failed:', error);
      // Re-throw error to be handled by the component
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const { token: newToken, user: userData } = await authService.register(data);
      setToken(newToken);
      setUser(userData);
    } catch (error) {
      // Re-throw error to be handled by the component
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state
      setToken(null);
      setUser(null);
    }
  };

  const value: AuthContextData = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;