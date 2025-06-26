'use client';

import { useState, useEffect } from 'react';
import documentService from '@/services/document.service';

interface PDFViewerProps {
  pdfUrl?: string;
  documentId: string;
}

export default function PDFViewer({ pdfUrl, documentId }: PDFViewerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const [showEmbed, setShowEmbed] = useState(false);

  useEffect(() => {
    if (pdfUrl) {
      // If we have a direct URL, try to load it
      setPdfDataUrl(pdfUrl);
      setShowEmbed(true);
    }
  }, [pdfUrl]);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);

    try {
      const blob = await documentService.downloadDocument(documentId);
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `document_${documentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async () => {
    if (pdfDataUrl) {
      setShowEmbed(!showEmbed);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const blob = await documentService.downloadDocument(documentId);
      const url = URL.createObjectURL(blob);
      setPdfDataUrl(url);
      setShowEmbed(true);
    } catch (err) {
      console.error('View error:', err);
      setError('Failed to load PDF. Please try downloading instead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Toolbar */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Document Preview</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleView}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showEmbed ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button
              onClick={handleDownload}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-6 py-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* PDF Embed */}
      {showEmbed && pdfDataUrl && (
        <div className="p-6">
          <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '800px' }}>
            <iframe
              src={pdfDataUrl}
              className="w-full h-full"
              title="PDF Preview"
            />
          </div>
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>Having trouble viewing? Try downloading the PDF instead.</p>
          </div>
        </div>
      )}

      {/* Placeholder when not showing embed */}
      {!showEmbed && !error && (
        <div className="p-12">
          <div className="text-center">
            <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">PDF Document Ready</h3>
            <p className="text-gray-600 mb-6">
              Click "Show Preview" to view the document or "Download PDF" to save it.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}