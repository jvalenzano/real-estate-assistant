import fs from 'fs';
import path from 'path';
import { Property, PropertySearchParams, PropertySearchResponse } from '@/types';

interface PropertiesData {
  properties: Property[];
}

export class PropertyService {
  private static properties: Property[] = [];
  private static loaded = false;

  /**
   * Load properties from demo data file
   */
  private static loadProperties(): void {
    if (this.loaded) return;

    try {
      const dataPath = path.join(process.cwd(), '..', 'demo-data', 'properties.json');
      const rawData = fs.readFileSync(dataPath, 'utf8');
      const data: PropertiesData = JSON.parse(rawData);
      this.properties = data.properties;
      this.loaded = true;
      console.log(`✅ Loaded ${this.properties.length} demo properties`);
    } catch (error) {
      console.error('❌ Failed to load properties:', error);
      this.properties = [];
    }
  }

  /**
   * Get all properties
   */
  static getAllProperties(): Property[] {
    this.loadProperties();
    return this.properties;
  }

  /**
   * Get property by ID
   */
  static getPropertyById(id: string): Property | null {
    this.loadProperties();
    return this.properties.find(p => p.id === id) || null;
  }

  /**
   * Get property by MLS number
   */
  static getPropertyByMLS(mlsNumber: string): Property | null {
    this.loadProperties();
    return this.properties.find(p => p.mls_number === mlsNumber) || null;
  }

  /**
   * Search properties with filters and sorting
   */
  static searchProperties(params: PropertySearchParams): PropertySearchResponse {
    const startTime = Date.now();
    this.loadProperties();

    let results = [...this.properties];
    const query = params.q?.toLowerCase().trim() || '';

    // Text search (MLS, address, description)
    if (query) {
      results = results.filter(property => {
        // MLS number search (exact and partial)
        if (property.mls_number.toLowerCase().includes(query)) {
          return true;
        }

        // Address search
        const fullAddress = `${property.address.line1} ${property.address.city} ${property.address.state} ${property.address.zip_code}`.toLowerCase();
        if (fullAddress.includes(query)) {
          return true;
        }

        // Description search
        if (property.description?.toLowerCase().includes(query)) {
          return true;
        }

        // Features search
        if (property.features) {
          const allFeatures = [
            ...property.features.exterior,
            ...property.features.interior,
            ...property.features.utilities
          ].join(' ').toLowerCase();
          
          if (allFeatures.includes(query)) {
            return true;
          }
        }

        return false;
      });
    }

    // Price range filter
    if (params.minPrice !== undefined) {
      results = results.filter(p => p.list_price >= params.minPrice!);
    }
    if (params.maxPrice !== undefined) {
      results = results.filter(p => p.list_price <= params.maxPrice!);
    }

    // Bedrooms filter
    if (params.bedrooms !== undefined) {
      results = results.filter(p => p.bedrooms >= params.bedrooms!);
    }

    // Bathrooms filter
    if (params.bathrooms !== undefined) {
      results = results.filter(p => p.bathrooms >= params.bathrooms!);
    }

    // Property type filter
    if (params.propertyType) {
      results = results.filter(p => 
        p.property_type.toLowerCase().includes(params.propertyType!.toLowerCase())
      );
    }

    // City filter
    if (params.city) {
      results = results.filter(p => 
        p.address.city.toLowerCase().includes(params.city!.toLowerCase())
      );
    }

    // Sort results
    results = this.sortProperties(results, params.sortBy || 'relevance', query);

    // Apply pagination
    const limit = params.limit || 20;
    const offset = params.offset || 0;
    const paginatedResults = results.slice(offset, offset + limit);

    const searchTime = Date.now() - startTime;

    return {
      properties: paginatedResults,
      total: results.length,
      query: params.q || '',
      searchTime,
      filters: params,
      suggestions: this.generateSuggestions(query, results.length)
    };
  }

