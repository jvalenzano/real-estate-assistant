import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/services/property.service';

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
  const primaryImage = property.images.find(img => img.is_primary) || property.images[0];
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(property.list_price);

  // Price change indicator for demo
  const isPriceReduced = property.days_on_market > 30 && property.list_price < 1000000;

  const isGoldenPath = property.mls_number === 'ML81234567';

  return (
    <Link href={`/properties/${property.id}`} className="block h-full">
      <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col group ${
        isGoldenPath ? 'ring-2 ring-yellow-400' : ''
      }`}>
        {/* Image Container - Fixed Height */}
        <div className="relative h-56 w-full flex-shrink-0">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt_text}
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
          
          {/* Status Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {isGoldenPath && (
              <span 
                className="px-3 py-1.5 rounded-full text-sm font-semibold shadow-md flex items-center gap-1"
                style={{ 
                  backgroundColor: '#fbbf24', 
                  color: colors.text 
                }}
              >
                <span>⭐</span> Demo Property
              </span>
            )}
            <span 
              className="px-3 py-1.5 rounded-full text-sm font-semibold shadow-md"
              style={{ 
                backgroundColor: colors.success, 
                color: colors.white 
              }}
            >
              {property.listing_status}
            </span>
            {isPriceReduced && (
              <span 
                className="px-3 py-1.5 rounded-full text-sm font-semibold shadow-md"
                style={{ 
                  backgroundColor: colors.warning, 
                  color: colors.white 
                }}
              >
                Price Reduced
              </span>
            )}
          </div>

          {/* Days on Market */}
          <div className="absolute top-3 right-3">
            <span 
              className="px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur"
              style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.7)', 
                color: colors.white 
              }}
            >
              {property.days_on_market} days
            </span>
          </div>
        </div>

        {/* Property Details - Flex Grow */}
        <div className="p-5 flex-grow flex flex-col">
          {/* Price - Bold and Large */}
          <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
            {formattedPrice}
          </h3>

          {/* Address - Clear and Readable */}
          <div className="mb-3">
            <p className="font-semibold" style={{ color: colors.text }}>
              {property.address.line1}
            </p>
            <p className="text-sm" style={{ color: colors.gray }}>
              {property.address.city}, {property.address.state} {property.address.zip_code}
            </p>
          </div>

          {/* Property Stats - Clear Icons and Text */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" stroke={colors.gray} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-semibold" style={{ color: colors.text }}>
                {property.bedrooms}
              </span>
              <span style={{ color: colors.gray }}>beds</span>
            </div>
            
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" stroke={colors.gray} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="font-semibold" style={{ color: colors.text }}>
                {property.bathrooms}
              </span>
              <span style={{ color: colors.gray }}>baths</span>
            </div>
            
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" stroke={colors.gray} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span className="font-semibold" style={{ color: colors.text }}>
                {property.square_feet.toLocaleString()}
              </span>
              <span style={{ color: colors.gray }}>sqft</span>
            </div>
          </div>

          {/* Bottom Info - Spacer and MLS */}
          <div className="mt-auto pt-3 border-t flex justify-between items-center">
            <span className="text-sm font-medium" style={{ color: colors.gray }}>
              {property.property_type}
            </span>
            <span className="text-sm font-semibold" style={{ color: colors.primary }}>
              MLS# {property.mls_number}
            </span>
          </div>
          
          {/* Price per sqft */}
          <div className="mt-2">
            <span className="text-sm" style={{ color: colors.gray }}>
              ${property.price_per_sqft}/sqft
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}