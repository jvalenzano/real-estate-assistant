'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="mb-4">
          <svg className="w-20 h-20 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Oops! Something went wrong
        </h2>
        
        <p className="text-gray-600 mb-6">
          We're sorry for the inconvenience. An unexpected error has occurred.
        </p>

        {/* Error details in development */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-mono text-red-600">{error.message}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 active:scale-95 transition-all"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}