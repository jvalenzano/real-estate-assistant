# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RealeAgent is a 3-week prototype for an AI-powered real estate transaction assistant. The goal is to reduce transaction times from 2-3 hours to under 5 minutes by automating property search, document generation (RPA - Residential Purchase Agreement), and digital signatures.

## Current Development Focus

### Active Task: API Server Foundation (Task 1.1)
- [ ] Create basic Express server with TypeScript
- [ ] Set up src/server.ts listening on port 3001  
- [ ] Add GET "/" route returning { message: "RealeAgent API" }
- [ ] Configure TypeScript with tsconfig.json
- [ ] Verify with: curl http://localhost:3001

### Next Tasks Queue:
1. TypeScript configuration refinement
2. Middleware setup (CORS, JSON parsing, error handling)
3. Environment variables (.env) and Supabase connection
4. Basic auth endpoints (login, demo account reset)
5. Property search API implementation

### Progress Tracking:
See `.cursor/scratchpad.md` for detailed progress and lessons learned.

## Commands

### Development
- `npm run dev` - Start both API server and mobile app concurrently
- `npm run dev:api` - Start API server only (runs on port 3001)
- `npm run dev:mobile` - Start Expo mobile app only
- `npm install:all` - Install dependencies for all workspaces
- `npm run clean` - Remove all node_modules directories

### API Server (in /api-server)
- `npm run dev` - Development server with nodemon + ts-node
- `npm run build` - Compile TypeScript
- `npm run start` - Production server
- `npm test` - Run tests (when implemented)

### Mobile App (in /mobile-app)
- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web

### Quick Testing Commands
```bash
# Test API endpoint
curl http://localhost:3001

# Test with JSON payload
curl -X POST http://localhost:3001/api/v1/properties/search \
  -H "Content-Type: application/json" \
  -d '{"query": "ML81234567"}'

# Watch API logs
tail -f api-server/logs/dev.log
```

## Architecture

### Monorepo Structure
- `/api-server` - Node.js + Express backend with TypeScript
- `/mobile-app` - React Native + Expo frontend
- `/shared` - Shared TypeScript types and constants
- `/demo-data` - Mock data for investor demos (properties.json, users.json)
- `/.cursor/rules` - AI coding guidelines per technology

### Tech Stack
- **Frontend**: React Native + Expo (mobile-native, touch-first design)
- **Backend**: Node.js + Express + TypeScript
- **Database**: Supabase (PostgreSQL + Auth + Realtime)
- **AI**: Google Gemini 2.0 Flash (ARIA co-pilot)
- **E-Signatures**: DocuSign (sandbox for prototype)
- **PDF Generation**: Puppeteer

### Core Demo Flow
Property Search → Auto-Generate RPA → Digital Signature → Transaction Management

### Key Performance Targets
- Property search: <300ms response time
- Document generation: <3 seconds
- PDF rendering: <2 seconds
- End-to-end transaction: <5 minutes
- All animations: 60fps

## Development Guidelines

### Code Standards
- Use TypeScript for all code (strict mode enabled)
- Functional components only in React Native
- Components should be under 80 lines
- Handle loading states explicitly
- Error boundaries for all screens
- Descriptive variable names with auxiliary verbs (isLoading, hasError)
- Early returns to reduce nesting

### File Organization
```
// React Native component structure
components/
  property-card/
    index.tsx        // Component logic
    styles.ts        // Styles separated
    types.ts         // Component-specific types

// API route structure  
routes/
  properties/
    index.ts         // Route definitions
    handlers.ts      // Request handlers
    validators.ts    // Input validation
```

### TypeScript Patterns
```typescript
// Use interfaces over types
interface User {
  id: string;
  email: string;
  role: 'agent' | 'broker' | 'admin';
}

// Explicit return types
const searchProperties = async (query: string): Promise<Property[]> => {
  // implementation
};

// No 'any' - use 'unknown' with type guards
const processData = (data: unknown): ProcessedData => {
  if (!isValidData(data)) {
    throw new Error('Invalid data format');
  }
  return data as ProcessedData;
};
```

