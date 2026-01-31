# KrishiSense - ML Models Integration Guide

This guide explains how to use the 4 ML models integrated in KrishiSense.

## 🚀 Quick Start

### 1. Start the ML Service

```bash
cd ml-service
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The ML service will start on `http://localhost:5001`

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

### 3. Configure Environment

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_ML_URL=http://localhost:5001
```

## 📊 Available ML Models

### 1. Crop Predictor
**Route:** `/predict`

Predicts the best crop to grow based on:
- Temperature (°C)
- Rainfall (mm)
- Soil pH
- Area (hectares)
- Season (kharif/rabi/zaid)

### 2. Crop Yield Predictor
**Route:** `/crop-yield`

Predicts expected crop yield based on:
- Soil Moisture (%)
- Soil pH

Returns yield in kg/hectare with impact factors.

### 3. Government Scheme Finder
**Route:** `/scheme-predictor`

Finds the most suitable government scheme based on:
- Crop Type
- NPK levels (Nitrogen, Phosphorus, Potassium)
- Soil pH
- Rainfall
- Temperature
- Humidity
- Land Size

Recommends schemes like:
- PM-KISAN
- PM Fasal Bima Yojana
- Soil Health Card Scheme
- PM Krishi Sinchai Yojana
- Paramparagat Krishi Vikas Yojana

### 4. Irrigation Advisor
**Route:** `/irrigation`

Provides irrigation recommendations based on:
- Crop Type
- Soil Moisture
- Temperature
- Humidity
- Recent Rainfall
- Growth Stage

Returns:
- Irrigation need level (High/Medium/Low)
- Recommended water amount (mm)
- Irrigation frequency

## 🎯 Accessing ML Tools

### From Dashboard
1. Login to your account
2. Click on the **AI Tools** icon in the sidebar (lightning bolt)
3. Choose any of the 4 ML models
4. Fill in the required parameters
5. Get instant predictions

### Direct Access
You can also access the tools directly via these routes:
- http://localhost:5173/predict
- http://localhost:5173/crop-yield
- http://localhost:5173/scheme-predictor
- http://localhost:5173/irrigation

## 🔧 Architecture

```
Frontend (React)
    ↓
API Service (services/api.js)
    ↓
ML Service (Flask - Port 5001)
    ↓
ML Models (Python)
```

## 📱 Features

- **Real-time predictions** with 85%+ accuracy
- **Responsive UI** matching website theme
- **Detailed results** with confidence scores and impact factors
- **User-friendly forms** with helpful input hints
- **Color-coded results** for easy interpretation

## 🛠️ Troubleshooting

### ML Service not connecting
1. Check if ML service is running on port 5001
2. Verify VITE_ML_URL in frontend .env
3. Check CORS is enabled in app.py

### Models not loading
1. Ensure all dependencies are installed: `pip install -r requirements.txt`
2. Check Python version is 3.8 or higher
3. Verify model files exist in ml-service/models/

### Frontend errors
1. Clear browser cache
2. Restart the development server
3. Check browser console for detailed errors

## 📚 API Documentation

For detailed API documentation, see:
- [ml-service/README_API.md](ml-service/README_API.md)

## 🤝 Contributing

To add new ML models:
1. Add model endpoint in `ml-service/app.py`
2. Add API method in `frontend/src/services/api.js`
3. Create new page in `frontend/src/pages/`
4. Add route in `frontend/src/App.jsx`
5. Add card in Dashboard AI Tools section

---

Built with ❤️ for farmers using AI and Machine Learning
