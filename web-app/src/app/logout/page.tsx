'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Clear all auth data
    localStorage.removeItem('@RealAgent:authToken');
    localStorage.clear();
    
    // Redirect to login
    router.push('/login');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-gray-600">Logging out...</p>
      </div>
    </div>
  );
}