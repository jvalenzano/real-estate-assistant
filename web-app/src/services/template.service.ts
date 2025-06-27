/**
 * Template Service
 * Manages loading, validation, and rendering of form templates
 */

import { TEMPLATE_REGISTRY, TemplateRegistryEntry, getFormById } from '@/templates';
import Handlebars from 'handlebars';

export interface TemplateData {
  propertyId: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  sellerName?: string;
  sellerEmail?: string;
  sellerPhone?: string;
  propertyAddress?: string;
  purchasePrice?: number;
  closingDate?: string;
  contingencies?: string[];
  additionalTerms?: string;
  [key: string]: any;
}

export interface TemplateField {
  name: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  section: string;
  implemented: boolean;
}

export interface SignatureField {
  id: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  role: 'buyer' | 'seller' | 'agent' | 'other';
  type: 'signature' | 'initial' | 'date';
  required: boolean;
  label: string;
  implemented: boolean;
}

export class TemplateService {
  private static instance: TemplateService;
  private loadedTemplates: Map<string, any> = new Map();
  private templateCache: Map<string, HandlebarsTemplateDelegate> = new Map();
  private initialized = false;

  private constructor() {
    // Register Handlebars helpers immediately on construction
    this.registerHelpers();
  }

  static getInstance(): TemplateService {
    if (!TemplateService.instance) {
      TemplateService.instance = new TemplateService();
    }
    return TemplateService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    console.log(`[TemplateService] Initializing with ${Object.keys(TEMPLATE_REGISTRY).length} registered forms`);
    
    // Register Handlebars helpers
    this.registerHelpers();
    
    // Load all implemented templates
    const implementedTemplates = Object.entries(TEMPLATE_REGISTRY)
      .filter(([_, entry]) => entry.implemented);
    
    console.log(`[TemplateService] Loading ${implementedTemplates.length} implemented templates`);
    
    for (const [templateId, entry] of implementedTemplates) {
      await this.loadTemplate(templateId, entry);
    }

    this.initialized = true;
  }

  private registerHelpers(): void {
    // Currency formatter
    Handlebars.registerHelper('formatCurrency', function(amount: number) {
      if (!amount) return '0.00';
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    });
    
    Handlebars.registerHelper('formatDate', function(date: string) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-US');
    });
    
    Handlebars.registerHelper('eq', function(a: any, b: any) {
      return a === b;
    });
    
    Handlebars.registerHelper('not', function(value: any) {
      return !value;
    });
    
    // Helper for checkboxes
    Handlebars.registerHelper('if_eq', function(a: any, b: any, opts: any) {
      if (a === b) {
        return opts.fn(this);
      } else {
        return opts.inverse(this);
      }
    });

    // Currency formatting helper
    Handlebars.registerHelper('formatCurrency', function(value: number | string) {
      const num = typeof value === 'string' ? parseFloat(value) : value;
      if (isNaN(num)) return '$0';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(num);
    });

    // Date formatting helper
    Handlebars.registerHelper('formatDate', function(date: string | Date, format?: string) {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (format === 'long') {
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(dateObj);
      }
      return new Intl.DateTimeFormat('en-US').format(dateObj);
    });

    // Number formatting helper
    Handlebars.registerHelper('formatNumber', function(value: number | string) {
      const num = typeof value === 'string' ? parseFloat(value) : value;
      if (isNaN(num)) return '0';
      return new Intl.NumberFormat('en-US').format(num);
    });

    // Includes helper for arrays
    Handlebars.registerHelper('includes', function(array: any[], value: string) {
      return array && array.includes(value);
    });

