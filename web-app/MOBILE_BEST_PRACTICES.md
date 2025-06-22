# Mobile Web Best Practices for RealeAgent

## 🎯 Purpose
This document contains hard-won lessons for building web apps that feel native on mobile devices. Reference this when building ANY user-facing component.

## 🚨 Critical Setup (Do Once)

### 1. Global CSS (`app/globals.css`)
```css
/* Prevent iOS bounce and ensure smooth scrolling */
* {
  -webkit-overflow-scrolling: touch;
}

/* Fix iOS input zoom */
input, textarea, select {
  font-size: 16px !important;
}

/* Safe area classes */
.safe-top { padding-top: env(safe-area-inset-top); }
.safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
.safe-left { padding-left: env(safe-area-inset-left); }
.safe-right { padding-right: env(safe-area-inset-right); }

/* Fix viewport height issues */
.h-screen-safe {
  height: 100vh;
  height: 100dvh; /* Dynamic viewport height */
}
```

### 2. Layout Template (`app/layout.tsx`)
```tsx
<html className="h-full">
  <body className="h-full flex flex-col">
    {children}
  </body>
</html>
```

## 📐 Component Patterns

### Touch-Friendly Buttons
```tsx
// ❌ BAD: Too small
<button className="px-2 py-1 text-sm">Save</button>

// ✅ GOOD: 44px touch target
<button className="px-6 py-3 text-base min-h-[44px] active:scale-95">
  Save
</button>
```

### Fixed Mobile Navigation
```tsx
// Bottom navigation that respects safe areas
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t safe-bottom">
  <div className="flex justify-around py-2">
    {/* Nav items with 44px touch targets */}
  </div>
</nav>
```

### Scrollable Content Area
```tsx
// Main content that accounts for fixed header/footer
<main className="flex-1 overflow-y-auto">
  <div className="px-4 py-6 max-w-md mx-auto">
    {/* Content */}
  </div>
</main>
```

### Form Inputs
```tsx
// Mobile-optimized input
<input
  type="email"
  inputMode="email"  // Shows email keyboard
  autoComplete="email"
  className="w-full px-4 py-3 text-base border rounded-lg"
/>
```

## 🎨 Tailwind Mobile-First Classes

### Responsive Utilities (Mobile → Desktop)
```tsx
// Start with mobile, enhance for larger screens
<div className="w-full md:w-1/2 lg:w-1/3">
  <h1 className="text-2xl md:text-4xl lg:text-5xl">
  <p className="px-4 md:px-8 lg:px-12">
</div>
```

### Common Patterns
```tsx
// Mobile-first container
<div className="w-full max-w-md mx-auto px-4">

// Card with proper spacing
<div className="bg-white rounded-lg shadow-md p-4 md:p-6">

// Grid that stacks on mobile
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

## 🚫 Common Pitfalls & Solutions

### Problem: Fixed elements covered by keyboard
```tsx
// ❌ BAD
<div className="fixed bottom-0">

// ✅ GOOD: Use absolute in a flex container
<div className="flex flex-col h-screen-safe">
  <main className="flex-1 overflow-y-auto">
  <footer className="flex-shrink-0">
</div>
```

### Problem: Horizontal scroll on mobile
```tsx
// ❌ BAD: Can cause overflow
<div className="w-screen">

// ✅ GOOD: Use full width
<div className="w-full">
```

### Problem: Text too small/large
```tsx
// Base font sizes that work
<h1 className="text-2xl md:text-4xl">  // 24px → 36px
<h2 className="text-xl md:text-2xl">   // 20px → 24px
<p className="text-base">               // 16px (prevents zoom)
<small className="text-sm">             // 14px minimum
```

## 📱 Testing Checklist

Before considering a component "done":

- [ ] Test on iPhone Safari (notch + home bar)
- [ ] Test on Android Chrome
- [ ] Test with keyboard open (forms)
- [ ] Test landscape orientation
- [ ] Test with slow 3G throttling
- [ ] Test touch targets with thumb
- [ ] Verify no horizontal scroll

## 🛠️ Useful Utilities

### Container Component
```tsx
// components/MobileContainer.tsx
export function MobileContainer({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full max-w-md mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
}
```

### Page Layout Component
```tsx
// components/MobileLayout.tsx
export function MobileLayout({ 
  title, 
  children,
  showBack = false 
}: {
  title: string;
  children: React.ReactNode;
  showBack?: boolean;
}) {
  return (
    <div className="flex flex-col h-screen-safe">
      <header className="flex-shrink-0 safe-top bg-white border-b">
        <div className="flex items-center h-14 px-4">
          {showBack && <BackButton />}
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
```

## 🔍 Debug Helpers

Add to development builds:
```tsx
// components/DeviceInfo.tsx (dev only)
export function DeviceInfo() {
  if (process.env.NODE_ENV === 'production') return null;
  
  return (
    <div className="fixed top-0 right-0 bg-black text-white text-xs p-1 z-50">
      <div className="sm:hidden">XS</div>
      <div className="hidden sm:block md:hidden">SM</div>
      <div className="hidden md:block lg:hidden">MD</div>
      <div className="hidden lg:block xl:hidden">LG</div>
      <div className="hidden xl:block">XL</div>
    </div>
  );
}
```

---

**Remember**: Mobile users have fat thumbs, small screens, and poor connections. Design accordingly!