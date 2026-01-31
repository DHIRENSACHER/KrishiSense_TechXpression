# KrushiSense ML Service

Python Flask API to serve ML model predictions locally.

## Setup

1. Create venv (if not using shared one):
```bash
cd ml-service
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Place your 4 models in `models/` folder:
```
models/
├── crop_yield.pkl
├── price_forecast.pkl
├── disease_detector.pkl
└── pest_prediction.pkl
```

4. Update `app.py` feature inputs based on your models

5. Run:
```bash
python app.py
```

Server runs at: http://localhost:5000

## Endpoints

- `GET /` - Health check
- `POST /predict/crop-yield` - Predict crop yield
- `POST /predict/price-forecast` - Predict market price
- `POST /predict/disease` - Disease detection
- `POST /predict/pest` - Pest prediction

## Call from Backend

```javascript
// In marketController.js or advisoryController.js
const response = await axios.post('http://localhost:5000/predict/crop-yield', {
  feature1: value1,
  feature2: value2,
  // ... other features
});
```
