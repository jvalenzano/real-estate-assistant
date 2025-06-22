# CLAUDE.md - Claude Code Context

## 🚨 STRATEGIC PIVOT (2025-06-22)
**Decision**: Pivoting from React Native to Next.js mobile-web app
**Reason**: Expo SDK 53 compatibility issues blocking progress
**Timeline**: 2-3 hours to working demo vs days of Expo troubleshooting
**Approach**: Mobile-first responsive web app that looks/feels native

## Quick Status
**Current Phase**: Next.js Web App Development  
**Active Directory**: `/web-app`  
**Main Focus**: Building mobile-first property search and document generation web interface

## Project Command Center
📋 **Live Status**: `.cursor/project-board/command-center.md`  
🎯 **Current Tasks**: Building Next.js web app with authentication and property search  
🤖 **AI Context**: `.cursor/ai-instructions/cursor-context.md`  

## Architecture Overview
```
┌─ api-server/          # ✅ Complete - Node.js + Express + TypeScript
├─ web-app/             # 🚧 Current Focus - Next.js + Tailwind CSS
├─ mobile-app/          # ⏸️ Paused - React Native + Expo (SDK issues)
├─ shared/              # 📦 Types and constants
└─ demo-data/           # 🎭 Mock data for demos
```

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

## Demo-First Development Philosophy
- **Always Show Data**: Never show empty states in demos
- **Hardcode When Needed**: For investor demos, hardcoded data > API calls
- **Golden Path Priority**: ML81234567 property should always work perfectly
- **Fail Gracefully**: If APIs fail, fall back to demo data
- **Performance > Perfection**: 2-second load time beats perfect architecture

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

---
*For detailed context, always check the command center first*
*Last Updated: $(date +"%Y-%m-%d")*
