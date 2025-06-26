/**
 * PDF Generation Utilities
 * Uses Puppeteer to convert HTML templates to PDF
 */

import puppeteer, { Browser, Page, PDFOptions } from 'puppeteer';
import Handlebars from 'handlebars';

export interface PDFGenerationOptions {
  format?: 'A4' | 'Letter' | 'Legal';
  landscape?: boolean;
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  displayHeaderFooter?: boolean;
  headerTemplate?: string;
  footerTemplate?: string;
  preferCSSPageSize?: boolean;
  printBackground?: boolean;
  scale?: number;
}

export class PDFGenerator {
  private browser: Browser | null = null;
  private isInitialized = false;

  /**
   * Initialize Puppeteer browser instance
   */
  async initialize(): Promise<void> {
    if (this.isInitialized && this.browser) {
      return;
    }

    try {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      });
      this.isInitialized = true;
      console.log('[PDFGenerator] Browser initialized');
    } catch (error) {
      console.error('[PDFGenerator] Failed to initialize browser:', error);
      throw new Error('Failed to initialize PDF generator');
    }
  }

  /**
   * Generate PDF from HTML template and data
   */
  async generateFromTemplate(
    templateHtml: string,
    data: Record<string, any>,
    options: PDFGenerationOptions = {}
  ): Promise<Buffer> {
    if (!this.isInitialized || !this.browser) {
      await this.initialize();
    }

    let page: Page | null = null;

    try {
      // Compile Handlebars template
      const template = Handlebars.compile(templateHtml);
      const html = template(data);

      // Create new page
      page = await this.browser!.newPage();

      // Set viewport for consistent rendering
      await page.setViewport({
        width: 1200,
        height: 1600,
        deviceScaleFactor: 2
      });

      // Add CSS for print media
      await page.addStyleTag({
        content: `
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .no-print {
              display: none !important;
            }
          }
          @page {
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
        `
      });

      // Set content
      await page.setContent(html, {
        waitUntil: ['networkidle0', 'domcontentloaded']
      });

      // Wait for any async content
      await page.evaluateHandle('document.fonts.ready');

      // Default PDF options
      const defaultOptions: PDFOptions = {
        format: 'Letter',
        printBackground: true,
        preferCSSPageSize: false,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        },
        displayHeaderFooter: false
      };

      // Merge with provided options
      const pdfOptions: PDFOptions = {
        ...defaultOptions,
        ...options,
        margin: {
          ...defaultOptions.margin,
          ...options.margin
        }
      };

      // Generate PDF
      const pdfBuffer = await page.pdf(pdfOptions);

      return pdfBuffer;
    } catch (error) {
      console.error('[PDFGenerator] Failed to generate PDF:', error);
      throw new Error('Failed to generate PDF');
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  /**
   * Generate PDF with custom header and footer
   */
  async generateWithHeaderFooter(
    templateHtml: string,
    data: Record<string, any>,
    headerHtml: string,
    footerHtml: string,
    options: PDFGenerationOptions = {}
  ): Promise<Buffer> {
    const headerTemplate = `
      <div style="font-size: 10px; width: 100%; text-align: center;">
        ${headerHtml}
      </div>
    `;

    const footerTemplate = `
      <div style="font-size: 10px; width: 100%; text-align: center;">
        ${footerHtml}
        <span style="margin-left: auto;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `;

    return this.generateFromTemplate(templateHtml, data, {
      ...options,
      displayHeaderFooter: true,
      headerTemplate,
      footerTemplate,
      margin: {
        top: '1in',
        bottom: '1in',
        ...options.margin
      }
    });
  }

  /**
   * Generate multiple PDFs and merge them
   */
  async generateBatch(
    templates: Array<{
      html: string;
      data: Record<string, any>;
      options?: PDFGenerationOptions;
    }>
  ): Promise<Buffer[]> {
    const pdfs: Buffer[] = [];

    for (const template of templates) {
      const pdf = await this.generateFromTemplate(
        template.html,
        template.data,
        template.options
      );
      pdfs.push(pdf);
    }

    return pdfs;
  }

  /**
   * Clean up resources
   */
  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.isInitialized = false;
      console.log('[PDFGenerator] Browser closed');
    }
  }

  /**
   * Generate thumbnail from first page of PDF
   */
  async generateThumbnail(
    pdfBuffer: Buffer,
    width = 200,
    height = 260
  ): Promise<Buffer> {
    if (!this.isInitialized || !this.browser) {
      await this.initialize();
    }

    let page: Page | null = null;

    try {
      page = await this.browser!.newPage();

      // Create data URL from PDF buffer
      const base64 = pdfBuffer.toString('base64');
      const dataUrl = `data:application/pdf;base64,${base64}`;

      // Use PDF.js to render first page
      await page.setContent(`
        <!DOCTYPE html>
        <html>
        <head>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
        </head>
        <body style="margin: 0; padding: 0;">
          <canvas id="pdfCanvas"></canvas>
          <script>
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            
            async function renderPDF() {
              const pdf = await pdfjsLib.getDocument('${dataUrl}').promise;
              const page = await pdf.getPage(1);
              
              const viewport = page.getViewport({ scale: 1 });
              const canvas = document.getElementById('pdfCanvas');
              const context = canvas.getContext('2d');
              
              const scale = Math.min(${width} / viewport.width, ${height} / viewport.height);
              const scaledViewport = page.getViewport({ scale });
              
              canvas.width = scaledViewport.width;
              canvas.height = scaledViewport.height;
              
              await page.render({
                canvasContext: context,
                viewport: scaledViewport
              }).promise;
            }
            
            renderPDF();
          </script>
        </body>
        </html>
      `);

      // Wait for PDF to render
      await page.waitForTimeout(2000);

      // Take screenshot of canvas
      const element = await page.$('#pdfCanvas');
      if (!element) {
        throw new Error('Failed to render PDF for thumbnail');
      }

      const screenshot = await element.screenshot({
        type: 'png',
        omitBackground: true
      });

      return screenshot;
    } catch (error) {
      console.error('[PDFGenerator] Failed to generate thumbnail:', error);
      throw new Error('Failed to generate thumbnail');
    } finally {
      if (page) {
        await page.close();
      }
    }
  }
}

// Register Handlebars helpers
Handlebars.registerHelper('formatCurrency', (amount: number) => {
  if (!amount) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
});

Handlebars.registerHelper('formatDate', (date: string | Date) => {
  if (!date) return '';
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(d);
});

Handlebars.registerHelper('formatShortDate', (date: string | Date) => {
  if (!date) return '';
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US').format(d);
});

Handlebars.registerHelper('eq', (a: any, b: any) => a === b);
Handlebars.registerHelper('ne', (a: any, b: any) => a !== b);
Handlebars.registerHelper('lt', (a: any, b: any) => a < b);
Handlebars.registerHelper('gt', (a: any, b: any) => a > b);
Handlebars.registerHelper('lte', (a: any, b: any) => a <= b);
Handlebars.registerHelper('gte', (a: any, b: any) => a >= b);
Handlebars.registerHelper('and', (a: any, b: any) => a && b);
Handlebars.registerHelper('or', (a: any, b: any) => a || b);
Handlebars.registerHelper('not', (a: any) => !a);

Handlebars.registerHelper('capitalize', (str: string) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
});

Handlebars.registerHelper('uppercase', (str: string) => {
  if (!str) return '';
  return str.toUpperCase();
});

Handlebars.registerHelper('lowercase', (str: string) => {
  if (!str) return '';
  return str.toLowerCase();
});

// Export singleton instance
export const pdfGenerator = new PDFGenerator();