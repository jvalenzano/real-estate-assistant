import api from './api';

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
      return response.data.data;
    } catch (error: any) {
      console.error('Property search error:', error);
      throw new Error(error.response?.data?.message || 'Failed to search properties');
    }
  }

  async getPropertyById(id: string): Promise<Property | null> {
    try {
      const response = await api.get<{ success: boolean; data: Property }>(`/properties/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Get property error:', error);
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch property');
    }
  }

  async getPropertyByMLS(mlsNumber: string): Promise<Property | null> {
    try {
      const properties = await this.searchProperties({ search: mlsNumber });
      return properties.find(p => p.mls_number === mlsNumber) || null;
    } catch (error) {
      console.error('Get property by MLS error:', error);
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