# Migration from React Native to Next.js

## What We're Keeping
- ✅ All API endpoints (no changes needed)
- ✅ JWT authentication pattern
- ✅ Property search logic
- ✅ Document generation flow
- ✅ TypeScript types
- ✅ Demo data (30 properties with professional images)

## What We're Replacing
- ❌ React Native components → React + Tailwind
- ❌ React Navigation → Next.js App Router
- ❌ AsyncStorage → localStorage wrapper
- ❌ React Native Paper → Tailwind UI
- ❌ Expo Vector Icons → Heroicons

## Component Mapping
- SafeAreaView → div with safe-area padding
- ScrollView → div with overflow-auto
- TouchableOpacity → button with hover states
- TextInput → input with mobile-friendly styling
- View → div
- Text → span/p/h1-h6

## Key Implementation Notes

### Authentication
- JWT tokens stored in localStorage instead of AsyncStorage
- Same API endpoints and auth flow
- Storage wrapper created at `/services/storage.ts`

### API Integration
- Base URL updated to use localhost for development
- Can be overridden with NEXT_PUBLIC_API_URL env variable
- All API service logic remains the same

### Styling
- Mobile-first approach with Tailwind
- Use responsive utilities (sm:, md:, lg:)
- Touch-friendly sizes (min 44px touch targets)

### Navigation
- App Router replaces React Navigation
- Protected routes via middleware
- Dynamic routing for property details

## File Structure
```
web-app/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (main)/
│   │   │   ├── properties/
│   │   │   │   ├── page.tsx (search)
│   │   │   │   └── [id]/page.tsx (details)
│   │   │   └── documents/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── property/
│   │   │   └── PropertyCard.tsx
│   │   └── ui/
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   └── storage.ts
│   └── types/
```

## Migration Progress
- [x] Project structure created
- [x] Services copied and adapted
- [x] Storage wrapper implemented
- [ ] Login page
- [ ] Property search page
- [ ] Property details page
- [ ] Document generation
- [ ] Deployment to Vercel