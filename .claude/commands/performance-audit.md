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
