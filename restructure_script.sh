#!/bin/bash

# RealeAgent Project Documentation Restructure Script
# This script reorganizes your documentation for optimal AI tool integration

set -e  # Exit on any error

echo "🚀 Starting RealeAgent documentation restructure..."

# Create backup of existing files
echo "📦 Creating backup..."
mkdir -p .backup/$(date +%Y%m%d_%H%M%S)
cp -r .cursor .backup/$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true
cp CLAUDE.md .backup/$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true

# Create new directory structure
echo "📁 Creating new directory structure..."

# Enhanced .cursor directory structure
mkdir -p .cursor/{project-board,knowledge-base,ai-instructions}
mkdir -p docs/{project-management,quick-reference}

# Move and reorganize existing content
echo "🔄 Reorganizing existing files..."

# Backup existing scratchpad content
if [ -f ".cursor/scratchpad.md" ]; then
    cp .cursor/scratchpad.md .cursor/knowledge-base/legacy-scratchpad.md
fi

# Create new unified command center
echo "📋 Creating unified command center..."

cat > .cursor/project-board/command-center.md << 'EOF'
# RealeAgent Development Command Center

*Last Updated: $(date +"%Y-%m-%d %H:%M")*
*Active Developer: [Your Name]*
*Sprint: Week 2 of 3*

## 🎯 Current Objective
Building React Native mobile app with property search and document generation (Phase 5)

## 🚨 Blockers & Decisions Needed
- [ ] Choose between React Navigation v6 vs Expo Router
- [ ] Finalize UI component library (React Native Paper vs NativeBase)
- [ ] Confirm document preview implementation approach

## 📋 Active Tasks (AI-Actionable)

### 🔥 Working On Now
**Task 5.1: React Native App Setup** (Priority: P0)
- [ ] Initialize Expo project structure ⏱️ 1h
- [ ] Configure navigation (React Navigation) ⏱️ 1h  
- [ ] Setup authentication context ⏱️ 2h
- [ ] Implement login screen UI ⏱️ 2h

**Context for AI**: Focus on /mobile-app directory. Reference existing JWT auth from api-server/routes/auth.ts

### ⏳ Up Next (This Week)
**Task 5.2: Property Search Implementation** (Priority: P0)
- [ ] Property search screen with filters ⏱️ 3h
- [ ] Property card components ⏱️ 2h
- [ ] Search results optimization ⏱️ 1h

**Task 5.3: Property Details & Document Generation** (Priority: P0)
- [ ] Property details screen ⏱️ 2h
- [ ] Document generation integration ⏱️ 2h
- [ ] PDF preview functionality ⏱️ 2h

### 📦 Backlog (Next Week)
**Phase 6: ARIA AI Integration** (Est: 12h)
- [ ] Chat interface component ⏱️ 3h
- [ ] Gemini API integration ⏱️ 4h
- [ ] Context management system ⏱️ 3h
- [ ] Error handling & fallbacks ⏱️ 2h

## ⚡ Key Metrics Dashboard

| Metric | Target | Current | Status | Last Updated |
|--------|---------|---------|--------|--------------|
| Property Search API | <300ms | 2.8ms | ✅ | 2025-01-15 |
| Document Generation | <3s | 2-3s | ✅ | 2025-01-15 |
| PDF Rendering | <2s | 1-2s | ✅ | 2025-01-15 |
| API Response Times | <50ms | <50ms | ✅ | 2025-01-15 |

## 🤖 AI Assistant Instructions

