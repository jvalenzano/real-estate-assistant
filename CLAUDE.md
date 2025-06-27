# CLAUDE.md - Claude Code Context

## 🚨 PROJECT APPROACH: PWA (Progressive Web App)
**Technology**: Next.js 15 with mobile-first responsive design
**Approach**: Progressive Web Application that works on all devices
**Benefits**: Single codebase, no app store deployment, instant updates
**Focus**: Touch-optimized web experience with offline capabilities

## Quick Status
**Current Phase**: Next.js Web App Development  
**Active Directory**: `/web-app`  
**Main Focus**: Building mobile-first property search and document generation web interface

## Current Development Status (Session Summary)
### ✅ Completed This Session (2025-06-27)
- **CA_RPA Workflow Fully Functional** - End-to-end document generation working!
- Fixed individual template API endpoint (added missing `getTemplate` method)
- Implemented real PDF generation with pdf-lib
- Handled encrypted CAR forms with `ignoreEncryption: true`
- Created `fillPDF` method for coordinate-based text placement
- Template service path resolution fixed (src/templates/01-buyers-offer/CA_RPA)
- Generated PDFs saved to `/public/generated-documents/` with UUID naming

### 🎯 Current Focus
- Quality improvements and testing
- Field mapping validation for CA_RPA
- Mobile responsiveness testing
- Security enhancement (move from /public to Supabase Storage)

### 📋 Next Steps
1. End-to-end UI testing (property → template → form → PDF)
2. Add PDF preview functionality
3. Implement secure document storage
4. Add 5 priority forms (Buyer Counter Offer, Contingency Removal, etc.)

### ✅ Performance Metrics
- Template API Response: ~50ms
- PDF Generation: ~300ms
- End-to-End Workflow: <2 minutes

## Project Command Center
📋 **Live Status**: `.cursor/project-board/command-center.md`  
🎯 **Current Tasks**: Building Next.js web app with authentication and property search  
🤖 **AI Context**: `.cursor/ai-instructions/cursor-context.md`  

## Architecture Overview
```
┌─ web-app/             # 🚧 Current Focus - Next.js 15 PWA + Tailwind CSS
│  ├─ src/templates/    # 📄 Document Management System (50+ CA forms)
│  │  ├─ 01-buyers-offer-negotiation/
│  │  │  └─ CA_RPA/    # ✅ Fully implemented template
│  │  ├─ 02-contingency-removal/
│  │  ├─ 03-escrow-contingency/
│  │  ├─ 04-final-disclosures/
│  │  ├─ 05-specific-situations/
│  │  └─ 06-listing-stage/
│  └─ src/services/     # 🔧 Template, eSignature, Storage services
├─ api-server/          # 📦 Being migrated to Next.js API routes
├─ shared/              # 📦 Types and constants
└─ demo-data/           # 🎭 Mock data for demos
```

## API Migration Status
- ✅ **Migrated to Next.js API Routes**:
  - `/api/v1/auth/*` - Authentication endpoints
  - `/api/v1/properties/*` - Property search and details
  - `/api/v1/documents/*` - Document generation and management
  - `/api/v1/document-templates/*` - Template listing
- ⏸️ **Still Using External API** (port 3001):
  - None - all endpoints migrated
- 📝 **Mock Implementation**: All API routes return demo data for investor demos

## Document Management System
The web app includes a comprehensive document management system for California real estate forms:

