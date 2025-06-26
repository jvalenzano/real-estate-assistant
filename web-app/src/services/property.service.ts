import api from './nextjs-api';

// Demo property for fallback
const DEMO_PROPERTY: Property = {
  id: 'prop-001',
  mls_number: 'ML81234567',
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
};

export interface Property {
  id: string;
  mls_number: string;
  address: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    zip_code: string;
    county: string;
  };
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  lot_size_sqft: number;
  year_built: number;
  list_price: number;
  price_per_sqft: number;
  estimated_monthly_payment: number;
  property_taxes_annual: number;
  hoa_fees_monthly: number;
  listing_status: string;
  days_on_market: number;
  listing_date: string;
  description: string;
  features: {
    exterior: string[];
    interior: string[];
    utilities: string[];
  };
  images: Array<{
    url: string;
    alt_text: string;
    is_primary: boolean;
    display_order: number;
  }>;
}

export interface PropertySearchParams {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

class PropertyService {
  async searchProperties(params: PropertySearchParams = {}): Promise<Property[]> {
    try {
      const response = await api.get<{ success: boolean; data: Property[] }>('/properties/search', { params });
      return response.data || [];
    } catch (error: any) {
      console.error('Property search error:', error);
      // Return empty array on error to prevent crashes
      return [];
    }
  }

  async getPropertyById(id: string): Promise<Property | null> {
    try {
      const response = await api.get<{ success: boolean; data: Property }>(`/properties/${id}`);
      return response.data || null;
    } catch (error: any) {
      console.error('Get property error:', error);
      // Return demo property for ML81234567
      if (id === 'ML81234567' || id === 'prop-001') {
        return DEMO_PROPERTY;
      }
      return null;
    }
  }

  async getPropertyByMLS(mlsNumber: string): Promise<Property | null> {
    try {
      const properties = await this.searchProperties({ search: mlsNumber });
      return properties.find(p => p.mls_number === mlsNumber) || null;
    } catch (error) {
      console.error('Get property by MLS error:', error);
      // Return demo property for ML81234567
      if (mlsNumber === 'ML81234567') {
        return DEMO_PROPERTY;
      }
      return null;
    }
  }

  async getPropertyByIdOrMLS(identifier: string): Promise<Property | null> {
    try {
      // First try to get by ID
      const byId = await this.getPropertyById(identifier);
      if (byId) return byId;
      
      // If not found, try by MLS number
      return await this.getPropertyByMLS(identifier);
    } catch (error) {
      console.error('Get property error:', error);
      return null;
    }
  }
}

export default new PropertyService();