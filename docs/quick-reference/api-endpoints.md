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
