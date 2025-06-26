#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { TEMPLATE_REGISTRY } from '../src/templates';

// Category folder mapping
const CATEGORY_MAP: Record<string, string> = {
  "Buyers Offer and Negotiation Stage": '01-buyers-offer',  // No apostrophe version
  "Buyer's Offer": '01-buyers-offer',  // Short version
  "Buyer's Offer and Negotiation Stage": '01-buyers-offer',  // With apostrophe
  "Contingency Removal and Closing": '02-contingency-removal',
  "Escrow and Contingency Stage": '03-escrow-contingency',
  "Final Disclosures & Delivery": '04-final-disclosures',
  "Forms Used in Specific Situations": '05-specific-situations',
  "Listing Stage": '06-listing-stage'
};

// Build PDF to template code mapping from TEMPLATE_REGISTRY
const PDF_TO_TEMPLATE_MAP: Record<string, string> = {};
Object.entries(TEMPLATE_REGISTRY).forEach(([code, template]) => {
  PDF_TO_TEMPLATE_MAP[template.fileName] = code;
});

interface ImportOptions {
  dryRun?: boolean;
  verbose?: boolean;
}

interface ImportResult {
  success: Array<{
    originalPath: string;
    templateCode: string;
    destinationPath: string;
    action: 'copied' | 'skipped' | 'would-copy';
  }>;
  failed: Array<{
    originalPath: string;
    reason: string;
  }>;
  warnings: Array<{
    message: string;
  }>;
}