  /**
   * Sort properties by specified criteria
   */
  private static sortProperties(properties: Property[], sortBy: string, query: string): Property[] {
    switch (sortBy) {
      case 'price_asc':
        return properties.sort((a, b) => a.list_price - b.list_price);
      
      case 'price_desc':
        return properties.sort((a, b) => b.list_price - a.list_price);
      
      case 'newest':
        return properties.sort((a, b) => 
          new Date(b.listing_date).getTime() - new Date(a.listing_date).getTime()
        );
      
      case 'days_on_market':
        return properties.sort((a, b) => a.days_on_market - b.days_on_market);
      
      case 'relevance':
      default:
        return properties.sort((a, b) => {
          // Prioritize demo property ML81234567
          if (a.mls_number === 'ML81234567') return -1;
          if (b.mls_number === 'ML81234567') return 1;

          // Prioritize by demo_priority
          if (a.demo_priority && b.demo_priority) {
            return a.demo_priority - b.demo_priority;
          }
          if (a.demo_priority) return -1;
          if (b.demo_priority) return 1;

          // If there's a query, prioritize exact MLS matches
          if (query) {
            const aExactMLS = a.mls_number.toLowerCase() === query;
            const bExactMLS = b.mls_number.toLowerCase() === query;
            if (aExactMLS && !bExactMLS) return -1;
            if (bExactMLS && !aExactMLS) return 1;

            // Then prioritize partial MLS matches
            const aMLS = a.mls_number.toLowerCase().includes(query);
            const bMLS = b.mls_number.toLowerCase().includes(query);
            if (aMLS && !bMLS) return -1;
            if (bMLS && !aMLS) return 1;
          }

          // Finally sort by days on market (newer listings first)
          return a.days_on_market - b.days_on_market;
        });
    }
  }

  /**
   * Generate search suggestions
   */
  private static generateSuggestions(query: string, resultCount: number): string[] {
    if (resultCount > 0) return [];

    const suggestions: string[] = [];

    // Suggest popular searches
    if (query.toLowerCase().includes('ocean')) {
      suggestions.push('ocean view', 'ocean front', 'sea view');
    }

    if (query.toLowerCase().includes('pool')) {
      suggestions.push('swimming pool', 'pool house', 'heated pool');
    }

    // Suggest MLS format if it looks like partial MLS
    if (query.match(/^ML\d*/i)) {
      suggestions.push('ML81234567', 'ML81234568', 'ML81234569');
    }

    // Default suggestions for empty results
    if (suggestions.length === 0) {
      suggestions.push('ML81234567', 'ocean view', 'San Diego', 'La Jolla');
    }

    return suggestions.slice(0, 4);
  }

  /**
   * Get featured properties (for homepage)
   */
  static getFeaturedProperties(limit: number = 6): Property[] {
    this.loadProperties();
    
    return this.properties
      .filter(p => p.listing_status === 'active')
      .sort((a, b) => {
        // Prioritize demo properties
        if (a.demo_priority && b.demo_priority) {
          return a.demo_priority - b.demo_priority;
        }
        if (a.demo_priority) return -1;
        if (b.demo_priority) return 1;
        
        // Then by days on market
        return a.days_on_market - b.days_on_market;
      })
      .slice(0, limit);
  }

  /**
   * Format price for display
   */
  static formatPrice(price: number): string {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    } else {
      return `$${price.toLocaleString()}`;
    }
  }

  /**
   * Get property summary statistics
   */
  static getPropertyStats(): {
    total: number;
    active: number;
    averagePrice: number;
    priceRange: { min: number; max: number };
  } {
    this.loadProperties();
    
    const active = this.properties.filter(p => p.listing_status === 'active');
    const prices = active.map(p => p.list_price);
    
    return {
      total: this.properties.length,
      active: active.length,
      averagePrice: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      }
    };
  }

  /**
   * Get properties by demo scenario
   */
  static getPropertiesByScenario(scenario: string): Property[] {
    this.loadProperties();
    return this.properties.filter(p => p.demo_scenario === scenario);
  }
}