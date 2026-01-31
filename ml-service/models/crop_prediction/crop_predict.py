#!/usr/bin/env python3
"""
Crop Prediction Model
Converts the Jupyter notebook into a Python script with input/output functionality
"""

from __future__ import print_function
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report
from sklearn import metrics
from sklearn import tree
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.tree import DecisionTreeClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
import warnings
warnings.filterwarnings('ignore')


def load_and_prepare_data(csv_path):
    """Load and prepare the dataset"""
    df = pd.read_csv(csv_path)
    
    # Prepare features and target
    features = df[['Crop_Year', 'Area', 'Temparetue', 'Rainfall', 'Humidity', 'Sun hours']]
    target = df['Crop']
    
    return features, target, df


def train_models(features, target):
    """Train all models and return them with their accuracies"""
    # Split data
    Xtrain, Xtest, Ytrain, Ytest = train_test_split(
        features, target, test_size=0.2, random_state=2
    )
    
    models = {}
    accuracies = {}
    
    # Decision Tree
    print("Training Decision Tree...")
    dt = DecisionTreeClassifier(criterion="entropy", random_state=2, max_depth=5)
    dt.fit(Xtrain, Ytrain)
    dt_pred = dt.predict(Xtest)
    dt_acc = metrics.accuracy_score(Ytest, dt_pred)
    models['Decision Tree'] = dt
    accuracies['Decision Tree'] = dt_acc
    print(f"Decision Tree Accuracy: {dt_acc*100:.2f}%")
    
    # Naive Bayes
    print("Training Naive Bayes...")
    nb = GaussianNB()
    nb.fit(Xtrain, Ytrain)
    nb_pred = nb.predict(Xtest)
    nb_acc = metrics.accuracy_score(Ytest, nb_pred)
    models['Naive Bayes'] = nb
    accuracies['Naive Bayes'] = nb_acc
    print(f"Naive Bayes Accuracy: {nb_acc*100:.2f}%")
    
    # SVM
    print("Training SVM...")
    svm = SVC(gamma='auto')
    svm.fit(Xtrain, Ytrain)
    svm_pred = svm.predict(Xtest)
    svm_acc = metrics.accuracy_score(Ytest, svm_pred)
    models['SVM'] = svm
    accuracies['SVM'] = svm_acc
    print(f"SVM Accuracy: {svm_acc*100:.2f}%")
    
    # Logistic Regression
    print("Training Logistic Regression...")
    lr = LogisticRegression(random_state=2, max_iter=1000)
    lr.fit(Xtrain, Ytrain)
    lr_pred = lr.predict(Xtest)
    lr_acc = metrics.accuracy_score(Ytest, lr_pred)
    models['Logistic Regression'] = lr
    accuracies['Logistic Regression'] = lr_acc
    print(f"Logistic Regression Accuracy: {lr_acc*100:.2f}%")
    
    # Random Forest
    print("Training Random Forest...")
    rf = RandomForestClassifier(n_estimators=20, random_state=0)
    rf.fit(Xtrain, Ytrain)
    rf_pred = rf.predict(Xtest)
    rf_acc = metrics.accuracy_score(Ytest, rf_pred)
    models['Random Forest'] = rf
    accuracies['Random Forest'] = rf_acc
    print(f"Random Forest Accuracy: {rf_acc*100:.2f}%")
    
    # Display all accuracies
    print("\n" + "="*50)
    print("Model Accuracy Comparison:")
    print("="*50)
    for model_name, acc in accuracies.items():
        print(f"{model_name:25} --> {acc:.4f}")
    print("="*50)
    
    return models, accuracies


def predict_crop(model, crop_year, area, temperature, rainfall, humidity, sun_hours):
    """
    Predict crop based on input parameters
    
    Parameters:
    -----------
    model : trained model object
    crop_year : int - Year of crop
    area : int - Area in hectares
    temperature : float - Temperature in Celsius
    rainfall : int - Rainfall in mm
    humidity : float - Humidity percentage
    sun_hours : float - Sun hours per day
    
    Returns:
    --------
    prediction : str - Predicted crop name
    """
    input_data = np.array([[crop_year, area, temperature, rainfall, humidity, sun_hours]])
    prediction = model.predict(input_data)
    return prediction[0]


def main():
    """Main function to run the crop prediction system"""
    print("="*70)
    print(" "*20 + "CROP PREDICTION SYSTEM")
    print("="*70)
    
    # Note: Update this path to your actual CSV file location
    CSV_PATH = 'Burdwan_Crop.csv'
    
    # Try to load data
    try:
        print(f"\nLoading data from: {CSV_PATH}")
        features, target, df = load_and_prepare_data(CSV_PATH)
        print(f"Data loaded successfully! Dataset shape: {df.shape}")
        print(f"Number of unique crops: {df['Crop'].nunique()}")
        
        # Train models
        print("\n" + "-"*70)
        print("Training Models...")
        print("-"*70)
        models, accuracies = train_models(features, target)
        
        # Select best model (Decision Tree in this case based on the notebook)
        best_model_name = 'Random Forest'
        best_model = models[best_model_name]
        
        print(f"\nUsing {best_model_name} for predictions")
        
    except FileNotFoundError:
        print(f"\nError: CSV file not found at '{CSV_PATH}'")
        print("Please update the CSV_PATH variable with the correct path to your data file.")
        return
    
    # Interactive prediction loop
    print("\n" + "="*70)
    print("MAKE PREDICTIONS")
    print("="*70)
    
    while True:
        print("\nEnter crop parameters (or 'quit' to exit):")
        
        try:
            user_input = input("\nContinue? (yes/no): ").strip().lower()
            if user_input in ['no', 'n', 'quit', 'q', 'exit']:
                print("\nThank you for using the Crop Prediction System!")
                break
            
            # Get input from user
            crop_year = int(input("Crop Year: "))
            area = float(input("Area (hectares): "))
            temperature = float(input("Temperature (°C): "))
            rainfall = float(input("Rainfall (mm): "))
            humidity = float(input("Humidity (%): "))
            sun_hours = float(input("Sun hours per day: "))
            
            # Make prediction
            prediction = predict_crop(
                best_model, crop_year, area, temperature, 
                rainfall, humidity, sun_hours
            )
            
            print("\n" + "-"*70)
            print(f"PREDICTED CROP: {prediction}")
            print("-"*70)
            
        except ValueError:
            print("\nError: Please enter valid numeric values!")
        except KeyboardInterrupt:
            print("\n\nExiting...")
            break
        except Exception as e:
            print(f"\nAn error occurred: {str(e)}")


if __name__ == "__main__":
    # Example usage with hardcoded values (uncomment to use)
    # You can also call this script and it will run interactively
    
    # Example prediction without user input:
    # CSV_PATH = 'Burdwan_Crop.csv'
    # features, target, df = load_and_prepare_data(CSV_PATH)
    # models, accuracies = train_models(features, target)
    # prediction = predict_crop(models['Random Forest'], 2022, 1777, 31, 1100, 80, 9.3)
    # print(f"\nPredicted Crop: {prediction}")
    
    # Run interactive mode
    main()