# 🌾 KrishiSense - AI-Powered Agricultural Platform

## 🚀 Quick Start

### Automated Setup (Recommended)

```bash
# Make the script executable
chmod +x start.sh

# Start everything
./start.sh
```

This will automatically:
1. Set up and start the ML service on port 5001
2. Set up and start the frontend on port 5173
3. Configure all necessary environment variables

### Manual Setup

#### 1. Start ML Service

```bash
cd ml-service
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

#### 2. Start Frontend

```bash
cd frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env
echo "VITE_ML_URL=http://localhost:5001" >> .env

npm run dev
```

#### 3. Start Backend (Optional - for full features)

```bash
cd backend
npm install
npm start
```

## 🤖 ML Models

KrishiSense includes 4 AI-powered prediction models:

### 1. 🌾 Crop Predictor
**Route:** `/predict`

Recommends the best crop to grow based on environmental conditions.

**Inputs:**
- Temperature (°C)
- Rainfall (mm)
- Soil pH
- Area (hectares)
- Season (kharif/rabi/zaid)

**Output:**
- Recommended crop
- Confidence score
- Alternative crop options

---

### 2. 📊 Crop Yield Predictor
**Route:** `/crop-yield`

Predicts expected crop yield based on soil parameters.

**Inputs:**
- Soil Moisture (%)
- Soil pH

**Output:**
- Expected yield (kg/hectare)
- Impact factors (moisture & pH)

---

### 3. 🏛️ Government Scheme Finder
**Route:** `/scheme-predictor`

Finds the most suitable government agricultural scheme.

**Inputs:**
- Crop Type
- NPK levels (Nitrogen, Phosphorus, Potassium)
- Soil pH
- Rainfall
- Temperature
- Humidity
- Land Size

**Output:**
- Recommended scheme (PM-KISAN, PM Fasal Bima Yojana, etc.)
- Confidence score
- Reason for recommendation
- Parameter analysis

---

### 4. 💧 Irrigation Advisor
**Route:** `/irrigation`

Provides precise irrigation recommendations.

**Inputs:**
- Crop Type
- Soil Moisture
- Temperature
- Humidity
- Recent Rainfall
- Growth Stage

**Output:**
- Irrigation need level (High/Medium/Low)
- Recommended water amount (mm)
- Irrigation frequency
- Impact factors

## 📱 Accessing ML Tools

### Via Dashboard (Recommended)
1. Navigate to http://localhost:5173
2. Login to your account
3. Click the ⚡ **AI Tools** icon in the sidebar
4. Select any of the 4 ML models
5. Fill in the parameters and get instant predictions

### Direct URLs
- Crop Predictor: http://localhost:5173/predict
- Crop Yield: http://localhost:5173/crop-yield
- Scheme Finder: http://localhost:5173/scheme-predictor
- Irrigation Advisor: http://localhost:5173/irrigation

## 🏗️ Architecture

```
Frontend (React + Vite)  →  ML Service (Flask)  →  ML Models (Python)
Port 5173                   Port 5001               scikit-learn
```

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router
- i18next (Multi-language support)

**ML Service:**
- Flask 3.0
- Python 3.8+
- scikit-learn
- pandas
- numpy

**Backend:**
- Node.js
- Express
- MongoDB
- JWT Authentication

## 📚 Documentation

- [ML Models Guide](ML_MODELS_GUIDE.md) - Complete guide to using ML models
- [API Documentation](ml-service/README_API.md) - ML Service API reference
- [Architecture](ARCHITECTURE.md) - System architecture diagram
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md) - Development details

## 🧪 Testing

Test the ML service endpoints:

```bash
cd ml-service
python test_api.py
```

This will test all 4 ML endpoints and show results.

## 🎯 Features

✅ 4 AI-powered prediction models  
✅ Real-time predictions (85%+ accuracy)  
✅ Multi-language support (9 languages)  
✅ Responsive design (mobile-friendly)  
✅ Dashboard with AI Tools hub  
✅ Government schemes database  
✅ Weather integration  
✅ Market price forecasting  
✅ Offline-first architecture  

## 🌐 Supported Languages

- English
- Hindi (हिंदी)
- Bengali (বাংলা)
- Gujarati (ગુજરાતી)
- Marathi (मराठी)
- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Kannada (ಕನ್ನಡ)
- Punjabi (ਪੰਜਾਬੀ)

## 🔧 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_ML_URL=http://localhost:5001
```

### ML Service (.env)
```env
ML_PORT=5001
FLASK_ENV=development
```

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

## 🚫 Stopping Services

```bash
./stop.sh
```

Or manually:
```bash
# Stop ML Service
pkill -f "python app.py"

# Stop Frontend
pkill -f "vite"

# Stop Backend
pkill -f "node.*index.js"
```

## 🐛 Troubleshooting

### ML Service not connecting
1. Check if ML service is running: `curl http://localhost:5001/`
2. Verify port 5001 is not in use: `lsof -i:5001`
3. Check CORS is enabled in app.py

### Frontend not loading
1. Clear browser cache
2. Check .env file exists with correct URLs
3. Restart dev server: `npm run dev`

### Models not working
1. Ensure Python 3.8+ is installed: `python3 --version`
2. Check dependencies: `pip list`
3. Review ML service logs for errors

## 📊 Project Structure

```
KrishiSense_TechXpression/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Predict.jsx         # Crop Predictor
│   │   │   ├── CropYield.jsx       # Crop Yield Predictor
│   │   │   ├── SchemePredictor.jsx # Scheme Finder
│   │   │   └── Irrigation.jsx      # Irrigation Advisor
│   │   └── services/
│   │       └── api.js              # API integration
│   └── package.json
├── ml-service/             # ML Service (Flask)
│   ├── app.py              # Main Flask app with 4 endpoints
│   ├── models/             # ML model implementations
│   │   ├── crop_prediction/
│   │   ├── crop_yield_prediction/
│   │   ├── government_scheme_predictor/
│   │   └── irrigateAI/
│   ├── test_api.py         # Test suite
│   └── requirements.txt
├── backend/                # Node.js backend
│   └── src/
└── start.sh               # Quick start script
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Built with ❤️ for farmers by the KrishiSense team.

## 🎉 Acknowledgments

- Farmers of India for inspiration
- Open-source ML libraries (scikit-learn, pandas)
- Government of India agricultural schemes database

---

**Happy Farming! 🌾🚜**
