'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { FileText, ChevronRight, ArrowRight } from 'lucide-react';

interface Template {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  categoryNumber: string;
  isImplemented: boolean;
  isCommonlyUsed: boolean;
}

export default function NewDocumentPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/v1/document-templates')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTemplates(data.data);
        } else {
          setError('Failed to load templates');
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load templates');
        setLoading(false);
      });
  }, []);

  const categories = [
    { value: 'all', label: 'All Forms' },
    { value: 'buyers-offer', label: "Buyer's Offer" },
    { value: 'contingency-removal', label: 'Contingency Removal' },
    { value: 'escrow-contingency', label: 'Escrow & Contingency' },
    { value: 'final-disclosures', label: 'Final Disclosures' },
    { value: 'specific-situations', label: 'Specific Situations' },
    { value: 'listing-stage', label: 'Listing Stage' }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  // Group templates by category for better display
  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    const category = template.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(template);
    return acc;
  }, {} as Record<string, Template[]>);

  const handleTemplateSelect = (template: Template) => {
    // Navigate to the form data entry page with the template code
    router.push(`/documents/create?template=${template.code}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Templates</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 text-gray-600 hover:text-gray-900 flex items-center transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create New Document</h1>
          <p className="mt-2 text-gray-600 text-sm md:text-base">
            Select a template to get started. Currently, only CA RPA is available for document generation.
          </p>
        </div>

        {/* Category Filter - Mobile optimized */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
          <select 
            className="w-full md:w-64 px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Templates Grid - Stacks on mobile */}
        {selectedCategory === 'all' ? (
          // Show grouped by category
          Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
            <div key={category} className="mb-8">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 capitalize">
                {category.replace(/-/g, ' ')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {categoryTemplates.map(template => (
                  <TemplateCard 
                    key={template.id} 
                    template={template} 
                    onSelect={handleTemplateSelect}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          // Show filtered templates
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredTemplates.map(template => (
              <TemplateCard 
                key={template.id} 
                template={template} 
                onSelect={handleTemplateSelect}
              />
            ))}
          </div>
        )}

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No templates found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TemplateCard({ template, onSelect }: { template: Template; onSelect: (template: Template) => void }) {
  if (template.isImplemented) {
    // Enhanced CA_RPA card (available)
    return (
      <div 
        className="bg-white rounded-xl border-2 border-blue-200 shadow-lg hover:shadow-xl hover:border-blue-300 transition-all duration-300 p-6 cursor-pointer transform hover:scale-[1.02]"
        onClick={() => onSelect(template)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          
          {/* Status badges */}
          <div className="flex gap-2">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              Available
            </span>
            {template.isCommonlyUsed && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                Popular
              </span>
            )}
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {template.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4">{template.description}</p>
        
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
          Select
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  } else {
    // Enhanced coming soon cards
    return (
      <div className="bg-gray-50 rounded-xl border-2 border-gray-200 shadow-sm p-6 opacity-75">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-gray-200 p-3 rounded-lg">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          
          <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
            Coming Soon
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          {template.name}
        </h3>
        <p className="text-gray-500 text-sm mb-4">{template.description}</p>
        
        <button className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg font-medium cursor-not-allowed" disabled>
          Coming Soon
        </button>
      </div>
    );
  }
}