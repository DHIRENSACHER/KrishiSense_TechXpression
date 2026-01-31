# KrishiSense ML Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                        │
│                   Port: 5173 (Vite)                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Predict    │  │  CropYield   │  │SchemePredictor│     │
│  │   /predict   │  │ /crop-yield  │  │/scheme-predictor    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                  │              │
│         └─────────────────┴──────────────────┤              │
│                                              │              │
│  ┌──────────────┐                           │              │
│  │  Irrigation  │                           │              │
│  │ /irrigation  │                           │              │
│  └──────┬───────┘                           │              │
│         │                                   │              │
│         └───────────────────────────────────┤              │
│                                            │              │
│         ┌──────────────────────────────────▼─────┐         │
│         │      services/api.js (modelAPI)        │         │
│         │  - predictCrop()                       │         │
│         │  - predictCropYield()                  │         │
│         │  - predictScheme()                     │         │
│         │  - predictIrrigation()                 │         │
│         └──────────────────┬─────────────────────┘         │
│                            │                                │
└────────────────────────────┼────────────────────────────────┘
                             │ HTTP POST
                             │ JSON
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                ML SERVICE (Flask + Python)                  │
│                   Port: 5001                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  GET  /                    → Health Check                   │
│  POST /predict/crop        → Crop Recommendation           │
│  POST /predict/crop-yield  → Yield Prediction              │
│  POST /predict/scheme      → Government Scheme Finder       │
│  POST /predict/irrigation  → Irrigation Advisor            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    ML Models (Python)                       │
│                                                             │
│  ┌─────────────────────────────────────────────────┐       │
│  │  models/crop_prediction/                        │       │
│  │    - crop_predict.py                            │       │
│  │    - Decision Tree, Random Forest, SVM, etc.    │       │
│  └─────────────────────────────────────────────────┘       │
│                                                             │
│  ┌─────────────────────────────────────────────────┐       │
│  │  models/crop_yield_prediction/                  │       │
│  │    - crop_yield_predictor.py                    │       │
│  │    - Linear Regression                          │       │
│  └─────────────────────────────────────────────────┘       │
│                                                             │
│  ┌─────────────────────────────────────────────────┐       │
│  │  models/government_scheme_predictor/            │       │
│  │    - agriculture_scheme_predictor_fixed.py      │       │
│  │    - Random Forest Classifier                   │       │
│  └─────────────────────────────────────────────────┘       │
│                                                             │
│  ┌─────────────────────────────────────────────────┐       │
│  │  models/irrigateAI/                             │       │
│  │    - predict_irrigation.py                      │       │
│  │    - Custom Irrigation Model                    │       │
│  └─────────────────────────────────────────────────┘       │
│                                                             │
└─────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                    DASHBOARD VIEW                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Sidebar:                                                   │
│  ┌──────┐                                                   │
│  │ Home │  → Default dashboard view                        │
│  ├──────┤                                                   │
│  │Crops │  → Crop inventory + Predict tool                 │
│  ├──────┤                                                   │
│  │⚡ AI  │  → ML Tools Hub (NEW!)                          │
│  │Tools │     ┌────────────────────────────────┐           │
│  ├──────┤     │ • Crop Predictor              │           │
│  │Weather     │ • Crop Yield Predictor        │           │
│  ├──────┤     │ • Government Scheme Finder    │           │
│  │Settings    │ • Irrigation Advisor          │           │
│  ├──────┤     └────────────────────────────────┘           │
│  │Profile│                                                  │
│  └──────┘                                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘


DATA FLOW EXAMPLE - Crop Prediction:
────────────────────────────────────

1. USER INPUT (Frontend)
   ┌─────────────────────────┐
   │ Temperature: 28°C       │
   │ Rainfall: 150mm         │
   │ Soil pH: 6.5            │
   │ Area: 1.2 ha            │
   │ Season: Kharif          │
   └────────┬────────────────┘
            │
            ▼
2. API CALL (services/api.js)
   POST http://localhost:5001/predict/crop
   Content-Type: application/json
   {
     "temperature": 28,
     "rainfall": 150,
     "soil_ph": 6.5,
     "area": 1.2,
     "season": "kharif"
   }
            │
            ▼
3. ML SERVICE (Flask)
   - Receives JSON data
   - Validates inputs
   - Applies prediction logic
   - Returns JSON response
            │
            ▼
4. RESPONSE
   {
     "success": true,
     "prediction": "Rice",
     "confidence": 0.92,
     "alternatives": ["Cotton", "Jute"]
   }
            │
            ▼
5. DISPLAY (Frontend)
   ┌─────────────────────────┐
   │ 🌾 Prediction           │
   │                         │
   │ Recommended Crop: RICE  │
   │ Confidence: 92%         │
   │                         │
   │ Alternatives:           │
   │ • Cotton                │
   │ • Jute                  │
   └─────────────────────────┘
```

## Color Theme for ML Tools

- 🟢 **Crop Predictor**: Green (#16a34a)
- 🔵 **Crop Yield**: Blue (#3b82f6)
- 🟣 **Scheme Finder**: Purple (#9333ea)
- 🔷 **Irrigation**: Cyan (#06b6d4)

## Technology Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router

**Backend ML Service:**
- Flask 3.0
- Python 3.8+
- scikit-learn
- pandas
- numpy

**Communication:**
- REST API
- JSON format
- CORS enabled
