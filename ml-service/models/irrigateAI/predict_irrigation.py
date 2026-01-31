import pandas as pd
import numpy as np
import pickle

# Load the saved model
print("Loading trained model...")
with open('C:\\Users\\HP\\Desktop\\tp\\irrigation_model.pkl', 'rb') as f:
    model_objects = pickle.load(f)

model = model_objects['model']
scaler = model_objects['scaler']
label_encoders = model_objects['label_encoders']
target_encoder = model_objects['target_encoder']
feature_names = model_objects['feature_names']

print("✓ Model loaded successfully!")

def calculate_irrigation_amount(prediction, features_df):
    """
    Calculate irrigation water amount in mm based on prediction and environmental factors.
    """
    results = []
    
    for idx, pred_class in enumerate(prediction):
        pred_label = target_encoder.inverse_transform([pred_class])[0]
        
        # Get relevant features
        soil_moisture = features_df.iloc[idx]['Soil_Moisture']
        rainfall = features_df.iloc[idx]['Rainfall_mm']
        temperature = features_df.iloc[idx]['Temperature_C']
        humidity = features_df.iloc[idx]['Humidity']
        previous_irrigation = features_df.iloc[idx]['Previous_Irrigation_mm']
        crop_type = features_df.iloc[idx]['Crop_Type']
        growth_stage = features_df.iloc[idx]['Crop_Growth_Stage']
        
        # Base irrigation amounts
        if pred_label == 'Low':
            base_amount = np.random.uniform(20, 50)
        elif pred_label == 'Medium':
            base_amount = np.random.uniform(50, 90)
        else:  # High
            base_amount = np.random.uniform(90, 150)
        
        # Adjustment factors
        moisture_factor = 1.3 if soil_moisture < 20 else (1.1 if soil_moisture < 40 else (1.0 if soil_moisture < 60 else 0.8))
        rainfall_factor = 0.7 if rainfall > 1500 else (0.85 if rainfall > 1000 else (1.0 if rainfall > 500 else 1.15))
        temp_factor = 1.2 if temperature > 35 else (1.1 if temperature > 25 else 0.95)
        humidity_factor = 0.85 if humidity > 80 else (0.95 if humidity > 60 else 1.1)
        
        crop_factors = {'Rice': 1.3, 'Sugarcane': 1.25, 'Cotton': 1.0, 'Wheat': 0.9, 'Maize': 1.0, 'Potato': 1.1}
        crop_factor = crop_factors.get(crop_type, 1.0)
        
        stage_factors = {'Sowing': 1.2, 'Vegetative': 1.15, 'Flowering': 1.3, 'Harvest': 0.7}
        stage_factor = stage_factors.get(growth_stage, 1.0)
        
        irrigation_amount = (base_amount * moisture_factor * rainfall_factor * 
                           temp_factor * humidity_factor * crop_factor * stage_factor)
        
        # Bounds
        if pred_label == 'Low':
            irrigation_amount = np.clip(irrigation_amount, 15, 60)
        elif pred_label == 'Medium':
            irrigation_amount = np.clip(irrigation_amount, 45, 110)
        else:
            irrigation_amount = np.clip(irrigation_amount, 85, 180)
        
        results.append({
            'Predicted_Irrigation_Need': pred_label,
            'Recommended_Irrigation_mm': round(irrigation_amount, 2)
        })
    
    return pd.DataFrame(results)

def predict_irrigation(input_data):
    """
    Make predictions on new data.
    
    Parameters:
    input_data: pandas DataFrame with the same columns as training data (except Irrigation_Need)
    
    Returns:
    DataFrame with predictions and recommended irrigation amounts
    """
    # Make a copy
    X_new = input_data.copy()
    
    # Store original categorical columns for reference
    original_data = input_data.copy()
    
    # Encode categorical variables
    categorical_cols = [col for col in label_encoders.keys() if col in X_new.columns]
    for col in categorical_cols:
        X_new[col] = label_encoders[col].transform(X_new[col])
    
    # Identify numerical columns (those that weren't categorical)
    numerical_cols = [col for col in X_new.columns if col not in categorical_cols]
    
    # Scale numerical features
    X_new_scaled = X_new.copy()
    X_new_scaled[numerical_cols] = scaler.transform(X_new[numerical_cols])
    
    # Ensure columns are in the correct order
    X_new_scaled = X_new_scaled[feature_names]
    
    # Make predictions
    predictions = model.predict(X_new_scaled)
    prediction_proba = model.predict_proba(X_new_scaled)
    
    # Calculate irrigation amounts using original data
    irrigation_results = calculate_irrigation_amount(predictions, original_data)
    
    # Combine results
    results_df = pd.concat([
        input_data.reset_index(drop=True),
        irrigation_results
    ], axis=1)
    
    # Add confidence scores
    confidence_scores = []
    for i, pred in enumerate(predictions):
        confidence_scores.append(round(prediction_proba[i][pred] * 100, 2))
    
    results_df['Prediction_Confidence_%'] = confidence_scores
    
    return results_df

