#!/bin/bash

# Claude Commands Setup Script - FIXED VERSION
# Creates essential Claude commands for AI-assisted development

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
CLAUDE_DIR=".claude"
COMMANDS_DIR="$CLAUDE_DIR/commands"

echo -e "${BLUE}🚀 Claude Commands Setup Script (Fixed)${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Create directories
echo -e "${GREEN}📁 Creating directories...${NC}"
mkdir -p "$COMMANDS_DIR"

# 1. Code Review Command
echo -e "${GREEN}📝 Creating code-review.md...${NC}"
cat > "$COMMANDS_DIR/code-review.md" << 'EOF'
# Code Review Assistant

You are performing a comprehensive code review. Focus on:

## Review Checklist
- **Security**: Check for potential vulnerabilities, exposed secrets, unsafe operations
- **Performance**: Identify bottlenecks, unnecessary re-renders, inefficient queries
- **Maintainability**: Code clarity, naming conventions, component size
- **Best Practices**: TypeScript usage, error handling, accessibility
- **Testing**: Identify areas needing tests, suggest test scenarios

## Output Format
### 🔴 Critical Issues
- [List any security or breaking issues]

### 🟡 Improvements
- [Performance optimizations and code quality improvements]

### ✅ Good Practices
- [Highlight well-written code patterns]

### 📝 Suggestions
- [Additional recommendations for maintainability]

## Technology-Specific Focus Areas
### Frontend (React/Next.js/Vue)
- Component architecture and reusability
- State management patterns
- Bundle size optimization
- Accessibility compliance

### Backend (Node.js/API Routes)
- API design and RESTful principles
- Error handling and validation
- Security best practices
- Database query optimization

### Mobile-First Development
- Touch target sizing (44px minimum)
- Responsive design patterns
- Performance on mobile devices
- Offline capability considerations

## Project Customization Notes
Adjust focus areas based on your tech stack:
- Next.js: App Router patterns, API routes, image optimization
- React: Hook usage, component lifecycle, state management
- TypeScript: Strict mode compliance, proper typing
- Database: Query optimization, indexing, security
EOF

# 2. Debug Helper Command
echo -e "${GREEN}📝 Creating debug-helper.md...${NC}"
cat > "$COMMANDS_DIR/debug-helper.md" << 'EOF'
# Debug Assistant

You are helping debug an issue. Follow this systematic approach:

## Debug Process
1. **Understand the Problem**
   - What was expected to happen?
   - What actually happened?
   - When did this start occurring?

2. **Gather Information**
   - Check browser console for errors
   - Review network tab for failed requests
   - Examine server logs
   - Test in different environments

3. **Isolate the Issue**
   - Identify the smallest reproducible case
   - Check recent changes in git history
   - Test individual components/functions

4. **Provide Solution**
   - Immediate fix for the symptom
   - Root cause analysis
   - Prevention strategies

## Common Debug Commands (Customize for your stack)
```bash
# Frontend Debugging
npm run dev | grep -i error
npm run build  # Check for build errors

# API Testing
curl -v http://localhost:3000/api/endpoint
curl -X POST -H "Content-Type: application/json" -d "{}" http://localhost:3000/api/endpoint

# File System
ls -la path/to/files/
find . -name "*.log" -type f

# Process Management
lsof -i :3000  # Check what is using port 3000
ps aux | grep node  # Find Node.js processes

# Cache Clearing
rm -rf node_modules/.cache
rm -rf .next  # Next.js specific
```

## Output Format
### 🔍 Root Cause
[Explain what is causing the issue]

### ⚡ Quick Fix
[Immediate solution to unblock development]

### 🛠️ Proper Solution
[Long-term fix that addresses the root cause]

### 🔒 Prevention
[How to prevent this issue in the future]

## Common Issue Categories
### Build/Compilation Issues
- Missing dependencies
- TypeScript errors
- Configuration problems
- Environment variable issues

### Runtime Issues
- Network request failures
- State management bugs
- Component lifecycle issues
- Memory leaks

### Performance Issues
- Slow page loads
- Inefficient re-renders
- Large bundle sizes
- Database query performance
EOF

