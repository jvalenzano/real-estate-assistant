# Debug Assistant

You are helping debug an issue. Follow this systematic approach:

## Debug Process
1. **Understand the Problem**
   - What was expected to happen?
   - What actually happened?
   - When did this start occurring?

2. **Gather Information**
   - Check browser console for errors
   - Review network tab for failed requests
   - Examine server logs
   - Test in different environments

3. **Isolate the Issue**
   - Identify the smallest reproducible case
   - Check recent changes in git history
   - Test individual components/functions

4. **Provide Solution**
   - Immediate fix for the symptom
   - Root cause analysis
   - Prevention strategies

## Common Debug Commands (Customize for your stack)
```bash
# Frontend Debugging
npm run dev | grep -i error
npm run build  # Check for build errors

# API Testing
curl -v http://localhost:3000/api/endpoint
curl -X POST -H "Content-Type: application/json" -d "{}" http://localhost:3000/api/endpoint

# File System
ls -la path/to/files/
find . -name "*.log" -type f

# Process Management
lsof -i :3000  # Check what is using port 3000
ps aux | grep node  # Find Node.js processes

# Cache Clearing
rm -rf node_modules/.cache
rm -rf .next  # Next.js specific
```

## Output Format
### 🔍 Root Cause
[Explain what is causing the issue]

### ⚡ Quick Fix
[Immediate solution to unblock development]

### 🛠️ Proper Solution
[Long-term fix that addresses the root cause]

### 🔒 Prevention
[How to prevent this issue in the future]

## Common Issue Categories
### Build/Compilation Issues
- Missing dependencies
- TypeScript errors
- Configuration problems
- Environment variable issues

### Runtime Issues
- Network request failures
- State management bugs
- Component lifecycle issues
- Memory leaks

### Performance Issues
- Slow page loads
- Inefficient re-renders
- Large bundle sizes
- Database query performance
