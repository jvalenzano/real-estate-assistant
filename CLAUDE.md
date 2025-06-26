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
- ✅ **Fixed**: Login page styling issues resolved with inline styles
- ✅ **Fixed**: Authentication migrated to Next.js API routes
- ✅ **Fixed**: Properties page navigation and API integration
- ✅ **Fixed**: Document service Supabase import removed
- 🚧 **Current**: Document template selection and generation flow
- 📋 **Next**: Debug individual template API endpoints

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
- **CA_RPA (California Residential Purchase Agreement)** - Fully implemented as primary template
- **Template Service Architecture**:
  - Handlebars-based template rendering
  - Dynamic field validation and mapping
  - E-signature integration ready (mock provider included)
  - Storage integration planned (currently using mock storage)
  - Note: Supabase client not yet configured - use mock implementations
- **Form Categories**:
  1. Buyer's Offer and Negotiation (8 forms)
  2. Contingency Removal and Closing (5 forms)
  3. Escrow and Contingency Stage (6 forms)
  4. Final Disclosures & Delivery (4 forms)
  5. Forms Used in Specific Situations (5 forms)
  6. Listing Stage (8 forms)

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

# Document Generation Testing
curl -X POST http://localhost:3001/api/v1/documents/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"documentType": "rpa", "propertyId": "ML81234567"}'
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
- **WCAG AA Compliance**: All text must meet minimum contrast ratios
  - Normal text: 4.5:1 contrast ratio
  - Large text (18pt+): 3:1 contrast ratio
  - Use these specific colors:
    - Primary text: #111827 (almost black)
    - Secondary text: #374151 (dark gray)
    - Disabled/tertiary: #6B7280 (medium gray)
    - Never use light grays (#9CA3AF or lighter) for body text
- **Template Development**:
  - Use Handlebars (.hbs) for all document templates
  - Include proper helpers for currency and date formatting
  - Separate template structure: template.hbs, fields.json, signatures.json, metadata.json
  - All templates must support both HTML preview and PDF generation
- **Error Handling Patterns**:
  - API Routes: Always return consistent { success: boolean, data?: T, error?: string } format
  - Module Not Found: Check imports, remove external dependencies, use mock implementations
  - Navigation Errors: Ensure authentication state persists, fall back to demo data
  - Styling Issues: Use inline styles as fallback when Tailwind classes don't apply
  - Always log errors with context for debugging

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

## Session Handoff Checklist
At the end of each session, document:
1. **Last working state** - what was confirmed working
2. **Active debugging** - what was being investigated
3. **Next immediate step** - specific first action for next session
4. **Blockers identified** - known issues to address
5. **Test commands** - specific commands to verify status

---
*For detailed context, always check the command center first*
*Last Updated: 2025-06-26 00:56*