# 3. Feature Implementation Command
echo -e "${GREEN}📝 Creating feature-implement.md...${NC}"
cat > "$COMMANDS_DIR/feature-implement.md" << 'EOF'
# Feature Implementation Assistant

You are implementing a new feature following project standards.

## Implementation Checklist
- [ ] **Plan Architecture**: Break down into components and services
- [ ] **TypeScript First**: Define interfaces and types
- [ ] **Mobile-First**: Start with mobile design, scale up
- [ ] **Error Handling**: Plan for failure scenarios
- [ ] **Testing Strategy**: Unit tests and integration tests
- [ ] **Documentation**: Update relevant docs

## Project-Specific Guidelines (Customize for your project)
### File Structure Template
```
src/
├── components/[feature]/
│   ├── index.ts
│   ├── [Feature].tsx
│   └── [Feature].test.tsx
├── services/
│   └── [feature].service.ts
├── types/
│   └── [feature].types.ts
└── hooks/ (if React)
    └── use[Feature].ts
```

### Styling Standards
- Use CSS framework consistently (Tailwind/Styled Components/CSS Modules)
- Follow accessibility guidelines (WCAG AA)
- Implement proper hover/focus states
- Use consistent spacing and typography
- Mobile-first responsive design

### API Standards
- Return consistent response format: `{ success: boolean, data?: T, error?: string }`
- Include proper error handling and status codes
- Use TypeScript for request/response types
- Add request logging for debugging
- Implement proper validation

## Implementation Steps
1. **Define Types** - Create TypeScript interfaces
2. **Build API/Services** - Implement backend logic with proper error handling
3. **Create Components** - Build UI components following design system
4. **Add Functionality** - Connect frontend to backend/services
5. **Test & Polish** - Unit tests, integration tests, edge cases
6. **Update Documentation** - README, API docs, component docs

## Quality Gates
- [ ] TypeScript compiles without errors
- [ ] All tests pass
- [ ] Mobile responsive design verified
- [ ] Error states handled gracefully
- [ ] Accessibility tested (keyboard navigation, screen readers)
- [ ] Performance impact assessed
- [ ] Documentation updated

## Technology-Specific Notes
### React/Next.js
- Use hooks appropriately
- Implement proper loading states
- Consider Server Side Rendering implications
- Use React.memo for expensive components

### Vue/Nuxt
- Follow Vue 3 Composition API patterns
- Use proper reactivity patterns
- Consider SSR/SSG implications

### Backend APIs
- Implement proper middleware
- Add rate limiting where appropriate
- Use proper HTTP status codes
- Implement request validation
EOF

# 4. Testing Helper Command
echo -e "${GREEN}📝 Creating testing-helper.md...${NC}"
cat > "$COMMANDS_DIR/testing-helper.md" << 'EOF'
# Testing Assistant

You are helping create comprehensive tests for this project.

## Testing Strategy
### Unit Tests
- **Services/Utils**: Business logic, data transformations, helper functions
- **Components**: User interactions, props handling, conditional rendering
- **Hooks** (React): Custom hook behavior and edge cases

### Integration Tests
- **API Routes**: End-to-end request/response testing
- **Component Integration**: Parent-child component interactions
- **Service Integration**: Database/external API interactions

### E2E Tests
- **Critical User Journeys**: Main application flows
- **Cross-browser Testing**: Compatibility across browsers
- **Mobile Experience**: Touch interactions, responsive design

## Test Templates (Customize for your framework)

### API/Service Test (Jest/Vitest)
```javascript
describe("FeatureService", () => {
  describe("getData", () => {
    it("should return data successfully", async () => {
      const mockData = { id: 1, name: "test" };
      const result = await featureService.getData(1);
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
    });

    it("should handle errors gracefully", async () => {
      const result = await featureService.getData(999);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
```

