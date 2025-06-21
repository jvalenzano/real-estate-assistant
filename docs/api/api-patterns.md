# API Design Patterns

## Endpoints Structure
- POST   /api/v1/auth/login
- GET    /api/v1/properties/search?q={query}
- POST   /api/v1/documents/generate
- GET    /api/v1/transactions

## Response Format
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2025-01-15T10:00:00Z",
    "version": "1.0"
  }
}
