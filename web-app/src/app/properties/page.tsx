'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { PropertyCard } from '@/components/property/PropertyCard';
import PropertyCardSkeleton from '@/components/property/PropertyCardSkeleton';
import propertyService, { Property, PropertySearchParams } from '@/services/property.service';
import { Plus, FileText, FileCheck } from 'lucide-react';
import { demoProperties } from '@/data/demo-properties';
import { useAriaStore } from '@/lib/stores/aria.store';
import { useSearchParams } from 'next/navigation';

// Function to transform demo properties to PropertyCard format
function transformPropertyForCard(property: Property) {
  return {
    id: property.id,
    mlsNumber: property.mls_number,
    address: property.address.line1,
    city: property.address.city,
    state: property.address.state,
    zipCode: property.address.zip_code,
    price: property.list_price,
    beds: property.bedrooms,
    baths: property.bathrooms,
    sqft: property.square_feet,
    images: property.images.map(img => img.url),
    status: property.listing_status === 'Contingent' ? 'Pending' as const : 
            property.listing_status === 'Sold' ? 'Sold' as const :
            property.listing_status === 'Pending' ? 'In Escrow' as const :
            'Active' as const,
    listingDate: property.listing_date,
    propertyType: property.property_type
  };
}

// Design System Colors
const colors = {
  primary: '#2563eb',
  text: '#111827',
  gray: '#6b7280',
  white: '#ffffff',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444'
};