### Component Test (React Testing Library)
```javascript
import { render, screen, fireEvent } from "@testing-library/react";
import { FeatureComponent } from "./FeatureComponent";

describe("FeatureComponent", () => {
  it("should render with required props", () => {
    render(<FeatureComponent title="Test Title" />);
    
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("should handle user interactions", async () => {
    const mockOnClick = jest.fn();
    render(<FeatureComponent onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByRole("button"));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Test (Playwright/Cypress)
```javascript
test("user can complete main workflow", async ({ page }) => {
  await page.goto("/");
  
  // Navigate through main flow
  await page.click("[data-testid=start-button]");
  await page.fill("[data-testid=input-field]", "test data");
  await page.click("[data-testid=submit-button]");
  
  // Verify successful completion
  await expect(page.locator("[data-testid=success-message]")).toBeVisible();
});
```

## Test Commands (Adjust for your setup)
```bash
# Run all tests
npm test

# Run specific test file
npm test feature.test.ts

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage

# Run E2E tests
npm run test:e2e
```

## Coverage Goals
- **Critical Services**: 90%+ coverage
- **API Routes**: 95%+ coverage
- **UI Components**: 80%+ coverage
- **Utility Functions**: 100% coverage

## Testing Best Practices
- **Arrange, Act, Assert**: Structure tests clearly
- **Test Behavior**: Focus on what the code does, not how
- **Mock External Dependencies**: Isolate units under test
- **Use Descriptive Names**: Test names should explain the scenario
- **Test Edge Cases**: Error conditions, boundary values, empty states
EOF

# 5. Performance Audit Command
echo -e "${GREEN}📝 Creating performance-audit.md...${NC}"
cat > "$COMMANDS_DIR/performance-audit.md" << 'EOF'
# Performance Audit Assistant

You are auditing performance for a modern web application.

## Performance Targets (Customize for your project)
- **Page Load**: <2 seconds
- **API Response**: <500ms
- **Bundle Size**: <500KB initial load
- **Lighthouse Score**: >90 (Performance)
- **Core Web Vitals**: All green

## Audit Areas
### Frontend Performance
- [ ] Component re-render optimization
- [ ] Image optimization and lazy loading
- [ ] Bundle size analysis
- [ ] CSS optimization
- [ ] JavaScript execution time
- [ ] Memory usage patterns

### Backend Performance
- [ ] API response times
- [ ] Database query optimization
- [ ] Caching strategies
- [ ] Memory usage
- [ ] Concurrent request handling

### Mobile Performance
- [ ] Touch response time (<100ms)
- [ ] Smooth scrolling (60fps)
- [ ] Network request optimization
- [ ] Battery usage considerations
- [ ] Offline functionality

## Audit Commands (Adjust for your stack)
```bash
# Bundle analysis
npm run build
npm run analyze  # If you have bundle analyzer

# Lighthouse audit
npx lighthouse http://localhost:3000 --view
npx lighthouse http://localhost:3000 --output=json --output-path=lighthouse-report.json

# Performance monitoring
npm run dev -- --experimental-profiler

# Memory profiling
node --inspect npm run dev

# Bundle size tracking
npx bundlephobia [package-name]
```

## Common Optimizations
### React/Frontend
- Use React.memo for expensive components
- Implement proper loading states
- Optimize images (WebP, lazy loading, responsive images)
- Use dynamic imports for code splitting
- Minimize bundle size with tree shaking

### Next.js Specific
- Use next/image for automatic optimization
- Implement proper caching strategies
- Use Static Site Generation where appropriate
- Optimize font loading

### API/Backend Performance
- Add response caching (Redis, in-memory)
- Implement request deduplication
- Use database indexing
- Add compression middleware
- Implement proper pagination

### Universal Optimizations
- Minimize HTTP requests
- Use CDN for static assets
- Implement proper error boundaries
- Add performance monitoring (Sentry, LogRocket)

## Report Format
### 📊 Current Metrics
- Lighthouse scores (Performance, Accessibility, Best Practices, SEO)
- Core Web Vitals (LCP, FID, CLS)
- Bundle size breakdown
- API response times

### 🚀 Optimization Opportunities
- Specific improvements with expected impact
- Low-hanging fruit vs complex optimizations
- Performance budget recommendations

### 🎯 Implementation Priority
- High impact, low effort (Quick wins)
- High impact, high effort (Plan for sprint)
- Low impact items (Backlog)

### 📈 Monitoring Setup
- Performance monitoring tools
- Alerting for regressions
- Continuous performance testing
EOF

# 6. Documentation Helper Command
echo -e "${GREEN}📝 Creating docs-helper.md...${NC}"
cat > "$COMMANDS_DIR/docs-helper.md" << 'EOF'
# Documentation Assistant

You are helping maintain comprehensive, up-to-date documentation.

## Documentation Standards
### API Documentation
- Include request/response examples
- Document all error scenarios
- Provide testing commands (cURL, Postman)
- Include authentication requirements
- Specify rate limits and constraints

### Component Documentation
- Props interface with JSDoc comments
- Usage examples with code snippets
- Accessibility considerations
- Mobile-specific notes
- Styling customization options

### Architecture Documentation
- System diagrams (use Mermaid when possible)
- Data flow explanations
- Deployment instructions
- Environment configuration
- Database schema and relationships

## Documentation Types to Maintain

### 1. API Reference Template
```markdown
## POST /api/v1/[endpoint]

