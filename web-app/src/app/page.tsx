'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Always redirect to login on home page
    // This ensures fresh starts always go through login
    router.push('/login');
  }, [router]);
  
  return null;
}