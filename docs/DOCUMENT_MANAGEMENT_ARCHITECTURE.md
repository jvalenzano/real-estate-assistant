## Consolidated Document Management Architecture

After reviewing both documents, I'll create a consolidated version that combines the accurate current state with the useful architectural patterns from the older document.

# RealeAgent Document Management System - Implementation Manifest v2.1

## Table of Contents
1. [System Overview](#system-overview)
2. [Current Implementation Status](#current-implementation-status)
3. [Architecture Design](#architecture-design)
4. [Core Components](#core-components)
5. [Implementation Phases](#implementation-phases)
6. [API Reference](#api-reference)
7. [Development Workflow](#development-workflow)
8. [Testing Strategy](#testing-strategy)
9. [Known Issues & Solutions](#known-issues--solutions)

---

## System Overview

### Purpose
The RealeAgent Document Management System provides a complete solution for generating, managing, and obtaining signatures on 50+ California real estate transaction documents throughout the property lifecycle.

### Key Features
- PDF form filling for 50+ California real estate forms
- Automated import and organization of official CAR forms
- E-signature integration with fallback/mock modes
- Transaction-centric document organization
- Real-time document status tracking
- Secure storage with access control

### Success Metrics
- Document generation: < 3 seconds
- Template accuracy: 99.9% (exact PDF preservation)
- Zero-downtime signature fallback
- All 50+ forms imported and scaffolded

---

## Current Implementation Status

### ✅ Completed
- All 50+ California real estate PDFs imported
- Supabase database schema created and seeded
- Template selection UI with category filtering
- Navigation structure (Properties → Documents)
- API endpoints returning template data
- Dark mode issues resolved
- PDF import automation script
- Form data entry UI for CA_RPA

### 🚧 In Progress
- CA_RPA click handler bug (shows "broken")
- Document generation API endpoint
- PDF form filling with encrypted files
- E-signature integration

### 📋 Pending
- Remaining 49 forms implementation
- Document history/list view
- Complete e-signature workflow
- Access control implementation

---

## Architecture Design

### Current Implementation Flow
```
User Input → Template Selection → Form Data Entry → PDF Form Filling → E-Signature → Storage
     ↓              ↓                   ↓                ↓                ↓            ↓
   Web Form     CA_RPA.pdf         Field Mapping     pdf-lib         HelloSign    Supabase
```

### Technology Stack
- **Frontend**: Next.js 15 with App Router
- **Backend**: Node.js + TypeScript
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **PDF Processing**: pdf-lib (form filling)
- **E-Signatures**: HelloSign API (with mock fallback)
- **Form Management**: JSON field mappings

### Directory Structure (Current)
```
web-app/
├── src/
│   ├── app/
│   │   ├── documents/
│   │   │   ├── new/page.tsx              # Template selection UI
│   │   │   ├── create/page.tsx           # Form data entry
│   │   │   ├── [id]/page.tsx            # Document viewer
│   │   │   └── page.tsx                  # Document list
│   │   └── api/v1/
│   │       ├── document-templates/       # Template API endpoints
│   │       └── documents/generate/       # Document generation endpoint
│   │
│   ├── services/
│   │   ├── document.service.ts          # Document generation orchestration
│   │   ├── template.service.ts          # Template loading and management
│   │   ├── pdf-form.service.ts          # PDF form filling operations
│   │   ├── eSignature.service.ts        # E-signature integration
│   │   └── storage.service.ts           # Supabase storage operations
│   │
│   ├── templates/
│   │   ├── 01-buyers-offer/
│   │   │   └── CA_RPA/
│   │   │       ├── California_Residential_Purchase_Agreement___12_24.pdf
│   │   │       ├── pdf-fields.json      # PDF form field mappings
│   │   │       ├── fields.json          # Web form field definitions
│   │   │       ├── signatures.json      # Signature placement config
│   │   │       └── metadata.json        # Form metadata
│   │   └── [02-06 categories with 49 other forms]
│   │
│   ├── components/
│   │   ├── documents/
│   │   │   ├── TemplateSelector.tsx
│   │   │   ├── DocumentGenerationForm.tsx
│   │   │   └── PDFViewer.tsx
│   │   └── Navigation.tsx
│   │
│   └── utils/
│       ├── pdf-field-setup.ts
│       └── pdf.utils.ts
│
├── scripts/
│   └── import-pdfs.ts                   # Automated PDF import
│
└── supabase/
    ├── migrations/
    └── seed.sql
```

---

## Core Components

### 1. PDF Form Service (Current Implementation)

**File**: `src/services/pdf-form.service.ts`

```typescript
import { PDFDocument, PDFTextField, PDFCheckBox } from 'pdf-lib';

export class PDFFormService {
  async fillPDFForm(
    templatePdfPath: string,
    formData: Record<string, any>,
    fieldMappings: FormFieldMapping[]
  ): Promise<Uint8Array> {
    // Load PDF with encryption handling
    const existingPdfBytes = await fs.readFile(templatePdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes, {
      ignoreEncryption: true  // Critical for CAR forms
    });
    
    const form = pdfDoc.getForm();
    
    // Fill fields based on mappings
    for (const mapping of fieldMappings) {
      const field = form.getField(mapping.pdfFieldId);
      
      if (field instanceof PDFTextField) {
        field.setText(String(formData[mapping.fieldName] || ''));
      } else if (field instanceof PDFCheckBox) {
        if (formData[mapping.fieldName]) {
          field.check();
        }
      }
    }
    
    return await pdfDoc.save();
  }
}
```

### 2. Template Service (Updated for PDF approach)

**File**: `src/services/template.service.ts`

```typescript
import { TEMPLATE_REGISTRY } from '@/templates';

export class TemplateService {
  async getTemplate(templateCode: string) {
    const template = TEMPLATE_REGISTRY[templateCode];
    if (!template) {
      throw new Error(`Template ${templateCode} not found`);
    }
    
    // Load PDF and field mappings
    const pdfPath = path.join(
      process.cwd(),
      'src/templates',
      template.path,
      template.metadata.fileName
    );
    
    const fieldMappings = await this.loadFieldMappings(templateCode);
    
    return {
      ...template,
      pdfPath,
      fieldMappings
    };
  }
  
  private async loadFieldMappings(templateCode: string) {
    const template = TEMPLATE_REGISTRY[templateCode];
    const mappingPath = path.join(
      process.cwd(),
      'src/templates',
      template.path,
      'pdf-fields.json'
    );
    
    return JSON.parse(await fs.readFile(mappingPath, 'utf-8'));
  }
}
```

### 3. Document Generation API (To Be Implemented)

**File**: `app/api/v1/documents/generate/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { DocumentService } from '@/services/document.service';

export async function POST(request: NextRequest) {
  try {
    const { templateCode, formData, transactionId } = await request.json();
    
    const documentService = new DocumentService();
    const result = await documentService.generateDocument(
      templateCode,
      formData,
      transactionId
    );
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Document generation error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

## Implementation Phases

### Phase 1: Fix Current Issues (Immediate)
1. ✅ Fix CA_RPA "broken" click handler
2. ✅ Create document generation API endpoint
3. ✅ Handle encrypted PDFs in pdf-form service
4. ⬜ Test end-to-end CA_RPA generation

### Phase 2: Complete Core Features (Week 1)
1. ⬜ Perfect CA_RPA field mappings
2. ⬜ Implement document storage in Supabase
3. ⬜ Add document viewing/download
4. ⬜ Create mock e-signature flow

### Phase 3: Expand Forms (Week 2)
1. ⬜ Add 5 most common forms:
   - Buyer Counter Offer
   - Inspection Contingency Removal
   - Lead Paint Disclosure
   - Estimated Buyer Costs
   - Seller Counter Offer
2. ⬜ Create field mapping tool/UI

### Phase 4: Production Features (Week 3+)
1. ⬜ HelloSign integration
2. ⬜ Document versioning
3. ⬜ Access control/permissions
4. ⬜ Batch operations

---

## API Reference

### Current Working Endpoints

```typescript
// Get all templates
GET /api/v1/document-templates
Response: {
  success: true,
  data: Template[],
  meta: { total: 36, timestamp: string }
}

// Get specific template
GET /api/v1/document-templates/:templateCode
Response: {
  success: true,
  data: Template
}
```

### Endpoints to Implement

```typescript
// Generate document
POST /api/v1/documents/generate
Body: {
  templateCode: string,
  formData: object,
  transactionId: string
}

// Get document
GET /api/v1/documents/:id

// Send for signature
POST /api/v1/documents/:id/send-signature
```

---

## Development Workflow

### Adding a New Form
1. **Import PDF**: Place in correct template directory
2. **Create Field Mapping**: 
   ```json
   {
     "templateCode": "BUYER_COUNTER_OFFER",
     "fields": [
       {
         "fieldName": "propertyAddress",
         "pdfFieldId": "Property Address",
         "type": "text",
         "page": 1,
         "x": 150,
         "y": 700
       }
     ]
   }
   ```
3. **Run Field Setup**: `npm run setup-pdf-fields BUYER_COUNTER_OFFER`
4. **Test**: Generate test document
5. **Update Registry**: Mark as implemented

### Technical Considerations
- **Encrypted PDFs**: All CAR forms require `{ ignoreEncryption: true }`
- **Form Fields**: Must be added programmatically to blank PDFs
- **Field Mapping**: Manual process, consider building UI tool
- **Storage**: Generated PDFs stored in Supabase Storage

---

## Testing Strategy

### Current Test Commands
```bash
# Test template API
curl http://localhost:3000/api/v1/document-templates

# Test specific template
curl http://localhost:3000/api/v1/document-templates/CA_RPA

# Import PDFs
npm run import-pdfs

# Setup form fields
npm run setup-pdf-fields CA_RPA
```

### Test Scenarios
1. **Template Selection**: Click through all categories
2. **Form Submission**: Fill CA_RPA with test data
3. **PDF Generation**: Verify output matches input
4. **Storage**: Confirm file saved to Supabase

---

## Known Issues & Solutions

### Current Bugs
1. **CA_RPA Shows "broken"**
   - Location: `app/documents/new/page.tsx`
   - Fix: Remove broken text, fix onClick handler

2. **API 400 Error**
   - Cause: External API call to localhost:3001
   - Fix: Use internal Next.js API routes

3. **Encrypted PDF Handling**
   - Issue: CAR PDFs are encrypted
   - Solution: Add `{ ignoreEncryption: true }` to all PDF loads

### Environment Setup
```bash
# Required environment variables
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Optional for development
MOCK_SIGNATURES=true
PDF_DEBUG=true
```

---

## Migration Notes from v1

### Key Changes
- **PDF Generation**: Switched from HTML/Puppeteer to pdf-lib form filling
- **Templates**: Now using actual PDFs instead of HTML templates
- **Storage**: Blank PDFs in repo, generated PDFs in Supabase
- **Architecture**: Simplified to focus on form filling vs generation

### Deprecated Components
- HTML template system
- Puppeteer PDF generation
- Handlebars templating

---

*Last Updated: June 2024*  
*Version: 2.1*  
*Status: Active Development*