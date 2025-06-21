# Technical Decision Records

## DR-001: In-Memory Storage for Demo (2025-06-20)
**Status**: Implemented ✅  
**Decision**: Use in-memory storage instead of persistent database  
**Rationale**: Perfect for demo scenarios, enables instant resets, no database setup complexity  
**Alternatives Considered**: SQLite, PostgreSQL, Supabase  
**Impact**: Enables rapid demo cycles, data resets for presentations  

## DR-002: JWT Authentication (2025-06-20)
**Status**: Implemented ✅  
**Decision**: Implement JWT tokens with 24h expiry  
**Rationale**: Production-ready auth pattern, stateless, mobile-friendly  
**Alternatives Considered**: Session cookies, OAuth  
**Impact**: Secure mobile authentication, easy API integration  

## DR-003: Puppeteer for PDF Generation (2025-06-20)
**Status**: Implemented ✅  
**Decision**: Use Puppeteer for HTML-to-PDF conversion  
**Rationale**: High-quality output, full CSS support, professional documents  
**Alternatives Considered**: PDFKit, jsPDF, external services  
**Impact**: Professional-grade RPA documents, 1-2 second generation time  

## DR-004: React Native Paper UI Library (2025-06-21)
**Status**: Implemented ✅  
**Decision**: Use React Native Paper for UI components  
**Rationale**: Material Design 3 support, comprehensive component library, excellent TypeScript support  
**Alternatives Considered**: NativeBase, custom components  
**Impact**: Professional UI with minimal custom styling, faster development  

## DR-005: React Navigation v6 (2025-06-21)
**Status**: Implemented ✅  
**Decision**: Use React Navigation v6 for navigation  
**Rationale**: Mature library, excellent TypeScript support, stack navigation perfect for auth flow  
**Alternatives Considered**: Expo Router (too new for stable demo)  
**Impact**: Reliable navigation with auth stack switching, type-safe navigation

## DR-006: Expo SDK 53 Upgrade (2025-06-21)
**Status**: Implemented ✅  
**Decision**: Upgrade from SDK 49 to SDK 53 to match Expo Go  
**Rationale**: Required for Expo Go compatibility, latest React Native features  
**Process**: Used `npx expo install --fix` for dependency resolution  
**Impact**: Resolved module errors, enabled latest features, improved performance

## DR-007: AsyncStorage for Token Management (2025-06-21)
**Status**: Implemented ✅  
**Decision**: Use AsyncStorage for JWT token persistence  
**Rationale**: Standard React Native solution, simple API, sufficient for demo  
**Alternatives Considered**: expo-secure-store (overkill for demo)  
**Impact**: Tokens persist across app restarts, seamless auth experience  

---
*Add new decisions as development progresses*
