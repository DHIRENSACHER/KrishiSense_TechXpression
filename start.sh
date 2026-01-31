#!/bin/bash

# KrishiSense Quick Start Script
# This script helps you start the ML service and frontend

echo "🌾 KrishiSense ML Models - Quick Start"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -d "ml-service" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the KrishiSense_TechXpression root directory"
    exit 1
fi

# Function to start ML service
start_ml_service() {
    echo "🚀 Starting ML Service..."
    cd ml-service
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        echo "📦 Creating virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Install dependencies
    echo "📦 Installing dependencies..."
    pip install -q -r requirements.txt
    
    # Start ML service
    echo "✅ ML Service starting on http://localhost:5001"
    python app.py &
    ML_PID=$!
    echo $ML_PID > .ml_service.pid
    
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "🚀 Starting Frontend..."
    cd frontend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing npm dependencies..."
        npm install
    fi
    
    # Create .env if it doesn't exist
    if [ ! -f ".env" ]; then
        echo "📝 Creating .env file..."
        cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
VITE_ML_URL=http://localhost:5001
EOF
    fi
    
    # Start frontend
    echo "✅ Frontend starting on http://localhost:5173"
    npm run dev &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > .frontend.pid
    
    cd ..
}

# Main execution
echo "1️⃣  Setting up ML Service..."
start_ml_service

sleep 3

echo ""
echo "2️⃣  Setting up Frontend..."
start_frontend

sleep 3

echo ""
echo "======================================"
echo "✅ KrishiSense is ready!"
echo "======================================"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:5173"
echo "   ML Service: http://localhost:5001"
echo ""
echo "📊 Available ML Tools:"
echo "   • Crop Predictor: http://localhost:5173/predict"
echo "   • Crop Yield: http://localhost:5173/crop-yield"
echo "   • Scheme Finder: http://localhost:5173/scheme-predictor"
echo "   • Irrigation Advisor: http://localhost:5173/irrigation"
echo ""
echo "💡 Tip: Login and navigate to Dashboard → AI Tools"
echo ""
echo "To stop all services, run: ./stop.sh"
echo ""

# Create stop script
cat > stop.sh << 'EOF'
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
EOF

chmod +x stop.sh

# Keep script running
wait
