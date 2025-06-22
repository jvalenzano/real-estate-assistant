'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyCardSkeleton from '@/components/property/PropertyCardSkeleton';
import propertyService, { Property, PropertySearchParams } from '@/services/property.service';

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

// DEMO PROPERTIES - ALWAYS SHOW THESE
const DEMO_PROPERTIES: Property[] = [
  {
    id: 'prop-001',
    mls_number: 'ML81234567',
    demo_priority: 1, // Golden path property
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
    description: 'Stunning ocean view home with modern finishes',
    features: {
      exterior: ['Ocean View', 'Pool', 'Spa'],
      interior: ['Granite Counters', 'Hardwood Floors'],
      utilities: ['Solar Panels']
    },
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        alt_text: 'Ocean view home',
        is_primary: true,
        display_order: 1
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
    description: 'Modern luxury condo in the heart of Hollywood',
    features: {
      exterior: ['City View', 'Balcony'],
      interior: ['Quartz Counters', 'Walk-in Closet'],
      utilities: ['Central AC', 'In-unit Laundry']
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
    description: 'Contemporary beach house with rooftop deck',
    features: {
      exterior: ['Beach Access', 'Rooftop Deck', 'Garage'],
      interior: ['Chef Kitchen', 'Wine Cellar', 'Home Theater'],
      utilities: ['Smart Home', 'Solar']
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
    description: 'Charming mid-century home with mountain views',
    features: {
      exterior: ['Mountain View', 'Large Yard', 'Mature Trees'],
      interior: ['Original Hardwood', 'Fireplace', 'Updated Kitchen'],
      utilities: ['New HVAC', 'Copper Plumbing']
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
    description: 'Luxury high-rise condo with panoramic city views',
    features: {
      exterior: ['City View', 'Balcony', 'Concierge'],
      interior: ['Floor-to-ceiling Windows', 'Modern Kitchen', 'Walk-in Closets'],
      utilities: ['Central AC', 'Gym', 'Pool']
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
    description: 'Silicon Valley executive home near Stanford',
    features: {
      exterior: ['Private Garden', 'EV Charging', 'Solar'],
      interior: ['Home Office', 'Gourmet Kitchen', 'Master Suite'],
      utilities: ['Fiber Internet', 'Smart Home']
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
  },
  {
    id: 'prop-007',
    mls_number: 'ML81234573',
    address: {
      line1: '888 Beach Walk',
      line2: null,
      city: 'Malibu',
      state: 'CA',
      zip_code: '90265',
      county: 'Los Angeles'
    },
    property_type: 'Single Family',
    bedrooms: 6,
    bathrooms: 5,
    square_feet: 4200,
    lot_size_sqft: 12000,
    year_built: 2020,
    list_price: 4500000,
    price_per_sqft: 1071,
    estimated_monthly_payment: 24750,
    property_taxes_annual: 54000,
    hoa_fees_monthly: 0,
    listing_status: 'Active',
    days_on_market: 5,
    listing_date: '2024-01-09',
    description: 'Beachfront estate with private beach access',
    features: {
      exterior: ['Beach Access', 'Infinity Pool', 'Guest House'],
      interior: ['Ocean Views', 'Wine Room', 'Gym'],
      utilities: ['Solar', 'Smart Home', 'Security']
    },
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1527030280862-64139fba04ca?w=800',
        alt_text: 'Beachfront estate exterior',
        is_primary: true,
        display_order: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1559767949-0faa5c7e9992?w=800',
        alt_text: 'Infinity pool overlooking ocean',
        is_primary: false,
        display_order: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687655-b3f7f8c8e3f8?w=800',
        alt_text: 'Luxury master suite',
        is_primary: false,
        display_order: 3
      },
      {
        url: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800',
        alt_text: 'Guest house',
        is_primary: false,
        display_order: 4
      }
    ]
  },
  {
    id: 'prop-008',
    mls_number: 'ML81234574',
    address: {
      line1: '222 City Heights',
      line2: 'Penthouse A',
      city: 'San Francisco',
      state: 'CA',
      zip_code: '94105',
      county: 'San Francisco'
    },
    property_type: 'Condominium',
    bedrooms: 4,
    bathrooms: 4.5,
    square_feet: 3200,
    lot_size_sqft: 0,
    year_built: 2023,
    list_price: 5800000,
    price_per_sqft: 1812,
    estimated_monthly_payment: 31900,
    property_taxes_annual: 69600,
    hoa_fees_monthly: 1200,
    listing_status: 'Active',
    days_on_market: 1,
    listing_date: '2024-01-13',
    description: 'Brand new penthouse with Golden Gate views',
    features: {
      exterior: ['Private Terrace', 'City Views', 'Bridge Views'],
      interior: ['Chef Kitchen', 'Smart Home', 'Private Elevator'],
      utilities: ['Concierge', 'Valet', 'Wine Storage']
    },
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        alt_text: 'Luxury penthouse exterior',
        is_primary: true,
        display_order: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687654-7f194d376ce7?w=800',
        alt_text: 'Penthouse terrace with Golden Gate view',
        is_primary: false,
        display_order: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1556911261-6bd341186b2f?w=800',
        alt_text: 'Chef kitchen',
        is_primary: false,
        display_order: 3
      },
      {
        url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800',
        alt_text: 'Living room with city views',
        is_primary: false,
        display_order: 4
      }
    ]
  },
  {
    id: 'prop-009',
    mls_number: 'ML81234575',
    address: {
      line1: '999 Hillside Ave',
      line2: null,
      city: 'Beverly Hills',
      state: 'CA',
      zip_code: '90210',
      county: 'Los Angeles'
    },
    property_type: 'Single Family',
    bedrooms: 5,
    bathrooms: 6,
    square_feet: 5500,
    lot_size_sqft: 15000,
    year_built: 2019,
    list_price: 6750000,
    price_per_sqft: 1227,
    estimated_monthly_payment: 37125,
    property_taxes_annual: 81000,
    hoa_fees_monthly: 0,
    listing_status: 'Active',
    days_on_market: 12,
    listing_date: '2024-01-02',
    description: 'Modern architectural masterpiece',
    features: {
      exterior: ['City Views', 'Infinity Pool', 'Motor Court'],
      interior: ['Theater', 'Gym', 'Spa'],
      utilities: ['Smart Home', 'Solar', 'Security']
    },
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
        alt_text: 'Modern mansion exterior',
        is_primary: true,
        display_order: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687640-fdf0b5ce3b44?w=800',
        alt_text: 'Infinity pool with city views',
        is_primary: false,
        display_order: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800',
        alt_text: 'Home theater',
        is_primary: false,
        display_order: 3
      },
      {
        url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800',
        alt_text: 'Wine cellar',
        is_primary: false,
        display_order: 4
      }
    ]
  },
  {
    id: 'prop-010',
    mls_number: 'ML81234576',
    address: {
      line1: '444 Vineyard Road',
      line2: null,
      city: 'Napa',
      state: 'CA',
      zip_code: '94558',
      county: 'Napa'
    },
    property_type: 'Single Family',
    bedrooms: 4,
    bathrooms: 3.5,
    square_feet: 3800,
    lot_size_sqft: 43560,
    year_built: 2015,
    list_price: 2950000,
    price_per_sqft: 776,
    estimated_monthly_payment: 16225,
    property_taxes_annual: 35400,
    hoa_fees_monthly: 0,
    listing_status: 'Active',
    days_on_market: 30,
    listing_date: '2023-12-15',
    description: 'Wine country estate with vineyard views',
    features: {
      exterior: ['Vineyard Views', 'Pool', 'Outdoor Kitchen'],
      interior: ['Wine Cellar', 'Gourmet Kitchen', 'Great Room'],
      utilities: ['Well Water', 'Solar', 'Generator']
    },
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1504615755583-2916b52192a3?w=800',
        alt_text: 'Wine country home exterior',
        is_primary: true,
        display_order: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800',
        alt_text: 'Vineyard views',
        is_primary: false,
        display_order: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=800',
        alt_text: 'Wine tasting room',
        is_primary: false,
        display_order: 3
      },
      {
        url: 'https://images.unsplash.com/photo-1556911261-6bd341186b2f?w=800',
        alt_text: 'Outdoor kitchen',
        is_primary: false,
        display_order: 4
      }
    ]
  },
  {
    id: 'prop-011',
    mls_number: 'ML81234577',
    address: {
      line1: '777 Marina Way',
      line2: null,
      city: 'Sausalito',
      state: 'CA',
      zip_code: '94965',
      county: 'Marin'
    },
    property_type: 'Townhouse',
    bedrooms: 3,
    bathrooms: 2.5,
    square_feet: 2400,
    lot_size_sqft: 3000,
    year_built: 2008,
    list_price: 1875000,
    price_per_sqft: 781,
    estimated_monthly_payment: 10312,
    property_taxes_annual: 22500,
    hoa_fees_monthly: 350,
    listing_status: 'Active',
    days_on_market: 18,
    listing_date: '2023-12-27',
    description: 'Waterfront townhouse with Golden Gate views',
    features: {
      exterior: ['Water Views', 'Deck', 'Private Dock'],
      interior: ['Updated Kitchen', 'Fireplace', 'Home Office'],
      utilities: ['Radiant Heat', 'Central AC', 'EV Charging']
    },
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=800',
        alt_text: 'Waterfront townhouse exterior',
        is_primary: true,
        display_order: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1556909172-8c2f041fca1e?w=800',
        alt_text: 'Marina views from deck',
        is_primary: false,
        display_order: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        alt_text: 'Living room with water views',
        is_primary: false,
        display_order: 3
      }
    ]
  },
  {
    id: 'prop-012',
    mls_number: 'ML81234578',
    address: {
      line1: '333 Tech Campus Dr',
      line2: null,
      city: 'Cupertino',
      state: 'CA',
      zip_code: '95014',
      county: 'Santa Clara'
    },
    property_type: 'Single Family',
    bedrooms: 5,
    bathrooms: 4,
    square_feet: 3200,
    lot_size_sqft: 8000,
    year_built: 2012,
    list_price: 3850000,
    price_per_sqft: 1203,
    estimated_monthly_payment: 21175,
    property_taxes_annual: 46200,
    hoa_fees_monthly: 0,
    listing_status: 'Active',
    days_on_market: 8,
    listing_date: '2024-01-06',
    description: 'Tech executive home near Apple Park',
    features: {
      exterior: ['Japanese Garden', 'Koi Pond', 'Solar'],
      interior: ['Smart Home', 'Theater', 'Dual Office'],
      utilities: ['Fiber Internet', 'Tesla Powerwall', 'EV Charging']
    },
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
        alt_text: 'Modern tech home exterior',
        is_primary: true,
        display_order: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800',
        alt_text: 'Japanese garden',
        is_primary: false,
        display_order: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687651-6b5c60e44c91?w=800',
        alt_text: 'Smart home control center',
        is_primary: false,
        display_order: 3
      },
      {
        url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
        alt_text: 'Dual home offices',
        is_primary: false,
        display_order: 4
      }
    ]
  }
];

