#!/bin/bash

echo "=== Starting RealeAgent Development Servers ==="
echo ""

# Kill any existing processes
echo "Cleaning up existing processes..."
lsof -ti:3001,8081 | xargs kill -9 2>/dev/null

# Start API server
echo "Starting API server on port 3001..."
cd /Users/jasonvalenzano/realeagent-prototype
npm run dev:api &
API_PID=$!

# Wait for API to start
sleep 5

# Start Expo server
echo "Starting Expo server on port 8081..."
cd /Users/jasonvalenzano/realeagent-prototype/mobile-app
yarn expo start --lan &
EXPO_PID=$!

# Wait for Expo to start
sleep 10

# Display connection info
echo ""
echo "=== SERVERS RUNNING ==="
echo "API Server: http://localhost:3001"
echo "Expo Server: http://localhost:8081"
echo ""
echo "Your IP: $(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)"
echo ""
echo "Connect your phone to: exp://$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1):8081"
echo ""
echo "Press Ctrl+C to stop all servers"

# Keep script running
wait $API_PID $EXPO_PID