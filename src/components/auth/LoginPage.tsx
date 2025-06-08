import { useState } from 'react';
import { motion } from 'framer-motion';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
}

// Demo accounts for investor presentations
const demoAccounts = [
  { 
    email: 'sarah@realeai.com', 
    password: 'demo123', 
    role: 'Top Producer', 
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150&q=80'
  },
  { 
    email: 'mike@realeai.com', 
    password: 'demo123', 
    role: 'Managing Broker', 
    name: 'Mike Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150&q=80'
  },
  { 
    email: 'investor@realeai.com', 
    password: 'demo123', 
    role: 'Series A Investor', 
    name: 'James Liu',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150&q=80'
  }
];

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [email, setEmail] = useState('sarah@realeai.com');
  const [password, setPassword] = useState('demo123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check demo accounts
    const account = demoAccounts.find(acc => acc.email === email && acc.password === password);
    
    if (account) {
      onLogin(email, password);
    } else {
      setError('Invalid credentials. Please use one of the demo accounts below.');
    }
    
    setIsLoading(false);
  };

  const handleDemoLogin = (account: typeof demoAccounts[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    onLogin(account.email, account.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Logo Area */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl mb-4 shadow-lg"
          >
            <span className="text-3xl">🏠</span>
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 reale-logo">Reale Agent</h1>
          <p className="text-gray-600 text-sm reale-tagline">by Reale AI</p>
          <p className="text-blue-600 text-xs font-medium mt-1">Turn Hours Into Minutes</p>
          <p className="text-gray-500 text-xs">Powering $2.1B+ in transactions monthly</p>
        </div>
        
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors autofill:bg-white autofill:text-gray-900"
              style={{
                WebkitBoxShadow: '0 0 0 1000px white inset',
                WebkitTextFillColor: '#111827'
              }}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors autofill:bg-white autofill:text-gray-900"
              style={{
                WebkitBoxShadow: '0 0 0 1000px white inset',
                WebkitTextFillColor: '#111827'
              }}
              required
            />
          </div>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}
          
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Signing In...
              </>
            ) : (
              'Sign In to Reale Agent'
            )}
          </motion.button>
        </form>

        {/* Forgot Password */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setError('Demo mode: Use one of the demo accounts below')}
                            className="text-sm text-white font-medium bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md transition-colors"
          >
            Forgot Password?
          </button>
        </div>
        
        {/* Demo Accounts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-4 bg-gray-50 rounded-lg"
        >
          <p className="text-xs text-gray-600 mb-3 font-medium">Demo Accounts (Click to Login):</p>
          <div className="space-y-2">
            {demoAccounts.map((account) => (
              <motion.button
                key={account.email}
                onClick={() => handleDemoLogin(account)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-left p-3 bg-white rounded border hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={account.avatar}
                    alt={account.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(account.name)}&background=1976d2&color=fff&size=150`;
                    }}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{account.name}</div>
                    <div className="text-xs text-gray-600">{account.email}</div>
                  </div>
                  <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {account.role}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Password for all demo accounts: <span className="font-mono bg-gray-200 px-1 rounded">demo123</span>
          </p>
        </motion.div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            © 2025 Reale AI. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
