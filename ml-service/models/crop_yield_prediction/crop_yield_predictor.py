#!/usr/bin/env python3
"""
AI-Powered Crop Yield Predictor
Predicts crop yield based on soil moisture and soil pH using Linear Regression
"""

import pandas as pd
import numpy as np
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


class CropYieldPredictor:
    """
    Crop Yield Prediction Model
    Uses soil moisture and pH to predict yield in kg per hectare
    """
    
    def __init__(self, model_path='crop_yield_model.pkl'):
        """Initialize the predictor with optional model path"""
        self.model = None
        self.model_path = model_path
        self.feature_names = ['soil_moisture_%', 'soil_pH']
        
    def train_model(self, data_path='Smart_Farming_Crop_Yield_2024.csv'):
        """
        Train the Linear Regression model on the dataset
        
        Parameters:
        -----------
        data_path : str
            Path to the CSV file containing training data
        """
        print("Loading dataset...")
        try:
            df = pd.read_csv(data_path)
        except FileNotFoundError:
            print(f"Error: Dataset file '{data_path}' not found!")
            print("Please ensure the CSV file is in the same directory.")
            return False
        
        print(f"Dataset loaded successfully! Shape: {df.shape}")
        
        # Handle missing values
        print("Handling missing values...")
        if 'irrigation_type' in df.columns:
            df['irrigation_type'] = df['irrigation_type'].fillna(df['irrigation_type'].mode()[0])
        if 'crop_disease_status' in df.columns:
            df['crop_disease_status'] = df['crop_disease_status'].fillna(df['crop_disease_status'].mode()[0])
        
        # Define features and target
        X = df[self.feature_names]
        y = df['yield_kg_per_hectare']
        
        # Split the data
        print("Splitting data into train and test sets (80-20 split)...")
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train the model
        print("Training Linear Regression model...")
        self.model = LinearRegression()
        self.model.fit(X_train, y_train)
        
        # Evaluate the model
        print("\nEvaluating model performance...")
        y_pred = self.model.predict(X_test)
        
        mae = mean_absolute_error(y_test, y_pred)
        mse = mean_squared_error(y_test, y_pred)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_test, y_pred)
        
        print("\n" + "="*50)
        print("MODEL EVALUATION METRICS")
        print("="*50)
        print(f"Mean Absolute Error (MAE):       {mae:.2f} kg/ha")
        print(f"Mean Squared Error (MSE):        {mse:.2f}")
        print(f"Root Mean Squared Error (RMSE):  {rmse:.2f} kg/ha")
        print(f"R-squared (R²):                  {r2:.4f}")
        print("="*50)
        
        # Save the model
        self.save_model()
        print(f"\nModel saved to '{self.model_path}'")
        
        return True
    
    def save_model(self):
        """Save the trained model to disk"""
        if self.model is not None:
            with open(self.model_path, 'wb') as f:
                pickle.dump(self.model, f)
    
    def load_model(self):
        """Load a previously trained model from disk"""
        if os.path.exists(self.model_path):
            with open(self.model_path, 'rb') as f:
                self.model = pickle.load(f)
            print(f"Model loaded from '{self.model_path}'")
            return True
        else:
            print(f"No saved model found at '{self.model_path}'")
            return False
    
    def predict_yield(self, soil_moisture, soil_ph):
        """
        Predict crop yield based on soil parameters
        
        Parameters:
        -----------
        soil_moisture : float
            Soil moisture percentage (0-100)
        soil_ph : float
            Soil pH level (typically 0-14)
            
        Returns:
        --------
        float : Predicted yield in kg per hectare
        """
        if self.model is None:
            print("Error: Model not loaded or trained!")
            return None
        
        # Create input DataFrame
        input_data = pd.DataFrame({
            'soil_moisture_%': [soil_moisture],
            'soil_pH': [soil_ph]
        })
        
        # Make prediction
        prediction = self.model.predict(input_data)[0]
        
        return prediction


def get_user_input():
    """
    Get crop parameters from user input with validation
    
    Returns:
    --------
    tuple : (soil_moisture, soil_ph) or (None, None) if invalid
    """
    print("\n" + "="*50)
    print("CROP YIELD PREDICTION - INPUT PARAMETERS")
    print("="*50)
    
    try:
        # Get soil moisture
        while True:
            soil_moisture = float(input("\nEnter Soil Moisture (%) [0-100]: "))
            if 0 <= soil_moisture <= 100:
                break
            else:
                print("❌ Invalid input! Soil moisture must be between 0 and 100%")
        
        # Get soil pH
        while True:
            soil_ph = float(input("Enter Soil pH [0-14]: "))
            if 0 <= soil_ph <= 14:
                break
            else:
                print("❌ Invalid input! Soil pH must be between 0 and 14")
        
        return soil_moisture, soil_ph
        
    except ValueError:
        print("❌ Invalid input! Please enter numeric values only.")
        return None, None
    except KeyboardInterrupt:
        print("\n\nOperation cancelled by user.")
        return None, None


def main():
    """Main function to run the crop yield predictor"""
    print("\n" + "="*70)
    print("     AI-POWERED CROP YIELD PREDICTOR FOR SMALL-SCALE FARMERS")
    print("="*70)
    
    # Initialize predictor
    predictor = CropYieldPredictor()
    
    # Try to load existing model, otherwise train new one
    if not predictor.load_model():
        print("\nNo pre-trained model found. Training new model...")
        print("-" * 50)
        if not predictor.train_model():
            print("\nFailed to train model. Exiting...")
            return
    
    # Get user input and make prediction
    while True:
        soil_moisture, soil_ph = get_user_input()
        
        if soil_moisture is None or soil_ph is None:
            break
        
        # Make prediction
        predicted_yield = predictor.predict_yield(soil_moisture, soil_ph)
        
        if predicted_yield is not None:
            print("\n" + "="*50)
            print("PREDICTION RESULT")
            print("="*50)
            print(f"Soil Moisture:     {soil_moisture:.2f}%")
            print(f"Soil pH:           {soil_ph:.2f}")
            print(f"\n🌾 Predicted Yield: {predicted_yield:.2f} kg/hectare")
            print("="*50)
        
        # Ask if user wants to make another prediction
        print("\n" + "-"*50)
        choice = input("\nWould you like to predict another crop yield? (yes/no): ").lower()
        if choice not in ['yes', 'y']:
            break
    
    print("\n" + "="*70)
    print("Thank you for using the Crop Yield Predictor!")
    print("="*70 + "\n")


if __name__ == "__main__":
    main()
