'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import authService from '@/services/auth.service';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await authService.getToken();
      console.log('Checking auth, token exists:', !!token);
      if (token) {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          console.log('User authenticated:', currentUser.email);
          setUser(currentUser);
        } else {
          // Token exists but user fetch failed, clear token
          console.log('Token invalid, clearing...');
          await authService.logout();
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setUser(response.user);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  // Redirect logic
  useEffect(() => {
    if (!isLoading) {
      const publicPaths = ['/login', '/register', '/'];
      const isPublicPath = publicPaths.includes(pathname);

      if (!user && !isPublicPath) {
        router.push('/login');
      } else if (user && (pathname === '/login' || pathname === '/')) {
        router.push('/properties');
      }
    }
  }, [user, isLoading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}