export default function PropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>(DEMO_PROPERTIES);
  const [allProperties, setAllProperties] = useState<Property[]>(DEMO_PROPERTIES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    // Check auth
    const token = localStorage.getItem('@RealAgent:authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    // Try to load from API, but always show demo properties
    loadProperties();
  }, [router]);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      const results = await propertyService.searchProperties({});
      
      if (results && results.length > 0) {
        console.log(`Loaded ${results.length} properties from API`);
        setProperties(results);
        setAllProperties(results);
      } else {
        console.log('No API properties, using demo data');
        setProperties(DEMO_PROPERTIES);
        setAllProperties(DEMO_PROPERTIES);
      }
    } catch (error) {
      console.error('Failed to load properties:', error);
      // Use demo properties on error
      setProperties(DEMO_PROPERTIES);
      setAllProperties(DEMO_PROPERTIES);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearchSuggestions(false);
    
    if (!searchValue.trim()) {
      setProperties(allProperties);
      return;
    }
    
    // Simple search filter
    const filtered = allProperties.filter(p => 
      p.mls_number.toLowerCase().includes(searchValue.toLowerCase()) ||
      p.address.line1.toLowerCase().includes(searchValue.toLowerCase()) ||
      p.address.city.toLowerCase().includes(searchValue.toLowerCase())
    );
    
    setProperties(filtered);
  };

  const handleLogout = () => {
    router.push('/logout');
  };

  const SEARCH_SUGGESTIONS = [
    'Ocean View',
    'Downtown',
    'Luxury',
    'ML81234567'
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
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

      {/* Search Bar */}
      <div className="flex-shrink-0 bg-white border-b px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-3 relative mb-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setShowSearchSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                placeholder="Search by MLS#, address, or city..."
                className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                style={{ color: colors.text }}
              />
              
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
                handleSearch({ preventDefault: () => {} } as any);
              }}
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              Ocean View
            </button>
            <button
              onClick={() => {
                const under1M = allProperties.filter(p => p.list_price < 1000000);
                setProperties(under1M);
                setSearchValue('');
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
              }}
              className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
            >
              New Listings
            </button>
            <button
              onClick={() => {
                setSearchValue('ML81234567');
                handleSearch({ preventDefault: () => {} } as any);
              }}
              className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium flex items-center gap-1"
            >
              <span>⭐</span> Demo Property
            </button>
            <button
              onClick={() => {
                setProperties(allProperties);
                setSearchValue('');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              All Properties
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* Empty State */}
          {properties.length === 0 && searchValue && (
            <div className="text-center py-12">
              <p className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                No properties found for "{searchValue}"
              </p>
              <button
                onClick={() => {
                  setSearchValue('');
                  setProperties(allProperties);
                }}
                className="text-sm font-medium"
                style={{ color: colors.primary }}
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </main>
      
      {/* Filter Panel */}
      {isFiltersOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsFiltersOpen(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto"
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
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ color: colors.text }}
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
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
                      <input type="checkbox" className="mr-3" />
                      <span style={{ color: colors.text }}>{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Bedrooms */}
              <div>
                <h3 className="font-semibold mb-3" style={{ color: colors.text }}>Bedrooms</h3>
                <div className="flex gap-2">
                  {['1+', '2+', '3+', '4+', '5+'].map((beds) => (
                    <button
                      key={beds}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                      style={{ color: colors.text }}
                    >
                      {beds}
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}