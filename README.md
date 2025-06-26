# RealeAgent - AI-Powered Real Estate Transaction Assistant

A Progressive Web Application (PWA) built with Next.js 15, offering a mobile-responsive web interface for real estate professionals to streamline property transactions with AI assistance.

## Quick Start

```bash
npm install
npm run dev
```

## Project Structure
- `/web-app` - Next.js 15 PWA with mobile-first responsive design
- `/api-server` - Node.js + Express backend (being migrated to Next.js API routes)
- `/shared` - Shared types and utilities
- `/demo-data` - Mock data for demos
- `/docs` - Architecture and documentation

## Key Features
- 🔍 AI-powered property search
- 📄 Automated document generation (50+ CA real estate forms)
- ✍️ Digital signature integration
- 🤖 ARIA AI co-pilot throughout
- 📱 Touch-optimized mobile web experience
- 💾 Offline-capable PWA functionality

## Demo Instructions
1. Use demo account: agent@demo.com
2. Search for property: ML81234567
3. Generate RPA with one click
4. Complete signature flow

## Document Management System

### Features
- 50+ California real estate forms organized in 6 categories
- Template-based document generation
- PDF form filling capabilities
- Category-based organization and filtering
- Mobile-first responsive design

### Quick Start
1. Navigate to Properties page after login
2. Click "Create New Document" button
3. Select a template (currently only CA_RPA is fully implemented)
4. Fill out the form with property and buyer details
5. Generate PDF document

### Document Categories
1. Buyer's Offer and Negotiation (8 forms)
2. Contingency Removal and Closing (5 forms)
3. Escrow and Contingency Stage (6 forms)
4. Final Disclosures & Delivery (4 forms)
5. Forms Used in Specific Situations (5 forms)
6. Listing Stage (8 forms)

### Development
- Templates stored in `web-app/src/templates/`
- PDFs imported from `~/Blank_Forms/` directory
- Run `npm run import-pdfs` to re-import forms
- API endpoints in `web-app/src/app/api/v1/`

## Development Setup
1. Install dependencies: `npm install`
2. Set up environment variables in `web-app/.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   ```
3. Start development server: `npm run dev`
4. Open http://localhost:3000 in your browser

## Mobile Development
This is a **Progressive Web Application** - no native app installation required:
- Access on any device through a web browser
- Add to home screen for app-like experience
- Fully responsive design optimized for mobile devices
- Touch gestures and mobile-first UI/UX

## Tech Stack
- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **API**: Next.js API Routes (migrating from Express)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT-based auth
- **Document Generation**: Handlebars templates, PDF-lib
- **Styling**: Tailwind CSS with mobile-first approach
