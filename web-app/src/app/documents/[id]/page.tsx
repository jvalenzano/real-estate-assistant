'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import documentService from '@/services/document.service';
import DocumentGenerationForm from '@/components/documents/DocumentGenerationForm';
import PDFViewer from '@/components/documents/PDFViewer';

interface DocumentData {
  documentId: string;
  status?: string;
  type?: string;
  pdfUrl?: string;
  htmlPreviewUrl?: string;
  createdAt?: string;
}

export default function DocumentPage() {
  const params = useParams();
  const documentId = params.id as string;
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGenerationForm, setShowGenerationForm] = useState(false);

  useEffect(() => {
    if (documentId === 'new') {
      setShowGenerationForm(true);
      setLoading(false);
      return;
    }

    loadDocument();
  }, [documentId]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      const doc = await documentService.getDocument(documentId);
      setDocument(doc);
    } catch (err) {
      setError('Failed to load document');
      console.error('Error loading document:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentGenerated = (newDocument: DocumentData) => {
    setDocument(newDocument);
    setShowGenerationForm(false);
    window.history.pushState(null, '', `/documents/${newDocument.documentId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Document</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.href = '/properties'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  if (showGenerationForm || documentId === 'new') {
    return <DocumentGenerationForm onDocumentGenerated={handleDocumentGenerated} />;
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Document not found</p>
          <button
            onClick={() => window.location.href = '/properties'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Document Details</h1>
              <p className="mt-1 text-sm text-gray-600">
                Document ID: {document.documentId}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                document.status === 'completed' ? 'bg-green-100 text-green-800' :
                document.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {document.status || 'Unknown'}
              </span>
              <button
                onClick={() => window.location.href = '/properties'}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Back
              </button>
            </div>
          </div>
          
          {document.createdAt && (
            <div className="mt-4 text-sm text-gray-600">
              Created: {new Date(document.createdAt).toLocaleString()}
            </div>
          )}
        </div>

        {/* PDF Viewer */}
        {document.pdfUrl ? (
          <PDFViewer pdfUrl={document.pdfUrl} documentId={document.documentId} />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12">
            <div className="text-center">
              <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No PDF Available</h3>
              <p className="text-gray-600 mb-6">
                This document hasn't been generated yet or the PDF is still processing.
              </p>
              {document.htmlPreviewUrl && (
                <a
                  href={document.htmlPreviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View HTML Preview
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}