async function importPdfs(sourceDir: string, options: ImportOptions = {}): Promise<ImportResult> {
  const result: ImportResult = { success: [], failed: [], warnings: [] };
  
  // Check if source directory exists
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Source directory not found: ${sourceDir}`);
  }
  
  console.log(`\n📂 Scanning directory: ${sourceDir}`);
  
  // Read category folders
  const entries = fs.readdirSync(sourceDir);
  const categories = entries.filter(f => {
    const fullPath = path.join(sourceDir, f);
    return fs.statSync(fullPath).isDirectory();
  });
  
  console.log(`📁 Found ${categories.length} category folders\n`);
  
  for (const categoryFolder of categories) {
    const categoryPath = path.join(sourceDir, categoryFolder);
    const targetCategory = CATEGORY_MAP[categoryFolder];
    
    if (!targetCategory) {
      result.warnings.push({
        message: `Unknown category folder: "${categoryFolder}" - skipping`
      });
      continue;
    }
    
    console.log(`\n📂 Processing category: ${categoryFolder}`);
    console.log(`   → Maps to: ${targetCategory}`);
    
    // Process PDFs in this category
    const files = fs.readdirSync(categoryPath);
    const pdfs = files.filter(f => f.toLowerCase().endsWith('.pdf'));
    
    console.log(`   → Found ${pdfs.length} PDFs`);
    
    for (const pdfFile of pdfs) {
      const sourcePath = path.join(categoryPath, pdfFile);
      
      // Try to match PDF to template
      const matchResult = matchPdfToTemplate(pdfFile, targetCategory);
      
      if (matchResult.templateCode) {
        const template = TEMPLATE_REGISTRY[matchResult.templateCode];
        if (!template) {
          result.failed.push({
            originalPath: sourcePath,
            reason: `Template ${matchResult.templateCode} not found in registry`
          });
          continue;
        }
        
        const destDir = path.join(process.cwd(), 'src/templates', template.path);
        const destPath = path.join(destDir, template.fileName);
        
        // Check if file already exists
        const alreadyExists = fs.existsSync(destPath);
        
        if (options.dryRun) {
          result.success.push({
            originalPath: sourcePath,
            templateCode: matchResult.templateCode,
            destinationPath: destPath,
            action: alreadyExists ? 'skipped' : 'would-copy'
          });
          
          if (options.verbose) {
            console.log(`   ✓ ${pdfFile} → ${matchResult.templateCode} ${alreadyExists ? '(exists)' : '(would copy)'}`);
          }
        } else {
          if (alreadyExists) {
            result.success.push({
              originalPath: sourcePath,
              templateCode: matchResult.templateCode,
              destinationPath: destPath,
              action: 'skipped'
            });
            
            if (options.verbose) {
              console.log(`   ⏭️  ${pdfFile} → ${matchResult.templateCode} (already exists)`);
            }
          } else {
            // Ensure destination directory exists
            fs.mkdirSync(destDir, { recursive: true });
            
            // Copy PDF
            fs.copyFileSync(sourcePath, destPath);
            
            // Create initial field mapping if it doesn't exist
            const fieldMapPath = path.join(destDir, 'pdf-fields.json');
            if (!fs.existsSync(fieldMapPath)) {
              createInitialFieldMapping(matchResult.templateCode, template, fieldMapPath);
            }
            
            result.success.push({
              originalPath: sourcePath,
              templateCode: matchResult.templateCode,
              destinationPath: destPath,
              action: 'copied'
            });
            
            if (options.verbose) {
              console.log(`   ✅ ${pdfFile} → ${matchResult.templateCode}`);
            }
          }
        }
      } else {
        result.failed.push({
          originalPath: sourcePath,
          reason: matchResult.reason || 'Could not match to template'
        });
        
        if (options.verbose) {
          console.log(`   ❌ ${pdfFile} - ${matchResult.reason}`);
        }
      }
    }
  }
  
  return result;
}

interface MatchResult {
  templateCode: string | null;
  reason?: string;
}

function matchPdfToTemplate(pdfName: string, categoryPath: string): MatchResult {
  // First try exact match
  if (PDF_TO_TEMPLATE_MAP[pdfName]) {
    return { templateCode: PDF_TO_TEMPLATE_MAP[pdfName] };
  }
  
  // Special case mappings for problematic PDFs
  const specialCases: Record<string, string> = {
    'possible representation': 'POSSIBLE_REPRESENTATION',
    'wire fraud': 'WIRE_FRAUD_ADVISORY',
    'wire fraud advisory': 'WIRE_FRAUD_ADVISORY',
    'notice to buyer to perform': 'NOTICE_TO_BUYER_PERFORM_2', // For the duplicate
    'statewide buyer and seller advisory': 'STATEWIDE_ADVISORY_LISTING', // For the duplicate
  };
  
  const normalizedPdfName = normalizeName(pdfName);
  
  // Check special cases first
  for (const [pattern, templateCode] of Object.entries(specialCases)) {
    if (normalizedPdfName.includes(pattern)) {
      // Verify the template exists in this category
      const categoryNumber = categoryPath.split('-')[0];
      const template = TEMPLATE_REGISTRY[templateCode];
      if (template && template.categoryNumber === categoryNumber) {
        return { templateCode };
      }
    }
  }
  
  // Get templates in this category
  const categoryNumber = categoryPath.split('-')[0]; // Extract '01' from '01-buyers-offer'
  const templatesInCategory = Object.entries(TEMPLATE_REGISTRY)
    .filter(([_, template]) => template.categoryNumber === categoryNumber);
  
  if (templatesInCategory.length === 0) {
    return { 
      templateCode: null, 
      reason: `No templates found for category ${categoryNumber}` 
    };
  }
  
  // Look for best match
  for (const [code, template] of templatesInCategory) {
    const normalizedTemplateName = normalizeName(template.name);
    const normalizedFileName = normalizeName(template.fileName);
    
    // Check if normalized names match
    if (normalizedPdfName === normalizedFileName || 
        normalizedPdfName === normalizedTemplateName ||
        normalizedPdfName.includes(normalizedTemplateName) ||
        normalizedTemplateName.includes(normalizedPdfName)) {
      return { templateCode: code };
    }
    
    // Check CAR form number match
    if (template.carFormNumber) {
      const normalizedCarNumber = template.carFormNumber.replace(/\s+/g, '').toLowerCase();
      if (normalizedPdfName.includes(normalizedCarNumber)) {
        return { templateCode: code };
      }
    }
  }
  
  // Try word-based matching
  const pdfWords = extractWords(normalizedPdfName);
  let bestMatch = { code: '', score: 0 };
  
  for (const [code, template] of templatesInCategory) {
    const templateWords = extractWords(normalizeName(template.name));
    const matchScore = calculateMatchScore(pdfWords, templateWords);
    
    if (matchScore > bestMatch.score && matchScore >= 0.5) {
      bestMatch = { code, score: matchScore };
    }
  }
  
  if (bestMatch.code) {
    return { templateCode: bestMatch.code };
  }
  
  return { 
    templateCode: null, 
    reason: `No matching template found in category ${categoryNumber}` 
  };
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.pdf$/i, '')
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\d{1,2}[_\s]\d{2,4}\b/g, '') // Remove dates like 12_21 or 6_24
    .replace(/\(\d+\)/g, '') // Remove (1), (2), etc.
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .trim();
}

function extractWords(text: string): string[] {
  return text.split(/\s+/).filter(word => word.length > 2);
}

function calculateMatchScore(words1: string[], words2: string[]): number {
  if (words1.length === 0 || words2.length === 0) return 0;
  
  let matches = 0;
  for (const word1 of words1) {
    if (words2.some(word2 => word1 === word2 || word1.includes(word2) || word2.includes(word1))) {
      matches++;
    }
  }
  
  return matches / Math.max(words1.length, words2.length);
}

function createInitialFieldMapping(templateCode: string, template: any, outputPath: string) {
  const fieldMapping = {
    templateCode,
    pdfFileName: template.fileName,
    description: template.name,
    carFormNumber: template.carFormNumber || null,
    fields: [
      // Common fields that appear on most forms
      {
        fieldName: "date",
        type: "date",
        page: 1,
        x: 450,
        y: 750,
        width: 100,
        height: 20,
        required: true,
        description: "Form date"
      }
    ],
    needsFieldMapping: true,
    mappingStatus: "initial",
    notes: "This is an initial field mapping. Field positions need to be adjusted based on the actual PDF layout."
  };
  
  // Add template-specific fields based on the template type
  if (templateCode === 'CA_RPA' || template.name.toLowerCase().includes('purchase agreement')) {
    fieldMapping.fields.push(
      {
        fieldName: "propertyAddress",
        type: "text",
        page: 1,
        x: 150,
        y: 700,
        width: 400,
        height: 20,
        required: true,
        description: "Property address"
      },
      {
        fieldName: "buyerName",
        type: "text",
        page: 1,
        x: 150,
        y: 650,
        width: 200,
        height: 20,
        required: true,
        description: "Buyer name"
      },
      {
        fieldName: "sellerName",
        type: "text",
        page: 1,
        x: 150,
        y: 600,
        width: 200,
        height: 20,
        required: true,
        description: "Seller name"
      }
    );
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(fieldMapping, null, 2));
}

// Generate comprehensive import report
function generateReport(result: ImportResult, options: ImportOptions = {}) {
  console.log('\n\n📊 PDF Import Report');
  console.log('====================');
  
  const copied = result.success.filter(s => s.action === 'copied').length;
  const skipped = result.success.filter(s => s.action === 'skipped').length;
  const wouldCopy = result.success.filter(s => s.action === 'would-copy').length;
  
  if (options.dryRun) {
    console.log(`🔍 Dry Run Results:`);
    console.log(`   Would copy: ${wouldCopy} new PDFs`);
    console.log(`   Would skip: ${skipped} existing PDFs`);
    console.log(`   Failed: ${result.failed.length} PDFs`);
  } else {
    console.log(`✅ Copied: ${copied} PDFs`);
    console.log(`⏭️  Skipped: ${skipped} existing PDFs`);
    console.log(`❌ Failed: ${result.failed.length} PDFs`);
  }
  
  if (result.warnings.length > 0) {
    console.log(`\n⚠️  Warnings:`);
    result.warnings.forEach(w => console.log(`   ${w.message}`));
  }
  
  if (result.success.length > 0 && !options.verbose) {
    console.log('\n📋 Summary by Template:');
    const byTemplate = result.success.reduce((acc, s) => {
      if (!acc[s.templateCode]) acc[s.templateCode] = [];
      acc[s.templateCode].push(s);
      return acc;
    }, {} as Record<string, typeof result.success>);
    
    Object.entries(byTemplate).forEach(([code, items]) => {
      const template = TEMPLATE_REGISTRY[code];
      console.log(`   ${code}: ${template?.name || 'Unknown'} (${items.length} file${items.length > 1 ? 's' : ''})`);
    });
  }
  
  if (result.failed.length > 0) {
    console.log('\n❌ Failed PDFs:');
    result.failed.forEach(f => {
      console.log(`   ${path.basename(f.originalPath)}`);
      console.log(`      Reason: ${f.reason}`);
    });
  }
  
  // Save detailed report
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(process.cwd(), `import-report-${timestamp}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(result, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  
  // Show next steps
  if (!options.dryRun && copied > 0) {
    console.log('\n🚀 Next Steps:');
    console.log('   1. Run field setup for imported PDFs:');
    console.log('      npm run setup-pdf-fields CA_RPA');
    console.log('   2. Adjust field positions in pdf-fields.json files');
    console.log('   3. Test document generation');
  }
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose') || args.includes('-v');
  const sourceDirArg = args.find(arg => !arg.startsWith('--'));
  
  const sourceDir = sourceDirArg || path.join(process.env.HOME || '', 'Blank_Forms');
  
  const options: ImportOptions = { dryRun, verbose };
  
  console.log(`🚀 PDF Import Tool`);
  console.log(`==================`);
  if (dryRun) {
    console.log(`🔍 Running in DRY RUN mode - no files will be copied`);
  }
  console.log(`📂 Source: ${sourceDir}`);
  console.log(`📂 Target: ${path.join(process.cwd(), 'src/templates')}`);
  
  importPdfs(sourceDir, options)
    .then(result => generateReport(result, options))
    .catch(err => {
      console.error('\n❌ Import failed:', err.message);
      process.exit(1);
    });
}