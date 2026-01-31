import pandas as pd
import numpy as np
import pickle
import sys

# Load the saved model
print("="*80)
print("IRRIGATION REQUIREMENT PREDICTION SYSTEM")
print("="*80)
print("\nLoading trained model...")

try:
    with open('/Users/dhirensacher/Project/KrishiSense_TechXpression/ml-service/models/irrigateAI/irrigation_model.pkl', 'rb') as f:
        model_objects = pickle.load(f)
    
    model = model_objects['model']
    scaler = model_objects['scaler']
    label_encoders = model_objects['label_encoders']
    target_encoder = model_objects['target_encoder']
    feature_names = model_objects['feature_names']
    print("✓ Model loaded successfully!\n")
except FileNotFoundError:
    print("❌ Error: Model file not found!")
    print("Please ensure 'irrigation_model.pkl' is in the same directory.")
    sys.exit(1)

def get_valid_input(prompt, valid_options=None, input_type='text'):
    """Get and validate user input"""
    while True:
        user_input = input(prompt).strip()
        
        if input_type == 'number':
            try:
                value = float(user_input)
                if valid_options and (value < valid_options[0] or value > valid_options[1]):
                    print(f"  ⚠️  Please enter a value between {valid_options[0]} and {valid_options[1]}")
                    continue
                return value
            except ValueError:
                print("  ⚠️  Please enter a valid number")
                continue
        else:  # text input
            if valid_options:
                if user_input in valid_options:
                    return user_input
                else:
                    print(f"  ⚠️  Invalid input. Choose from: {', '.join(valid_options)}")
                    continue
            return user_input

def calculate_irrigation_amount(prediction, features_dict):
    """Calculate irrigation water amount based on prediction and features"""
    pred_class = prediction[0]
    pred_label = target_encoder.inverse_transform([pred_class])[0]
    
    # Get relevant features
    soil_moisture = features_dict['Soil_Moisture']
    rainfall = features_dict['Rainfall_mm']
    temperature = features_dict['Temperature_C']
    humidity = features_dict['Humidity']
    crop_type = features_dict['Crop_Type']
    growth_stage = features_dict['Crop_Growth_Stage']
    
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
    
    return pred_label, round(irrigation_amount, 2)

def collect_crop_data():
    """Collect all required input from user"""
    print("="*80)
    print("ENTER CROP AND FIELD INFORMATION")
    print("="*80)
    
    crop_data = {}
    
    # Soil Characteristics
    print("\n📍 SOIL CHARACTERISTICS")
    print("-" * 40)
    crop_data['Soil_Type'] = get_valid_input(
        "Soil Type (Clay/Sandy/Silt/Loamy): ",
        valid_options=['Clay', 'Sandy', 'Silt', 'Loamy']
    )
    crop_data['Soil_pH'] = get_valid_input(
        "Soil pH (4.0 - 9.0): ",
        valid_options=[4.0, 9.0],
        input_type='number'
    )
    crop_data['Soil_Moisture'] = get_valid_input(
        "Soil Moisture % (0 - 100): ",
        valid_options=[0, 100],
        input_type='number'
    )
    crop_data['Organic_Carbon'] = get_valid_input(
        "Organic Carbon (0 - 2.0): ",
        valid_options=[0, 2.0],
        input_type='number'
    )
    crop_data['Electrical_Conductivity'] = get_valid_input(
        "Electrical Conductivity (0 - 4.0): ",
        valid_options=[0, 4.0],
        input_type='number'
    )
    
    # Environmental Conditions
    print("\n🌤️  ENVIRONMENTAL CONDITIONS")
    print("-" * 40)
    crop_data['Temperature_C'] = get_valid_input(
        "Temperature (°C): ",
        input_type='number'
    )
    crop_data['Humidity'] = get_valid_input(
        "Humidity % (0 - 100): ",
        valid_options=[0, 100],
        input_type='number'
    )
    crop_data['Rainfall_mm'] = get_valid_input(
        "Rainfall (mm): ",
        valid_options=[0, 3000],
        input_type='number'
    )
    crop_data['Sunlight_Hours'] = get_valid_input(
        "Sunlight Hours (0 - 24): ",
        valid_options=[0, 24],
        input_type='number'
    )
    crop_data['Wind_Speed_kmh'] = get_valid_input(
        "Wind Speed (km/h): ",
        valid_options=[0, 100],
        input_type='number'
    )
    
    # Crop Information
    print("\n🌾 CROP INFORMATION")
    print("-" * 40)
    crop_data['Crop_Type'] = get_valid_input(
        "Crop Type (Rice/Wheat/Maize/Cotton/Sugarcane/Potato): ",
        valid_options=['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Potato']
    )
    crop_data['Crop_Growth_Stage'] = get_valid_input(
        "Growth Stage (Sowing/Vegetative/Flowering/Harvest): ",
        valid_options=['Sowing', 'Vegetative', 'Flowering', 'Harvest']
    )
    crop_data['Season'] = get_valid_input(
        "Season (Kharif/Rabi/Zaid): ",
        valid_options=['Kharif', 'Rabi', 'Zaid']
    )
    
    # Irrigation & Field Details
    print("\n💧 IRRIGATION & FIELD DETAILS")
    print("-" * 40)
    crop_data['Irrigation_Type'] = get_valid_input(
        "Irrigation Type (Drip/Sprinkler/Canal/Rainfed): ",
        valid_options=['Drip', 'Sprinkler', 'Canal', 'Rainfed']
    )
    crop_data['Water_Source'] = get_valid_input(
        "Water Source (Groundwater/River/Reservoir/Rainwater): ",
        valid_options=['Groundwater', 'River', 'Reservoir', 'Rainwater']
    )
    crop_data['Field_Area_hectare'] = get_valid_input(
        "Field Area (hectares): ",
        valid_options=[0, 100],
        input_type='number'
    )
    crop_data['Mulching_Used'] = get_valid_input(
        "Mulching Used (Yes/No): ",
        valid_options=['Yes', 'No']
    )
    crop_data['Previous_Irrigation_mm'] = get_valid_input(
        "Previous Irrigation (mm): ",
        valid_options=[0, 200],
        input_type='number'
    )
    crop_data['Region'] = get_valid_input(
        "Region (North/South/East/West/Central): ",
        valid_options=['North', 'South', 'East', 'West', 'Central']
    )
    
    return crop_data

