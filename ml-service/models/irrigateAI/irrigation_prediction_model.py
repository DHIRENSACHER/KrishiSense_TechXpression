import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import warnings
warnings.filterwarnings('ignore')

# Set random seed for reproducibility
np.random.seed(42)

# Load the data
print("Loading data...")
df = pd.read_csv('/mnt/user-data/uploads/irrigation_prediction.csv')
print(f"Dataset shape: {df.shape}")
print(f"\nFirst few rows:")
print(df.head())

# Display basic statistics
print("\n" + "="*80)
print("DATASET OVERVIEW")
print("="*80)
print(f"\nTarget variable distribution:")
print(df['Irrigation_Need'].value_counts())
print(f"\nPercentage distribution:")
print(df['Irrigation_Need'].value_counts(normalize=True) * 100)

# Check for missing values
print(f"\nMissing values: {df.isnull().sum().sum()}")

# Prepare features and target
print("\n" + "="*80)
print("DATA PREPROCESSING")
print("="*80)

# Separate features and target
X = df.drop('Irrigation_Need', axis=1)
y = df['Irrigation_Need']

# Identify categorical and numerical columns
categorical_cols = X.select_dtypes(include=['object']).columns.tolist()
numerical_cols = X.select_dtypes(include=['float64', 'int64']).columns.tolist()

print(f"\nCategorical features ({len(categorical_cols)}): {categorical_cols}")
print(f"Numerical features ({len(numerical_cols)}): {numerical_cols}")

# Encode categorical variables
label_encoders = {}
X_encoded = X.copy()

for col in categorical_cols:
    le = LabelEncoder()
    X_encoded[col] = le.fit_transform(X[col])
    label_encoders[col] = le

# Encode target variable
le_target = LabelEncoder()
y_encoded = le_target.fit_transform(y)

print(f"\nTarget classes: {le_target.classes_}")

# Split the data
X_train, X_test, y_train, y_test = train_test_split(
    X_encoded, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)

print(f"\nTraining set size: {X_train.shape[0]}")
print(f"Test set size: {X_test.shape[0]}")

# Scale numerical features
scaler = StandardScaler()
X_train_scaled = X_train.copy()
X_test_scaled = X_test.copy()

X_train_scaled[numerical_cols] = scaler.fit_transform(X_train[numerical_cols])
X_test_scaled[numerical_cols] = scaler.transform(X_test[numerical_cols])

# Train Random Forest model
print("\n" + "="*80)
print("MODEL TRAINING - RANDOM FOREST")
print("="*80)

rf_model = RandomForestClassifier(
    n_estimators=200,
    max_depth=20,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)

rf_model.fit(X_train_scaled, y_train)
print("✓ Random Forest training complete")

# Make predictions
y_pred_rf = rf_model.predict(X_test_scaled)
y_pred_proba_rf = rf_model.predict_proba(X_test_scaled)

# Evaluate Random Forest
print("\n" + "="*80)
print("MODEL EVALUATION - RANDOM FOREST")
print("="*80)

accuracy_rf = accuracy_score(y_test, y_pred_rf)
print(f"\nTest Accuracy: {accuracy_rf:.4f} ({accuracy_rf*100:.2f}%)")

print("\nClassification Report:")
print(classification_report(y_test, y_pred_rf, target_names=le_target.classes_))

print("\nConfusion Matrix:")
cm = confusion_matrix(y_test, y_pred_rf)
cm_df = pd.DataFrame(cm, 
                     index=[f'True {cls}' for cls in le_target.classes_],
                     columns=[f'Pred {cls}' for cls in le_target.classes_])
print(cm_df)

# Cross-validation
cv_scores = cross_val_score(rf_model, X_train_scaled, y_train, cv=5)
print(f"\nCross-validation scores: {cv_scores}")
print(f"Mean CV accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std()*2:.4f})")

# Feature importance
print("\n" + "="*80)
print("FEATURE IMPORTANCE (Top 15)")
print("="*80)

feature_importance = pd.DataFrame({
    'feature': X_encoded.columns,
    'importance': rf_model.feature_importances_
}).sort_values('importance', ascending=False)

print(feature_importance.head(15).to_string(index=False))

# Train Gradient Boosting model for comparison
print("\n" + "="*80)
print("MODEL TRAINING - GRADIENT BOOSTING")
print("="*80)

gb_model = GradientBoostingClassifier(
    n_estimators=150,
    max_depth=8,
    learning_rate=0.1,
    random_state=42
)

gb_model.fit(X_train_scaled, y_train)
print("✓ Gradient Boosting training complete")

y_pred_gb = gb_model.predict(X_test_scaled)
accuracy_gb = accuracy_score(y_test, y_pred_gb)
print(f"\nGradient Boosting Test Accuracy: {accuracy_gb:.4f} ({accuracy_gb*100:.2f}%)")