- **50+ California Real Estate Forms** organized in 6 categories
- **Currently Implemented**: 
  - ✅ CA_RPA (California Residential Purchase Agreement)
  - ✅ BUYER_COUNTER_OFFER (Buyer Counter Offer #1)
- **Template Service Architecture**:
  - **PDF Form Filling** with pdf-lib (NOT Handlebars for PDF generation)
  - Coordinate-based field mapping via pdf-fields.json
  - Dynamic field validation and mapping
  - E-signature integration ready (mock provider included)
  - Storage integration with Supabase (with local fallback)
- **Form Categories**:
  1. Buyer's Offer and Negotiation (8 forms)
  2. Contingency Removal and Closing (5 forms)
  3. Escrow and Contingency Stage (6 forms)
  4. Final Disclosures & Delivery (4 forms)
  5. Forms Used in Specific Situations (5 forms)
  6. Listing Stage (8 forms)

## PDF Form Implementation Pattern
**IMPORTANT**: The project uses PDF form filling, NOT Handlebars for PDF generation.

### Required Files for Each Template:
1. **metadata.json** - Form metadata, dependencies, CAR form number
2. **fields.json** - Form field definitions with validation rules
3. **pdf-fields.json** - PDF coordinate mappings for form filling
4. **signatures.json** - Signature field locations (NOT signature-fields.json)

### Implementation Notes:
- The `template.hbs` file is ONLY for HTML preview, not PDF generation
- PDF forms are filled using coordinate-based text placement with pdf-lib
- CAR forms require `ignoreEncryption: true` when loading
- Each template must be registered in `/src/templates/index.ts`

## Key Commands
```bash
# Development
npm run dev:api               # Start API server
cd web-app && npm run dev     # Start Next.js dev server

# Web App (in /web-app)
npm run dev                   # Next.js dev server
npm run build                 # Production build
npm run start                 # Production server

# API Testing
curl http://localhost:3001    # Health check

# Document Generation Testing (Working!)
curl -X POST http://localhost:3000/api/v1/documents/generate \
  -H "Content-Type: application/json" \
  -d '{"templateCode": "CA_RPA", "formData": {"propertyAddress": "123 Main St", "buyerName": "John Doe", "purchasePrice": 750000}, "transactionId": "test-123"}'

# Test CA_RPA template endpoint
curl http://localhost:3000/api/v1/document-templates/CA_RPA
```

## Critical Files for AI Context
1. **`.cursor/project-board/command-center.md`** - Live project status
2. **`api-server/src/routes/*.ts`** - API patterns to integrate with
3. **`demo-data/properties.json`** - Data structure reference
4. **`shared/types/index.ts`** - TypeScript interfaces
5. **`web-app/src/templates/index.ts`** - Template registry for 50+ forms
6. **`web-app/src/services/template.service.ts`** - Template rendering engine
7. **`web-app/src/config/document.config.ts`** - Document system configuration
8. **`web-app/src/types/template.types.ts`** - Template type definitions

## Demo Requirements
- **Golden Path**: ML81234567 property → Generate RPA (CA_RPA template) → Preview PDF
- **Accounts**: agent@demo.com / demo123
- **Performance**: <5 minutes end-to-end transaction
- **Mobile-First**: Touch-optimized, 60fps animations
- **Document Generation**: CA_RPA fully implemented, 49 other forms show placeholder
- **Demo Data Sources** (in order of authority):
  1. `/demo-data/properties.json` - Primary source for property data
  2. Component-level DEMO_PROPERTIES constants - For immediate fallback
  3. API mock responses - Should match demo-data files
  - Always ensure consistency across all three sources

## Demo-First Development Philosophy
- **Always Show Data**: Never show empty states in demos
- **Hardcode When Needed**: For investor demos, hardcoded data > API calls
- **Golden Path Priority**: ML81234567 property should always work perfectly
- **Data Synchronization**: Keep demo data consistent across all views (list, detail, filters)
- **Fail Gracefully**: If APIs fail, fall back to demo data
- **Performance > Perfection**: 2-second load time beats perfect architecture

## UI Protection Rules
- **Login page UI** (src/app/(auth)/login/page.tsx) is **FINALIZED**
- Any UI changes require explicit approval
- Maintain professional button styling and icons
- Test UI changes before committing
- **Protected Pages**: Login page must remain exactly as implemented on 2025-06-27
- Always verify button visibility and contrast before modifying any UI

## Response Priorities
1. **Functionality Issues**: Fix immediately, don't explain why it's broken
2. **Visual/UX Issues**: Implement the requested change, then explain
3. **Performance Issues**: Profile first, optimize based on data
4. **When debugging**: Add console.log statements to verify behavior

## Development Standards
- TypeScript strict mode, no 'any' types
- React functional components only
- Components under 80 lines, separate styles
- JWT authentication with backend APIs
- Error boundaries and loading states
- Tailwind CSS for styling (mobile-first)
- Next.js App Router for navigation
- **Performance Requirements**:
  - Document generation MUST complete in <1.5s
  - Log generation times: `console.time('pdf-generation')`
  - Test with production-sized PDFs (multi-page forms)
  - Monitor memory usage for concurrent operations
  - Profile before optimizing: measure → optimize → verify
- **WCAG AA Compliance**: All text must meet minimum contrast ratios
  - Normal text: 4.5:1 contrast ratio
  - Large text (18pt+): 3:1 contrast ratio
  - Use these specific colors:
    - Primary text: #111827 (almost black)
    - Secondary text: #374151 (dark gray)
    - Disabled/tertiary: #6B7280 (medium gray)
    - Never use light grays (#9CA3AF or lighter) for body text
- **Template Development**:
  - Use PDF form filling with pdf-lib (NOT Handlebars for PDFs)
  - Required files: metadata.json, fields.json, pdf-fields.json, signatures.json
  - Template.hbs is ONLY for HTML preview
  - All templates must maintain <1.5s generation time
- **Error Handling Patterns**:
  - API Routes: Always return consistent { success: boolean, data?: T, error?: string } format
  - Module Not Found: Check imports, remove external dependencies, use mock implementations
  - Navigation Errors: Ensure authentication state persists, fall back to demo data
  - Styling Issues: Use inline styles as fallback when Tailwind classes don't apply
  - Always log errors with context for debugging

## UI Enhancement Guidelines
- **Icon Libraries**: Use Lucide React for all icons (already installed)
  - Import only needed icons: `import { Heart, Bed, Bath } from 'lucide-react'`
  - Consistent icon sizing: 4-5-6 pattern (w-4 for inline, w-5 for buttons, w-6 for headers)
- **Enhancement Patterns**:
  - Cards: Add shadows (shadow-lg hover:shadow-xl), rounded corners (rounded-xl), borders
  - Buttons: Include hover states, transitions, and proper padding (px-6 py-3)
  - Gradients: Use for important sections (from-blue-600 to-blue-700)
  - Status Badges: Consistent styling with rounded-full, px-3 py-1, shadow-lg
- **Color Consistency**: Always use the defined color system or inline styles for consistency

## UI/UX Patterns
- **Filter Behavior**: 
  - Simple filters (search, quick buttons) apply immediately
  - Complex filters (multi-select, ranges) show selection state but require "Apply" button
  - Always provide visual feedback for active filters (badges, highlights, counts)
  - Include "Clear All" option when any filters are active

## External Resources
- **Always validate external URLs** (images, APIs) before using
- Provide fallback options for missing resources
- Test with `curl -I [URL]` to verify availability
- For demo data, prefer stable image sources or have fallbacks

## 📱 Mobile Web Development

⚠️ **CRITICAL**: Before writing ANY component code:
1. First read `web-app/MOBILE_BEST_PRACTICES.md`
2. Use the patterns there for ALL UI work
3. Test touch targets (44px minimum)
4. Check contrast on mobile screens

This contains battle-tested patterns that will save hours of debugging:
- Touch target sizing (44px minimum)
- Safe area handling for iPhone notch/bottom bar
- Viewport height fixes (100vh vs 100dvh)
- Tailwind mobile-first patterns
- Common pitfalls and solutions

## Development Workflow Guide
- **Missing API Endpoint**: 
  1. Create route in `/web-app/src/app/api/v1/`
  2. Return mock data matching expected format
  3. Log requests for debugging
- **Styling Not Working**:
  1. Check if Tailwind is loading (inspect element)
  2. Use inline styles as immediate fix
  3. Ensure proper Tailwind config exists
- **Module Resolution Errors**:
  1. Check if dependency exists in package.json
  2. Remove external service imports
  3. Create mock implementation
- **Navigation/State Issues**:
  1. Check localStorage for auth tokens
  2. Ensure API error handling doesn't crash the page
  3. Always provide fallback navigation options

## Quick Fix Patterns
When user reports common issues, follow these patterns:

### "Button/UI element is hard to view"
1. Add inline styles with explicit colors
2. Add borders for definition
3. Add shadow/hover effects
4. Increase font weight

### "Getting module not found error"
1. Check the import path
2. Remove external dependencies
3. Create mock implementation
4. Update imports to use mock

### "Page crashes on navigation"
1. Check auth state persistence
2. Add try-catch in data loading
3. Provide fallback data
4. Fix any API endpoint issues

### "API returns 500 error"
1. Check if endpoint exists
2. Verify query parameter handling
3. Add proper error responses
4. Fall back to demo data

### "Template shows 'broken' status"
1. Check individual template API endpoint (`/api/v1/document-templates/{ID}`)
2. Verify template metadata in database
3. Check file paths in template registry
4. Ensure PDF file exists in templates directory

### "PDF generation fails with encryption error"
1. Use `PDFDocument.load(buffer, { ignoreEncryption: true })` for CAR forms
2. CAR forms appear encrypted but don't require passwords
3. This is safe for read-only operations and form filling

### "Build fails with 'Module not found'"
1. Check if package exists in package.json
2. Install missing dependency: `npm install {package-name}`
3. Restart dev server after installation
4. Clear .next cache if issues persist

## Issue Priority Framework
**P0 - Demo Blockers**: Anything that breaks ML81234567 property workflow
**P1 - Core Features**: Template selection, document generation, navigation
**P2 - Polish**: UI enhancements, animations, visual improvements
**P3 - Future**: Additional templates, advanced features

## Common Missing Dependencies
- `lucide-react` - Icons for UI components
- `@supabase/supabase-js` - Database integration (not yet configured)
- `pdf-lib` - PDF manipulation
- `handlebars` - Template rendering

Quick install:
```bash
npm install lucide-react pdf-lib handlebars
```

## Dependency Management Patterns

### When You Encounter "Module not found"
1. **Check if it's in package.json**: `npm list [package-name]`
2. **If missing, install it**: `npm install [package-name]`
3. **If it's a type definition**: `npm install -D @types/[package-name]`
4. **Common missing packages in this project**:
   - `lucide-react` - UI icons
   - `pdf-lib` - PDF manipulation
   - `handlebars` - Template rendering

### Before Using Any Package
1. Check if it's already installed: `npm list [package]`
2. Check if similar functionality exists in current packages
3. Prefer packages already in the ecosystem (Next.js built-ins, etc.)

## Environment Validation Commands
```bash
# Check if all required packages are installed
npm list lucide-react pdf-lib handlebars

# Verify API endpoints are responding
curl http://localhost:3000/api/v1/document-templates

# Test template file access
ls -la web-app/src/templates/01-buyers-offer-negotiation/CA_RPA/
```

## Development Testing Checklist
Before marking any feature as "complete":
- [ ] API endpoints return expected response format
- [ ] UI components render without console errors
- [ ] Mobile responsiveness tested (DevTools mobile view)
- [ ] Demo data flows correctly through all views
- [ ] Error states handled gracefully
- [ ] Authentication persists across navigation

## Template Implementation Checklist
When implementing a new document template, follow this checklist:

### 1. File Structure Validation
- [ ] PDF file exists in correct category directory
- [ ] metadata.json includes CAR form number and dependencies
- [ ] fields.json defines all form fields with proper types
- [ ] pdf-fields.json has coordinate mappings for all fields
- [ ] signatures.json (NOT signature-fields.json) with signature locations

### 2. Template Registration
- [ ] Added to TEMPLATE_REGISTRY in `/src/templates/index.ts`
- [ ] Set `implemented: true`
- [ ] Correct category and sortOrder assigned
- [ ] CAR form number included

### 3. API Integration
- [ ] Template appears in `/api/v1/document-templates` response
- [ ] Individual template endpoint works: `/api/v1/document-templates/{ID}`
- [ ] Added to VALID_TEMPLATE_CODES in generate route
- [ ] Template path configured in document generation logic

### 4. Testing & Quality
- [ ] Test document generation with sample data
- [ ] Verify all fields populate correctly on PDF
- [ ] Check field coordinate accuracy (no overlapping text)
- [ ] Confirm generation time <1.5s
- [ ] Test with edge cases (long text, special characters)
- [ ] Verify template appears in UI selection

### 5. Performance Verification
- [ ] Log generation time with `console.time()`
- [ ] Test with multiple concurrent requests
- [ ] Monitor memory usage during generation
- [ ] Verify Supabase Storage upload succeeds

## Session Handoff Checklist
At the end of each session, document:
1. **Last working state** - what was confirmed working
2. **Active debugging** - what was being investigated
3. **Next immediate step** - specific first action for next session
4. **Blockers identified** - known issues to address
5. **Test commands** - specific commands to verify status

## Git Workflow Patterns

### Large-Scale Cleanup
When performing major cleanups:
1. **Pre-cleanup**: Document what will be removed and why
2. **Cleanup Commands**:
   ```bash
   # Remove system files
   find . -name ".DS_Store" -delete
   find . -name "*.log" -delete
   find . -name "*.tmp" -delete
   
   # Clean build artifacts
   rm -rf web-app/.next web-app/.turbo web-app/node_modules/.cache
   ```
3. **Commit Message Format** for cleanups:
   ```
   🧹 Major cleanup: [Brief description]
   
   Removed files:
   - [List major removals]
   
   Environment fixes:
   - [List fixes]
   
   Current status:
   - [List what's working]
   ```

## 🔐 Security & Production Considerations

### Document Storage Security
**Current**: PDFs saved to `/public/generated-documents/` ⚠️
**Recommended**: Move to Supabase Storage with proper access controls
```typescript
// Recommended approach
const { data, error } = await supabase.storage
  .from('documents')
  .upload(`${transactionId}/${documentId}.pdf`, pdfBuffer);
```

### PDF Encryption Handling
- CAR forms use encryption but don't require passwords
- Use `ignoreEncryption: true` for reading and form filling
- Monitor for forms with stronger encryption that may need different handling

### Performance Monitoring
- Current PDF generation: ~300ms ✅
- Target for production: <3 seconds for complex forms
- Monitor memory usage for concurrent PDF operations

## 📊 Phase 2 Development Roadmap

### Current Status (2025-06-27)
- **Forms Implemented**: 2 of 50+ (CA_RPA ✅, BUYER_COUNTER_OFFER ✅)
- **Performance**: ~1s generation time (exceeding <1.5s target)
- **Architecture**: Proven scalable pattern established

### Priority 1: Scale to 6 Working Forms
1. **Next Form**: SELLER_COUNTER_OFFER (Category 03)
   - Follow proven Buyer Counter Offer pattern
   - Expected timeline: <2 hours
2. **Then Add** (High-frequency forms):
   - REQUEST_FOR_REPAIR (Category 01)
   - BUYER_CONTINGENCY_REMOVAL (Category 02)
   - LEAD_PAINT_DISCLOSURE (Category 01 or 06)

### Priority 2: Field Mapping Tool Development
- **Goal**: Accelerate coordinate mapping for remaining 44+ forms
- **Approach**: Interactive UI to click PDF positions
- **Output**: Generate pdf-fields.json automatically
- **Benefit**: Reduce form implementation time from hours to minutes

### Priority 3: Document Management UI
- **Features**:
  - List view of generated documents per transaction
  - Filter by template type, date, status
  - Download and preview capabilities
- **API**: Enhance GET /api/v1/documents with filtering

### Success Metrics
- [ ] 6 total forms working with consistent field accuracy
- [ ] Maintain <1.5s generation time as forms scale
- [ ] Scalable development process proven
- [ ] Field mapping tool operational
- [ ] Document management UI complete

## 📊 Strategic Roadmap (Updated)

### Phase 1: Foundation ✅ COMPLETE
- ✅ CA_RPA workflow complete
- ✅ BUYER_COUNTER_OFFER added
- ✅ Scalable architecture proven
- ✅ Mobile responsiveness implemented
- ✅ Security migration (Supabase Storage)

### Phase 2: Scale to Market-Ready (Current)
- [ ] 4 Additional Priority Forms (Target: 6 total)
- [ ] Field Mapping Tool
- [ ] Document Management UI
- [ ] Performance optimization

### Phase 3: Production Features
- [ ] Remaining 44+ forms
- [ ] E-signature integration
- [ ] ARIA AI integration
- [ ] Advanced workflow automation

---
*For detailed context, always check the command center first*
*Last Updated: 2025-06-26 20:44*