### Demo-First Approach
- Prioritize impressive demo scenarios over edge cases
- Use actual integrations (DocuSign sandbox) not mocks
- Focus on the happy path: ML81234567 property demo
- Preload demo data for instant responses
- Cache everything for the golden path

### API Design Patterns

#### Endpoint Structure
```
POST   /api/v1/auth/login
GET    /api/v1/properties/search?q={query}
GET    /api/v1/properties/{id}
POST   /api/v1/documents/generate
PATCH  /api/v1/documents/{id}/fields
POST   /api/v1/aria/chat
```

#### Response Format
```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2025-01-15T10:00:00Z",
    "version": "1.0"
  }
}
```

#### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "PROPERTY_NOT_FOUND",
    "message": "Property with MLS# ML81234567 not found",
    "details": {}
  },
  "meta": {
    "timestamp": "2025-01-15T10:00:00Z",
    "version": "1.0"
  }
}
```

### Environment Variables
```env
# .env.example
NODE_ENV=development
PORT=3001

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# AI
GEMINI_API_KEY=your_gemini_key

# DocuSign
DOCUSIGN_INTEGRATION_KEY=your_integration_key
DOCUSIGN_USER_ID=your_user_id
DOCUSIGN_ACCOUNT_ID=your_account_id
```

### Key Demo Data
- Demo account: agent@demo.com / demo123
- Golden path property: ML81234567
- Demo scenarios documented in /docs/ai-context/project-overview.md
- 30 test properties in /demo-data/properties.json

## AI Integration (ARIA)

ARIA is the AI co-pilot integrated throughout the workflow using Google Gemini 2.0 Flash. 

### Key Integration Points:
- Property search assistance
- Document field suggestions
- Transaction status explanations
- Workflow guidance

### Function Calling Tools:
```javascript
const ariaTools = [
  "searchProperties",
  "generateDocument", 
  "checkTransactionStatus",
  "explainNextSteps"
];
```

## Testing Strategy

### Test Categories:
1. **Unit Tests**: Individual functions and utilities
2. **Integration Tests**: API endpoints with mocked DB
3. **E2E Tests**: Full demo scenarios
4. **Performance Tests**: Response time validation

### Demo Test Scenarios:
```bash
# Happy path test
npm run test:demo:happy-path

# Performance benchmark
npm run test:performance

# Full demo suite
npm run test:demo:all
```

## Debugging Tips

### Common Issues:
1. **Port already in use**: Kill process on port 3001
   ```bash
   lsof -ti:3001 | xargs kill -9
   ```

2. **TypeScript errors**: Check tsconfig.json paths
   ```bash
   npx tsc --noEmit
   ```

3. **Supabase connection**: Verify environment variables
   ```bash
   node -e "console.log(process.env.SUPABASE_URL)"
   ```

## Power User Workflows

### Quick Iteration:
```bash
# Terminal 1: API with auto-restart
cd api-server && npm run dev

# Terminal 2: TypeScript type checking  
cd api-server && npx tsc --watch --noEmit

# Terminal 3: Test runner
cd api-server && npm test -- --watch

# Terminal 4: Mobile app
cd mobile-app && npm start
```

### Git Workflow:
```bash
# Feature branch pattern
git checkout -b feature/api-setup
git add -A
git commit -m "feat: implement basic Express server"
git push origin feature/api-setup
```

### Performance Monitoring:
```javascript
// Add to server.ts for request timing
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });
  next();
});
```

## References
- [Cursor Rules](.cursor/rules/) - Technology-specific AI guidelines
- [API Patterns](docs/api/api-patterns.md) - Detailed API design
- [Project Overview](docs/ai-context/project-overview.md) - Full project context
- [Scratchpad](.cursor/scratchpad.md) - Current progress tracking

---
Last Updated: [Current Date]
Active Development Phase: API Server Foundation
```

This enhanced version includes:
- ✅ Your current development focus section
- ✅ Progress tracking reference
- ✅ Power user workflows
- ✅ Quick testing commands  
- ✅ TypeScript patterns and examples
- ✅ Error handling formats
- ✅ Debugging tips
- ✅ Performance monitoring
- ✅ Git workflow suggestions
- ✅ Environment variable template
