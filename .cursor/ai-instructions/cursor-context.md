# Cursor IDE Context & Instructions

## Project Overview
RealeAgent is a 3-week prototype for an AI-powered real estate transaction assistant. We're currently in Week 2, building the React Native mobile app that interfaces with our completed backend APIs.

## Current Development Phase
**Phase 5: React Native Mobile App** (Week 2 of 3)
- ✅ Mobile app foundation complete with authentication
- 🔄 Building property search UI and card components (Task 5.2)
- Next: Property details and document generation (Task 5.3)
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
- Expo SDK 53 with React Native 0.79.4
- React 19.0.0 for latest features

### File Naming
- kebab-case for directories: `property-search/`
- PascalCase for components: `PropertyCard.tsx`
- camelCase for utilities: `authUtils.ts`
- Descriptive names: `usePropertySearch.ts` not `useHook.ts`

## API Integration Patterns

### Authentication
```typescript
// JWT authentication fully integrated
const { token, user } = await authService.login(email, password);
// Token stored in AsyncStorage with proper key management
// API responses wrapped in { success, data, meta } structure
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
1. ✅ **Expo Project Setup** - Complete with SDK 53
2. ✅ **Login Screen** - Working on web and mobile
3. 🔄 **Property Search** - Building card components and filters
4. **Property Details** - Detail view with document generation

## Reference Files
- Check `api-server/src/routes/auth.ts` for authentication patterns
- Reference `api-server/src/routes/properties.ts` for search API
- Use `demo-data/properties.json` for understanding data structure
- Follow patterns in `api-server/src/services/` for service layer

---
*Updated automatically from command-center.md*
