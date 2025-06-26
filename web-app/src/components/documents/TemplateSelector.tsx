'use client';

import { useState, useEffect } from 'react';
import { TEMPLATE_REGISTRY, CATEGORY_NAMES, getCommonlyUsedForms } from '@/templates';

interface TemplateSelectorProps {
  value: string;
  onChange: (templateCode: string) => void;
}

export default function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('01');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyImplemented, setShowOnlyImplemented] = useState(true);

  // Get templates for the selected category
  const getTemplatesForCategory = () => {
    return Object.values(TEMPLATE_REGISTRY)
      .filter(template => {
        if (selectedCategory && template.categoryNumber !== selectedCategory) return false;
        if (showOnlyImplemented && !template.implemented) return false;
        if (searchTerm) {
          const search = searchTerm.toLowerCase();
          return (
            template.name.toLowerCase().includes(search) ||
            template.id.toLowerCase().includes(search) ||
            (template.carFormNumber?.toLowerCase().includes(search))
          );
        }
        return true;
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);
  };

  const templates = getTemplatesForCategory();
  const commonlyUsedTemplates = getCommonlyUsedForms().filter(t => t.implemented);

  return (
    <div className="space-y-4">
      {/* Quick Select for Common Forms */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Commonly Used Forms</h3>
        <div className="grid grid-cols-2 gap-2">
          {commonlyUsedTemplates.slice(0, 4).map(template => (
            <button
              key={template.id}
              type="button"
              onClick={() => onChange(template.id)}
              className={`p-3 text-left border rounded-lg transition-colors ${
                value === template.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium text-sm">{template.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                {template.carFormNumber || 'Form ' + template.id}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Browse by Category</h3>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4 overflow-x-auto">
            {Object.entries(CATEGORY_NAMES).map(([categoryNum, categoryName]) => (
              <button
                key={categoryNum}
                type="button"
                onClick={() => setSelectedCategory(categoryNum)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedCategory === categoryNum
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {categoryName.replace(/'/g, '')}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showOnlyImplemented}
            onChange={(e) => setShowOnlyImplemented(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Implemented only</span>
        </label>
      </div>

      {/* Template List */}
      <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
        {templates.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No templates found</p>
            {showOnlyImplemented && (
              <p className="text-sm mt-2">
                Try unchecking "Implemented only" to see all templates
              </p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {templates.map(template => (
              <button
                key={template.id}
                type="button"
                onClick={() => onChange(template.id)}
                disabled={!template.implemented}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  value === template.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {template.name}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {template.carFormNumber ? `CAR Form ${template.carFormNumber}` : `Template ${template.id}`}
                    </div>
                  </div>
                  <div className="ml-4 flex items-center space-x-2">
                    {template.commonlyUsed && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        Common
                      </span>
                    )}
                    {!template.implemented && (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Template Info */}
      {value && TEMPLATE_REGISTRY[value] && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-blue-800">
              Selected: {TEMPLATE_REGISTRY[value].name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}