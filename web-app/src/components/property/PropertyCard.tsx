import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/services/property.service';
import { Heart, Bed, Bath, Ruler, Share2 } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
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

export default function PropertyCard({ property }: PropertyCardProps) {
  // Handle both image formats for compatibility
  const primaryImage = property.images?.find?.(img => img.is_primary) || 
                      property.images?.[0] || 
                      (property as any).photos?.[0] || 
                      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800';
  
  const imageUrl = typeof primaryImage === 'string' ? primaryImage : primaryImage?.url || primaryImage;
  
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(property.list_price);

  // Price change indicator for demo
  const isPriceReduced = property.days_on_market > 30 && property.list_price < 1000000;

  const isGoldenPath = property.mls_number === 'ML81234567';

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col group ${
      isGoldenPath ? 'ring-2 ring-amber-500' : ''
    }`}>
        {/* Image Container with enhanced styling */}
        <div className="relative h-64 w-full flex-shrink-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={property.address.line1 || 'Property image'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={property.demo_priority === 1}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span style={{ color: colors.gray }}>No image available</span>
            </div>
          )}
          
          {/* Enhanced Status Badges with better positioning */}
          <div className="absolute top-4 left-4 flex gap-2">
            {isGoldenPath && (
              <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-1">
                <span>⭐</span> Demo Property
              </span>
            )}
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              {property.listing_status || (property as any).status || 'Active'}
            </span>
            {isPriceReduced && (
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                Price Reduced
              </span>
            )}
          </div>

          {/* Days on Market - enhanced styling */}
          <div className="absolute top-4 right-4">
            <span className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
              {property.days_on_market} days
            </span>
          </div>
        </div>

        {/* Enhanced content area */}
        <div className="p-6 flex-grow flex flex-col">
          {/* Price with heart icon */}
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-2xl font-bold text-gray-900">
              {formattedPrice}
            </h3>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Heart className="w-6 h-6" />
            </button>
          </div>

          {/* Address with better typography */}
          <p className="text-lg text-gray-700 font-medium mb-2">
            {property.address.line1}
          </p>
          <p className="text-gray-500 mb-4">
            {property.address.city}, {property.address.state} {property.address.zip_code}
          </p>

          {/* Property details with icons */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              {property.bedrooms} bed
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              {property.bathrooms} bath
            </span>
            <span className="flex items-center gap-1">
              <Ruler className="w-4 h-4" />
              {property.square_feet.toLocaleString()} sqft
            </span>
          </div>

          {/* Spacer to push buttons to bottom */}
          <div className="flex-grow" />
          
          {/* Action buttons */}
          <div className="flex gap-3 mt-4">
            <Link 
              href={`/properties/${property.id}`}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-center"
            >
              View Details
            </Link>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          
          {/* Bottom info */}
          <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm">
            <span className="text-gray-500">
              {property.property_type} • ${property.price_per_sqft}/sqft
            </span>
            <span className="font-medium text-blue-600">
              MLS# {property.mls_number}
            </span>
          </div>
        </div>
      </div>
  );
}