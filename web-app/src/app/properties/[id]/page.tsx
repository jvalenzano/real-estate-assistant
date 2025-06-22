'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/services/property.service';

// Same demo properties as the main page
const DEMO_PROPERTIES: Property[] = [
  {
    id: 'prop-001',
    mls_number: 'ML81234567',
    demo_priority: 1,
    address: {
      line1: '789 Ocean View Dr',
      line2: null,
      city: 'San Diego',
      state: 'CA',
      zip_code: '92037',
      county: 'San Diego'
    },
    property_type: 'Single Family',
    bedrooms: 4,
    bathrooms: 3.5,
    square_feet: 2850,
    lot_size_sqft: 8500,
    year_built: 2019,
    list_price: 1250000,
    price_per_sqft: 439,
    estimated_monthly_payment: 6875,
    property_taxes_annual: 15000,
    hoa_fees_monthly: 150,
    listing_status: 'Active',
    days_on_market: 14,
    listing_date: '2024-01-01',
    description: 'Stunning ocean view home with modern finishes throughout. This contemporary masterpiece features an open-concept design, floor-to-ceiling windows, and breathtaking views of the Pacific Ocean. The gourmet kitchen includes top-of-the-line appliances and a large island perfect for entertaining.',
    features: {
      exterior: ['Ocean View', 'Pool', 'Spa', '3-Car Garage', 'Private Beach Access'],
      interior: ['Granite Counters', 'Hardwood Floors', 'Smart Home System', 'Wine Cellar', 'Home Theater'],
      utilities: ['Solar Panels', 'Central AC', 'Tankless Water Heater', 'EV Charging Station']
    },
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        alt_text: 'Ocean view home exterior',
        is_primary: true,
        display_order: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        alt_text: 'Living room with ocean view',
        is_primary: false,
        display_order: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800',
        alt_text: 'Modern kitchen',
        is_primary: false,
        display_order: 3
      }
    ]
  },
  {
    id: 'prop-002',
    mls_number: 'ML81234568',
    address: {
      line1: '123 Sunset Boulevard',
      line2: null,
      city: 'Los Angeles',
      state: 'CA',
      zip_code: '90028',
      county: 'Los Angeles'
    },
    property_type: 'Condominium',
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1200,
    lot_size_sqft: 0,
    year_built: 2021,
    list_price: 875000,
    price_per_sqft: 729,
    estimated_monthly_payment: 4812,
    property_taxes_annual: 10500,
    hoa_fees_monthly: 450,
    listing_status: 'Active',
    days_on_market: 7,
    listing_date: '2024-01-07',
    description: 'Modern luxury condo in the heart of Hollywood. Features high-end finishes, open floor plan, and stunning city views from the private balcony.',
    features: {
      exterior: ['City View', 'Balcony', 'Rooftop Deck', 'Gym', 'Pool'],
      interior: ['Quartz Counters', 'Walk-in Closet', 'Stainless Appliances', 'In-unit Laundry'],
      utilities: ['Central AC', 'High-Speed Internet', 'Secure Parking', 'Concierge']
    },
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800',
        alt_text: 'Modern condo exterior',
        is_primary: true,
        display_order: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        alt_text: 'Living room with city view',
        is_primary: false,
        display_order: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
        alt_text: 'Modern kitchen',
        is_primary: false,
        display_order: 3
      }
    ]
  },
  {
    id: 'prop-003',
    mls_number: 'ML81234569',
    address: {
      line1: '456 Palm Street',
      line2: null,
      city: 'Santa Monica',
      state: 'CA',
      zip_code: '90401',
      county: 'Los Angeles'
    },
    property_type: 'Single Family',
    bedrooms: 5,
    bathrooms: 4,
    square_feet: 3500,
    lot_size_sqft: 7200,
    year_built: 2018,
    list_price: 2150000,
    price_per_sqft: 614,
    estimated_monthly_payment: 11825,
    property_taxes_annual: 25800,
    hoa_fees_monthly: 0,
    listing_status: 'Active',
    days_on_market: 21,
    listing_date: '2023-12-24',
    description: 'Contemporary beach house with rooftop deck and just steps from the sand. This architectural gem features sustainable materials and smart home technology throughout.',
    features: {
      exterior: ['Beach Access', 'Rooftop Deck', 'Garage', 'Outdoor Shower', 'BBQ Area'],
      interior: ['Chef Kitchen', 'Wine Cellar', 'Home Theater', 'Master Suite with Ocean Views'],
      utilities: ['Smart Home', 'Solar Panels', 'Radiant Heating', 'Water Filtration']
    },
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
        alt_text: 'Beach house exterior',
        is_primary: true,
        display_order: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800',
        alt_text: 'Beachfront view',
        is_primary: false,
        display_order: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800',
        alt_text: 'Rooftop deck',
        is_primary: false,
        display_order: 3
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
        alt_text: 'Master bedroom',
        is_primary: false,
        display_order: 4
      }
    ]
  },
  {
    id: 'prop-004',
    mls_number: 'ML81234570',
    address: {
      line1: '789 Mountain View Rd',
      line2: null,
      city: 'Pasadena',
      state: 'CA',
      zip_code: '91101',
      county: 'Los Angeles'
    },
    property_type: 'Single Family',
    bedrooms: 3,
    bathrooms: 2.5,
    square_feet: 2200,
    lot_size_sqft: 10000,
    year_built: 1955,
    list_price: 985000,
    price_per_sqft: 448,
    estimated_monthly_payment: 5417,
    property_taxes_annual: 11820,
    hoa_fees_monthly: 0,
    listing_status: 'Active',
    days_on_market: 45,
    listing_date: '2023-12-01',
    description: 'Charming mid-century home with mountain views. Original hardwood floors and architectural details preserved, with modern updates to kitchen and bathrooms.',
    features: {
      exterior: ['Mountain View', 'Large Yard', 'Mature Trees', 'Detached Garage', 'Garden'],
      interior: ['Original Hardwood', 'Fireplace', 'Updated Kitchen', 'Built-in Storage'],
      utilities: ['New HVAC', 'Copper Plumbing', 'Updated Electrical', 'Gas Heat']
    },
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800',
        alt_text: 'Mid-century home exterior',
        is_primary: true,
        display_order: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1556912998-c57cc6b63cd7?w=800',
        alt_text: 'Living room with fireplace',
        is_primary: false,
        display_order: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
        alt_text: 'Kitchen',
        is_primary: false,
        display_order: 3
      }
    ]
  },
  {
    id: 'prop-005',
    mls_number: 'ML81234571',
    address: {
      line1: '321 Downtown Plaza',
      line2: 'Unit 2405',
      city: 'San Diego',
      state: 'CA',
      zip_code: '92101',
      county: 'San Diego'
    },
    property_type: 'Condominium',
    bedrooms: 3,
    bathrooms: 3,
    square_feet: 1800,
    lot_size_sqft: 0,
    year_built: 2022,
    list_price: 1450000,
    price_per_sqft: 806,
    estimated_monthly_payment: 7975,
    property_taxes_annual: 17400,
    hoa_fees_monthly: 650,
    listing_status: 'Active',
    days_on_market: 3,
    listing_date: '2024-01-11',
    description: 'Luxury high-rise condo with panoramic city views. Floor-to-ceiling windows, premium finishes, and access to world-class amenities including pool, gym, and concierge.',
    features: {
      exterior: ['City View', 'Balcony', 'Concierge', 'Valet Parking', 'Rooftop Pool'],
      interior: ['Floor-to-ceiling Windows', 'Modern Kitchen', 'Walk-in Closets', 'Spa Bathroom'],
      utilities: ['Central AC', 'High-Speed Internet', 'In-unit Laundry', 'Storage Unit']
    },
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        alt_text: 'Luxury condo exterior',
        is_primary: true,
        display_order: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt_text: 'Panoramic city view',
        is_primary: false,
        display_order: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
        alt_text: 'Modern living area',
        is_primary: false,
        display_order: 3
      },
      {
        url: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800',
        alt_text: 'Master bathroom',
        is_primary: false,
        display_order: 4
      }
    ]
  },
  {
    id: 'prop-006',
    mls_number: 'ML81234572',
    address: {
      line1: '555 Oak Grove Lane',
      line2: null,
      city: 'Palo Alto',
      state: 'CA',
      zip_code: '94301',
      county: 'Santa Clara'
    },
    property_type: 'Single Family',
    bedrooms: 4,
    bathrooms: 3,
    square_feet: 2600,
    lot_size_sqft: 6500,
    year_built: 2005,
    list_price: 3200000,
    price_per_sqft: 1231,
    estimated_monthly_payment: 17600,
    property_taxes_annual: 38400,
    hoa_fees_monthly: 0,
    listing_status: 'Active',
    days_on_market: 10,
    listing_date: '2024-01-04',
    description: 'Silicon Valley executive home near Stanford. Open floor plan perfect for entertaining, with home office, gourmet kitchen, and private backyard oasis.',
    features: {
      exterior: ['Private Garden', 'EV Charging', 'Solar Panels', 'Pergola', 'Fire Pit'],
      interior: ['Home Office', 'Gourmet Kitchen', 'Master Suite', 'Bonus Room', 'Wine Storage'],
      utilities: ['Fiber Internet', 'Smart Home', 'Water Softener', 'Security System']
    },
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        alt_text: 'Executive home exterior',
        is_primary: true,
        display_order: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
        alt_text: 'Backyard and pool',
        is_primary: false,
        display_order: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800',
        alt_text: 'Home office',
        is_primary: false,
        display_order: 3
      }
    ]
  }
];

