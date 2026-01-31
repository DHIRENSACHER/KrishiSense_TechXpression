#!/usr/bin/env python3
"""
Test script for KrishiSense ML Service
Run this to verify all endpoints are working
"""

import requests
import json

BASE_URL = "http://localhost:5001"

def test_health():
    """Test health endpoint"""
    print("\n🔍 Testing Health Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"✅ Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_crop_prediction():
    """Test crop prediction endpoint"""
    print("\n🌾 Testing Crop Prediction...")
    try:
        data = {
            "temperature": 28.5,
            "rainfall": 150,
            "soil_ph": 6.5,
            "area": 1.2,
            "season": "kharif"
        }
        response = requests.post(f"{BASE_URL}/predict/crop", json=data)
        print(f"✅ Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_crop_yield():
    """Test crop yield prediction endpoint"""
    print("\n📊 Testing Crop Yield Prediction...")
    try:
        data = {
            "soil_moisture": 45.5,
            "soil_ph": 6.5
        }
        response = requests.post(f"{BASE_URL}/predict/crop-yield", json=data)
        print(f"✅ Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_scheme_prediction():
    """Test government scheme prediction endpoint"""
    print("\n🏛️ Testing Government Scheme Prediction...")
    try:
        data = {
            "crop": "Rice",
            "nitrogen": 50,
            "phosphorus": 40,
            "potassium": 50,
            "ph": 6.5,
            "rainfall": 1000,
            "temperature": 28,
            "humidity": 70,
            "land_size": 1.5
        }
        response = requests.post(f"{BASE_URL}/predict/scheme", json=data)
        print(f"✅ Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_irrigation_prediction():
    """Test irrigation prediction endpoint"""
    print("\n💧 Testing Irrigation Prediction...")
    try:
        data = {
            "crop": "Rice",
            "soil_moisture": 45,
            "temperature": 28,
            "humidity": 70,
            "rainfall": 20,
            "growth_stage": "Vegetative"
        }
        response = requests.post(f"{BASE_URL}/predict/irrigation", json=data)
        print(f"✅ Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Run all tests"""
    print("="*60)
    print("KrishiSense ML Service Test Suite")
    print("="*60)
    
    results = []
    results.append(("Health Check", test_health()))
    results.append(("Crop Prediction", test_crop_prediction()))
    results.append(("Crop Yield", test_crop_yield()))
    results.append(("Scheme Prediction", test_scheme_prediction()))
    results.append(("Irrigation Prediction", test_irrigation_prediction()))
    
    print("\n" + "="*60)
    print("Test Results Summary")
    print("="*60)
    
    for name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{name:.<40} {status}")
    
    passed_count = sum(1 for _, passed in results if passed)
    total = len(results)
    
    print("\n" + "="*60)
    print(f"Total: {passed_count}/{total} tests passed")
    print("="*60)
    
    if passed_count == total:
        print("\n🎉 All tests passed! ML Service is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")

if __name__ == "__main__":
    main()
