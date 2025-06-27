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
### ✅ Completed (As of 2025-06-27)
- **4 Working Forms** - CA_RPA, Buyer Counter Offer, Seller Counter Offer, Request for Repair
- **Supabase Storage Integration** - Secure document storage implemented
- **Professional Login UI** - Finalized and protected from regression
- **Performance Optimized** - PDF generation in 13-70ms (exceeding <1.5s target)
- **Scalable Architecture** - Proven 30-minute form implementation pattern
- **End-to-End Workflow** - Property → Template → Form → PDF → Storage

### 🎯 Current Focus
- Scale to 6 total forms (2 more needed)
- Manual UI testing and verification
- Production readiness assessment
- Field mapping tool development

### 📋 Next Immediate Steps
1. Implement 2 more priority forms to reach 6 total
2. Create field mapping tool for accelerated form development
3. Build document management UI for viewing generated PDFs
4. Comprehensive testing of all 4 working forms

### ✅ Performance Metrics
- Template API Response: ~10ms
- PDF Generation: 13-70ms ✅
- Storage Upload: ~200ms
- End-to-End Workflow: <30 seconds

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
- **Currently Implemented** (4 of 50+): 
  - ✅ CA_RPA (California Residential Purchase Agreement)
  - ✅ BUYER_COUNTER_OFFER (Buyer Counter Offer #1)
  - ✅ SELLER_COUNTER_OFFER (Seller Counter Offer)
  - ✅ REQUEST_FOR_REPAIR (Request for Repair)
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

## 🛡️ UI Protection Protocol
### Mandatory UI Change Verification Process

**CRITICAL**: Follow this protocol BEFORE making ANY UI changes to protected components:

1. **Pre-Change Verification**
   ```bash
   # Screenshot current state
   # Check git history for component
   git log -p src/app/(auth)/login/page.tsx  # For login page
   ```

2. **Change Authorization Checklist**
   - [ ] Is this a protected component? (Login page = YES)
   - [ ] Has user explicitly requested this specific change?
   - [ ] Have you confirmed the exact change with the user?
   - [ ] Is the change fixing a critical bug (not just preference)?

3. **Implementation Safety**
   - Make changes in small increments
   - Test each change visually before proceeding
   - Use browser DevTools to preview changes first
   - Keep original styling commented nearby for quick revert

4. **Post-Change Validation**
   - [ ] All buttons visible with proper contrast?
   - [ ] Mobile responsiveness maintained?
   - [ ] No transparent backgrounds on critical elements?
   - [ ] All interactive elements have proper hover states?

5. **Rollback Protocol**
   ```bash
   # If regression detected
   git checkout HEAD -- [affected-file]
   # Or revert specific commit
   git revert [commit-hash]
   ```

### Common UI Regression Triggers
- Applying Tailwind classes without checking existing styles
- Using transparent backgrounds on buttons/forms
- Removing inline styles that override Tailwind
- Modifying parent containers affecting child elements

## Response Priorities
1. **Functionality Issues**: Fix immediately, don't explain why it's broken
2. **Visual/UX Issues**: Implement the requested change, then explain
3. **Performance Issues**: Profile first, optimize based on data
4. **When debugging**: Add console.log statements to verify behavior

## 📊 Testing Guidelines
### When to Use Comprehensive vs. Targeted Testing

**Comprehensive Testing Required**:
- Protected UI components (login page, critical forms)
- Payment/transaction flows
- Document generation workflows
- Authentication state changes
- Database operations

**Targeted Testing Acceptable**:
- Adding new forms following established patterns
- Style updates to non-critical components
- Mock data additions
- Console log additions for debugging

### Testing Command Reference
```bash
# Form Implementation Testing
curl -X POST http://localhost:3000/api/v1/documents/generate \
  -H "Content-Type: application/json" \
  -d '{"templateCode": "[TEMPLATE_CODE]", "formData": {}, "transactionId": "test-123"}'

# Individual Template Testing
curl http://localhost:3000/api/v1/document-templates/[TEMPLATE_CODE]

# Performance Testing
time curl -X POST [endpoint]  # Basic timing
```

### Rapid Form Testing Pattern
1. **API First**: Test template endpoint
2. **Generation Test**: Minimal formData test
3. **UI Integration**: Check template appears in list
4. **Full Flow**: Only if above pass

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

## 🚨 Common Pitfalls & Solutions
### Known Issues with Proven Solutions

#### 1. **Transparent Background CSS Issue**
**Problem**: Buttons/forms become invisible due to transparent backgrounds
**Solution**:
```css
/* Always use explicit background colors */
background-color: white;  /* NOT bg-transparent */
background-color: rgb(59, 130, 246);  /* For primary buttons */
```
**Prevention**: Never use `bg-transparent` on interactive elements

#### 2. **Login Form Regression**
**Problem**: Login page UI breaks after "improvements"
**Solution**:
```bash
git checkout HEAD -- src/app/(auth)/login/page.tsx
```
**Prevention**: Follow UI Protection Protocol before ANY changes

#### 3. **PDF Generation Memory Leaks**
**Problem**: Memory usage grows with each PDF generation
**Solution**:
```typescript
// Always dispose of PDF objects
finally {
  // Cleanup code
  pdfDoc = null;
}
```

#### 4. **Template Not Found Errors**
**Problem**: Template exists but API returns 404
**Solution Checklist**:
- [ ] Template registered in `/src/templates/index.ts`?
- [ ] `implemented: true` in registry?
- [ ] Files in correct directory structure?
- [ ] Template code matches directory name?

#### 5. **Supabase Storage Failures**
**Problem**: Upload succeeds but returns undefined URL
**Solution**:
```typescript
// Always check both data and error
if (error || !data?.path) {
  console.error('Storage upload failed:', error);
  return null;
}
```

#### 6. **Form Coordinate Misalignment**
**Problem**: Text appears in wrong location on PDF
**Solution**:
- Use PDF reader with coordinate display
- Test with single field first
- Account for PDF origin (bottom-left)

#### 7. **State Loss on Navigation**
**Problem**: User logged out unexpectedly
**Solution**:
- Check localStorage persistence
- Verify auth token in API calls
- Add auth state logging

#### 8. **Style Classes Not Applying**
**Problem**: Tailwind classes have no effect
**Solution Priority**:
1. Use inline styles for immediate fix
2. Check Tailwind config includes file path
3. Verify dev server is running
4. Clear .next cache

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

## 🚀 30-Minute Form Implementation Template
### Proven Pattern for Rapid Form Addition

**Prerequisites**: Existing working form to copy (e.g., BUYER_COUNTER_OFFER)

#### Phase 1: Setup (5 minutes)
```bash
# 1. Copy existing template structure
cp -r web-app/src/templates/03-escrow-contingency/BUYER_COUNTER_OFFER \
      web-app/src/templates/01-buyers-offer-negotiation/REQUEST_FOR_REPAIR

# 2. Get the correct PDF
cp [source-pdf] web-app/src/templates/01-buyers-offer-negotiation/REQUEST_FOR_REPAIR/
```

#### Phase 2: Configuration (10 minutes)
1. **Update metadata.json**:
   ```json
   {
     "name": "Request for Repair",
     "carFormNumber": "RR",
     "implemented": true
   }
   ```

2. **Register in index.ts**:
   ```typescript
   {
     id: 'REQUEST_FOR_REPAIR',
     code: 'REQUEST_FOR_REPAIR',
     name: 'Request for Repair',
     category: TemplateCategoryKeys.BUYERS_OFFER_NEGOTIATION,
     implemented: true,
     sortOrder: 140
   }
   ```

3. **Quick fields.json** (copy and modify):
   - Keep structure, update field names
   - Focus on critical fields only

#### Phase 3: Coordinate Mapping (10 minutes)
1. Open PDF in coordinate-enabled reader
2. Map 5-10 critical fields first:
   ```json
   {
     "propertyAddress": { "x": 100, "y": 700, "fontSize": 10 },
     "buyerName": { "x": 100, "y": 650, "fontSize": 10 }
   }
   ```
3. Test with generation endpoint immediately

#### Phase 4: Testing (5 minutes)
```bash
# 1. Test template endpoint
curl http://localhost:3000/api/v1/document-templates/REQUEST_FOR_REPAIR

# 2. Test generation
curl -X POST http://localhost:3000/api/v1/documents/generate \
  -H "Content-Type: application/json" \
  -d '{"templateCode": "REQUEST_FOR_REPAIR", "formData": {"propertyAddress": "123 Test"}}'

# 3. Check generated PDF
ls -la web-app/src/services/generated-documents/
```

#### Success Metrics
- [ ] Template appears in API list
- [ ] Individual endpoint returns metadata
- [ ] Generation creates PDF file
- [ ] At least one field visible on PDF
- [ ] No console errors

#### Common Speedups
- Copy entire working template, don't start from scratch
- Use minimal fields for initial test
- Skip signatures.json if not needed immediately
- Test API before UI integration
- Use placeholder coordinates, refine later

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

## 📋 Session Handoff Checklist
### Structured Handoff Process for Session Continuity

**At Session End, Document**:

1. **✅ Last Confirmed Working State**
   ```markdown
   ## Working State (Session End YYYY-MM-DD HH:MM)
   - Forms implemented: [List with status]
   - API endpoints verified: [List]
   - UI components stable: [List]
   - Performance metrics: [Latest measurements]
   ```

2. **🔍 Active Debugging Context**
   ```markdown
   ## In Progress
   - Issue: [Description]
   - Last attempted fix: [What was tried]
   - Console output: [Key error messages]
   - Next hypothesis: [What to try next]
   ```

3. **🎯 Next Immediate Actions**
   ```markdown
   ## Next Session Start
   1. Run: [Specific command to verify state]
   2. Check: [Specific file or endpoint]
   3. Implement: [Specific next feature]
   ```

4. **⚠️ Known Issues/Blockers**
   ```markdown
   ## Blockers
   - [Issue]: [Impact] - [Proposed solution]
   - [Issue]: [Impact] - [Workaround in place]
   ```

5. **🧪 Verification Commands**
   ```bash
   # Copy-paste ready commands
   npm run dev  # Start Next.js
   curl http://localhost:3000/api/v1/document-templates  # Verify API
   # Add session-specific test commands
   ```

### Session Start Protocol
1. **Read Previous Handoff**: Check CLAUDE.md session section
2. **Run Verification Commands**: Ensure system state
3. **Review Todo List**: `TodoRead` to see pending tasks
4. **Check Git Status**: Understand uncommitted changes
5. **Continue or Pivot**: Based on current priorities

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
- **Forms Implemented**: 4 of 50+ (CA_RPA ✅, BUYER_COUNTER_OFFER ✅, SELLER_COUNTER_OFFER ✅, REQUEST_FOR_REPAIR ✅)
- **Performance**: 13-70ms generation time (far exceeding <1.5s target)
- **Architecture**: Proven scalable pattern - 30 minutes per form

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
*Last Updated: 2025-06-26 20:54*
