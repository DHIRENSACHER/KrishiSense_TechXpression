#!/bin/bash
echo "🛑 Stopping KrishiSense services..."

if [ -f "ml-service/.ml_service.pid" ]; then
    kill $(cat ml-service/.ml_service.pid) 2>/dev/null
    rm ml-service/.ml_service.pid
    echo "✅ ML Service stopped"
fi

if [ -f "frontend/.frontend.pid" ]; then
    kill $(cat frontend/.frontend.pid) 2>/dev/null
    rm frontend/.frontend.pid
    echo "✅ Frontend stopped"
fi

# Kill any remaining processes on the ports
lsof -ti:5001 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null

echo "✅ All services stopped"