# Function to calculate irrigation water amount based on prediction and features
def calculate_irrigation_amount(prediction, features_df, original_df):
    """
    Calculate irrigation water amount in mm based on prediction and environmental factors.
    
    Logic:
    - Base amounts: Low (20-50mm), Medium (50-90mm), High (90-150mm)
    - Adjusted based on soil moisture, rainfall, temperature, humidity, crop type, etc.
    """
    results = []
    
    for idx, pred_class in enumerate(prediction):
        # Get prediction class name
        pred_label = le_target.inverse_transform([pred_class])[0]
        
        # Get relevant features from original dataframe
        soil_moisture = original_df.iloc[idx]['Soil_Moisture']
        rainfall = original_df.iloc[idx]['Rainfall_mm']
        temperature = original_df.iloc[idx]['Temperature_C']
        humidity = original_df.iloc[idx]['Humidity']
        previous_irrigation = original_df.iloc[idx]['Previous_Irrigation_mm']
        crop_type = original_df.iloc[idx]['Crop_Type']
        growth_stage = original_df.iloc[idx]['Crop_Growth_Stage']
        field_area = original_df.iloc[idx]['Field_Area_hectare']
        
        # Base irrigation amounts for each category
        if pred_label == 'Low':
            base_amount = np.random.uniform(20, 50)
        elif pred_label == 'Medium':
            base_amount = np.random.uniform(50, 90)
        else:  # High
            base_amount = np.random.uniform(90, 150)
        
        # Adjustment factors
        
        # 1. Soil moisture adjustment (inverse relationship)
        if soil_moisture < 20:
            moisture_factor = 1.3  # Very dry, need more water
        elif soil_moisture < 40:
            moisture_factor = 1.1
        elif soil_moisture < 60:
            moisture_factor = 1.0
        else:
            moisture_factor = 0.8  # High moisture, need less water
        
        # 2. Rainfall adjustment (inverse relationship)
        if rainfall > 1500:
            rainfall_factor = 0.7  # High rainfall, reduce irrigation
        elif rainfall > 1000:
            rainfall_factor = 0.85
        elif rainfall > 500:
            rainfall_factor = 1.0
        else:
            rainfall_factor = 1.15  # Low rainfall, increase irrigation
        
        # 3. Temperature adjustment
        if temperature > 35:
            temp_factor = 1.2  # High temp, more evaporation
        elif temperature > 25:
            temp_factor = 1.1
        else:
            temp_factor = 0.95
        
        # 4. Humidity adjustment (inverse relationship)
        if humidity > 80:
            humidity_factor = 0.85  # High humidity, less evaporation
        elif humidity > 60:
            humidity_factor = 0.95
        else:
            humidity_factor = 1.1  # Low humidity, more evaporation
        
        # 5. Crop-specific adjustments
        crop_factors = {
            'Rice': 1.3,      # High water requirement
            'Sugarcane': 1.25,
            'Cotton': 1.0,
            'Wheat': 0.9,
            'Maize': 1.0,
            'Potato': 1.1
        }
        crop_factor = crop_factors.get(crop_type, 1.0)
        
        # 6. Growth stage adjustment
        stage_factors = {
            'Sowing': 1.2,       # Critical stage
            'Vegetative': 1.15,   # High water need
            'Flowering': 1.3,     # Highest water need
            'Harvest': 0.7        # Lower water need
        }
        stage_factor = stage_factors.get(growth_stage, 1.0)
        
        # Calculate final irrigation amount
        irrigation_amount = (base_amount * 
                           moisture_factor * 
                           rainfall_factor * 
                           temp_factor * 
                           humidity_factor * 
                           crop_factor * 
                           stage_factor)
        
        # Ensure reasonable bounds based on prediction category
        if pred_label == 'Low':
            irrigation_amount = np.clip(irrigation_amount, 15, 60)
        elif pred_label == 'Medium':
            irrigation_amount = np.clip(irrigation_amount, 45, 110)
        else:  # High
            irrigation_amount = np.clip(irrigation_amount, 85, 180)
        
        # Round to 2 decimal places
        irrigation_amount = round(irrigation_amount, 2)
        
        results.append({
            'Predicted_Irrigation_Need': pred_label,
            'Recommended_Irrigation_mm': irrigation_amount
        })
    
    return pd.DataFrame(results)

# Generate predictions with irrigation amounts for test set
print("\n" + "="*80)
print("GENERATING IRRIGATION RECOMMENDATIONS")
print("="*80)

# Get original test data
test_indices = X_test.index
test_original = df.loc[test_indices].reset_index(drop=True)

# Calculate irrigation amounts
irrigation_results = calculate_irrigation_amount(y_pred_rf, X_test_scaled, test_original)

