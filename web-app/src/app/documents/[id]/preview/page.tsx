'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import documentService, { DocumentResponse } from '@/services/document.service';

export default function DocumentPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const [document, setDocument] = useState<DocumentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetchDocument();
  }, [params.id]);

  const fetchDocument = async () => {
    try {
      setIsLoading(true);
      const data = await documentService.getDocument(params.id as string);
      setDocument(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load document');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!document) return;

    try {
      setIsDownloading(true);
      const blob = await documentService.downloadDocument(document.documentId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `RPA_${document.documentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err: any) {
      alert('Failed to download document');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen-safe bg-gray-50">
        <header className="flex-shrink-0 bg-white border-b safe-top">
          <div className="flex items-center h-14 px-4">
            <button onClick={() => router.back()} className="p-2 -ml-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading document...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="flex flex-col h-screen-safe bg-gray-50">
        <header className="flex-shrink-0 bg-white border-b safe-top">
          <div className="flex items-center h-14 px-4">
            <button onClick={() => router.back()} className="p-2 -ml-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => router.push('/properties')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
              Back to Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen-safe bg-gray-900">
      {/* Header */}
      <header className="flex-shrink-0 bg-gray-800 text-white safe-top z-10">
        <div className="flex items-center justify-between h-14 px-4">
          <button 
            onClick={() => router.push('/properties')} 
            className="p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">Document Preview</h1>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center disabled:opacity-50"
          >
            {isDownloading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* PDF Viewer */}
      <main className="flex-1 bg-gray-100 overflow-hidden">
        <iframe
          src={document.pdfUrl}
          className="w-full h-full"
          title="RPA Document Preview"
          sandbox="allow-same-origin allow-scripts allow-downloads"
          referrerPolicy="no-referrer"
        />
      </main>

      {/* Success Message */}
      <div className="flex-shrink-0 bg-green-600 text-white p-4 safe-bottom">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium">Document Generated Successfully!</p>
              <p className="text-sm text-green-100">Your RPA is ready for download</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex-shrink-0 bg-white border-t safe-bottom">
        <div className="flex gap-3 p-4">
          <button
            onClick={() => router.push('/properties')}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 active:scale-95 transition-all"
          >
            Back to Properties
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}