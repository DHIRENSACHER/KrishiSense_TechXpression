# 🌾 Smart Agriculture Advisory System

## Machine Learning-Based Government Scheme Recommendation for Farmers

This system uses Random Forest Classification to predict the most suitable Indian Government agricultural scheme for farmers based on their crop type, soil conditions, environmental data, and land size.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Government Schemes Covered](#government-schemes-covered)
3. [System Features](#system-features)
4. [Installation & Requirements](#installation--requirements)
5. [Quick Start Guide](#quick-start-guide)
6. [Detailed Usage](#detailed-usage)
7. [Model Performance](#model-performance)
8. [File Descriptions](#file-descriptions)
9. [Prediction Logic](#prediction-logic)
10. [Customization Guide](#customization-guide)

---

## 🎯 Overview

This ML-based advisory system helps identify the most appropriate government agricultural scheme for Indian farmers by analyzing:

- **Crop Type**: Rice, Wheat, Maize, Cotton, Jute, Sugarcane, Pulses, Vegetables, Fruits, Spices
- **Soil Conditions**: Nitrogen (N), Phosphorus (P), Potassium (K), pH levels
- **Environmental Data**: Rainfall, Temperature, Humidity
- **Land Size**: Farm area in hectares

**Model**: Random Forest Classifier (100 trees)
**Accuracy**: ~62% on synthetic test data
**Training Size**: 500 samples (expandable)

---

## 🏛️ Government Schemes Covered

### 1. **PM-KISAN** (Pradhan Mantri Kisan Samman Nidhi)
- **Target**: Small and marginal farmers
- **Criteria**: Land size < 2 hectares
- **Benefit**: Direct income support

### 2. **PM Fasal Bima Yojana** (Crop Insurance)
- **Target**: Farmers facing weather-related risks
- **Criteria**: Extreme rainfall, temperature variations
- **Benefit**: Crop loss insurance

### 3. **Soil Health Card Scheme**
- **Target**: Farmers with poor soil quality
- **Criteria**: Low NPK values, improper pH
- **Benefit**: Soil testing and management guidance

### 4. **PM Krishi Sinchai Yojana** (Irrigation)
- **Target**: Farmers in low rainfall areas
- **Criteria**: Low rainfall (<800mm), water-intensive crops
- **Benefit**: Irrigation infrastructure support

### 5. **Paramparagat Krishi Vikas Yojana** (Organic Farming)
- **Target**: Farmers with conditions suitable for organic farming
- **Criteria**: Good soil health, optimal environmental conditions
- **Benefit**: Organic farming promotion and certification

---

## ✨ System Features

✅ **Automated Scheme Recommendation**: Predicts best scheme with confidence scores
✅ **Multi-Feature Analysis**: Considers 9 agricultural parameters
✅ **Probability Distribution**: Shows likelihood for all schemes
✅ **Synthetic Dataset Generation**: Includes 500-sample dataset for immediate testing
✅ **Model Evaluation**: Confusion matrix and accuracy metrics
✅ **Feature Importance Analysis**: Identifies key decision factors
✅ **Easy-to-Use API**: Simple prediction function for integration

---

## 🛠️ Installation & Requirements

### Prerequisites

```bash
Python 3.8+
```

### Required Libraries

```bash
pip install pandas numpy scikit-learn matplotlib seaborn --break-system-packages
```

Or install from requirements file:

```bash
pip install -r requirements.txt --break-system-packages
```

### System Requirements

- **RAM**: Minimum 2GB
- **Storage**: 50MB for model and datasets
- **OS**: Linux, Windows, macOS

---

## 🚀 Quick Start Guide

### Option 1: Full System Training (Recommended for First Time)

```python
# Run the complete training pipeline
python agriculture_scheme_predictor.py
```

**Output**:
- Trained model with 62% accuracy
- Synthetic dataset (500 samples)
- Confusion matrix visualization
- Feature importance chart
- 4 example predictions

### Option 2: Simple Prediction (For Quick Use)

```python
# Use the simplified prediction interface
python simple_predictor.py
```

### Option 3: Custom Prediction

```python
from simple_predictor import predict_government_scheme, print_prediction_result

# Your farmer's data
result = predict_government_scheme(
    crop='Rice',
    nitrogen=45,
    phosphorus=30,
    potassium=35,
    ph=6.5,
    rainfall=1200,
    temperature=28.5,
    humidity=75.0,
    land_size=1.5
)

# Display results
print_prediction_result(result)
```

---

## 📖 Detailed Usage

### Input Parameters

| Parameter | Type | Range | Description | Example |
|-----------|------|-------|-------------|---------|
| `crop` | string | 10 crops | Crop being grown | 'Rice', 'Wheat', 'Maize' |
| `nitrogen` | int | 20-140 | Nitrogen content in soil (kg/ha) | 45 |
| `phosphorus` | int | 15-80 | Phosphorus content in soil (kg/ha) | 30 |
| `potassium` | int | 20-100 | Potassium content in soil (kg/ha) | 35 |
| `ph` | float | 4.5-8.5 | Soil pH level | 6.5 |
| `rainfall` | int | 400-2500 | Annual rainfall (mm) | 1200 |
| `temperature` | float | 15-40 | Average temperature (°C) | 28.5 |
| `humidity` | float | 40-90 | Average humidity (%) | 75.0 |
| `land_size` | float | 0.5-10 | Farm size (hectares) | 1.5 |

### Output Format

```python
{
    'recommended_scheme': 'PM-KISAN',
    'confidence': 86.60,
    'all_probabilities': {
        'PM-KISAN': 86.60,
        'Soil Health Card Scheme': 6.55,
        'PM Fasal Bima Yojana': 4.03,
        'PM Krishi Sinchai Yojana': 1.50,
        'Paramparagat Krishi Vikas Yojana': 1.32
    },
    'farmer_data': { ... }
}
```

---

## 📊 Model Performance

### Accuracy Metrics

- **Overall Accuracy**: 62.00%
- **Training Samples**: 400
- **Test Samples**: 100

### Per-Scheme Performance

| Scheme | Precision | Recall | F1-Score |
|--------|-----------|--------|----------|
| PM Fasal Bima Yojana | 0.65 | 0.78 | 0.71 |
| PM-KISAN | 0.73 | 0.50 | 0.59 |
| Soil Health Card Scheme | 0.55 | 0.72 | 0.62 |
| PM Krishi Sinchai Yojana | 0.00 | 0.00 | 0.00 |
| Paramparagat Krishi Vikas Yojana | 0.00 | 0.00 | 0.00 |

**Note**: Lower performance for minority classes (PM Krishi Sinchai Yojana, Paramparagat Krishi Vikas Yojana) is due to limited training samples. Performance can be improved with real-world data.

### Feature Importance (Top 5)

1. **Land Size** (32.5%) - Most critical factor
2. **pH Level** (15.2%)
3. **Rainfall** (13.8%)
4. **Nitrogen** (11.4%)
5. **Temperature** (9.6%)

---

## 📁 File Descriptions

### Main Scripts

1. **agriculture_scheme_predictor.py**
   - Complete training pipeline
   - Synthetic data generation
   - Model evaluation
   - Visualization generation
   - Example predictions

2. **simple_predictor.py**
   - Simplified prediction interface
   - Easy-to-use functions
   - Pretty-printed results
   - Model loading/saving

### Generated Files

1. **agriculture_scheme_dataset.csv**
   - 500 synthetic farmer records
   - All features and target schemes
   - Ready for analysis

2. **confusion_matrix.png**
   - Visual representation of model performance
   - Shows prediction accuracy per scheme

3. **feature_importance.png**
   - Bar chart of feature importance
   - Identifies key decision factors

4. **agriculture_model.pkl**
   - Trained Random Forest model
   - Crop and Scheme encoders
   - Ready for deployment

---

## 🧠 Prediction Logic

### Scheme Selection Rules (used in synthetic data)

```
1. PM-KISAN
   - Land size < 2 hectares
   - Priority for small farmers

2. PM Fasal Bima Yojana
   - Rainfall < 600mm OR > 2000mm
   - Temperature > 35°C OR < 18°C
   - Weather-vulnerable conditions

3. Soil Health Card Scheme
   - Nitrogen < 40
   - Phosphorus < 25
   - Potassium < 30
   - pH < 5.5 OR > 8.0

4. PM Krishi Sinchai Yojana
   - Rainfall < 800mm
   - Water-intensive crops (Rice, Sugarcane, Vegetables)

5. Paramparagat Krishi Vikas Yojana
   - Nitrogen > 80
   - Phosphorus > 50
   - Potassium > 60
   - pH: 6.0-7.5
   - Humidity > 60%
```

---

## 🔧 Customization Guide

### 1. Add More Crops

```python
# In generate_synthetic_dataset() function
crops = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Jute', 'Sugarcane', 
         'Pulses', 'Vegetables', 'Fruits', 'Spices',
         'Millets', 'Oilseeds']  # Add new crops
```

### 2. Add New Government Schemes

```python
# Update scheme selection logic in generate_synthetic_dataset()
# Add new scheme rules:

elif (your_condition) and np.random.random() > 0.4:
    scheme = 'New Scheme Name'
```

### 3. Adjust Model Parameters

```python
# In train_model() function
rf_model = RandomForestClassifier(
    n_estimators=200,      # Increase for better accuracy
    max_depth=20,          # Increase for complex patterns
    min_samples_split=3,   # Decrease for finer splits
    min_samples_leaf=1,    # Decrease for detailed leaves
    random_state=42
)
```

### 4. Use Real Dataset

Replace synthetic data with your CSV file:

```python
# Load real data
df = pd.read_csv('your_real_data.csv')

# Ensure columns match:
# Crop, Nitrogen_N, Phosphorus_P, Potassium_K, pH, 
# Rainfall_mm, Temperature_C, Humidity_percent, Land_Size_hectares, Scheme

# Continue with preprocessing
df_processed, crop_encoder, scheme_encoder = preprocess_data(df)
```

### 5. Improve Model Accuracy

```python
# Collect more training data (500+ samples)
# Balance scheme distribution
# Use feature engineering:

df['NPK_ratio'] = df['Nitrogen_N'] / (df['Phosphorus_P'] + df['Potassium_K'])
df['soil_quality_score'] = (df['Nitrogen_N'] + df['Phosphorus_P'] + df['Potassium_K']) / 3

# Try different models:
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.svm import SVC
```

---

## 📞 Support & Contact

For issues, improvements, or questions:
- Review code comments in scripts
- Check generated visualizations for insights
- Modify synthetic data rules to match your use case

---

## 📜 License

This project is for educational and agricultural advisory purposes. Government schemes are based on Indian agricultural policies as of 2024-2025.

---

## 🙏 Acknowledgments

- Scikit-learn for ML algorithms
- Government of India agricultural schemes
- Synthetic data generation based on agricultural best practices

---

## 🔮 Future Enhancements

- [ ] Integration with real-time weather APIs
- [ ] Mobile app interface
- [ ] Multi-language support (Hindi, regional languages)
- [ ] Integration with government scheme databases
- [ ] Real farmer data collection
- [ ] Deep learning models for better accuracy
- [ ] Recommendation explanations (why this scheme?)
- [ ] Historical scheme success tracking

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Status**: Production Ready for Testing

---

## 💡 Quick Reference

### Training Command
```bash
python agriculture_scheme_predictor.py
```

### Prediction Command
```bash
python simple_predictor.py
```

### Custom Prediction Code
```python
from simple_predictor import predict_government_scheme, print_prediction_result

result = predict_government_scheme(
    crop='Maize', nitrogen=50, phosphorus=35, potassium=40,
    ph=6.3, rainfall=800, temperature=26.5, humidity=68.0, land_size=2.0
)
print_prediction_result(result)
```

---

**Built with ❤️ for Indian Farmers**
