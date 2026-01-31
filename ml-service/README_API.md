# KrishiSense ML Service

AI-powered prediction service for agricultural decision-making.

## Available Models

### 1. Crop Predictor (`/predict/crop`)
Recommends the best crops based on environmental parameters.

**Input:**
```json
{
  "temperature": 28.5,
  "rainfall": 150,
  "soil_ph": 6.5,
  "area": 1.2,
  "season": "kharif"
}
```

**Output:**
```json
{
  "success": true,
  "prediction": "Rice",
  "confidence": 0.92,
  "alternatives": ["Cotton", "Jute"]
}
```

### 2. Crop Yield Predictor (`/predict/crop-yield`)
Predicts expected crop yield based on soil parameters.

**Input:**
```json
{
  "soil_moisture": 45.5,
  "soil_ph": 6.5
}
```

**Output:**
```json
{
  "success": true,
  "predicted_yield": 3450.75,
  "unit": "kg/hectare",
  "factors": {
    "moisture_impact": 120.0,
    "ph_impact": 115.0
  }
}
```

### 3. Government Scheme Predictor (`/predict/scheme`)
Recommends suitable government agricultural schemes.

**Input:**
```json
{
  "crop": "Rice",
  "nitrogen": 50,
  "phosphorus": 40,
  "potassium": 50,
  "ph": 6.5,
  "rainfall": 1000,
  "temperature": 28,
  "humidity": 70,
  "land_size": 1.5
}
```

**Output:**
```json
{
  "success": true,
  "recommended_scheme": "PM-KISAN",
  "confidence": 0.95,
  "reason": "Small farmer with land size less than 2 hectares",
  "parameters_analyzed": {
    "land_size": 1.5,
    "soil_health": "Good",
    "weather_risk": "Normal"
  }
}
```

### 4. Irrigation Predictor (`/predict/irrigation`)
Provides irrigation recommendations based on crop and environmental factors.

**Input:**
```json
{
  "crop": "Rice",
  "soil_moisture": 45,
  "temperature": 28,
  "humidity": 70,
  "rainfall": 20,
  "growth_stage": "Vegetative"
}
```

**Output:**
```json
{
  "success": true,
  "irrigation_need": "Medium",
  "recommended_amount_mm": 85.5,
  "recommended_amount_liters_per_sqm": 85.5,
  "frequency": "Every 2-3 days",
  "factors": {
    "soil_moisture_impact": 100.0,
    "temperature_impact": 110.0,
    "humidity_impact": 95.0
  }
}
```

## Setup

1. **Create virtual environment:**
   ```bash
   cd ml-service
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env if needed (default port: 5001)
   ```

4. **Run the service:**
   ```bash
   python app.py
   ```

The service will start on `http://localhost:5001`

## API Testing

Test the health endpoint:
```bash
curl http://localhost:5001/
```

Test crop prediction:
```bash
curl -X POST http://localhost:5001/predict/crop \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 28,
    "rainfall": 150,
    "soil_ph": 6.5,
    "area": 1,
    "season": "kharif"
  }'
```

## Integration with Frontend

The frontend connects to this service via the `/predict/*` endpoints. Make sure to configure the `VITE_ML_URL` in your frontend `.env` file:

```env
VITE_ML_URL=http://localhost:5001
```

## Model Files

The actual ML model implementations are in:
- `models/crop_prediction/crop_predict.py`
- `models/crop_yield_prediction/crop_yield_predictor.py`
- `models/government_scheme_predictor/agriculture_scheme_predictor_fixed.py`
- `models/irrigateAI/predict_irrigation.py`

## Tech Stack

- **Framework:** Flask
- **ML Libraries:** scikit-learn, pandas, numpy
- **API:** REST with JSON
- **CORS:** Enabled for frontend integration
