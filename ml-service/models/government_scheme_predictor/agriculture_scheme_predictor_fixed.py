"""
Smart Agriculture Advisory System - LOCAL MACHINE VERSION
Predicts the most suitable Government Scheme for farmers based on agricultural parameters
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt
import warnings
import os
warnings.filterwarnings('ignore')

# Set random seed for reproducibility
np.random.seed(42)

# Create output directory if it doesn't exist
OUTPUT_DIR = 'outputs'
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)
    print(f"Created output directory: {OUTPUT_DIR}")


def generate_synthetic_dataset(n_samples=500):
    """
    Generate synthetic dataset based on logical rules for government schemes
    
    Scheme Selection Logic:
    - PM-KISAN: Small farmers (land < 2 hectares), any crop
    - PM Fasal Bima Yojana: Weather-vulnerable crops, extreme rainfall/temp
    - Soil Health Card Scheme: Poor soil conditions (imbalanced NPK or bad pH)
    - PM Krishi Sinchai Yojana: Low rainfall areas, water-intensive crops
    - Paramparagat Krishi Vikas Yojana: Organic farming suitable conditions
    """
    
    # Define crop categories
    crops = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Jute', 'Sugarcane', 
             'Pulses', 'Vegetables', 'Fruits', 'Spices']
    
    data = {
        'Crop': [],
        'Nitrogen_N': [],
        'Phosphorus_P': [],
        'Potassium_K': [],
        'pH': [],
        'Rainfall_mm': [],
        'Temperature_C': [],
        'Humidity_percent': [],
        'Land_Size_hectares': [],
        'Scheme': []
    }
    
    for _ in range(n_samples):
        crop = np.random.choice(crops)
        
        # Generate base parameters
        nitrogen = np.random.randint(20, 140)
        phosphorus = np.random.randint(15, 80)
        potassium = np.random.randint(20, 100)
        ph = np.random.uniform(4.5, 8.5)
        rainfall = np.random.randint(400, 2500)
        temperature = np.random.uniform(15, 40)
        humidity = np.random.uniform(40, 90)
        land_size = np.random.uniform(0.5, 10)
        
        # Scheme determination based on logical rules
        scheme = None
        
        # Rule 1: PM-KISAN - Priority for small farmers
        if land_size < 2.0 and np.random.random() > 0.3:
            scheme = 'PM-KISAN'
        
        # Rule 2: PM Fasal Bima Yojana - Crop insurance for vulnerable conditions
        elif (rainfall < 600 or rainfall > 2000 or temperature > 35 or temperature < 18) and np.random.random() > 0.4:
            scheme = 'PM Fasal Bima Yojana'
        
        # Rule 3: Soil Health Card Scheme - Poor soil conditions
        elif (nitrogen < 40 or phosphorus < 25 or potassium < 30 or ph < 5.5 or ph > 8.0) and np.random.random() > 0.4:
            scheme = 'Soil Health Card Scheme'
        
        # Rule 4: PM Krishi Sinchai Yojana - Low rainfall, irrigation needed
        elif rainfall < 800 and crop in ['Rice', 'Sugarcane', 'Vegetables'] and np.random.random() > 0.4:
            scheme = 'PM Krishi Sinchai Yojana'
        
        # Rule 5: Paramparagat Krishi Vikas Yojana - Organic farming
        elif (nitrogen > 80 and phosphorus > 50 and potassium > 60 and 
              6.0 <= ph <= 7.5 and humidity > 60) and np.random.random() > 0.5:
            scheme = 'Paramparagat Krishi Vikas Yojana'
        
        # Default fallback based on probabilities
        if scheme is None:
            schemes = ['PM-KISAN', 'PM Fasal Bima Yojana', 'Soil Health Card Scheme', 
                      'PM Krishi Sinchai Yojana', 'Paramparagat Krishi Vikas Yojana']
            weights = [0.25, 0.25, 0.20, 0.15, 0.15]
            scheme = np.random.choice(schemes, p=weights)
        
        # Add to dataset
        data['Crop'].append(crop)
        data['Nitrogen_N'].append(nitrogen)
        data['Phosphorus_P'].append(phosphorus)
        data['Potassium_K'].append(potassium)
        data['pH'].append(round(ph, 2))
        data['Rainfall_mm'].append(rainfall)
        data['Temperature_C'].append(round(temperature, 2))
        data['Humidity_percent'].append(round(humidity, 2))
        data['Land_Size_hectares'].append(round(land_size, 2))
        data['Scheme'].append(scheme)
    
    df = pd.DataFrame(data)
    return df


def preprocess_data(df):
    """
    Preprocess the dataset: encode categorical variables
    """
    # Create a copy to avoid modifying original
    df_processed = df.copy()
    
    # Encode the Crop column using LabelEncoder
    crop_encoder = LabelEncoder()
    df_processed['Crop_Encoded'] = crop_encoder.fit_transform(df_processed['Crop'])
    
    # Encode the target variable (Scheme)
    scheme_encoder = LabelEncoder()
    df_processed['Scheme_Encoded'] = scheme_encoder.fit_transform(df_processed['Scheme'])
    
    return df_processed, crop_encoder, scheme_encoder


def train_model(df_processed):
    """
    Train Random Forest Classifier
    """
    # Select features for training
    feature_columns = ['Crop_Encoded', 'Nitrogen_N', 'Phosphorus_P', 'Potassium_K', 
                      'pH', 'Rainfall_mm', 'Temperature_C', 'Humidity_percent', 
                      'Land_Size_hectares']
    
    X = df_processed[feature_columns]
    y = df_processed['Scheme_Encoded']
    
    # Split data: 80% training, 20% testing
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Train Random Forest Classifier
    print("Training Random Forest Classifier...")
    rf_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    rf_model.fit(X_train, y_train)
    
    # Make predictions
    y_pred = rf_model.predict(X_test)
    
    return rf_model, X_train, X_test, y_train, y_test, y_pred, feature_columns


def evaluate_model(y_test, y_pred, scheme_encoder):
    """
    Evaluate model performance
    """
    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\n{'='*60}")
    print(f"MODEL PERFORMANCE")
    print(f"{'='*60}")
    print(f"Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    
    # Classification Report
    print(f"\n{'='*60}")
    print("CLASSIFICATION REPORT")
    print(f"{'='*60}")
    print(classification_report(y_test, y_pred, 
                                target_names=scheme_encoder.classes_,
                                digits=4))
    
    # Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    
    # Plot Confusion Matrix
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=scheme_encoder.classes_,
                yticklabels=scheme_encoder.classes_,
                cbar_kws={'label': 'Count'})
    plt.title('Confusion Matrix - Government Scheme Prediction', fontsize=14, fontweight='bold')
    plt.xlabel('Predicted Scheme', fontsize=12)
    plt.ylabel('Actual Scheme', fontsize=12)
    plt.xticks(rotation=45, ha='right')
    plt.yticks(rotation=0)
    plt.tight_layout()
    plt.savefig(f'{OUTPUT_DIR}/confusion_matrix.png', dpi=300, bbox_inches='tight')
    print(f"\nConfusion Matrix saved as '{OUTPUT_DIR}/confusion_matrix.png'")
    
    return accuracy, cm


def plot_feature_importance(model, feature_columns):
    """
    Plot feature importance
    """
    # Get feature importances
    importances = model.feature_importances_
    indices = np.argsort(importances)[::-1]
    
    # Plot
    plt.figure(figsize=(10, 6))
    plt.title('Feature Importance - Government Scheme Prediction', fontsize=14, fontweight='bold')
    plt.bar(range(len(importances)), importances[indices], align='center')
    plt.xticks(range(len(importances)), [feature_columns[i] for i in indices], rotation=45, ha='right')
    plt.ylabel('Importance Score', fontsize=12)
    plt.xlabel('Features', fontsize=12)
    plt.tight_layout()
    plt.savefig(f'{OUTPUT_DIR}/feature_importance.png', dpi=300, bbox_inches='tight')
    print(f"Feature Importance plot saved as '{OUTPUT_DIR}/feature_importance.png'")


def predict_scheme(model, crop_encoder, scheme_encoder, farmer_data):
    """
    Predict government scheme for a farmer
    
    Parameters:
    -----------
    farmer_data : dict
        Dictionary containing farmer's data with keys:
        - Crop: str
        - Nitrogen_N: int
        - Phosphorus_P: int
        - Potassium_K: int
        - pH: float
        - Rainfall_mm: int
        - Temperature_C: float
        - Humidity_percent: float
        - Land_Size_hectares: float
    
    Returns:
    --------
    str: Recommended government scheme
    """
    # Encode the crop
    try:
        crop_encoded = crop_encoder.transform([farmer_data['Crop']])[0]
    except:
        print(f"Warning: Crop '{farmer_data['Crop']}' not in training data. Using default encoding.")
        crop_encoded = 0
    
    # Prepare input features
    input_features = np.array([[
        crop_encoded,
        farmer_data['Nitrogen_N'],
        farmer_data['Phosphorus_P'],
        farmer_data['Potassium_K'],
        farmer_data['pH'],
        farmer_data['Rainfall_mm'],
        farmer_data['Temperature_C'],
        farmer_data['Humidity_percent'],
        farmer_data['Land_Size_hectares']
    ]])
    
    # Make prediction
    prediction_encoded = model.predict(input_features)[0]
    prediction_proba = model.predict_proba(input_features)[0]
    
    # Decode prediction
    recommended_scheme = scheme_encoder.inverse_transform([prediction_encoded])[0]
    confidence = prediction_proba[prediction_encoded] * 100
    
    # Display results
    print(f"\n{'='*60}")
    print(f"FARMER DATA ANALYSIS")
    print(f"{'='*60}")
    for key, value in farmer_data.items():
        print(f"{key:20s}: {value}")
    
    print(f"\n{'='*60}")
    print(f"RECOMMENDED SCHEME")
    print(f"{'='*60}")
    print(f"Scheme: {recommended_scheme}")
    print(f"Confidence: {confidence:.2f}%")
    
    # Show all probabilities
    print(f"\n{'='*60}")
    print(f"ALL SCHEME PROBABILITIES")
    print(f"{'='*60}")
    for i, scheme_name in enumerate(scheme_encoder.classes_):
        print(f"{scheme_name:40s}: {prediction_proba[i]*100:6.2f}%")
    
    return recommended_scheme


def main():
    """
    Main execution function
    """
    print("="*60)
    print("SMART AGRICULTURE ADVISORY SYSTEM")
    print("Government Scheme Recommendation using Machine Learning")
    print("="*60)
    
    # Step 1: Generate synthetic dataset
    print("\n[1/6] Generating synthetic dataset...")
    df = generate_synthetic_dataset(n_samples=500)
    print(f"Dataset created with {len(df)} records")
    print(f"\nDataset shape: {df.shape}")
    print(f"\nScheme distribution:")
    print(df['Scheme'].value_counts())
    
    # Save dataset
    df.to_csv(f'{OUTPUT_DIR}/agriculture_scheme_dataset.csv', index=False)
    print(f"\nDataset saved as '{OUTPUT_DIR}/agriculture_scheme_dataset.csv'")
    
    # Step 2: Preprocess data
    print("\n[2/6] Preprocessing data...")
    df_processed, crop_encoder, scheme_encoder = preprocess_data(df)
    print("Data preprocessing completed")
    print(f"Crops encoded: {list(crop_encoder.classes_)}")
    print(f"Schemes: {list(scheme_encoder.classes_)}")
    
    # Step 3: Train model
    print("\n[3/6] Training Random Forest model...")
    model, X_train, X_test, y_train, y_test, y_pred, feature_columns = train_model(df_processed)
    print(f"Model trained on {len(X_train)} samples")
    print(f"Testing on {len(X_test)} samples")
    
    # Step 4: Evaluate model
    print("\n[4/6] Evaluating model performance...")
    accuracy, cm = evaluate_model(y_test, y_pred, scheme_encoder)
    
    # Step 5: Feature importance
    print(f"\n[5/6] Analyzing feature importance...")
    plot_feature_importance(model, feature_columns)
    
    # Step 6: Example predictions
    print(f"\n[6/6] Running example predictions...")
    
    # Example 1: Small farmer
    print("\n" + "="*60)
    print("EXAMPLE 1: Small Farmer")
    print("="*60)
    farmer1 = {
        'Crop': 'Rice',
        'Nitrogen_N': 45,
        'Phosphorus_P': 30,
        'Potassium_K': 35,
        'pH': 6.5,
        'Rainfall_mm': 1200,
        'Temperature_C': 28.5,
        'Humidity_percent': 75.0,
        'Land_Size_hectares': 1.5
    }
    predict_scheme(model, crop_encoder, scheme_encoder, farmer1)
    
    # Example 2: Poor soil conditions
    print("\n" + "="*60)
    print("EXAMPLE 2: Poor Soil Conditions")
    print("="*60)
    farmer2 = {
        'Crop': 'Wheat',
        'Nitrogen_N': 25,
        'Phosphorus_P': 18,
        'Potassium_K': 22,
        'pH': 5.2,
        'Rainfall_mm': 900,
        'Temperature_C': 22.0,
        'Humidity_percent': 55.0,
        'Land_Size_hectares': 3.5
    }
    predict_scheme(model, crop_encoder, scheme_encoder, farmer2)
    
    # Example 3: Low rainfall area
    print("\n" + "="*60)
    print("EXAMPLE 3: Low Rainfall Area")
    print("="*60)
    farmer3 = {
        'Crop': 'Sugarcane',
        'Nitrogen_N': 80,
        'Phosphorus_P': 45,
        'Potassium_K': 55,
        'pH': 6.8,
        'Rainfall_mm': 550,
        'Temperature_C': 30.0,
        'Humidity_percent': 65.0,
        'Land_Size_hectares': 4.0
    }
    predict_scheme(model, crop_encoder, scheme_encoder, farmer3)
    
    # Example 4: Organic farming suitable
    print("\n" + "="*60)
    print("EXAMPLE 4: Organic Farming Suitable Conditions")
    print("="*60)
    farmer4 = {
        'Crop': 'Vegetables',
        'Nitrogen_N': 95,
        'Phosphorus_P': 60,
        'Potassium_K': 70,
        'pH': 6.7,
        'Rainfall_mm': 1100,
        'Temperature_C': 25.0,
        'Humidity_percent': 72.0,
        'Land_Size_hectares': 2.5
    }
    predict_scheme(model, crop_encoder, scheme_encoder, farmer4)
    
    print("\n" + "="*60)
    print("ANALYSIS COMPLETE!")
    print("="*60)
    print(f"\nGenerated Files (in '{OUTPUT_DIR}/' directory):")
    print("1. agriculture_scheme_dataset.csv - Synthetic training dataset")
    print("2. confusion_matrix.png - Model performance visualization")
    print("3. feature_importance.png - Feature importance analysis")
    
    # Return trained components for interactive use
    return model, crop_encoder, scheme_encoder, df


if __name__ == "__main__":
    model, crop_encoder, scheme_encoder, df = main()
    
    print("\n" + "="*60)
    print("INTERACTIVE MODE")
    print("="*60)
    print("\nYou can now use the predict_scheme() function to predict schemes for new farmers.")
    print("\nExample usage:")
    print("""
    new_farmer = {
        'Crop': 'Maize',
        'Nitrogen_N': 50,
        'Phosphorus_P': 35,
        'Potassium_K': 40,
        'pH': 6.3,
        'Rainfall_mm': 800,
        'Temperature_C': 26.5,
        'Humidity_percent': 68.0,
        'Land_Size_hectares': 2.0
    }
    
    predict_scheme(model, crop_encoder, scheme_encoder, new_farmer)
    """)