export default function PropertiesPage() {
  const { isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();
  
  // Get filter state and setters from the global store
  const { 
    searchValue, 
    filters, 
    setSearchValue, 
    setFilters,
    clearFilters,
  } = useAriaStore();

  const [properties, setProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Local state for filters is no longer needed
  const searchParams = useSearchParams();

  useEffect(() => {
    // This effect runs once on mount to sync URL params to the store
    const maxPrice = searchParams.get('maxPrice');
    if (maxPrice) {
      setFilters({ maxPrice });
    }
    // Add other filters from URL here if needed
  }, []); // Empty dependency array ensures it runs only once on mount

  useEffect(() => {
    // Let the AuthProvider handle the redirect
    if (!isAuthLoading && isAuthenticated) {
      loadProperties();
    }
  }, [isAuthenticated, isAuthLoading]);

  // This useEffect handles all filtering logic declaratively.
  // It runs whenever the source data or any filter criteria change.
  useEffect(() => {
    let filtered = [...allProperties];
    
    // Apply search filter from store
    if (searchValue.trim()) {
      filtered = filtered.filter(p => 
        p.mls_number.toLowerCase().includes(searchValue.toLowerCase()) ||
        p.address.line1.toLowerCase().includes(searchValue.toLowerCase()) ||
        p.address.city.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    
    // Apply filters from store
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.list_price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.list_price <= parseInt(filters.maxPrice));
    }
    if (filters.propertyTypes.length > 0) {
      filtered = filtered.filter(p => filters.propertyTypes.includes(p.property_type));
    }
    if (filters.minBedrooms > 0) {
      filtered = filtered.filter(p => p.bedrooms >= filters.minBedrooms);
    }
    
    setProperties(filtered);
  }, [allProperties, searchValue, filters]);

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      // For demo, we use the centralized demo properties
      const uniqueProperties = Array.from(new Map(demoProperties.map(p => [p.id, p])).values());
      
      // Just set the source of truth. The useEffect will handle filtering.
      setAllProperties(uniqueProperties as Property[]);

    } catch (error) {
      console.error('Failed to load properties:', error);
      setError('Could not load properties. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearchSuggestions(false);
    // The useEffect will automatically re-filter when searchValue changes.
    // This handler is now only for form submission behavior.
  };

  const handleLogout = () => {
    logout();
  };
  
  const togglePropertyType = (type: string) => {
    const newTypes = filters.propertyTypes.includes(type)
      ? filters.propertyTypes.filter(t => t !== type)
      : [...filters.propertyTypes, type];
    setFilters({ propertyTypes: newTypes });
  };
  
  const SEARCH_SUGGESTIONS = [
    'Ocean View',
    'Downtown',
    'Luxury',
    'ML81234567'
  ];

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
           <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
           <p className="text-lg font-medium text-gray-700">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Render content only if authenticated
  if (!isAuthenticated) {
    // Or redirect logic can be handled here as a fallback
    return null;
  }

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>Properties</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium" style={{ color: colors.gray }}>Sarah Johnson</span>
            <div className="flex items-center gap-3">
              <Image
                src="https://i.pravatar.cc/150?u=sarah.johnson@demo.com"
                alt="Sarah Johnson"
                width={40}
                height={40}
                className="rounded-full"
              />
              <button
                onClick={handleLogout}
                className="text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: colors.primary }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="flex-shrink-0 bg-white border-b px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold" style={{ color: colors.text }}>
                {properties.length}
              </span>
              <span className="text-sm font-medium" style={{ color: colors.gray }}>
                Available Properties
              </span>
            </div>
            <div className="text-sm font-medium" style={{ color: colors.gray }}>
              $875K - $6.75M
            </div>
          </div>
          
          {/* Property Status Indicators */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.success }}></div>
              <span className="text-sm font-medium" style={{ color: colors.text }}>
                Active ({properties.filter(p => p.listing_status === 'Active').length})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.warning }}></div>
              <span className="text-sm font-medium" style={{ color: colors.text }}>
                Price Reduced ({properties.filter(p => p.days_on_market > 30 && p.list_price < 1000000).length})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <span className="text-sm font-medium" style={{ color: colors.text }}>
                New Listings ({properties.filter(p => p.days_on_market <= 7).length})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#fbbf24' }}></div>
              <span className="text-sm font-medium" style={{ color: colors.text }}>
                Featured ({properties.filter(p => p.mls_number === 'ML81234567').length})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Document Management Section */}
      <div className="flex-shrink-0 bg-white border-b px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Document Management</h2>
                <p className="text-blue-100 text-lg mb-6 max-w-2xl">
                  Create and manage California real estate documents with our comprehensive form library.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/documents/new"
                    className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg flex items-center justify-center gap-2 transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5" />
                    Create New Document
                  </Link>
                  <Link 
                    href="/documents"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    View All Documents
                  </Link>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <FileCheck className="w-24 h-24 text-blue-200 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Search and Filters */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b">
        <div className="flex-shrink-0 bg-white px-4 py-4">
          <div className="max-w-7xl mx-auto">
            <form onSubmit={handleSearch} className="flex gap-3 relative mb-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                  placeholder="Search by MLS#, address, or city..."
                  className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                  style={{ color: colors.text }}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setShowSearchSuggestions(true)}
                />
                
                {/* Clear search button */}
                {searchValue && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchValue('');
                      clearFilters();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                
                {/* Search Suggestions */}
                {showSearchSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-20">
                    <div className="p-2">
                      <p className="text-xs font-semibold px-3 py-1" style={{ color: colors.gray }}>
                        QUICK SEARCHES
                      </p>
                      {SEARCH_SUGGESTIONS.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => {
                            setSearchValue(suggestion);
                            setShowSearchSuggestions(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
                          style={{ color: colors.text }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                type="submit"
                className="px-6 py-3 min-h-[48px] text-white font-semibold rounded-lg hover:opacity-90 transition-all"
                style={{ backgroundColor: colors.primary }}
              >
                Search
              </button>
              
              <button
                onClick={() => setIsFiltersOpen(true)}
                className="px-6 py-3 min-h-[48px] font-semibold rounded-lg border-2 hover:bg-gray-50 transition-all flex items-center gap-2"
                style={{ borderColor: colors.primary, color: colors.primary }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Filters
              </button>
            </form>
            
            {/* Quick Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  setSearchValue('Ocean');
                  setFilters({ minPrice: '', maxPrice: '', propertyTypes: [], minBedrooms: 0 });
                }}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                Ocean View
              </button>
              <button
                onClick={() => {
                  setSearchValue('');
                  setFilters({ minPrice: '', maxPrice: '999999', propertyTypes: [], minBedrooms: 0 });
                }}
                className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
              >
                Under $1M
              </button>
              <button
                onClick={() => {
                  const newListings = allProperties.filter(p => p.days_on_market <= 7);
                  setProperties(newListings);
                  setSearchValue('');
                  setFilters({ minPrice: '', maxPrice: '', propertyTypes: [], minBedrooms: 0 });
                }}
                className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
              >
                New Listings
              </button>
              <button
                onClick={() => {
                  setSearchValue('ML81234567');
                  setFilters({ minPrice: '', maxPrice: '', propertyTypes: [], minBedrooms: 0 });
                }}
                className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium flex items-center gap-1"
              >
                <span>⭐</span> Demo Property
              </button>
              <button
                onClick={() => {
                  clearFilters();
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                All Properties
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Search Results Header */}
          {searchValue && properties.length > 0 && (
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm" style={{ color: colors.gray }}>
                Showing {properties.length} results for "{searchValue}"
              </p>
              <button
                onClick={() => {
                  setSearchValue('');
                  clearFilters();
                }}
                className="text-sm font-medium hover:underline"
                style={{ color: colors.primary }}
              >
                Clear search
              </button>
            </div>
          )}
          
          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
               <PropertyCard key={property.id} property={transformPropertyForCard(property)} />
            ))}
          </div>

          {/* Empty State */}
          {properties.length === 0 && searchValue && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                No properties found for "{searchValue}"
              </p>
              <p className="text-sm mb-4" style={{ color: colors.gray }}>
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchValue('');
                  clearFilters();
                }}
                className="px-6 py-3 font-semibold rounded-lg transition-all hover:opacity-90"
                style={{ backgroundColor: colors.primary, color: colors.white }}
              >
                Clear Search & Show All Properties
              </button>
            </div>
          )}
        </div>
      </main>
      
      {/* Filter Panel */}
      {isFiltersOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsFiltersOpen(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-full sm:w-80 bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold" style={{ color: colors.text }}>Filters</h2>
                <button
                  onClick={() => setIsFiltersOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-3" style={{ color: colors.text }}>Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ minPrice: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ color: colors.text }}
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ maxPrice: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ color: colors.text }}
                  />
                </div>
              </div>
              
              {/* Property Type */}
              <div>
                <h3 className="font-semibold mb-3" style={{ color: colors.text }}>Property Type</h3>
                <div className="space-y-2">
                  {['Single Family', 'Condominium', 'Townhouse'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-3"
                        checked={filters.propertyTypes.includes(type)}
                        onChange={() => togglePropertyType(type)}
                      />
                      <span style={{ color: colors.text }}>{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Bedrooms */}
              <div>
                <h3 className="font-semibold mb-3" style={{ color: colors.text }}>
                  Bedrooms {filters.minBedrooms > 0 && <span className="text-sm font-normal">({filters.minBedrooms}+ bedrooms)</span>}
                </h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((beds) => (
                    <button
                      key={beds}
                      onClick={() => {
                        const newBeds = filters.minBedrooms === beds ? 0 : beds;
                        setFilters({ minBedrooms: newBeds });
                      }}
                      className={`px-4 py-2 border rounded-lg transition-all ${
                        filters.minBedrooms === beds 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      style={{ 
                        color: filters.minBedrooms === beds ? colors.primary : colors.text,
                        borderColor: filters.minBedrooms === beds ? colors.primary : undefined
                      }}
                    >
                      {beds}+
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Apply Filters Button */}
              <div className="pt-4">
                <button
                  onClick={() => setIsFiltersOpen(false)}
                  className="w-full px-6 py-3 text-white font-semibold rounded-lg"
                  style={{ backgroundColor: colors.primary }}
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    clearFilters();
                    setIsFiltersOpen(false);
                  }}
                  className="w-full px-6 py-3 font-semibold rounded-lg border-2 mt-2"
                  style={{ borderColor: colors.gray, color: colors.gray }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}