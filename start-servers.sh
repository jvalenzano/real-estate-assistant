#!/bin/bash

echo "=== Starting RealeAgent PWA Development Server ==="
echo ""

# Kill any existing processes
echo "Cleaning up existing processes..."
lsof -ti:3000,3001 | xargs kill -9 2>/dev/null

# Start Next.js dev server
echo "Starting Next.js PWA on port 3000..."
cd /Users/jasonvalenzano/realeagent-prototype/web-app
npm run dev &
NEXTJS_PID=$!

# Optional: Start API server if still needed
# echo "Starting API server on port 3001..."
# cd /Users/jasonvalenzano/realeagent-prototype
# npm run dev:api &
# API_PID=$!

# Wait for server to start
sleep 5

# Display connection info
echo ""
echo "=== SERVER RUNNING ==="
echo "Next.js PWA: http://localhost:3000"
echo ""
echo "Your local IP: $(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)"
echo ""
echo "Access on mobile: http://$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1):3000"
echo ""
echo "Press Ctrl+C to stop the server"

# Keep script running
wait $NEXTJS_PID