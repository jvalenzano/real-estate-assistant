'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// Removed auth service import for simplicity

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simple direct API call
      const response = await fetch('http://localhost:3001/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.data?.token) {
        // Store token simply
        localStorage.setItem('@RealAgent:authToken', data.data.token);
        // Redirect to properties
        router.push('/properties');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: 'agent@demo.com',
      password: 'demo123'
    });
    // Focus on the submit button after filling
    setTimeout(() => {
      const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      submitButton?.focus();
    }, 100);
  };

  return (
    <div className="flex flex-col h-screen-safe">
      {/* Hero Background */}
      <div className="flex-1 relative bg-gradient-to-br from-blue-600 to-blue-800">
        {/* Safe area top padding */}
        <div className="safe-top" />
        
        {/* Content */}
        <div className="flex flex-col items-center justify-center h-full px-4">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">RealeAgent</h1>
            <p className="text-blue-100">AI-Powered Real Estate</p>
          </div>

          {/* Login Form */}
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Welcome Back
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                    placeholder="agent@demo.com"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 pr-12 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 min-h-[44px] bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>

                {/* Demo Credentials Button */}
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="w-full px-6 py-3 min-h-[44px] bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 active:scale-95 transition-all"
                >
                  Use Demo Credentials
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-700 font-medium">
                  Demo Account: agent@demo.com / demo123
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Safe area bottom padding */}
        <div className="safe-bottom" />
      </div>
    </div>
  );
}