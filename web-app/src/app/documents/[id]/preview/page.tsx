'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import documentService, { DocumentResponse } from '@/services/document.service';
import api from '@/services/api';

export default function DocumentPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const [documentData, setDocumentData] = useState<DocumentResponse | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string>('');
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = () => {
    // Add a class to the body for print mode
    window.document.body.classList.add('printing');
    window.print();
    // Remove the class after printing
    setTimeout(() => {
      window.document.body.classList.remove('printing');
    }, 1000);
  };

  useEffect(() => {
    fetchDocument();
  }, [params.id]);

  useEffect(() => {
    // Cleanup blob URL when component unmounts
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl]);

  const fetchDocument = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching document with ID:', params.id);
      
      const data = await documentService.getDocument(params.id as string);
      setDocumentData(data);
      console.log('Document fetched:', data);
      
      // Try to fetch PDF blob first
      try {
        const documentId = data.documentId || (params.id as string);
        console.log('Fetching PDF for documentId:', documentId);
        const pdfBlob = await documentService.downloadDocument(documentId);
        const blobUrl = URL.createObjectURL(pdfBlob);
        setPdfBlobUrl(blobUrl);
      } catch (pdfError: any) {
        // Only log non-404 errors
        if (pdfError.response?.status !== 404) {
          console.warn('PDF error:', pdfError.message);
        }
        
        // If PDF fails, try to fetch HTML preview
        if (data.htmlPreviewUrl) {
          try {
            const htmlResponse = await api.get(data.htmlPreviewUrl.replace('/api/v1', ''), {
              responseType: 'text'
            });
            setHtmlContent(htmlResponse.data);
          } catch (htmlError: any) {
            console.error('Failed to fetch HTML preview:', htmlError);
            // If both PDF and HTML fail, show a basic error message
            setError('Document preview is being generated. Please refresh the page in a moment.');
          }
        } else {
          setError('Document preview is being generated. Please refresh the page in a moment.');
        }
      }
    } catch (err: any) {
      console.error('Document fetch error:', err);
      if (err.response?.status === 404) {
        setError('Document not found. It may still be generating. Please try refreshing the page.');
      } else {
        setError(err.message || 'Failed to load document');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!documentData) {
      alert('Document information not available. Please refresh the page.');
      return;
    }

    const documentId = documentData.documentId || (params.id as string);
    console.log('Attempting download for document:', documentId);

    try {
      setIsDownloading(true);
      let blob: Blob;
      
      try {
        // Try to download PDF
        blob = await documentService.downloadDocument(documentId);
      } catch (err: any) {
        console.error('PDF download error:', err);
        
        // If PDF fails, offer to print instead
        if (err.response?.status === 404 || err.response?.status === 500) {
          const usePrint = confirm('PDF generation is not available. Would you like to print the document instead? You can save it as PDF from the print dialog.');
          if (usePrint) {
            window.print();
          }
          return;
        }
        throw new Error('Failed to download PDF. Please try again.');
      }
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `RPA_${documentData.documentId}.pdf`;
      window.document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(link);
    } catch (err: any) {
      console.error('Download error:', err);
      alert(err.message || 'Failed to download document. Please use the Print button instead.');
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

  if (error || !documentData) {
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
          <div className="text-center max-w-md">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
              >
                Refresh Page
              </button>
              <button 
                onClick={() => router.push('/properties')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 active:scale-95 transition-all"
              >
                Back to Properties
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen-safe bg-white">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b text-gray-900 safe-top z-10">
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

      {/* PDF/HTML Viewer */}
      <main className="flex-1 bg-gray-100 overflow-hidden">
        {pdfBlobUrl ? (
          <iframe
            src={pdfBlobUrl}
            className="w-full h-full"
            title="RPA Document Preview"
          />
        ) : htmlContent ? (
          <div className="w-full h-full bg-white overflow-auto">
            <style dangerouslySetInnerHTML={{ __html: `
              @media print {
                body { margin: 0; }
                header, .safe-bottom, .bg-green-600 { display: none !important; }
                main { height: auto !important; }
                iframe { height: auto !important; page-break-inside: avoid; }
              }
              /* Hide any console errors that might appear */
              .console-error, .error-message { display: none !important; }
            ` }} />
            <iframe
              srcDoc={htmlContent}
              className="w-full h-full"
              title="RPA Document Preview"
              style={{
                minHeight: '100%',
                backgroundColor: 'white',
                border: 'none'
              }}
              sandbox="allow-same-origin"
              onError={(e) => {
                console.log('Iframe error suppressed:', e);
              }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading document...</p>
            </div>
          </div>
        )}
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
        <div className="flex gap-2 p-4">
          <button
            onClick={() => router.push('/properties')}
            className="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 active:scale-95 transition-all min-w-[120px]"
          >
            Back
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 active:scale-95 transition-all"
          >
            Print Document
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
          >
            {isDownloading ? 'Loading...' : 'Download'}
          </button>
        </div>
      </div>
    </div>
  );
}