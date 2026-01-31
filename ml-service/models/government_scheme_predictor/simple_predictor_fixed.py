"""
Simple Prediction Script for Government Scheme Recommendation - LOCAL MACHINE VERSION
Load the trained model and make predictions for individual farmers
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import pickle
import os

# Create output directory if it doesn't exist
OUTPUT_DIR = 'outputs'
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)


def train_and_save_model():
    """
    Train the model and save it along with encoders for future use
    """
    # Import the main module functions
    import sys
    # Add current directory to path
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    
    try:
        from agriculture_scheme_predictor_fixed import generate_synthetic_dataset, preprocess_data, train_model
    except ImportError:
        print("Error: Could not import agriculture_scheme_predictor_fixed.py")
        print("Please ensure the file is in the same directory.")
        return None, None, None
    
    # Generate dataset
    df = generate_synthetic_dataset(n_samples=500)
    
    # Preprocess
    df_processed, crop_encoder, scheme_encoder = preprocess_data(df)
    
    # Train model
    model, _, _, _, _, _, feature_columns = train_model(df_processed)
    
    # Save model and encoders
    model_data = {
        'model': model,
        'crop_encoder': crop_encoder,
        'scheme_encoder': scheme_encoder,
        'feature_columns': feature_columns
    }
    
    with open(f'{OUTPUT_DIR}/agriculture_model.pkl', 'wb') as f:
        pickle.dump(model_data, f)
    
    print("✓ Model saved successfully!")
    return model, crop_encoder, scheme_encoder


def predict_government_scheme(crop, nitrogen, phosphorus, potassium, ph, 
                              rainfall, temperature, humidity, land_size):
    """
    Easy-to-use prediction function
    
    Parameters:
    -----------
    crop : str - Crop name (e.g., 'Rice', 'Wheat', 'Maize')
    nitrogen : int - Nitrogen content in soil (20-140)
    phosphorus : int - Phosphorus content in soil (15-80)
    potassium : int - Potassium content in soil (20-100)
    ph : float - Soil pH level (4.5-8.5)
    rainfall : int - Annual rainfall in mm (400-2500)
    temperature : float - Average temperature in Celsius (15-40)
    humidity : float - Average humidity percentage (40-90)
    land_size : float - Land size in hectares (0.5-10)
    
    Returns:
    --------
    dict: Contains recommended scheme, confidence, and all probabilities
    """
    
    # Try to load saved model, if not available, train new one
    try:
        with open(f'{OUTPUT_DIR}/agriculture_model.pkl', 'rb') as f:
            model_data = pickle.load(f)
        model = model_data['model']
        crop_encoder = model_data['crop_encoder']
        scheme_encoder = model_data['scheme_encoder']
    except:
        print("Training new model...")
        model, crop_encoder, scheme_encoder = train_and_save_model()
        if model is None:
            return {"error": "Failed to train model"}
    
    # Encode crop
    try:
        crop_encoded = crop_encoder.transform([crop])[0]
    except:
        # If crop not in training data, use most common crop encoding
        print(f"Warning: '{crop}' not in training data. Using default.")
        crop_encoded = 0
    
    # Prepare input
    input_data = np.array([[
        crop_encoded, nitrogen, phosphorus, potassium, ph,
        rainfall, temperature, humidity, land_size
    ]])
    
    # Predict
    prediction = model.predict(input_data)[0]
    probabilities = model.predict_proba(input_data)[0]
    
    # Get scheme name
    recommended_scheme = scheme_encoder.inverse_transform([prediction])[0]
    confidence = probabilities[prediction] * 100
    
    # Get all scheme probabilities
    all_schemes = {}
    for i, scheme in enumerate(scheme_encoder.classes_):
        all_schemes[scheme] = round(probabilities[i] * 100, 2)
    
    # Sort by probability
    all_schemes = dict(sorted(all_schemes.items(), key=lambda x: x[1], reverse=True))
    
    result = {
        'recommended_scheme': recommended_scheme,
        'confidence': round(confidence, 2),
        'all_probabilities': all_schemes,
        'farmer_data': {
            'Crop': crop,
            'Nitrogen (N)': nitrogen,
            'Phosphorus (P)': phosphorus,
            'Potassium (K)': potassium,
            'pH': ph,
            'Rainfall (mm)': rainfall,
            'Temperature (°C)': temperature,
            'Humidity (%)': humidity,
            'Land Size (hectares)': land_size
        }
    }
    
    return result


def print_prediction_result(result):
    """
    Pretty print the prediction result
    """
    if "error" in result:
        print(f"Error: {result['error']}")
        return
    
    print("\n" + "="*70)
    print("🌾 GOVERNMENT SCHEME RECOMMENDATION SYSTEM 🌾")
    print("="*70)
    
    print("\n📊 FARMER PROFILE:")
    print("-" * 70)
    for key, value in result['farmer_data'].items():
        print(f"  {key:25s}: {value}")
    
    print("\n" + "="*70)
    print("✅ RECOMMENDED SCHEME")
    print("="*70)
    print(f"  🎯 Scheme: {result['recommended_scheme']}")
    print(f"  📈 Confidence: {result['confidence']:.2f}%")
    
    print("\n📋 ALL SCHEME PROBABILITIES:")
    print("-" * 70)
    for scheme, prob in result['all_probabilities'].items():
        bar = "█" * int(prob / 2)  # Visual bar
        print(f"  {scheme:40s}: {prob:6.2f}% {bar}")
    
    print("\n" + "="*70)


# Interactive input function
def get_farmer_input():
    """
    Get farmer input from user interactively
    """
    print("\n" + "="*70)
    print("🌾 GOVERNMENT SCHEME RECOMMENDATION SYSTEM - FARMER INPUT 🌾")
    print("="*70)
    print("\nPlease enter your farm details:\n")
    
    try:
        # Get crop information
        crop = input("Enter crop type (e.g., Rice, Wheat, Maize, Cotton): ").strip()
        if not crop:
            crop = "Rice"
        
        # Get soil nutrients
        nitrogen = int(input("Nitrogen content in soil (N) [20-140]: "))
        phosphorus = int(input("Phosphorus content in soil (P) [15-80]: "))
        potassium = int(input("Potassium content in soil (K) [20-100]: "))
        
        # Get pH level
        ph = float(input("Soil pH level [4.5-8.5]: "))
        
        # Get rainfall
        rainfall = int(input("Annual rainfall in mm [400-2500]: "))
        
        # Get temperature
        temperature = float(input("Average temperature in Celsius [15-40]: "))
        
        # Get humidity
        humidity = float(input("Average humidity percentage [40-90]: "))
        
        # Get land size
        land_size = float(input("Land size in hectares [0.5-10]: "))
        
        return {
            'crop': crop,
            'nitrogen': nitrogen,
            'phosphorus': phosphorus,
            'potassium': potassium,
            'ph': ph,
            'rainfall': rainfall,
            'temperature': temperature,
            'humidity': humidity,
            'land_size': land_size
        }
    
    except ValueError:
        print("\n❌ Invalid input! Please enter numeric values for numeric fields.")
        return None


# Example usage with user input
if __name__ == "__main__":
    print("SMART AGRICULTURE ADVISORY SYSTEM - INTERACTIVE PREDICTOR")
    print("="*70)
    
    while True:
        # Get user input
        farmer_data = get_farmer_input()
        
        if farmer_data is None:
            print("\nRetrying with user input...\n")
            continue
        
        # Make prediction
        print("\n⏳ Processing your data...")
        result = predict_government_scheme(
            crop=farmer_data['crop'],
            nitrogen=farmer_data['nitrogen'],
            phosphorus=farmer_data['phosphorus'],
            potassium=farmer_data['potassium'],
            ph=farmer_data['ph'],
            rainfall=farmer_data['rainfall'],
            temperature=farmer_data['temperature'],
            humidity=farmer_data['humidity'],
            land_size=farmer_data['land_size']
        )
        
        # Display result
        print_prediction_result(result)
        
        # Ask if user wants to make another prediction
        another = input("\n\nDo you want to check another farm? (yes/no): ").strip().lower()
        if another not in ['yes', 'y']:
            print("\n" + "="*70)
            print("Thank you for using the Smart Agriculture Advisory System!")
            print("="*70 + "\n")
            break
