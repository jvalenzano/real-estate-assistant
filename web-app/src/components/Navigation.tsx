'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };
  
  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-bold text-xl text-gray-900">
            RealeAgent
          </Link>
          <div className="flex gap-6">
            <Link 
              href="/properties" 
              className={`font-medium transition-colors ${
                isActive('/properties') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Properties
            </Link>
            <Link 
              href="/documents/new" 
              className={`font-medium transition-colors ${
                isActive('/documents') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Documents
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}