# Real Estate Transaction Assistant

A high-impact prototype demonstrating the transformation of real estate transactions from a 2-3 hour process to a 5-minute workflow.

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/ui/        # Reusable design system components
├── components/features/  # Business logic components
├── pages/               # Route components
├── data/                # Mock JSON (properties, users, documents)
├── utils/               # Helper functions
├── stores/              # Zustand stores
└── assets/              # Images, PDFs, icons
```

## Demo Scenarios

1. **Primary: "The 5-Minute Miracle"**
   - Agent login → Property search → RPA generation → Signature → Complete

2. **Secondary: "Power User Flow"**
   - Property comparison
   - Document customization
   - Transaction dashboard

3. **Backup: "Before/After"**
   - Split screen comparison
   - Time savings visualization

## Performance Targets

- Initial load: <2 seconds
- Search to results: <500ms
- Document generation: <1 second
- Animations: 60fps

## Browser Support

- Primary: Latest Chrome/Safari
- Mobile: iOS Safari, Android Chrome
- Demo setup: iPad Pro recommended

## Development Guidelines

1. Mobile-first design (320px to 428px width)
2. Use Tailwind CSS for styling
3. Implement smooth animations with Framer Motion
4. Keep performance in mind
5. Focus on the "magic moment" for investor impact
