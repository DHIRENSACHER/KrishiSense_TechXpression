from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

print("✅ ML Service initialized successfully")

@app.route('/', methods=['GET'])
def health():
    return jsonify({
        'status': 'running',
        'service': 'KrishiSense ML Service',
        'endpoints': [
            '/predict/crop',
            '/predict/crop-yield',
            '/predict/scheme',
            '/predict/irrigation'
        ]
    }), 200

@app.route('/predict/crop', methods=['POST'])
def predict_crop():
    """Predict best crop based on environmental parameters"""
    try:
        data = request.json
        
        # Extract parameters
        temperature = float(data.get('temperature', 25))
        rainfall = float(data.get('rainfall', 100))
        soil_ph = float(data.get('soil_ph', 6.5))
        area = float(data.get('area', 1))
        season = data.get('season', 'kharif')
        
        # For now, we'll use a simple rule-based prediction
        # You can integrate the actual trained model here
        crop_recommendations = {
            'kharif': {
                'high_rain': ['Rice', 'Cotton', 'Jute', 'Maize'],
                'low_rain': ['Millets', 'Groundnut', 'Soybeans']
            },
            'rabi': {
                'high_rain': ['Wheat', 'Barley', 'Mustard'],
                'low_rain': ['Gram', 'Peas', 'Wheat']
            },
            'zaid': {
                'high_rain': ['Watermelon', 'Cucumber', 'Muskmelon'],
                'low_rain': ['Bitter Gourd', 'Pumpkin']
            }
        }
        
        # Simple logic based on rainfall
        if rainfall > 150:
            crops = crop_recommendations.get(season, {}).get('high_rain', ['Rice'])
        else:
            crops = crop_recommendations.get(season, {}).get('low_rain', ['Wheat'])
        
        # Select based on temperature and pH
        predicted_crop = crops[0]
        confidence = 0.85
        
        if temperature > 30 and 'Rice' in crops:
            predicted_crop = 'Rice'
            confidence = 0.92
        elif temperature < 20 and 'Wheat' in crops:
            predicted_crop = 'Wheat'
            confidence = 0.88
        
        return jsonify({
            'success': True,
            'prediction': predicted_crop,
            'confidence': confidence,
            'alternatives': crops[1:3] if len(crops) > 1 else []
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/predict/crop-yield', methods=['POST'])
def predict_crop_yield():
    """Predict crop yield based on soil parameters"""
    try:
        data = request.json
        
        soil_moisture = float(data.get('soil_moisture', 50))
        soil_ph = float(data.get('soil_ph', 6.5))
        
        # Simple yield calculation (replace with actual model)
        base_yield = 3000  # kg/hectare
        
        # Moisture factor (optimal: 40-60%)
        if 40 <= soil_moisture <= 60:
            moisture_factor = 1.2
        elif 30 <= soil_moisture <= 70:
            moisture_factor = 1.0
        else:
            moisture_factor = 0.7
        
        # pH factor (optimal: 6.0-7.5)
        if 6.0 <= soil_ph <= 7.5:
            ph_factor = 1.15
        elif 5.5 <= soil_ph <= 8.0:
            ph_factor = 1.0
        else:
            ph_factor = 0.8
        
        predicted_yield = base_yield * moisture_factor * ph_factor
        
        return jsonify({
            'success': True,
            'predicted_yield': round(predicted_yield, 2),
            'unit': 'kg/hectare',
            'factors': {
                'moisture_impact': round(moisture_factor * 100, 1),
                'ph_impact': round(ph_factor * 100, 1)
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/predict/scheme', methods=['POST'])
def predict_scheme():
    """Predict suitable government scheme based on farm parameters"""
    try:
        data = request.json
        
        crop = data.get('crop', 'Rice')
        nitrogen = float(data.get('nitrogen', 50))
        phosphorus = float(data.get('phosphorus', 40))
        potassium = float(data.get('potassium', 50))
        ph = float(data.get('ph', 6.5))
        rainfall = float(data.get('rainfall', 1000))
        temperature = float(data.get('temperature', 25))
        humidity = float(data.get('humidity', 70))
        land_size = float(data.get('land_size', 1))
        
        # Scheme determination logic
        scheme = None
        confidence = 0.0
        reason = ""
        
        # PM-KISAN - Priority for small farmers
        if land_size < 2.0:
            scheme = 'PM-KISAN'
            confidence = 0.95
            reason = 'Small farmer with land size less than 2 hectares'
        
        # PM Fasal Bima Yojana - Crop insurance for vulnerable conditions
        elif rainfall < 600 or rainfall > 2000 or temperature > 35 or temperature < 18:
            scheme = 'PM Fasal Bima Yojana'
            confidence = 0.88
            reason = 'Extreme weather conditions detected'
        
        # Soil Health Card Scheme - Poor soil conditions
        elif nitrogen < 40 or phosphorus < 25 or potassium < 30 or ph < 5.5 or ph > 8.0:
            scheme = 'Soil Health Card Scheme'
            confidence = 0.85
            reason = 'Soil nutrient levels need improvement'
        
        # PM Krishi Sinchai Yojana - Low rainfall, irrigation needed
        elif rainfall < 800:
            scheme = 'PM Krishi Sinchai Yojana'
            confidence = 0.82
            reason = 'Low rainfall area requiring irrigation support'
        
        # Paramparagat Krishi Vikas Yojana - Organic farming
        elif nitrogen > 80 and phosphorus > 50 and potassium > 60 and 6.0 <= ph <= 7.5:
            scheme = 'Paramparagat Krishi Vikas Yojana'
            confidence = 0.78
            reason = 'Good soil health suitable for organic farming'
        
        else:
            scheme = 'PM-KISAN'
            confidence = 0.70
            reason = 'General support scheme recommended'
        
        return jsonify({
            'success': True,
            'recommended_scheme': scheme,
            'confidence': confidence,
            'reason': reason,
            'parameters_analyzed': {
                'land_size': land_size,
                'soil_health': 'Good' if (nitrogen > 50 and phosphorus > 40 and potassium > 50) else 'Needs Attention',
                'weather_risk': 'High' if (rainfall < 600 or rainfall > 2000 or temperature > 35) else 'Normal'
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/predict/irrigation', methods=['POST'])
def predict_irrigation():
    """Predict irrigation needs based on crop and environmental factors"""
    try:
        data = request.json
        
        crop = data.get('crop', 'Rice')
        soil_moisture = float(data.get('soil_moisture', 50))
        temperature = float(data.get('temperature', 25))
        humidity = float(data.get('humidity', 70))
        rainfall = float(data.get('rainfall', 100))
        growth_stage = data.get('growth_stage', 'Vegetative')
        
        # Base irrigation amounts by crop type (mm)
        crop_base = {
            'Rice': 120,
            'Wheat': 70,
            'Maize': 80,
            'Cotton': 90,
            'Sugarcane': 130,
            'Vegetables': 75,
            'Potato': 85
        }
        
        base_amount = crop_base.get(crop, 80)
        
        # Adjustment factors
        moisture_factor = 1.3 if soil_moisture < 30 else (1.0 if soil_moisture < 60 else 0.7)
        temp_factor = 1.2 if temperature > 35 else (1.0 if temperature > 25 else 0.9)
        humidity_factor = 0.85 if humidity > 80 else (1.0 if humidity > 60 else 1.15)
        rainfall_factor = 0.7 if rainfall > 50 else 1.0
        
        # Growth stage factor
        stage_factors = {
            'Sowing': 1.2,
            'Vegetative': 1.15,
            'Flowering': 1.3,
            'Harvest': 0.7
        }
        stage_factor = stage_factors.get(growth_stage, 1.0)
        
        # Calculate final irrigation amount
        irrigation_amount = base_amount * moisture_factor * temp_factor * humidity_factor * rainfall_factor * stage_factor
        
        # Determine irrigation need level
        if irrigation_amount > 100:
            need_level = 'High'
        elif irrigation_amount > 60:
            need_level = 'Medium'
        else:
            need_level = 'Low'
        
        return jsonify({
            'success': True,
            'irrigation_need': need_level,
            'recommended_amount_mm': round(irrigation_amount, 2),
            'recommended_amount_liters_per_sqm': round(irrigation_amount, 2),
            'frequency': 'Daily' if need_level == 'High' else ('Every 2-3 days' if need_level == 'Medium' else 'Weekly'),
            'factors': {
                'soil_moisture_impact': round(moisture_factor * 100, 1),
                'temperature_impact': round(temp_factor * 100, 1),
                'humidity_impact': round(humidity_factor * 100, 1)
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

if __name__ == '__main__':
    PORT = int(os.getenv('ML_PORT', 5001))
    print(f"🚀 Starting ML Service on port {PORT}")
    app.run(debug=True, host='0.0.0.0', port=PORT)
