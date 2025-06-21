import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import { Document, DocumentFields, DocumentGenerationRequest, Property, User } from '@/types';
import { PropertyService } from './property.service';

// In-memory document storage (in real app, this would be database)
const documentStorage: Map<string, Document> = new Map();
const documentCounter = { value: 1 };

export class DocumentService {
  private static templatesPath = path.join(process.cwd(), 'src', 'templates', 'documents');
  private static outputPath = path.join(process.cwd(), 'generated-documents');
  private static templates: Map<string, HandlebarsTemplateDelegate> = new Map();

  /**
   * Initialize the document service
   */
  static async initialize(): Promise<void> {
    // Ensure output directory exists
    try {
      await fs.mkdir(this.outputPath, { recursive: true });
      console.log('✅ Document output directory initialized');
    } catch (error) {
      console.error('❌ Failed to create document output directory:', error);
    }

    // Register Handlebars helpers
    this.registerHandlebarsHelpers();

    // Precompile templates
    await this.loadTemplates();
  }

  /**
   * Register Handlebars helper functions
   */
  private static registerHandlebarsHelpers(): void {
    // Format currency
    Handlebars.registerHelper('formatCurrency', (amount: number) => {
      if (!amount) return '$0.00';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    });

    // Format number with commas
    Handlebars.registerHelper('formatNumber', (num: number) => {
      if (!num) return '0';
      return new Intl.NumberFormat('en-US').format(num);
    });

    // Format date
    Handlebars.registerHelper('formatDate', (dateStr: string) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    });

    // Current year
    Handlebars.registerHelper('currentYear', () => {
      return new Date().getFullYear();
    });

