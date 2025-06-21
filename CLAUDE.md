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
