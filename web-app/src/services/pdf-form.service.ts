/**
 * PDF Form Service
 * Handles PDF form field mapping and filling using pdf-lib
 */

import { PDFDocument, PDFTextField, PDFCheckBox, PDFForm, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

export interface FormFieldMapping {
  fieldName: string;
  pdfFieldId?: string;
  type: 'text' | 'checkbox' | 'number' | 'date' | 'signature';
  page?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  required?: boolean;
  defaultValue?: string;
  fontSize?: number;
  format?: string; // For dates and numbers
}

export interface FormTemplate {
  templateCode: string;
  pdfPath: string;
  fields: FormFieldMapping[];
}

export interface PDFFormOptions {
  fontName?: StandardFonts;
  fontSize?: number;
  fontColor?: { r: number; g: number; b: number };
  dateFormat?: string;
  currencyFormat?: boolean;
}

export class PDFFormService {
  private static instance: PDFFormService;
  private defaultOptions: PDFFormOptions = {
    fontName: StandardFonts.Helvetica,
    fontSize: 10,
    fontColor: { r: 0, g: 0, b: 0 },
    dateFormat: 'MM/DD/YYYY',
    currencyFormat: true
  };

  private constructor() {}

  static getInstance(): PDFFormService {
    if (!PDFFormService.instance) {
      PDFFormService.instance = new PDFFormService();
    }
    return PDFFormService.instance;
  }

  /**
   * Add form fields to a blank PDF
   * Used for initial setup of PDFs without form fields
   */
  async addFormFieldsToPDF(
    inputPdfPath: string,
    outputPdfPath: string,
    fieldMappings: FormFieldMapping[]
  ): Promise<void> {
    try {
      // Read the existing PDF
      const existingPdfBytes = await fs.readFile(inputPdfPath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
      const form = pdfDoc.getForm();

      // Add fields based on mappings
      for (const mapping of fieldMappings) {
        if (!mapping.page || mapping.x === undefined || mapping.y === undefined) {
          console.warn(`Skipping field ${mapping.fieldName} - missing position info`);
          continue;
        }

        const page = pdfDoc.getPage(mapping.page - 1);
        
        switch (mapping.type) {
          case 'text':
          case 'number':
          case 'date':
            const textField = form.createTextField(mapping.fieldName);
            textField.addToPage(page, {
              x: mapping.x,
              y: mapping.y,
              width: mapping.width || 200,
              height: mapping.height || 20
            });
            
            if (mapping.defaultValue) {
              textField.setText(mapping.defaultValue);
            }
            
            if (mapping.required) {
              textField.enableRequired();
            }
            break;

          case 'checkbox':
            const checkBox = form.createCheckBox(mapping.fieldName);
            checkBox.addToPage(page, {
              x: mapping.x,
              y: mapping.y,
              width: mapping.width || 15,
              height: mapping.height || 15
            });
            break;

          case 'signature':
            // For signatures, we'll use a text field as placeholder
            const sigField = form.createTextField(`${mapping.fieldName}_signature`);
            sigField.addToPage(page, {
              x: mapping.x,
              y: mapping.y,
              width: mapping.width || 200,
              height: mapping.height || 40
            });
            sigField.enableMultiline();
            break;
        }
      }

      // Save the PDF with form fields
      const pdfBytes = await pdfDoc.save();
      await fs.writeFile(outputPdfPath, pdfBytes);
      
      console.log(`Added ${fieldMappings.length} form fields to PDF`);
    } catch (error) {
      console.error('Error adding form fields to PDF:', error);
      throw error;
    }
  }

  /**
   * Fill PDF form fields with data
   */
  async fillPDFForm(
    templatePdfPath: string,
    formData: Record<string, any>,
    fieldMappings: FormFieldMapping[],
    options?: PDFFormOptions
  ): Promise<Uint8Array> {
    try {
      // Read the template PDF
      const existingPdfBytes = await fs.readFile(templatePdfPath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
      const form = pdfDoc.getForm();

      // Merge options with defaults
      const opts = { ...this.defaultOptions, ...options };

      // Embed font
      const font = await pdfDoc.embedFont(opts.fontName!);

      // Try to fill using existing form fields first
      const formFields = form.getFields();
      const hasFormFields = formFields.length > 0;

      if (hasFormFields) {
        // Fill existing form fields
        for (const field of formFields) {
          const fieldName = field.getName();
          const value = formData[fieldName];

          if (value !== undefined && value !== null) {
            if (field instanceof PDFTextField) {
              const formattedValue = this.formatFieldValue(value, fieldName, fieldMappings);
              field.setText(formattedValue);
              field.updateAppearances(font);
            } else if (field instanceof PDFCheckBox) {
              if (value === true || value === 'true' || value === 1) {
                field.check();
              } else {
                field.uncheck();
              }
            }
          }
        }
      } else {
        // Fall back to direct text placement using coordinates
        console.log('No form fields found, using direct text placement');
        
        for (const mapping of fieldMappings) {
          if (!mapping.page || mapping.x === undefined || mapping.y === undefined) {
            continue;
          }

          const value = formData[mapping.fieldName];
          if (value === undefined || value === null) {
            continue;
          }

          const page = pdfDoc.getPage(mapping.page - 1);
          const formattedValue = this.formatFieldValue(value, mapping.fieldName, fieldMappings);
          
          if (mapping.type === 'checkbox') {
            // Draw checkbox
            if (value === true || value === 'true' || value === 1) {
              page.drawText('✓', {
                x: mapping.x,
                y: mapping.y,
                size: mapping.fontSize || 14,
                font,
                color: rgb(opts.fontColor!.r, opts.fontColor!.g, opts.fontColor!.b)
              });
            }
          } else {
            // Draw text
            page.drawText(formattedValue, {
              x: mapping.x,
              y: mapping.y,
              size: mapping.fontSize || opts.fontSize!,
              font,
              color: rgb(opts.fontColor!.r, opts.fontColor!.g, opts.fontColor!.b),
              maxWidth: mapping.width,
              lineHeight: (mapping.fontSize || opts.fontSize!) * 1.2
            });
          }
        }
      }

      // Flatten the form to prevent further editing (optional)
      // form.flatten();

      // Save and return the filled PDF
      return await pdfDoc.save();
    } catch (error) {
      console.error('Error filling PDF form:', error);
      throw error;
    }
  }

  /**
   * Format field value based on type and format settings
   */
  private formatFieldValue(
    value: any,
    fieldName: string,
    mappings: FormFieldMapping[]
  ): string {
    const mapping = mappings.find(m => m.fieldName === fieldName);
    
    if (!mapping) {
      return String(value);
    }

    switch (mapping.type) {
      case 'number':
        if (mapping.format === 'currency' || fieldName.toLowerCase().includes('price') || 
            fieldName.toLowerCase().includes('amount')) {
          return this.formatCurrency(value);
        }
        return this.formatNumber(value);

      case 'date':
        return this.formatDate(value, mapping.format);

      default:
        return String(value);
    }
  }

  /**
   * Format number as currency
   */
  private formatCurrency(value: number | string): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  }

  /**
   * Format number with commas
   */
  private formatNumber(value: number | string): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US').format(num);
  }

  /**
   * Format date
   */
  private formatDate(value: string | Date, format?: string): string {
    const date = typeof value === 'string' ? new Date(value) : value;
    
    if (format === 'long') {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    }

    // Default MM/DD/YYYY
    return new Intl.DateTimeFormat('en-US').format(date);
  }

  /**
   * Load field mappings from JSON file
   */
  async loadFieldMappings(templateCode: string): Promise<FormFieldMapping[]> {
    try {
      const mappingPath = path.join(
        process.cwd(),
        'src/templates',
        this.getTemplatePath(templateCode),
        'pdf-fields.json'
      );
      
      const data = await fs.readFile(mappingPath, 'utf-8');
      const config = JSON.parse(data);
      
      return config.fields || [];
    } catch (error) {
      console.error(`Error loading field mappings for ${templateCode}:`, error);
      return [];
    }
  }

  /**
   * Get template path from template code
   */
  private getTemplatePath(templateCode: string): string {
    // Map template codes to their directory paths
    const templatePaths: Record<string, string> = {
      'CA_RPA': '01-buyers-offer/CA_RPA',
      // Add more mappings as needed
    };

    return templatePaths[templateCode] || '';
  }

  /**
   * Validate form data against field mappings
   */
  validateFormData(
    formData: Record<string, any>,
    fieldMappings: FormFieldMapping[]
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const mapping of fieldMappings) {
      if (mapping.required) {
        const value = formData[mapping.fieldName];
        if (value === undefined || value === null || value === '') {
          errors.push(`Required field missing: ${mapping.fieldName}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate PDF from template with form data
   */
  async generatePDF(
    templateCode: string,
    formData: Record<string, any>,
    options?: PDFFormOptions
  ): Promise<Buffer> {
    try {
      // Get template PDF path
      const templatePath = path.join(
        process.cwd(),
        'public/templates/blank-forms',
        `${templateCode}.pdf`
      );

      // Load field mappings
      const fieldMappings = await this.loadFieldMappings(templateCode);

      // Fill the PDF form
      const pdfBytes = await this.fillPDFForm(
        templatePath,
        formData,
        fieldMappings,
        options
      );

      // Convert Uint8Array to Buffer
      return Buffer.from(pdfBytes);
    } catch (error) {
      console.error(`Error generating PDF for ${templateCode}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const pdfFormService = PDFFormService.getInstance();