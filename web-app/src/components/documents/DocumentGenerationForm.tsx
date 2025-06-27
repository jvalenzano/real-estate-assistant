'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import documentService from '@/services/document.service';
import TemplateSelector from './TemplateSelector';

interface Property {
  id: string;
  mlsNumber: string;
  address: string;
  price: number;
}

interface DocumentGenerationFormProps {
  onDocumentGenerated?: (document: any) => void;
  preselectedProperty?: Property;
  preselectedTemplate?: string;
}

export default function DocumentGenerationForm({ 
  onDocumentGenerated,
  preselectedProperty,
  preselectedTemplate 
}: DocumentGenerationFormProps) {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string>(preselectedTemplate || '');
  const [propertyId, setPropertyId] = useState<string>(preselectedProperty?.mlsNumber || '');
  const [formData, setFormData] = useState({
    buyerName: '',
    offerPrice: preselectedProperty?.price || 0,
    closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    contingencies: ['inspection', 'financing', 'appraisal'],
    additionalTerms: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Demo properties for selection
  const demoProperties: Property[] = [
    {
      id: 'ML81234567',
      mlsNumber: 'ML81234567',
      address: '1234 Market St, San Francisco, CA 94103',
      price: 1495000
    },
    {
      id: 'ML81234568',
      mlsNumber: 'ML81234568',
      address: '456 Valencia St, San Francisco, CA 94110',
      price: 2250000
    },
    {
      id: 'ML81234569',
      mlsNumber: 'ML81234569',
      address: '789 Mission St, San Francisco, CA 94105',
      price: 3200000
    },
    {
      id: 'ML81234570',
      mlsNumber: 'ML81234570',
      address: '321 Ocean View Dr, San Francisco, CA 94121',
      price: 2850000
    },
    {
      id: 'ML81234571',
      mlsNumber: 'ML81234571',
      address: '567 Lombard St, San Francisco, CA 94133',
      price: 4250000
    },
    {
      id: 'ML81234572',
      mlsNumber: 'ML81234572',
      address: '890 Castro St, San Francisco, CA 94114',
      price: 1875000
    },
    {
      id: 'ML81234573',
      mlsNumber: 'ML81234573',
      address: '123 Fillmore St, San Francisco, CA 94115',
      price: 2150000
    },
    {
      id: 'ML81234574',
      mlsNumber: 'ML81234574',
      address: '456 Haight St, San Francisco, CA 94117',
      price: 1650000
    },
    {
      id: 'ML81234575',
      mlsNumber: 'ML81234575',
      address: '789 Divisadero St, San Francisco, CA 94115',
      price: 2950000
    },
    {
      id: 'ML81234576',
      mlsNumber: 'ML81234576',
      address: '234 Geary Blvd, San Francisco, CA 94118',
      price: 3450000
    },
    {
      id: 'ML81234577',
      mlsNumber: 'ML81234577',
      address: '567 Russian Hill Dr, San Francisco, CA 94109',
      price: 5250000
    },
    {
      id: 'ML81234578',
      mlsNumber: 'ML81234578',
      address: '890 Nob Hill Ave, San Francisco, CA 94108',
      price: 4875000
    }
  ];

  useEffect(() => {
    if (preselectedProperty) {
      setPropertyId(preselectedProperty.mlsNumber);
      setFormData(prev => ({ ...prev, offerPrice: preselectedProperty.price }));
    }
  }, [preselectedProperty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const document = await documentService.generateDocument({
        templateCode: selectedTemplate,
        formData: {
          propertyId,
          propertyAddress: demoProperties.find(p => p.mlsNumber === propertyId)?.address || '',
          buyerName: formData.buyerName,
          offerPrice: formData.offerPrice,
          closingDate: formData.closingDate,
          contingencies: formData.contingencies,
          additionalTerms: formData.additionalTerms
        },
        transactionId: uuidv4()
      });

      if (onDocumentGenerated) {
        onDocumentGenerated(document);
      } else {
        router.push(`/documents/${document.documentId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate document');
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyChange = (mlsNumber: string) => {
    setPropertyId(mlsNumber);
    const property = demoProperties.find(p => p.mlsNumber === mlsNumber);
    if (property) {
      setFormData(prev => ({ ...prev, offerPrice: property.price }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Generate Document</h1>
            <p className="mt-1 text-sm text-gray-600">
              Create a new document from a template
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
            {/* Template Selection */}
            {!preselectedTemplate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Template
                </label>
                <TemplateSelector
                  value={selectedTemplate}
                  onChange={setSelectedTemplate}
                />
              </div>
            )}

            {/* Property Selection */}
            <div>
              <label htmlFor="property" className="block text-sm font-medium text-gray-700 mb-2">
                Property
              </label>
              <select
                id="property"
                value={propertyId}
                onChange={(e) => handlePropertyChange(e.target.value)}
                className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
                required
              >
                <option value="">Select a property</option>
                {demoProperties.map(property => (
                  <option key={property.id} value={property.mlsNumber}>
                    {property.address} - ${property.price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Buyer Name */}
            <div>
              <label htmlFor="buyerName" className="block text-sm font-medium text-gray-700 mb-2">
                Buyer Name
              </label>
              <input
                type="text"
                id="buyerName"
                value={formData.buyerName}
                onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Offer Price */}
            <div>
              <label htmlFor="offerPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Offer Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="offerPrice"
                  value={formData.offerPrice}
                  onChange={(e) => setFormData({ ...formData, offerPrice: parseInt(e.target.value) || 0 })}
                  className="w-full pl-8 pr-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            {/* Closing Date */}
            <div>
              <label htmlFor="closingDate" className="block text-sm font-medium text-gray-700 mb-2">
                Closing Date
              </label>
              <input
                type="date"
                id="closingDate"
                value={formData.closingDate}
                onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
                required
              />
            </div>

            {/* Contingencies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contingencies
              </label>
              <div className="space-y-2">
                {['inspection', 'financing', 'appraisal', 'sale-of-property'].map(contingency => (
                  <label key={contingency} className="flex items-center">
                    <input
                      type="checkbox"
                      value={contingency}
                      checked={formData.contingencies.includes(contingency)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            contingencies: [...formData.contingencies, contingency]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            contingencies: formData.contingencies.filter(c => c !== contingency)
                          });
                        }
                      }}
                      className="h-5 w-5 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 sm:ml-2 text-base sm:text-sm text-gray-700 capitalize">
                      {contingency.replace('-', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Terms */}
            <div>
              <label htmlFor="additionalTerms" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Terms (Optional)
              </label>
              <textarea
                id="additionalTerms"
                value={formData.additionalTerms}
                onChange={(e) => setFormData({ ...formData, additionalTerms: e.target.value })}
                rows={4}
                className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter any additional terms or conditions..."
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 sm:justify-between pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-3 sm:py-2 text-gray-600 hover:text-gray-900 text-center min-h-[44px] order-2 sm:order-1"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[44px] order-1 sm:order-2"
                style={{ 
                  backgroundColor: loading ? 'rgb(147, 197, 253)' : 'rgb(37, 99, 235)', 
                  color: 'white',
                  border: 'none',
                  fontWeight: '500'
                }}
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? 'Generating...' : 'Generate Document'}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}