# Combine with test data
final_results = pd.concat([
    test_original.reset_index(drop=True),
    irrigation_results
], axis=1)

# Add actual irrigation need for comparison
final_results['Actual_Irrigation_Need'] = df.loc[test_indices, 'Irrigation_Need'].values

# Show sample predictions
print("\nSample Predictions (first 20 rows):")
display_cols = ['Soil_Type', 'Soil_Moisture', 'Temperature_C', 'Humidity', 'Rainfall_mm', 
                'Crop_Type', 'Crop_Growth_Stage', 'Actual_Irrigation_Need', 
                'Predicted_Irrigation_Need', 'Recommended_Irrigation_mm']
print(final_results[display_cols].head(20).to_string(index=False))

# Statistics on irrigation amounts by category
print("\n" + "="*80)
print("IRRIGATION AMOUNT STATISTICS BY CATEGORY")
print("="*80)

for category in ['Low', 'Medium', 'High']:
    category_data = final_results[final_results['Predicted_Irrigation_Need'] == category]['Recommended_Irrigation_mm']
    if len(category_data) > 0:
        print(f"\n{category} Irrigation Need:")
        print(f"  Count: {len(category_data)}")
        print(f"  Mean: {category_data.mean():.2f} mm")
        print(f"  Median: {category_data.median():.2f} mm")
        print(f"  Min: {category_data.min():.2f} mm")
        print(f"  Max: {category_data.max():.2f} mm")
        print(f"  Std Dev: {category_data.std():.2f} mm")

# Save results
output_path = '/mnt/user-data/outputs/irrigation_predictions_with_amounts.csv'
final_results.to_csv(output_path, index=False)
print(f"\n✓ Full predictions saved to: {output_path}")

# Save model summary
model_summary_path = '/mnt/user-data/outputs/model_summary.txt'
with open(model_summary_path, 'w') as f:
    f.write("="*80 + "\n")
    f.write("IRRIGATION PREDICTION MODEL SUMMARY\n")
    f.write("="*80 + "\n\n")
    f.write(f"Model Type: Random Forest Classifier\n")
    f.write(f"Test Accuracy: {accuracy_rf:.4f} ({accuracy_rf*100:.2f}%)\n")
    f.write(f"Training samples: {len(X_train)}\n")
    f.write(f"Test samples: {len(X_test)}\n\n")
    f.write("Target Classes:\n")
    for cls in le_target.classes_:
        count = (y_test == le_target.transform([cls])[0]).sum()
        f.write(f"  - {cls}: {count} samples\n")
    f.write("\n" + "="*80 + "\n")
    f.write("TOP 10 MOST IMPORTANT FEATURES\n")
    f.write("="*80 + "\n\n")
    f.write(feature_importance.head(10).to_string(index=False))
    f.write("\n\n" + "="*80 + "\n")
    f.write("IRRIGATION AMOUNT LOGIC\n")
    f.write("="*80 + "\n\n")
    f.write("Base Ranges:\n")
    f.write("  - Low: 20-50 mm\n")
    f.write("  - Medium: 50-90 mm\n")
    f.write("  - High: 90-150 mm\n\n")
    f.write("Adjustment Factors:\n")
    f.write("  1. Soil Moisture (inverse)\n")
    f.write("  2. Rainfall (inverse)\n")
    f.write("  3. Temperature (direct)\n")
    f.write("  4. Humidity (inverse)\n")
    f.write("  5. Crop Type (specific requirements)\n")
    f.write("  6. Growth Stage (critical periods need more)\n\n")
    f.write("Final Bounds:\n")
    f.write("  - Low: 15-60 mm\n")
    f.write("  - Medium: 45-110 mm\n")
    f.write("  - High: 85-180 mm\n")

print(f"✓ Model summary saved to: {model_summary_path}")

# Create a simple prediction function
print("\n" + "="*80)
print("MODEL READY FOR PREDICTIONS")
print("="*80)
print("\nThe model can now predict irrigation needs and recommend water amounts.")
print("Simply provide the required input features and the model will output:")
print("  1. Irrigation Need Category (Low/Medium/High)")
print("  2. Recommended Irrigation Amount (in mm)")

# Save model objects (optional - for later use)
import pickle

model_objects = {
    'model': rf_model,
    'scaler': scaler,
    'label_encoders': label_encoders,
    'target_encoder': le_target,
    'feature_names': X_encoded.columns.tolist()
}

model_path = '/mnt/user-data/outputs/irrigation_model.pkl'
with open(model_path, 'wb') as f:
    pickle.dump(model_objects, f)

print(f"\n✓ Model objects saved to: {model_path}")
print("\n" + "="*80)
print("TRAINING COMPLETE!")
print("="*80)
