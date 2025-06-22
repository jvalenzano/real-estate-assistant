'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import propertyService, { Property } from '@/services/property.service';
import documentService, { RPAFormData } from '@/services/document.service';

export default function GenerateRPAPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<RPAFormData>({
    propertyId: params.id as string,
    buyerName: '',
    offerPrice: 0,
    closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    contingencies: ['inspection', 'financing', 'appraisal'],
    additionalTerms: ''
  });

  useEffect(() => {
    fetchProperty();
  }, [params.id]);

  const fetchProperty = async () => {
    try {
      setIsLoading(true);
      const data = await propertyService.getPropertyById(params.id as string);
      if (data) {
        setProperty(data);
        setFormData(prev => ({ ...prev, offerPrice: data.list_price }));
      } else {
        setError('Property not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load property');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.buyerName.trim()) {
      setError('Please enter buyer name');
      return;
    }

    if (formData.offerPrice <= 0) {
      setError('Please enter a valid offer price');
      return;
    }

    try {
      setIsGenerating(true);
      setError('');
      
      const document = await documentService.generateRPA(formData);
      
      // Navigate to PDF preview
      router.push(`/documents/${document.documentId}/preview`);
    } catch (err: any) {
      setError(err.message || 'Failed to generate document');
      setIsGenerating(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const toggleContingency = (contingency: string) => {
    setFormData(prev => ({
      ...prev,
      contingencies: prev.contingencies?.includes(contingency)
        ? prev.contingencies.filter(c => c !== contingency)
        : [...(prev.contingencies || []), contingency]
    }));
  };

  if (isLoading || !property) {
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
            <p className="mt-4" style={{ color: '#374151' }}>Loading property...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen-safe bg-gray-50">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b safe-top z-10">
        <div className="flex items-center justify-between h-14 px-4">
          <button 
            onClick={() => router.back()} 
            className="p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">Generate RPA</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="px-4 py-6 max-w-2xl mx-auto">
          {/* Property Summary */}
          <div className="bg-white rounded-lg border p-4 mb-6">
            <h2 className="font-semibold mb-2" style={{ color: '#111827' }}>Property Details</h2>
            <p style={{ color: '#374151' }}>{property.address.line1}</p>
            <p className="text-sm" style={{ color: '#374151' }}>
              {property.address.city}, {property.address.state} {property.address.zip_code}
            </p>
            <p className="text-sm mt-1" style={{ color: '#374151' }}>MLS# {property.mls_number}</p>
            <p className="text-xl font-semibold mt-2">{formatPrice(property.list_price)}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Buyer Information */}
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-4" style={{ color: '#111827' }}>Buyer Information</h3>
              <div>
                <label htmlFor="buyerName" className="block text-sm font-medium mb-1" style={{ color: '#111827' }}>
                  Buyer Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="buyerName"
                  type="text"
                  required
                  value={formData.buyerName}
                  onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John and Jane Doe"
                />
              </div>
            </div>

            {/* Offer Details */}
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-4" style={{ color: '#111827' }}>Offer Details</h3>
              
              <div className="mb-4">
                <label htmlFor="offerPrice" className="block text-sm font-medium mb-1" style={{ color: '#111827' }}>
                  Offer Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#374151' }}>$</span>
                  <input
                    id="offerPrice"
                    type="number"
                    required
                    value={formData.offerPrice}
                    onChange={(e) => setFormData({ ...formData, offerPrice: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-sm mt-1" style={{ color: '#374151' }}>
                  List price: {formatPrice(property.list_price)}
                </p>
              </div>

              <div>
                <label htmlFor="closingDate" className="block text-sm font-medium mb-1" style={{ color: '#111827' }}>
                  Preferred Closing Date
                </label>
                <input
                  id="closingDate"
                  type="date"
                  value={formData.closingDate}
                  onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Contingencies */}
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-4" style={{ color: '#111827' }}>Contingencies</h3>
              <div className="space-y-3">
                {['inspection', 'financing', 'appraisal', 'sale of current home'].map((contingency) => (
                  <label key={contingency} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.contingencies?.includes(contingency) || false}
                      onChange={() => toggleContingency(contingency)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 capitalize" style={{ color: '#374151' }}>{contingency}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Terms */}
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-4" style={{ color: '#111827' }}>Additional Terms (Optional)</h3>
              <textarea
                value={formData.additionalTerms}
                onChange={(e) => setFormData({ ...formData, additionalTerms: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter any additional terms or conditions..."
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="pb-safe-bottom">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full px-6 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Document...
                  </span>
                ) : (
                  'Generate RPA Document'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}