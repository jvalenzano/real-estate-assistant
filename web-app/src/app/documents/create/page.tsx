'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { Navigation } from '@/components/Navigation';
import DocumentGenerationForm from '@/components/documents/DocumentGenerationForm';

function CreateDocumentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateCode = searchParams.get('template');

  // If no template is selected, redirect back to selection
  if (!templateCode) {
    router.push('/documents/new');
    return null;
  }

  const handleDocumentGenerated = (document: any) => {
    // Redirect to the document page
    router.push(`/documents/${document.documentId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/documents/new')}
            className="mb-4 text-gray-600 hover:text-gray-900 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Templates
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Create Document</h1>
          <p className="mt-2 text-gray-600">
            Fill in the required information to generate your {templateCode === 'CA_RPA' ? 'California Residential Purchase Agreement' : 'document'}
          </p>
        </div>

        {/* Document Generation Form */}
        <DocumentGenerationForm 
          onDocumentGenerated={handleDocumentGenerated}
          preselectedTemplate={templateCode}
        />
      </div>
    </div>
  );
}

export default function CreateDocumentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CreateDocumentContent />
    </Suspense>
  );
}