Brief description of what this endpoint does.

### Request
```json
{
  "field1": "string",
  "field2": "number",
  "field3": "boolean"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "id": "generated-id",
    "field1": "processed-value"
  }
}
```

### Error Responses
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid authentication
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server processing error

### Example
```bash
curl -X POST http://localhost:3000/api/v1/[endpoint] \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{"field1": "value1", "field2": 123}'
```
```

### 2. Component Documentation Template
```typescript
/**
 * Component description and purpose
 * 
 * @example
 * ```tsx
 * <ComponentName 
 *   prop1="value" 
 *   prop2={123}
 *   onAction={(data) => console.log(data)}
 * />
 * ```
 */
interface ComponentProps {
  /** Description of prop1 */
  prop1: string;
  /** Description of prop2 with default value */
  prop2?: number;
  /** Callback function when action occurs */
  onAction?: (data: any) => void;
}
```

### 3. Architecture Documentation Template
```markdown
# System Architecture

## Overview
[Brief description of the system]

## Technology Stack
- **Frontend**: React/Vue/Angular + TypeScript
- **Backend**: Node.js/Python/Go
- **Database**: PostgreSQL/MongoDB/MySQL
- **Deployment**: Vercel/AWS/Docker

## System Diagram
```mermaid
graph TB
    A[Client] --> B[Load Balancer]
    B --> C[Web Server]
    C --> D[API Server]
    D --> E[Database]
```

## Data Flow
1. User interaction triggers frontend action
2. Frontend sends API request
3. Backend processes and validates request
4. Database operation performed
5. Response sent back to frontend
6. UI updated with new data
```

## Update Triggers
Update documentation when:
- [ ] New API endpoints added
- [ ] Component interfaces change
- [ ] Environment variables added
- [ ] Deployment process changes
- [ ] Architecture decisions made
- [ ] Dependencies updated
- [ ] Security requirements change

## Documentation Locations (Customize for your project)
- **API Reference**: `docs/api/` or inline in code
- **Component Docs**: JSDoc comments + Storybook
- **Architecture**: `docs/architecture/`
- **Deployment**: `docs/deployment/`
- **Setup Guide**: `README.md`
- **Change Log**: `CHANGELOG.md`

## Quality Checklist
- [ ] Documentation is up-to-date with current code
- [ ] Examples are tested and working
- [ ] All public APIs are documented
- [ ] Setup instructions are complete
- [ ] Architecture diagrams reflect current system
- [ ] Breaking changes are clearly marked
EOF

echo
echo -e "${GREEN}✅ Claude Commands Setup Complete!${NC}"
echo
echo -e "${BLUE}📁 Created files:${NC}"
echo "   .claude/commands/code-review.md"
echo "   .claude/commands/debug-helper.md" 
echo "   .claude/commands/feature-implement.md"
echo "   .claude/commands/testing-helper.md"
echo "   .claude/commands/performance-audit.md"
echo "   .claude/commands/docs-helper.md"
echo
echo -e "${YELLOW}📚 Next steps:${NC}"
echo "1. Check .claude/commands/ - all files should have proper content now"
echo "2. Customize commands for your specific tech stack if needed"
echo "3. Start using @command-name in Claude conversations!"
echo
echo -e "${GREEN}🎉 Happy coding with AI assistance!${NC}"