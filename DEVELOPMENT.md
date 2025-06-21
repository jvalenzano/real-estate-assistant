# RealeAgent Development Setup Guide

## 🎯 Quick Start (Get Running in 2 Minutes)

### **Prerequisites**
- Node.js 18+ installed
- Expo Go app on your phone (iOS/Android)
- Mac with Terminal access
- Code editor (Cursor IDE recommended)

### **Daily Startup Commands**

#### **Terminal 1: API Server**
```bash
cd /Users/jasonvalenzano/realeagent-prototype
npm run dev:api
```
**Expected output:**
- ✅ Supabase client initialized
- ✅ Document templates loaded
- 🚀 RealeAgent API server running on port 3001

#### **Terminal 2: Expo Mobile App**
```bash
cd /Users/jasonvalenzano/realeagent-prototype/mobile-app
npx expo start --clear
```
**Expected output:**
- QR code displayed in terminal
- Metro waiting on exp://192.168.1.5:8081

### **Daily Shutdown**
```bash
# In both terminals:
Ctrl+C

# Verify clean shutdown:
lsof -i:3001  # Should show nothing
lsof -i:8081  # Should show nothing
```

## 📱 Testing Your App

### **Mobile Testing (Primary)**
1. **Install Expo Go** app from App Store/Play Store
2. **Scan QR code** from Terminal 2 with Expo Go
3. **App loads** showing login screen

### **Web Testing (Secondary)**
1. **Press 'w'** in Terminal 2 (Expo)
2. **Browser opens** at localhost:19006
3. **Same app** as mobile, different platform

### **Demo Login Credentials**
- **Email:** agent@demo.com
- **Password:** demo123
- **Golden Path Property:** ML81234567

## 🏗️ Project Architecture

### **Monorepo Structure**
```
realeagent-prototype/
├── api-server/          # Backend (Node.js + Express)
├── mobile-app/          # Frontend (React Native + Expo)
├── shared/              # Shared TypeScript types
├── demo-data/           # Test properties and users
├── .cursor/             # AI development context
└── docs/                # Project documentation
```

### **Technology Stack**
- **Backend:** Node.js + Express + TypeScript
- **Frontend:** React Native + Expo SDK 53
- **Database:** In-memory (demo) → Supabase (production)
- **Authentication:** JWT tokens with AsyncStorage
- **UI Framework:** React Native Paper (Material Design)
- **Navigation:** React Navigation v6

## 🔧 Development Environment

### **Required Tools**
- **Terminal:** macOS Terminal app
- **IDE:** Cursor IDE (recommended) or VS Code
- **AI Assistant:** Claude Code for development
- **Git:** Version control
- **NPM:** Package management

### **Port Configuration**
- **API Server:** Port 3001 (http://localhost:3001)
- **Expo Dev Server:** Port 8081 (http://localhost:8081)
- **Web Preview:** Port 19006 (http://localhost:19006)

### **Network Configuration**
- **Local IP:** 192.168.1.5 (for mobile device connection)
- **Mobile URL:** exp://192.168.1.5:8081
- **API Endpoint:** http://192.168.1.5:3001/api/v1

## 🚀 Common Development Tasks

### **Install All Dependencies**
```bash
npm run install:all
```

### **Clean Installation**
```bash
npm run clean:install
```

### **Test API Health**
```bash
curl http://localhost:3001/api/v1/health
```

### **Test Demo Login**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"agent@demo.com","password":"demo123"}'
```

### **Reset Demo Data**
```bash
npm run demo:reset
```

## 🐛 Troubleshooting

### **"Port already in use" Errors**
```bash
# Kill processes using ports
lsof -ti:3001 | xargs kill -9  # API server
lsof -ti:8081 | xargs kill -9  # Expo server

# Then restart servers
npm run dev:api
npx expo start --clear
```

### **"Expo Go can't connect" Issues**
1. **Check WiFi:** Phone and Mac on same network
2. **Check IP:** Verify 192.168.1.5 is correct
3. **Restart Expo:** npx expo start --clear
4. **Manual URL:** In Expo Go, enter exp://192.168.1.5:8081

### **"Module not found" Errors**
```bash
cd mobile-app
rm -rf node_modules
npm install
npx expo start --clear
```

### **Authentication Not Working**
1. **Check API server** is running (Terminal 1)
2. **Check network connection** between mobile and API
3. **Verify demo credentials** haven't changed
4. **Clear app cache** in Expo Go

## 📋 Development Workflow

### **AI-Assisted Development Pattern**
1. **Claude (Web):** Strategic guidance and architecture decisions
2. **Claude Code:** Implementation and file creation
3. **Two-terminal setup:** API + Expo servers running
4. **Immediate testing:** Web and mobile simultaneously

### **Code Standards**
- **TypeScript strict mode** throughout
- **Functional components only** in React Native
- **Components under 80 lines**
- **Separated styles** (styles.ts files)
- **Early returns** to reduce nesting

### **Git Workflow**
```bash
# Daily commits recommended
git add .
git commit -m "feat: describe what you built"
git push origin main
```

## 📊 Current Project Status

### **✅ Completed (Phase 5.1)**
- Full-stack authentication system
- Cross-platform login (web + mobile)
- React Navigation with auth/main stacks
- Property search foundation
- JWT token management with AsyncStorage

### **🔄 In Progress (Phase 5.2)**
- Property search UI with images
- Property card components
- Advanced filtering and sorting

### **📅 Upcoming**
- Property details screens
- Document generation integration
- ARIA AI chat features
- DocuSign e-signature workflow

## 🎯 Demo Flow (Golden Path)

1. **Start servers** (both terminals)
2. **Connect mobile app** (scan QR)
3. **Login:** agent@demo.com / demo123
4. **Search:** ML81234567
5. **View results** and property details
6. **Generate RPA** document
7. **Success:** End-to-end transaction in <5 minutes

## 📚 Key Documentation Files

### **Live Project Status**
- `.cursor/project-board/command-center.md` - Current tasks and priorities
- `.cursor/ai-instructions/cursor-context.md` - Development standards
- `.cursor/knowledge-base/decisions.md` - Technical decision history

### **API Reference**
- `docs/quick-reference/api-endpoints.md` - All endpoints with examples
- `docs/quick-reference/performance-metrics.md` - Benchmarks and targets

### **Demo Data**
- `demo-data/properties.json` - 30 test properties
- `demo-data/users.json` - Demo user accounts

## 🔒 Security Notes

### **Demo Environment**
- Uses in-memory data storage
- JWT tokens for demo purposes only
- No real user data or production secrets

### **Environment Variables**
```bash
# Located in api-server/.env
NODE_ENV=development
PORT=3001
# Add real API keys for production features
```

## 🎉 Success Indicators

### **Everything Working When:**
- Both terminals show servers running without errors
- Mobile app loads login screen via QR scan
- Web app loads at localhost:19006
- Demo login succeeds and shows property search
- ML81234567 search returns property results

### **Performance Targets**
- Property search: <300ms (currently 2.8ms ✅)
- App launch: <2s (currently 1.5s ✅)
- Authentication: <500ms (currently 450ms ✅)

---

**🚀 Ready to build the future of real estate transactions!**

*Last updated: 2025-06-21*
*For questions or issues, check the `.cursor/` documentation or commit history*