### For Cursor IDE
- **Current Focus**: /mobile-app directory, React Native components
- **Reference Files**: Check api-server/src/routes/*.ts for API patterns
- **Styling**: Use React Native Paper components for consistency
- **Context**: Building mobile interface for existing backend APIs

### For Claude Code  
- **Active Branch**: feature/mobile-app-setup
- **Test Commands**: `npm run dev:mobile` for Expo dev server
- **Integration Points**: JWT auth, property search API, document generation
- **Update This File**: When completing tasks, move to "Done This Week"

### Context Preservation
- Backend APIs are complete and tested ✅
- Demo property ML81234567 is the golden path
- Authentication uses JWT with 24h expiry
- All document generation uses Handlebars templates

## 🔄 Done This Week

### ✅ Completed Tasks
- [x] **Backend Foundation Complete** - All API endpoints operational
- [x] **Authentication System** - JWT tokens, demo accounts, session management  
- [x] **Property Search** - 30 demo properties, advanced filtering, <3ms response
- [x] **Document Generation** - RPA templates, PDF generation, field customization

### 📊 Week 2 Progress
- **Velocity**: 32h estimated vs 28h actual (88% accuracy)
- **Blockers Resolved**: 3 (Puppeteer config, JWT middleware, template rendering)
- **On Track**: Yes - mobile app development starting on schedule

## 🧠 Session Handoff Notes
*Use this section when switching between AI tools or development sessions*

**Last Session**: 
- Completed: Backend API testing and documentation
- Working On: Planning mobile app architecture
- Next: Initialize Expo project and navigation

**Current Context**:
- All backend APIs tested and working
- Ready to build mobile interface
- Demo flow defined: Login → Search → Generate → Preview

**Files to Reference**:
- `/api-server/src/routes/*.ts` - API endpoint patterns
- `/demo-data/properties.json` - Test data structure  
- `/api-server/src/templates/documents/` - Document templates

## 🎮 Quick Commands

```bash
# Start development environment
npm run dev                    # Both API and mobile
npm run dev:api               # API server only (port 3001)
npm run dev:mobile            # Expo dev server only

# Test API endpoints
curl http://localhost:3001    # Health check
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"agent@demo.com","password":"demo123"}'

# Mobile app commands  
cd mobile-app
npm start                     # Expo dev server
npm run android              # Android emulator
npm run ios                  # iOS simulator
```

---
*This file is the single source of truth for current development status*
*Update after each significant milestone or daily standups*
EOF

# Create AI instructions file
cat > .cursor/ai-instructions/cursor-context.md << 'EOF'
# Cursor IDE Context & Instructions

## Project Overview
RealeAgent is a 3-week prototype for an AI-powered real estate transaction assistant. We're currently in Week 2, building the React Native mobile app that interfaces with our completed backend APIs.

## Current Development Phase
**Phase 5: React Native Mobile App** (Week 2 of 3)
- Building mobile interface for property search and document generation
- Integrating with existing Node.js/Express backend
- Preparing for ARIA AI integration in Phase 6

## File Structure Context

### Key Directories
- `/api-server/` - Complete Node.js backend with TypeScript
- `/mobile-app/` - React Native app (current focus)
- `/shared/` - Shared TypeScript types and constants
- `/demo-data/` - Mock data for demos
- `.cursor/project-board/` - Live project management

### Important Files
- `.cursor/project-board/command-center.md` - Current tasks and status
- `api-server/src/routes/*.ts` - API endpoints (reference for integration)
- `mobile-app/src/` - Mobile app source (current work area)
- `shared/types/` - TypeScript interfaces

## Coding Standards

### TypeScript
- Strict mode enabled
- No 'any' types - use 'unknown' with type guards
- Explicit return types for functions
- Interface over type declarations

### React Native
- Functional components only
- Use React Native Paper for UI components
- Keep components under 80 lines
- Separate styles into styles.ts files
- Use TypeScript for all components

### File Naming
- kebab-case for directories: `property-search/`
- PascalCase for components: `PropertyCard.tsx`
- camelCase for utilities: `authUtils.ts`
- Descriptive names: `usePropertySearch.ts` not `useHook.ts`

## API Integration Patterns

### Authentication
```typescript
// Use existing JWT pattern from backend
const token = await authService.login(email, password);
// Store in secure storage, not AsyncStorage
```

### API Calls
```typescript
// Base URL: http://localhost:3001/api/v1
// Include JWT in Authorization header
// Handle loading states explicitly
// Use proper error boundaries
```

### Data Flow
```
Mobile App → API Server → Mock Data → Response → Mobile UI
```

## Demo Requirements
- **Golden Path**: ML81234567 property search and RPA generation
- **Performance**: <300ms response times, 60fps animations
- **Accounts**: agent@demo.com / demo123 for testing
- **Mobile-First**: Touch-optimized, native feel

## Common Commands
```bash
# Current development
npm run dev:mobile           # Start Expo dev server
npm run dev:api             # Start backend (if needed)

# Mobile specific
cd mobile-app && npm start  # Expo dev server
cd mobile-app && npm run android  # Android emulator
```

## Current Priorities
1. **Expo Project Setup** - Navigation, authentication context
2. **Login Screen** - JWT integration with backend
3. **Property Search** - List view with API integration
4. **Property Details** - Detail view with document generation

## Reference Files
- Check `api-server/src/routes/auth.ts` for authentication patterns
- Reference `api-server/src/routes/properties.ts` for search API
- Use `demo-data/properties.json` for understanding data structure
- Follow patterns in `api-server/src/services/` for service layer

---
*Updated automatically from command-center.md*
EOF

# Create knowledge base files
cat > .cursor/knowledge-base/decisions.md << 'EOF'
# Technical Decision Records

## DR-001: In-Memory Storage for Demo (2025-01-10)
**Status**: Implemented ✅  
**Decision**: Use in-memory storage instead of persistent database  
**Rationale**: Perfect for demo scenarios, enables instant resets, no database setup complexity  
**Alternatives Considered**: SQLite, PostgreSQL, Supabase  
**Impact**: Enables rapid demo cycles, data resets for presentations  

## DR-002: JWT Authentication (2025-01-11)
**Status**: Implemented ✅  
**Decision**: Implement JWT tokens with 24h expiry  
**Rationale**: Production-ready auth pattern, stateless, mobile-friendly  
**Alternatives Considered**: Session cookies, OAuth  
**Impact**: Secure mobile authentication, easy API integration  

## DR-003: Puppeteer for PDF Generation (2025-01-12)
**Status**: Implemented ✅  
**Decision**: Use Puppeteer for HTML-to-PDF conversion  
**Rationale**: High-quality output, full CSS support, professional documents  
**Alternatives Considered**: PDFKit, jsPDF, external services  
**Impact**: Professional-grade RPA documents, 1-2 second generation time  

## DR-004: React Native Paper UI Library (2025-01-15)
**Status**: Pending 🔄  
**Decision**: [To be decided]  
**Options**: React Native Paper vs NativeBase vs custom components  
**Criteria**: Material Design compliance, demo aesthetics, development speed  
**Next Steps**: Prototype login screen with both libraries  

## DR-005: Navigation Library (2025-01-15)
**Status**: Pending 🔄  
**Decision**: [To be decided]  
**Options**: React Navigation v6 vs Expo Router  
**Criteria**: Expo compatibility, TypeScript support, demo flow requirements  
**Next Steps**: Test both with authentication flow  

---
*Add new decisions as development progresses*
EOF

# Create quick reference
cat > docs/quick-reference/api-endpoints.md << 'EOF'
# API Endpoints Quick Reference

## Base URL
```
http://localhost:3001/api/v1
```

## Authentication
```http
POST /auth/login
Content-Type: application/json
{
  "email": "agent@demo.com",
  "password": "demo123"
}

POST /auth/logout
Authorization: Bearer <token>

GET /auth/me
Authorization: Bearer <token>

POST /auth/demo/reset
# Resets all demo data
```

## Properties
```http
GET /properties/search?q=ML81234567
Authorization: Bearer <token>

GET /properties/featured
Authorization: Bearer <token>

GET /properties/{id}
Authorization: Bearer <token>

POST /properties/{id}/favorite
Authorization: Bearer <token>
```

## Documents
```http
POST /documents/generate
Authorization: Bearer <token>
Content-Type: application/json
{
  "propertyId": "property-uuid",
  "offerPrice": 650000,
  "buyerName": "John Doe"
}

GET /documents/{id}
Authorization: Bearer <token>

GET /documents/{id}/preview
Authorization: Bearer <token>

GET /documents/{id}/pdf
Authorization: Bearer <token>
```

## Demo Accounts
- **Agent**: agent@demo.com / demo123
- **Broker**: broker@demo.com / demo123

## Demo Property
- **MLS#**: ML81234567 (Golden path for demos)
- **Address**: 123 Ocean View Drive, San Diego, CA
- **Price**: $595,000

---
*Backend API Status: Complete ✅*
EOF

# Create performance benchmarks
cat > docs/quick-reference/performance-metrics.md << 'EOF'
# Performance Metrics & Benchmarks

## Current Performance (as of 2025-01-15)

### API Response Times
| Endpoint | Target | Current | Status |
|----------|---------|---------|--------|
| Property Search | <300ms | 2.8ms | ✅ Excellent |
| Document Generation | <3s | 2-3s | ✅ On Target |
| PDF Rendering | <2s | 1-2s | ✅ On Target |
| Auth Login | <100ms | <50ms | ✅ Excellent |
| Health Check | <50ms | <10ms | ✅ Excellent |

### Mobile App Targets (Week 2 Goals)
| Metric | Target | Current | Status |
|--------|---------|---------|--------|
| App Launch | <2s | TBD | 🔄 Building |
| Property List Load | <1s | TBD | 🔄 Building |
| Search Responsiveness | <500ms | TBD | 🔄 Building |
| Navigation Smoothness | 60fps | TBD | 🔄 Building |

### Demo Flow Performance
1. **Login**: <2 seconds total
2. **Property Search**: <1 second to display results
3. **Document Generation**: <5 seconds end-to-end
4. **PDF Download**: <3 seconds total

## Monitoring Commands
```bash
# API performance testing
curl -w "@curl-format.txt" -s -o /dev/null http://localhost:3001/api/v1/properties/search?q=ML81234567

# Create curl-format.txt:
echo 'time_namelookup:  %{time_namelookup}\ntime_connect:     %{time_connect}\ntime_appconnect:  %{time_appconnect}\ntime_pretransfer: %{time_pretransfer}\ntime_redirect:    %{time_redirect}\ntime_starttransfer: %{time_starttransfer}\ntime_total:       %{time_total}\n' > curl-format.txt
```

---
*Update metrics weekly during development*
EOF

# Update the main CLAUDE.md file for Claude Code
cat > CLAUDE.md << 'EOF'
# CLAUDE.md - Claude Code Context

## Quick Status
**Current Phase**: React Native Mobile App Development (Week 2 of 3)  
**Active Directory**: `/mobile-app`  
**Main Focus**: Building property search and document generation mobile interface

## Project Command Center
📋 **Live Status**: `.cursor/project-board/command-center.md`  
🎯 **Current Tasks**: Building Expo app with authentication and property search  
🤖 **AI Context**: `.cursor/ai-instructions/cursor-context.md`  

## Architecture Overview
```
┌─ api-server/          # ✅ Complete - Node.js + Express + TypeScript
├─ mobile-app/          # 🚧 Current Focus - React Native + Expo  
├─ shared/              # 📦 Types and constants
└─ demo-data/           # 🎭 Mock data for demos
```

## Key Commands
```bash
# Development
npm run dev                    # Start both API and mobile
npm run dev:mobile            # Expo dev server only

# Mobile App (in /mobile-app)
npm start                     # Expo dev server
npm run android              # Android emulator
npm run ios                  # iOS simulator

# API Testing
curl http://localhost:3001    # Health check
```

## Critical Files for AI Context
1. **`.cursor/project-board/command-center.md`** - Live project status
2. **`api-server/src/routes/*.ts`** - API patterns to integrate with
3. **`demo-data/properties.json`** - Data structure reference
4. **`shared/types/index.ts`** - TypeScript interfaces

## Demo Requirements
- **Golden Path**: ML81234567 property → Generate RPA → Preview PDF
- **Accounts**: agent@demo.com / demo123
- **Performance**: <5 minutes end-to-end transaction
- **Mobile-First**: Touch-optimized, 60fps animations

## Development Standards
- TypeScript strict mode, no 'any' types
- React Native functional components only
- Components under 80 lines, separate styles
- JWT authentication with backend APIs
- Error boundaries and loading states

---
*For detailed context, always check the command center first*
*Last Updated: $(date +"%Y-%m-%d")*
EOF

# Create updated .cursorrules
cat > .cursorrules << 'EOF'
# Cursor IDE Rules for RealeAgent

## Project Context
You are working on RealeAgent, a 3-week prototype for AI-powered real estate transactions. Currently in Week 2, building React Native mobile app.

## Always Check First
1. `.cursor/project-board/command-center.md` - Current tasks and priorities
2. `.cursor/ai-instructions/cursor-context.md` - Development context and standards

## Current Focus
- **Directory**: `/mobile-app` - React Native + Expo development
- **Integration**: Connect with existing `/api-server` APIs
- **Standards**: TypeScript strict, functional components, React Native Paper UI

## Key Rules
- Reference existing API patterns in `/api-server/src/routes/`
- Use demo property ML81234567 for testing
- Maintain <300ms response time targets
- Follow mobile-first, touch-optimized design
- Update command-center.md when completing tasks

## Quick Commands
- `npm run dev:mobile` - Start Expo dev server
- `npm run dev:api` - Start backend if needed
- Check `demo-data/` for test data structure
EOF

echo "✅ Documentation restructure complete!"
echo ""
echo "📁 New structure created:"
echo "   .cursor/project-board/command-center.md    # 🎯 Main development hub"
echo "   .cursor/ai-instructions/cursor-context.md  # 🤖 AI coding context"
echo "   .cursor/knowledge-base/decisions.md        # 🧠 Technical decisions"
echo "   docs/quick-reference/                      # 📚 API docs & metrics"
echo "   CLAUDE.md                                  # 🔄 Updated for Claude Code"
echo ""
echo "🚀 Next steps:"
echo "   1. Review the new command-center.md file"
echo "   2. Update current task status"
echo "   3. Start mobile app development with clear AI context"
echo ""
echo "💡 The command center is now your single source of truth!"
echo "   Both Cursor IDE and Claude Code will reference this for context."