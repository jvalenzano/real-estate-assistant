# RealeAgent Web App Deployment Guide

## 🚀 Quick Deployment to Vercel

### Prerequisites
- Node.js 18+ installed
- Vercel account (free at vercel.com)
- API server running (locally or deployed)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Configure Environment Variables
Create a `.env.production` file in the web-app directory:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
```

For local testing with production build:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### Step 3: Build and Test Locally
```bash
cd web-app
npm run build
npm run start
```

Visit http://localhost:3000 to verify everything works.

### Step 4: Deploy to Vercel

#### Option A: CLI Deployment
```bash
cd web-app
vercel

# Follow the prompts:
# - Link to existing project? No
# - What's your project's name? realeagent-web
# - In which directory is your code located? ./
# - Want to override the settings? No
```

#### Option B: Git Integration
1. Push your code to GitHub
2. Visit https://vercel.com/new
3. Import your repository
4. Select `web-app` as the root directory
5. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: Your API URL

### Step 5: Configure Production Environment

In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add:
   ```
   NEXT_PUBLIC_API_URL = https://your-api-domain.com/api/v1
   ```

### Step 6: Custom Domain (Optional)
1. In Vercel dashboard → Settings → Domains
2. Add your domain (e.g., app.realeagent.com)
3. Follow DNS configuration instructions

## 📱 PWA Installation

After deployment, users can install the app:

### iOS
1. Open in Safari
2. Tap Share button
3. Select "Add to Home Screen"

### Android
1. Open in Chrome
2. Tap menu (3 dots)
3. Select "Install app"

## 🧪 Testing the Deployment

### Golden Path Test
1. Visit your deployed URL
2. Login: agent@demo.com / demo123
3. Search: ML81234567
4. Click property → Generate RPA
5. Enter test buyer name
6. View PDF preview

### Performance Checks
- Lighthouse score should be 90+
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s

## 🔧 Troubleshooting

### API Connection Issues
```bash
# Check CORS headers on API server
curl -I https://your-api.com/api/v1/health

# Should include:
# Access-Control-Allow-Origin: *
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Environment Variables Not Working
- Ensure variables start with `NEXT_PUBLIC_`
- Redeploy after adding variables
- Check Vercel function logs

## 🚨 Production Checklist

- [ ] API server deployed and accessible
- [ ] Environment variables configured
- [ ] CORS enabled on API
- [ ] SSL certificates active
- [ ] Error tracking configured (optional)
- [ ] Analytics added (optional)

## 📊 Monitoring

### Vercel Analytics (Free)
1. Enable in Vercel dashboard
2. Add to `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Error Tracking (Optional)
Consider adding Sentry for production error tracking:
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

## 🎯 Demo Script for Investors

1. **Mobile Experience** (30s)
   - Show PWA installation
   - Demonstrate touch gestures
   - Show offline capability

2. **Golden Path** (2m)
   - Login → Search → Property → Generate RPA
   - Emphasize speed and simplicity

3. **AI Integration** (30s)
   - Tease ARIA assistant features
   - Show potential for automation

---

**Support**: For deployment issues, check Vercel docs or open an issue in the repository.