    // Join helper for arrays
    Handlebars.registerHelper('join', function(array: any[], separator: string) {
      return array ? array.join(separator) : '';
    });
  }

  private async loadTemplate(templateId: string, entry: TemplateRegistryEntry): Promise<void> {
    try {
      // For CA_RPA, we'll load the actual template files
      if (templateId === 'CA_RPA') {
        // In server-side context, we need to read files directly
        if (typeof window === 'undefined') {
          const fs = require('fs').promises;
          const path = require('path');
          
          const templateDir = path.join(process.cwd(), 'src/templates/01-buyers-offer/CA_RPA');
          
          // Load template HTML directly
          const templateHtml = await fs.readFile(path.join(templateDir, 'template.hbs'), 'utf-8');
          
          // Load fields definition
          const fieldsJson = await fs.readFile(path.join(templateDir, 'fields.json'), 'utf-8');
          const fields = JSON.parse(fieldsJson);
          
          // Load signature fields
          const signaturesJson = await fs.readFile(path.join(templateDir, 'signatures.json'), 'utf-8');
          const signatures = JSON.parse(signaturesJson);
          
          // Load metadata
          const metadataJson = await fs.readFile(path.join(templateDir, 'metadata.json'), 'utf-8');
          const metadata = JSON.parse(metadataJson);
          
          // Compile template
          const compiledTemplate = Handlebars.compile(templateHtml);
          
          // Store everything
          this.loadedTemplates.set(templateId, {
            template: compiledTemplate,
            fields,
            signatures,
            metadata,
            entry
          });
        } else {
          // Client-side loading
          const templateResponse = await fetch('/templates/01-buyers-offer-negotiation/CA_RPA/template.hbs');
          const templateHtml = await templateResponse.text();

          const fieldsResponse = await fetch('/templates/01-buyers-offer-negotiation/CA_RPA/fields.json');
          const fields = await fieldsResponse.json();

          const signaturesResponse = await fetch('/templates/01-buyers-offer-negotiation/CA_RPA/signatures.json');
          const signatures = await signaturesResponse.json();

          const metadataResponse = await fetch('/templates/01-buyers-offer-negotiation/CA_RPA/metadata.json');
          const metadata = await metadataResponse.json();

          const compiledTemplate = Handlebars.compile(templateHtml);

          this.loadedTemplates.set(templateId, {
            template: compiledTemplate,
            fields,
            signatures,
            metadata,
            entry
          });
        }

        console.log(`[TemplateService] Loaded template: ${templateId}`);
      } else {
        // For unimplemented templates, we don't load anything
        console.log(`[TemplateService] Template ${templateId} is not implemented yet`);
      }
    } catch (error) {
      console.error(`[TemplateService] Failed to load template ${templateId}:`, error);
    }
  }

  /**
   * Get all available templates grouped by category
   */
  getTemplatesByCategory(): Record<string, TemplateRegistryEntry[]> {
    const categories: Record<string, TemplateRegistryEntry[]> = {
      '01': [],
      '02': [],
      '03': [],
      '04': [],
      '05': [],
      '06': []
    };

    Object.values(TEMPLATE_REGISTRY).forEach(template => {
      categories[template.categoryNumber].push(template);
    });

    // Sort each category by sortOrder
    Object.keys(categories).forEach(cat => {
      categories[cat].sort((a, b) => a.sortOrder - b.sortOrder);
    });

    return categories;
  }

  /**
   * Check if a template is available for use
   */
  isTemplateAvailable(templateId: string): boolean {
    return TEMPLATE_REGISTRY[templateId]?.implemented || false;
  }

  /**
   * Get template metadata
   */
  async getTemplateMetadata(templateId: string): Promise<any> {
    // Check if template exists in registry
    const entry = TEMPLATE_REGISTRY[templateId];
    if (!entry) {
      return null;
    }

    // Load template if not already loaded
    if (!this.loadedTemplates.has(templateId)) {
      await this.loadTemplate(templateId, entry);
    }

    const loaded = this.loadedTemplates.get(templateId);
    return loaded?.metadata || { templateId, ...entry };
  }

  /**
   * Get template fields
   */
  getTemplateFields(templateId: string): TemplateField[] {
    const loaded = this.loadedTemplates.get(templateId);
    return loaded?.fields?.fields || [];
  }

  /**
   * Get signature fields
   */
  getSignatureFields(templateId: string): SignatureField[] {
    const loaded = this.loadedTemplates.get(templateId);
    return loaded?.signatures?.signatures || [];
  }

  /**
   * Get complete template details
   */
  async getTemplate(templateId: string): Promise<any> {
    // Check if template exists in registry
    const entry = TEMPLATE_REGISTRY[templateId];
    if (!entry) {
      return null;
    }

    // Load template if not already loaded
    if (!this.loadedTemplates.has(templateId)) {
      await this.loadTemplate(templateId, entry);
    }

    const loaded = this.loadedTemplates.get(templateId);
    if (!loaded) {
      return null;
    }

    return {
      fields: loaded.fields,
      signatures: loaded.signatures,
      metadata: loaded.metadata
    };
  }

  /**
   * Render a template with data
   */
  async renderTemplate(templateId: string, data: TemplateData): Promise<string> {
    if (!this.isTemplateAvailable(templateId)) {
      // Return placeholder for unimplemented templates
      return this.renderPlaceholder(templateId, data);
    }

    // Check if template exists in registry
    const entry = TEMPLATE_REGISTRY[templateId];
    if (!entry) {
      throw new Error(`Template ${templateId} not found in registry`);
    }

    // Load template if not already loaded
    if (!this.loadedTemplates.has(templateId)) {
      await this.loadTemplate(templateId, entry);
    }

    const loaded = this.loadedTemplates.get(templateId);
    if (!loaded) {
      throw new Error(`Template ${templateId} not loaded`);
    }

    try {
      // Prepare template data with defaults
      const templateData = {
        ...data,
        currentDate: new Date().toLocaleDateString(),
        currentYear: new Date().getFullYear(),
        formTitle: loaded.entry.name,
        templateId: templateId,
        // Add any other default values
      };

      // Render template
      return loaded.template(templateData);
    } catch (error) {
      console.error(`[TemplateService] Error rendering template ${templateId}:`, error);
      throw error;
    }
  }

  /**
   * Render placeholder for unimplemented templates
   */
  private async renderPlaceholder(templateId: string, data: TemplateData): Promise<string> {
    const entry = getFormById(templateId);
    if (!entry) {
      throw new Error(`Template ${templateId} not found in registry`);
    }

    // Create a simple placeholder HTML
    const placeholderHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>{{formTitle}}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          .placeholder { 
            max-width: 800px; 
            margin: 0 auto; 
            border: 2px solid #ddd; 
            padding: 40px; 
            text-align: center; 
          }
          h1 { color: #333; }
          .info { margin: 20px 0; color: #666; }
          .data { 
            margin: 30px 0; 
            padding: 20px; 
            background: #f5f5f5; 
            border-radius: 8px; 
            text-align: left; 
          }
          .data-item { margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="placeholder">
          <h1>{{formTitle}}</h1>
          <div class="info">
            <p>Category {{categoryNumber}}: {{categoryName}}</p>
            <p>Form ID: {{templateId}}</p>
            {{#if carFormNumber}}<p>C.A.R. Form: {{carFormNumber}}</p>{{/if}}
          </div>
          <div class="data">
            <h3>Form Data Preview:</h3>
            {{#if propertyAddress}}<div class="data-item"><strong>Property:</strong> {{propertyAddress}}</div>{{/if}}
            {{#if buyerName}}<div class="data-item"><strong>Buyer:</strong> {{buyerName}}</div>{{/if}}
            {{#if sellerName}}<div class="data-item"><strong>Seller:</strong> {{sellerName}}</div>{{/if}}
            {{#if purchasePrice}}<div class="data-item"><strong>Price:</strong> ${{purchasePrice}}</div>{{/if}}
          </div>
          <p style="margin-top: 40px; color: #999;">This form template is coming soon. The CA_RPA template is currently available.</p>
        </div>
      </body>
      </html>
    `;

    const placeholderTemplate = Handlebars.compile(placeholderHtml);

    return placeholderTemplate({
      formTitle: entry.name,
      categoryNumber: entry.categoryNumber,
      categoryName: this.getCategoryName(entry.categoryNumber),
      originalFileName: entry.fileName,
      templateId: templateId,
      carFormNumber: entry.carFormNumber || 'N/A',
      ...data
    });
  }

  /**
   * Get category name by number
   */
  private getCategoryName(categoryNumber: string): string {
    const names: Record<string, string> = {
      '01': 'Buyer\'s Offer and Negotiation Stage',
      '02': 'Contingency Removal and Closing',
      '03': 'Escrow and Contingency Stage',
      '04': 'Final Disclosures & Delivery',
      '05': 'Forms Used in Specific Situations',
      '06': 'Listing Stage'
    };
    return names[categoryNumber] || 'Unknown Category';
  }

  /**
   * Validate template data
   */
  validateTemplateData(templateId: string, data: TemplateData): { valid: boolean; errors: string[] } {
    const fields = this.getTemplateFields(templateId);
    const errors: string[] = [];

    fields.forEach(field => {
      if (field.required && !data[field.name]) {
        errors.push(`${field.label} is required`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get list of all commonly used forms
   */
  getCommonlyUsedForms(): TemplateRegistryEntry[] {
    return Object.values(TEMPLATE_REGISTRY)
      .filter(template => template.commonlyUsed)
      .sort((a, b) => {
        // Sort by category first, then by sortOrder
        if (a.categoryNumber !== b.categoryNumber) {
          return a.categoryNumber.localeCompare(b.categoryNumber);
        }
        return a.sortOrder - b.sortOrder;
      });
  }

  /**
   * Search templates by name or category
   */
  searchTemplates(query: string): TemplateRegistryEntry[] {
    const lowerQuery = query.toLowerCase();
    return Object.values(TEMPLATE_REGISTRY)
      .filter(template => 
        template.name.toLowerCase().includes(lowerQuery) ||
        template.category.toLowerCase().includes(lowerQuery) ||
        template.fileName.toLowerCase().includes(lowerQuery)
      )
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
}

// Export singleton instance
export const templateService = TemplateService.getInstance();