# Example usage with sample data
if __name__ == "__main__":
    print("\n" + "="*80)
    print("EXAMPLE PREDICTION")
    print("="*80)
    
    # Create sample input data
    sample_data = pd.DataFrame({
        'Soil_Type': ['Clay', 'Sandy', 'Loamy'],
        'Soil_pH': [6.5, 7.2, 6.8],
        'Soil_Moisture': [15.0, 45.0, 65.0],
        'Organic_Carbon': [0.8, 0.5, 1.2],
        'Electrical_Conductivity': [1.5, 2.0, 1.8],
        'Temperature_C': [35.0, 28.0, 22.0],
        'Humidity': [45.0, 70.0, 85.0],
        'Rainfall_mm': [400.0, 1200.0, 2000.0],
        'Sunlight_Hours': [9.5, 7.0, 6.0],
        'Wind_Speed_kmh': [12.0, 8.0, 5.0],
        'Crop_Type': ['Rice', 'Wheat', 'Maize'],
        'Crop_Growth_Stage': ['Flowering', 'Vegetative', 'Harvest'],
        'Season': ['Kharif', 'Rabi', 'Zaid'],
        'Irrigation_Type': ['Drip', 'Sprinkler', 'Canal'],
        'Water_Source': ['Groundwater', 'River', 'Reservoir'],
        'Field_Area_hectare': [5.0, 8.5, 3.2],
        'Mulching_Used': ['Yes', 'No', 'Yes'],
        'Previous_Irrigation_mm': [25.0, 60.0, 15.0],
        'Region': ['South', 'North', 'Central']
    })
    
    print("\nInput Data:")
    print(sample_data)
    
    # Make predictions
    predictions = predict_irrigation(sample_data)
    
    print("\n" + "="*80)
    print("PREDICTIONS WITH IRRIGATION RECOMMENDATIONS")
    print("="*80)
    
    display_cols = ['Soil_Type', 'Soil_Moisture', 'Temperature_C', 'Humidity', 
                   'Rainfall_mm', 'Crop_Type', 'Crop_Growth_Stage', 
                   'Predicted_Irrigation_Need', 'Recommended_Irrigation_mm', 
                   'Prediction_Confidence_%']
    
    print("\n" + predictions[display_cols].to_string(index=False))
    
    print("\n" + "="*80)
    print("DETAILED BREAKDOWN")
    print("="*80)
    
    for idx, row in predictions.iterrows():
        print(f"\nSample {idx + 1}:")
        print(f"  Crop: {row['Crop_Type']} ({row['Crop_Growth_Stage']} stage)")
        print(f"  Soil: {row['Soil_Type']}, Moisture: {row['Soil_Moisture']:.1f}%")
        print(f"  Environment: {row['Temperature_C']:.1f}°C, {row['Humidity']:.1f}% humidity, {row['Rainfall_mm']:.1f}mm rainfall")
        print(f"  → Prediction: {row['Predicted_Irrigation_Need']} need")
        print(f"  → Recommended Irrigation: {row['Recommended_Irrigation_mm']:.2f} mm")
        print(f"  → Confidence: {row['Prediction_Confidence_%']:.1f}%")
    
    print("\n" + "="*80)
    print("TO USE THIS SCRIPT WITH YOUR OWN DATA:")
    print("="*80)
    print("""
1. Load your data into a pandas DataFrame
2. Ensure it has all required columns (19 features, excluding Irrigation_Need)
3. Call: predictions = predict_irrigation(your_dataframe)
4. The output will include both the predicted category and irrigation amount

Example:
    import pandas as pd
    new_data = pd.read_csv('your_new_data.csv')
    results = predict_irrigation(new_data)
    results.to_csv('predictions_output.csv', index=False)
    """)