def predict_single_crop(crop_data):
    """Make prediction for single crop"""
    # Create DataFrame
    df = pd.DataFrame([crop_data])
    
    # Store original data
    original_data = df.copy()
    
    # Encode categorical variables
    categorical_cols = [col for col in label_encoders.keys() if col in df.columns]
    for col in categorical_cols:
        df[col] = label_encoders[col].transform(df[col])
    
    # Identify numerical columns
    numerical_cols = [col for col in df.columns if col not in categorical_cols]
    
    # Scale numerical features
    df_scaled = df.copy()
    df_scaled[numerical_cols] = scaler.transform(df[numerical_cols])
    
    # Ensure correct column order
    df_scaled = df_scaled[feature_names]
    
    # Make prediction
    prediction = model.predict(df_scaled)
    prediction_proba = model.predict_proba(df_scaled)
    
    # Calculate irrigation amount
    pred_label, irrigation_amount = calculate_irrigation_amount(prediction, crop_data)
    
    # Get confidence
    confidence = round(prediction_proba[0][prediction[0]] * 100, 2)
    
    return pred_label, irrigation_amount, confidence, original_data

def display_results(pred_label, irrigation_amount, confidence, original_data):
    """Display prediction results in a nice format"""
    print("\n" + "="*80)
    print("🎯 IRRIGATION PREDICTION RESULTS")
    print("="*80)
    
    data = original_data.iloc[0]
    
    print("\n📊 INPUT SUMMARY")
    print("-" * 80)
    print(f"Crop: {data['Crop_Type']} ({data['Crop_Growth_Stage']} stage)")
    print(f"Soil: {data['Soil_Type']}, pH: {data['Soil_pH']}, Moisture: {data['Soil_Moisture']}%")
    print(f"Environment: {data['Temperature_C']}°C, {data['Humidity']}% humidity, {data['Rainfall_mm']}mm rainfall")
    print(f"Field: {data['Field_Area_hectare']} hectares, {data['Region']} region")
    print(f"Irrigation: {data['Irrigation_Type']} system, {data['Water_Source']} source")
    
    print("\n" + "="*80)
    print("💧 IRRIGATION RECOMMENDATION")
    print("="*80)
    
    # Color-coded output based on need
    need_emoji = {"Low": "🟢", "Medium": "🟡", "High": "🔴"}
    print(f"\n{need_emoji.get(pred_label, '⚪')} Irrigation Need Category: {pred_label.upper()}")
    print(f"💦 Recommended Water Amount: {irrigation_amount} mm")
    print(f"📈 Prediction Confidence: {confidence}%")
    
    # Calculate total water needed
    total_water = irrigation_amount * data['Field_Area_hectare'] * 10  # Convert to cubic meters
    print(f"🌊 Total Water Required: {total_water:,.2f} cubic meters (for {data['Field_Area_hectare']} hectares)")
    
    print("\n" + "-"*80)
    print("📝 INTERPRETATION")
    print("-" * 80)
    
    if pred_label == "Low":
        print("✓ Current conditions are favorable with adequate moisture.")
        print("✓ Minimal irrigation required - avoid over-watering.")
        print("✓ Monitor soil moisture regularly.")
    elif pred_label == "Medium":
        print("⚠ Moderate irrigation needed to maintain optimal growth.")
        print("⚠ Schedule irrigation based on crop stage requirements.")
        print("⚠ Consider weather forecast before irrigating.")
    else:  # High
        print("⚡ HIGH PRIORITY: Immediate irrigation required!")
        print("⚡ Crop is experiencing water stress.")
        print("⚡ Schedule irrigation as soon as possible to prevent yield loss.")
    
    print("\n" + "="*80)

def main():
    """Main function"""
    while True:
        try:
            # Collect data
            crop_data = collect_crop_data()
            
            # Make prediction
            print("\n🔄 Processing prediction...")
            pred_label, irrigation_amount, confidence, original_data = predict_single_crop(crop_data)
            
            # Display results
            display_results(pred_label, irrigation_amount, confidence, original_data)
            
            # Ask if user wants to make another prediction
            print("\n" + "="*80)
            another = input("\n🔁 Do you want to predict for another crop? (yes/no): ").strip().lower()
            
            if another not in ['yes', 'y']:
                print("\n" + "="*80)
                print("Thank you for using the Irrigation Prediction System!")
                print("💚 Happy Farming! 🌾")
                print("="*80)
                break
            
            print("\n\n")
            
        except KeyboardInterrupt:
            print("\n\n⚠️  Prediction cancelled by user.")
            print("="*80)
            break
        except Exception as e:
            print(f"\n❌ Error: {str(e)}")
            print("Please try again with valid inputs.")
            continue

if __name__ == "__main__":
    main()