    // Conditional helpers
    Handlebars.registerHelper('if_eq', function(this: any, a: any, b: any, options: any) {
      if (a === b) {
        return options.fn(this);
      }
      return options.inverse(this);
    });
  }

  /**
   * Load and compile templates
   */
  private static async loadTemplates(): Promise<void> {
    try {
      // Load main RPA template
      const rpaTemplatePath = path.join(this.templatesPath, 'rpa-template.html');
      const rpaTemplateContent = await fs.readFile(rpaTemplatePath, 'utf8');
      
      // Load CSS styles
      const stylesPath = path.join(this.templatesPath, 'styles', 'rpa-styles.css');
      const styles = await fs.readFile(stylesPath, 'utf8');
      
      // Load partials
      const headerPath = path.join(this.templatesPath, 'partials', 'header.html');
      const footerPath = path.join(this.templatesPath, 'partials', 'footer.html');
      
      const headerContent = await fs.readFile(headerPath, 'utf8');
      const footerContent = await fs.readFile(footerPath, 'utf8');
      
      // Register partials
      Handlebars.registerPartial('header', headerContent);
      Handlebars.registerPartial('footer', footerContent);
      
      // Compile main template with styles injected
      const templateWithStyles = rpaTemplateContent.replace('{{{styles}}}', styles);
      const compiledTemplate = Handlebars.compile(templateWithStyles);
      
      this.templates.set('rpa', compiledTemplate);
      
      console.log('✅ Document templates loaded and compiled');
    } catch (error) {
      console.error('❌ Failed to load document templates:', error);
    }
  }

  /**
   * Generate a new document
   */
  static async generateDocument(
    request: DocumentGenerationRequest,
    agent: User
  ): Promise<Document> {
    // Get property details
    const property = PropertyService.getPropertyById(request.propertyId) || 
                    PropertyService.getPropertyByMLS(request.propertyId);
    
    if (!property) {
      throw new Error(`Property not found: ${request.propertyId}`);
    }

    // Create document ID
    const documentId = `doc-${Date.now()}-${String(documentCounter.value++).padStart(3, '0')}`;
    
    // Merge default fields with provided data
    const documentFields = this.createDefaultFields(property, request.data, agent);
    
    // Create document object
    const document: Document = {
      id: documentId,
      type: request.documentType,
      propertyId: property.id,
      buyerId: documentFields.buyerEmail || 'pending',
      sellerId: documentFields.sellerName || 'pending',
      agentId: agent.id,
      status: 'draft',
      fields: documentFields,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Generate HTML content
    document.htmlContent = await this.generateHTML(document, property, agent);
    
    // Store document
    documentStorage.set(documentId, document);
    
    console.log(`📄 Document generated: ${documentId} (${request.documentType})`);
    
    return document;
  }

  /**
   * Generate HTML content from template
   */
  private static async generateHTML(
    document: Document,
    property: Property,
    agent: User
  ): Promise<string> {
    const template = this.templates.get(document.type);
    if (!template) {
      throw new Error(`Template not found for document type: ${document.type}`);
    }

    const templateData = {
      document,
      property,
      agent: {
        firstName: agent.firstName,
        lastName: agent.lastName,
        licenseNumber: 'CA-LIC-12345' // Demo license number
      },
      generatedDate: new Date().toLocaleDateString('en-US'),
      documentId: document.id,
      currentYear: new Date().getFullYear(),
      pageNumber: 1,
      totalPages: 1
    };

    return template(templateData);
  }

  /**
   * Generate PDF from HTML content
   */
  static async generatePDF(documentId: string): Promise<string> {
    const document = documentStorage.get(documentId);
    if (!document || !document.htmlContent) {
      throw new Error(`Document not found or missing HTML content: ${documentId}`);
    }

    const pdfPath = path.join(this.outputPath, `${documentId}.pdf`);
    
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      
      // Set content and wait for any dynamic content to load
      await page.setContent(document.htmlContent, {
        waitUntil: 'networkidle0'
      });
      
      // Generate PDF with optimized settings
      await page.pdf({
        path: pdfPath,
        format: 'Letter',
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        },
        printBackground: true,
        preferCSSPageSize: true
      });
      
      // Update document with PDF path
      document.pdfPath = pdfPath;
      document.updatedAt = new Date().toISOString();
      documentStorage.set(documentId, document);
      
      console.log(`📄 PDF generated: ${pdfPath}`);
      return pdfPath;
      
    } catch (error) {
      console.error('❌ Failed to generate PDF:', error);
      throw new Error('PDF generation failed');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  /**
   * Get document by ID
   */
  static getDocument(documentId: string): Document | null {
    return documentStorage.get(documentId) || null;
  }

  /**
   * Update document fields
   */
  static updateDocumentFields(
    documentId: string,
    fieldUpdates: Partial<DocumentFields>
  ): Document {
    const document = documentStorage.get(documentId);
    if (!document) {
      throw new Error(`Document not found: ${documentId}`);
    }

    if (document.status === 'finalized' || document.status === 'signed') {
      throw new Error('Cannot update finalized or signed document');
    }

    // Merge field updates
    document.fields = { ...document.fields, ...fieldUpdates };
    document.updatedAt = new Date().toISOString();
    document.status = 'draft'; // Reset to draft when modified

    // Regenerate HTML with updated fields
    // Note: In a full implementation, you'd want to regenerate the HTML here
    
    documentStorage.set(documentId, document);
    
    console.log(`📝 Document updated: ${documentId}`);
    return document;
  }

  /**
   * Finalize document (lock for signing)
   */
  static finalizeDocument(documentId: string): Document {
    const document = documentStorage.get(documentId);
    if (!document) {
      throw new Error(`Document not found: ${documentId}`);
    }

    document.status = 'finalized';
    document.finalizedAt = new Date().toISOString();
    document.updatedAt = new Date().toISOString();
    
    documentStorage.set(documentId, document);
    
    console.log(`🔒 Document finalized: ${documentId}`);
    return document;
  }

  /**
   * Get all documents for a property
   */
  static getDocumentsByProperty(propertyId: string): Document[] {
    return Array.from(documentStorage.values())
      .filter(doc => doc.propertyId === propertyId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Get all documents for a user
   */
  static getDocumentsByUser(userId: string): Document[] {
    return Array.from(documentStorage.values())
      .filter(doc => doc.agentId === userId || doc.buyerId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Create default document fields
   */
  private static createDefaultFields(
    property: Property,
    providedData: Partial<DocumentFields>,
    agent: User
  ): DocumentFields {
    const defaultOfferPrice = providedData.offerPrice || property.list_price;
    const defaultDownPayment = providedData.downPayment || Math.round(defaultOfferPrice * 0.2);
    const defaultLoanAmount = defaultOfferPrice - defaultDownPayment;
    const defaultInitialDeposit = Math.round(defaultOfferPrice * 0.01); // 1% earnest money

    const closeDate = new Date();
    closeDate.setDate(closeDate.getDate() + (providedData.escrowDays || 30));

    return {
      // Financial terms
      offerPrice: defaultOfferPrice,
      initialDeposit: defaultInitialDeposit,
      additionalDeposit: 0,
      downPayment: defaultDownPayment,
      loanAmount: defaultLoanAmount,
      
      // Loan information
      loanType: {
        conventional: true,
        fha: false,
        va: false,
        cash: false,
        ...providedData.loanType
      },
      
      // Buyer information (demo defaults)
      buyerName: 'John Smith',
      buyerAddress: '123 Buyer St, San Diego, CA 92101',
      buyerPhone: '(619) 555-0123',
      buyerEmail: 'john.smith@email.com',
      
      // Seller information (defaults)
      sellerName: 'Property Owner',
      sellerAddress: property.address.line1 + ', ' + property.address.city + ', ' + property.address.state + ' ' + property.address.zip_code,
      
      // Escrow details
      escrowCompany: 'Pacific Coast Title & Escrow',
      escrowOfficer: 'Sarah Johnson',
      closeDate: closeDate.toISOString().split('T')[0],
      escrowDays: 30,
      
      // Contingencies
      contingencies: {
        inspection: true,
        loan: true,
        appraisal: true,
        saleOfProperty: false
      },
      
      contingencyPeriods: {
        inspection: 17,
        loan: 21,
        appraisal: 17
      },
      
      // Override with provided data
      ...providedData
    };
  }

  /**
   * Get document statistics
   */
  static getDocumentStats(): {
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
  } {
    const documents = Array.from(documentStorage.values());
    
    const byStatus: Record<string, number> = {};
    const byType: Record<string, number> = {};
    
    documents.forEach(doc => {
      byStatus[doc.status] = (byStatus[doc.status] || 0) + 1;
      byType[doc.type] = (byType[doc.type] || 0) + 1;
    });
    
    return {
      total: documents.length,
      byStatus,
      byType
    };
  }
}