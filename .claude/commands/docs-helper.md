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
