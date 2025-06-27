/**
 * PDF Field Setup Utility
 * One-time utility to add form fields to blank PDFs
 */

import { PDFDocument, PDFForm, PDFTextField, PDFCheckBox, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { FormFieldMapping } from '@/lib/server/pdf-form.server';

export interface SetupOptions {
  showFieldBorders?: boolean;
  fieldBorderColor?: { r: number; g: number; b: number };
  fieldBackgroundColor?: { r: number; g: number; b: number };
}

/**
 * Add form fields to a blank PDF
 * This is a one-time setup process for PDFs without form fields
 */
export async function setupFormFields(
  blankPdfPath: string,
  fieldMappings: FormFieldMapping[],
  options: SetupOptions = {}
): Promise<Uint8Array> {
  try {
    const existingPdfBytes = await fs.readFile(blankPdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
    const form = pdfDoc.getForm();

    // Default options
    const opts = {
      showFieldBorders: true,
      fieldBorderColor: { r: 0, g: 0, b: 0.5 },
      fieldBackgroundColor: { r: 0.95, g: 0.95, b: 1 },
      ...options
    };

    for (const field of fieldMappings) {
      if (!field.page || field.x === undefined || field.y === undefined) {
        console.warn(`Skipping field ${field.fieldName} - missing position info`);
        continue;
      }

      const page = pdfDoc.getPage(field.page - 1); // Pages are 0-indexed
      
      switch (field.type) {
        case 'text':
        case 'number':
        case 'date':
          const textField = form.createTextField(field.fieldName);
          textField.addToPage(page, {
            x: field.x,
            y: field.y,
            width: field.width || 200,
            height: field.height || 20,
            borderColor: opts.showFieldBorders 
              ? rgb(opts.fieldBorderColor.r, opts.fieldBorderColor.g, opts.fieldBorderColor.b)
              : undefined,
            backgroundColor: rgb(opts.fieldBackgroundColor.r, opts.fieldBackgroundColor.g, opts.fieldBackgroundColor.b)
          });
          
          // Set default value if provided
          if (field.defaultValue) {
            textField.setText(String(field.defaultValue));
          }
          
          // Enable required fields
          if (field.required) {
            textField.enableRequired();
          }
          
          // Enable multiline for larger text fields
          if ((field.height || 20) > 30) {
            textField.enableMultiline();
          }
          break;

        case 'checkbox':
          const checkBox = form.createCheckBox(field.fieldName);
          checkBox.addToPage(page, {
            x: field.x,
            y: field.y,
            width: field.width || 15,
            height: field.height || 15,
            borderColor: opts.showFieldBorders
              ? rgb(opts.fieldBorderColor.r, opts.fieldBorderColor.g, opts.fieldBorderColor.b)
              : undefined,
            backgroundColor: rgb(opts.fieldBackgroundColor.r, opts.fieldBackgroundColor.g, opts.fieldBackgroundColor.b)
          });
          
          // Set default checked state
          if (field.defaultValue === true || field.defaultValue === 'true') {
            checkBox.check();
          }
          break;

        case 'signature':
          // For signatures, create a text field that can be used for typed signatures
          // In production, you'd integrate with a proper e-signature service
          const sigField = form.createTextField(`${field.fieldName}`);
          sigField.addToPage(page, {
            x: field.x,
            y: field.y,
            width: field.width || 200,
            height: field.height || 40,
            borderColor: rgb(0.7, 0.7, 0.7),
            backgroundColor: rgb(0.98, 0.98, 0.98)
          });
          sigField.enableMultiline();
          sigField.setFontSize(field.fontSize || 12);
          break;
      }
      
      console.log(`Added field: ${field.fieldName} (${field.type}) on page ${field.page}`);
    }

    console.log(`Successfully added ${fieldMappings.length} form fields to PDF`);
    return await pdfDoc.save();
  } catch (error) {
    console.error('Error setting up form fields:', error);
    throw error;
  }
}

/**
 * Create a visual guide PDF showing field locations
 * Useful for debugging field positions
 */
export async function createFieldGuide(
  blankPdfPath: string,
  fieldMappings: FormFieldMapping[],
  outputPath: string
): Promise<void> {
  try {
    const existingPdfBytes = await fs.readFile(blankPdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });

    // Colors for different field types
    const colors = {
      text: rgb(0, 0, 1),        // Blue
      checkbox: rgb(0, 1, 0),     // Green
      number: rgb(1, 0.5, 0),     // Orange
      date: rgb(1, 0, 1),         // Magenta
      signature: rgb(0.5, 0, 0.5) // Purple
    };

    for (const field of fieldMappings) {
      if (!field.page || field.x === undefined || field.y === undefined) {
        continue;
      }

      const page = pdfDoc.getPage(field.page - 1);
      const color = colors[field.type] || rgb(0, 0, 0);
      
      // Draw rectangle around field area
      page.drawRectangle({
        x: field.x,
        y: field.y,
        width: field.width || 200,
        height: field.height || 20,
        borderColor: color,
        borderWidth: 2,
        opacity: 0.5
      });
      
      // Add field name label
      page.drawText(field.fieldName, {
        x: field.x,
        y: field.y + (field.height || 20) + 2,
        size: 8,
        color: color
      });
    }

    // Add legend on first page
    const firstPage = pdfDoc.getPage(0);
    const { height } = firstPage.getSize();
    let legendY = height - 50;
    
    firstPage.drawText('Field Guide Legend:', {
      x: 50,
      y: legendY,
      size: 12,
      color: rgb(0, 0, 0)
    });
    
    legendY -= 20;
    for (const [type, color] of Object.entries(colors)) {
      firstPage.drawRectangle({
        x: 50,
        y: legendY - 10,
        width: 15,
        height: 15,
        color: color
      });
      
      firstPage.drawText(type.charAt(0).toUpperCase() + type.slice(1), {
        x: 70,
        y: legendY - 7,
        size: 10,
        color: rgb(0, 0, 0)
      });
      
      legendY -= 20;
    }

    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, pdfBytes);
    
    console.log(`Field guide saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error creating field guide:', error);
    throw error;
  }
}

/**
 * CLI tool to set up form fields for a template
 */
export async function setupTemplateFormFields(templateCode: string): Promise<void> {
  try {
    // Load field mappings
    const mappingsPath = path.join(
      process.cwd(),
      'src/templates',
      getTemplatePath(templateCode),
      'pdf-fields.json'
    );
    
    const mappingsData = await fs.readFile(mappingsPath, 'utf-8');
    const config = JSON.parse(mappingsData);
    
    // Paths for input and output PDFs
    const templateDir = path.join(process.cwd(), 'src/templates', getTemplatePath(templateCode));
    const inputPdfPath = path.join(templateDir, config.pdfFileName);
    const outputPdfPath = path.join(templateDir, `${templateCode}_with_fields.pdf`);
    const guidePdfPath = path.join(templateDir, `${templateCode}_field_guide.pdf`);
    
    // Check if input PDF exists
    try {
      await fs.access(inputPdfPath);
    } catch {
      throw new Error(`PDF file not found: ${inputPdfPath}`);
    }
    
    // Add form fields
    console.log(`Setting up form fields for ${templateCode}...`);
    const pdfWithFields = await setupFormFields(inputPdfPath, config.fields);
    await fs.writeFile(outputPdfPath, pdfWithFields);
    console.log(`PDF with form fields saved to: ${outputPdfPath}`);
    
    // Create field guide
    await createFieldGuide(inputPdfPath, config.fields, guidePdfPath);
    
    console.log('\nSetup complete! Files created:');
    console.log(`- PDF with form fields: ${outputPdfPath}`);
    console.log(`- Field guide: ${guidePdfPath}`);
  } catch (error) {
    console.error(`Error setting up template ${templateCode}:`, error);
    throw error;
  }
}

/**
 * Get template directory path
 */
function getTemplatePath(templateCode: string): string {
  const templatePaths: Record<string, string> = {
    'CA_RPA': '01-buyers-offer/CA_RPA',
    // Add more template mappings as needed
  };

  const path = templatePaths[templateCode];
  if (!path) {
    throw new Error(`Unknown template code: ${templateCode}`);
  }
  
  return path;
}

// Export for use in scripts
if (require.main === module) {
  const templateCode = process.argv[2];
  if (!templateCode) {
    console.error('Usage: npm run setup-pdf-fields <template-code>');
    console.error('Example: npm run setup-pdf-fields CA_RPA');
    process.exit(1);
  }
  
  setupTemplateFormFields(templateCode)
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}