// Design system colors
const colors = {
  primary: '#2563eb',
  text: '#111827',
  gray: '#6b7280',
  white: '#ffffff',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444'
};

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    // Find property from demo data
    const foundProperty = DEMO_PROPERTIES.find(p => p.id === params.id);
    if (foundProperty) {
      setProperty(foundProperty);
    }
  }, [params.id]);

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || !property) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentImageIndex < property.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (!property) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <header className="flex-shrink-0 bg-white border-b shadow-sm">
          <div className="flex items-center h-16 px-4">
            <button onClick={() => router.back()} className="p-2 -ml-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Property not found</p>
            <button 
              onClick={() => router.push('/properties')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
              Back to Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isGoldenPath = property.mls_number === 'ML81234567';

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with MLS# */}
      <header className="flex-shrink-0 bg-white border-b shadow-sm z-10">
        <div className="flex items-center justify-between h-16 px-4">
          <button 
            onClick={() => router.push('/properties')} 
            className="p-2 -ml-2 flex items-center gap-2 hover:bg-gray-100 rounded-lg min-h-[44px]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-semibold" style={{ color: colors.text }}>Back</span>
          </button>
          <div className="flex items-center gap-2">
            {isGoldenPath && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                ⭐ Demo Property
              </span>
            )}
            <span className="text-sm font-medium" style={{ color: colors.gray }}>
              MLS# {property.mls_number}
            </span>
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {/* Image Carousel */}
        <div className="relative bg-gray-900">
          <div 
            className="relative h-80 md:h-[500px]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {property.images.length > 0 ? (
              <Image
                src={property.images[currentImageIndex].url}
                alt={property.images[currentImageIndex].alt_text}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No images available</span>
              </div>
            )}
            
            {/* Image indicators */}
            {property.images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentImageIndex 
                        ? 'bg-white w-8' 
                        : 'bg-white/50 w-2 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Navigation arrows */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all"
                  disabled={currentImageIndex === 0}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentImageIndex(Math.min(property.images.length - 1, currentImageIndex + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all"
                  disabled={currentImageIndex === property.images.length - 1}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Property Information */}
        <div className="px-4 py-6 max-w-4xl mx-auto">
          {/* Price and Address Section */}
          <div className="mb-6">
            <h1 className="text-5xl font-bold mb-2" style={{ color: colors.text }}>
              {formatPrice(property.list_price)}
            </h1>
            <p className="text-xl font-medium mb-1" style={{ color: colors.text }}>
              {property.address.line1}
              {property.address.line2 && `, ${property.address.line2}`}
            </p>
            <p className="text-lg" style={{ color: colors.gray }}>
              {property.address.city}, {property.address.state} {property.address.zip_code}
            </p>
          </div>

          {/* Key Stats */}
          <div className="flex flex-wrap gap-4 mb-6 text-lg">
            <span className="font-semibold" style={{ color: colors.text }}>
              {property.bedrooms} Beds
            </span>
            <span style={{ color: colors.gray }}>•</span>
            <span className="font-semibold" style={{ color: colors.text }}>
              {property.bathrooms} Baths
            </span>
            <span style={{ color: colors.gray }}>•</span>
            <span className="font-semibold" style={{ color: colors.text }}>
              {property.square_feet.toLocaleString()} Sq Ft
            </span>
          </div>

          {/* Additional Details Bar */}
          <div className="flex flex-wrap gap-4 mb-8 pb-6 border-b">
            <div>
              <span className="text-sm" style={{ color: colors.gray }}>Year Built</span>
              <p className="font-semibold" style={{ color: colors.text }}>{property.year_built}</p>
            </div>
            <div>
              <span className="text-sm" style={{ color: colors.gray }}>Lot Size</span>
              <p className="font-semibold" style={{ color: colors.text }}>
                {property.lot_size_sqft.toLocaleString()} sqft
              </p>
            </div>
            <div>
              <span className="text-sm" style={{ color: colors.gray }}>Property Type</span>
              <p className="font-semibold" style={{ color: colors.text }}>{property.property_type}</p>
            </div>
            <div>
              <span className="text-sm" style={{ color: colors.gray }}>Price/sqft</span>
              <p className="font-semibold" style={{ color: colors.text }}>${property.price_per_sqft}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-3" style={{ color: colors.text }}>
              About This Property
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: colors.gray }}>
              {property.description}
            </p>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
              Property Features
            </h2>
            
            {/* Exterior Features */}
            {property.features.exterior.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>
                  Exterior
                </h3>
                <div className="flex flex-wrap gap-2">
                  {property.features.exterior.map((feature, index) => (
                    <span 
                      key={index} 
                      className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-semibold border border-blue-200"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Interior Features */}
            {property.features.interior.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>
                  Interior
                </h3>
                <div className="flex flex-wrap gap-2">
                  {property.features.interior.map((feature, index) => (
                    <span 
                      key={index} 
                      className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-semibold border border-green-200"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Utilities */}
            {property.features.utilities.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>
                  Utilities & Systems
                </h3>
                <div className="flex flex-wrap gap-2">
                  {property.features.utilities.map((feature, index) => (
                    <span 
                      key={index} 
                      className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg text-sm font-semibold border border-purple-200"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Financial Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.text }}>
              Financial Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span style={{ color: colors.gray }}>Estimated Monthly Payment</span>
                <span className="font-semibold text-lg" style={{ color: colors.text }}>
                  {formatPrice(property.estimated_monthly_payment)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: colors.gray }}>Annual Property Taxes</span>
                <span className="font-semibold" style={{ color: colors.text }}>
                  {formatPrice(property.property_taxes_annual)}
                </span>
              </div>
              {property.hoa_fees_monthly > 0 && (
                <div className="flex justify-between items-center">
                  <span style={{ color: colors.gray }}>Monthly HOA Fees</span>
                  <span className="font-semibold" style={{ color: colors.text }}>
                    {formatPrice(property.hoa_fees_monthly)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-20">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <Link
            href={`/properties/${property.id}/generate-rpa`}
            className="flex-1 px-6 py-4 text-white font-semibold rounded-lg text-center transition-all hover:opacity-90"
            style={{ backgroundColor: colors.primary }}
          >
            Generate RPA Document
          </Link>
          <button
            className="px-6 py-4 border-2 font-semibold rounded-lg transition-all hover:bg-gray-50"
            style={{ borderColor: colors.primary, color: colors.primary }}
          >
            Schedule Tour
          </button>
        </div>
      </div>
    </div>
  );
}