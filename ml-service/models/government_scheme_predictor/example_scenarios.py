"""
Example Usage Script - Smart Agriculture Advisory System
Demonstrates various farmer scenarios and scheme recommendations
"""

from simple_predictor import predict_government_scheme, print_prediction_result

print("="*80)
print(" " * 20 + "SMART AGRICULTURE ADVISORY SYSTEM")
print(" " * 25 + "Example Usage Scenarios")
print("="*80)

# ============================================================================
# SCENARIO 1: Small Rice Farmer - Punjab
# ============================================================================
print("\n\n" + "🌾" * 40)
print("\nSCENARIO 1: Small Rice Farmer in Punjab")
print("Profile: Rajesh Kumar, 1.2 hectares, Rice cultivation")
print("-" * 80)

farmer_1 = predict_government_scheme(
    crop='Rice',
    nitrogen=55,
    phosphorus=35,
    potassium=40,
    ph=7.2,
    rainfall=1150,
    temperature=29.0,
    humidity=78.0,
    land_size=1.2
)
print_prediction_result(farmer_1)
print("\n💡 Insight: Small land size (<2 ha) qualifies for PM-KISAN direct income support")


# ============================================================================
# SCENARIO 2: Wheat Farmer with Soil Issues - Haryana
# ============================================================================
print("\n\n" + "🌾" * 40)
print("\nSCENARIO 2: Wheat Farmer with Poor Soil Health in Haryana")
print("Profile: Suresh Yadav, 3.5 hectares, Low NPK levels")
print("-" * 80)

farmer_2 = predict_government_scheme(
    crop='Wheat',
    nitrogen=28,
    phosphorus=20,
    potassium=25,
    ph=5.8,
    rainfall=650,
    temperature=24.0,
    humidity=60.0,
    land_size=3.5
)
print_prediction_result(farmer_2)
print("\n💡 Insight: Low nutrient levels indicate need for Soil Health Card to improve soil quality")


# ============================================================================
# SCENARIO 3: Cotton Farmer in Drought Area - Gujarat
# ============================================================================
print("\n\n" + "🌾" * 40)
print("\nSCENARIO 3: Cotton Farmer in Drought-Prone Area of Gujarat")
print("Profile: Mahesh Patel, 5.0 hectares, Very low rainfall")
print("-" * 80)

farmer_3 = predict_government_scheme(
    crop='Cotton',
    nitrogen=65,
    phosphorus=42,
    potassium=50,
    ph=7.0,
    rainfall=480,
    temperature=33.0,
    humidity=52.0,
    land_size=5.0
)
print_prediction_result(farmer_3)
print("\n💡 Insight: Low rainfall area needs irrigation support through PM Krishi Sinchai Yojana")


# ============================================================================
# SCENARIO 4: Sugarcane Farmer with Weather Risk - Maharashtra
# ============================================================================
print("\n\n" + "🌾" * 40)
print("\nSCENARIO 4: Sugarcane Farmer Facing Weather Extremes in Maharashtra")
print("Profile: Ramesh Jadhav, 4.2 hectares, High temperature risk")
print("-" * 80)

farmer_4 = predict_government_scheme(
    crop='Sugarcane',
    nitrogen=85,
    phosphorus=48,
    potassium=58,
    ph=6.9,
    rainfall=2200,
    temperature=36.5,
    humidity=82.0,
    land_size=4.2
)
print_prediction_result(farmer_4)
print("\n💡 Insight: Extreme weather conditions (high temp/rainfall) warrant crop insurance")


# ============================================================================
# SCENARIO 5: Organic Vegetable Farmer - Karnataka
# ============================================================================
print("\n\n" + "🌾" * 40)
print("\nSCENARIO 5: Organic Vegetable Farmer in Karnataka")
print("Profile: Lakshmi Reddy, 2.8 hectares, Excellent soil conditions")
print("-" * 80)

farmer_5 = predict_government_scheme(
    crop='Vegetables',
    nitrogen=98,
    phosphorus=65,
    potassium=75,
    ph=6.8,
    rainfall=1050,
    temperature=26.0,
    humidity=72.0,
    land_size=2.8
)
print_prediction_result(farmer_5)
print("\n💡 Insight: Optimal soil health makes this farm suitable for organic farming transition")


# ============================================================================
# SCENARIO 6: Maize Farmer - Madhya Pradesh
# ============================================================================
print("\n\n" + "🌾" * 40)
print("\nSCENARIO 6: Maize Farmer in Madhya Pradesh")
print("Profile: Vikram Singh, 3.0 hectares, Moderate conditions")
print("-" * 80)

farmer_6 = predict_government_scheme(
    crop='Maize',
    nitrogen=52,
    phosphorus=38,
    potassium=42,
    ph=6.5,
    rainfall=950,
    temperature=27.5,
    humidity=68.0,
    land_size=3.0
)
print_prediction_result(farmer_6)
print("\n💡 Insight: Balanced conditions - scheme depends on additional factors")


# ============================================================================
# SCENARIO 7: Jute Farmer - West Bengal
# ============================================================================
print("\n\n" + "🌾" * 40)
print("\nSCENARIO 7: Jute Farmer in West Bengal")
print("Profile: Subhas Das, 1.8 hectares, High humidity region")
print("-" * 80)

farmer_7 = predict_government_scheme(
    crop='Jute',
    nitrogen=62,
    phosphorus=40,
    potassium=45,
    ph=6.2,
    rainfall=1800,
    temperature=28.0,
    humidity=85.0,
    land_size=1.8
)
print_prediction_result(farmer_7)
print("\n💡 Insight: Small to medium farmer with adequate water availability")


# ============================================================================
# SCENARIO 8: Fruit Orchard - Himachal Pradesh
# ============================================================================
print("\n\n" + "🌾" * 40)
print("\nSCENARIO 8: Apple Orchard in Himachal Pradesh")
print("Profile: Kuldeep Sharma, 6.0 hectares, Hilly terrain")
print("-" * 80)

farmer_8 = predict_government_scheme(
    crop='Fruits',
    nitrogen=72,
    phosphorus=52,
    potassium=62,
    ph=6.4,
    rainfall=1350,
    temperature=18.5,
    humidity=65.0,
    land_size=6.0
)
print_prediction_result(farmer_8)
print("\n💡 Insight: Large farm with good conditions for fruit cultivation")


# ============================================================================
# Summary
# ============================================================================
print("\n\n" + "="*80)
print(" " * 30 + "SUMMARY")
print("="*80)
print("""
This Smart Agriculture Advisory System helps farmers identify the most suitable
government scheme based on their specific conditions:

KEY FACTORS CONSIDERED:
✓ Land size (small farmers get priority for PM-KISAN)
✓ Soil health (NPK levels and pH determine Soil Health Card eligibility)
✓ Weather patterns (extreme conditions trigger crop insurance)
✓ Water availability (low rainfall areas need irrigation support)
✓ Organic farming potential (optimal conditions for Paramparagat Krishi)

USAGE IN REAL APPLICATIONS:
1. Integrate with farmer mobile apps
2. Use at agricultural extension centers
3. Connect with government scheme portals
4. Deploy in rural kiosks for farmer assistance
5. Incorporate into precision agriculture platforms

NEXT STEPS:
- Collect real farmer data to improve model accuracy
- Integrate with government databases for scheme verification
- Add regional language support for better accessibility
- Develop mobile interface for field-level predictions
- Track success rates of recommended schemes
""")

print("="*80)
print(" " * 25 + "Thank you for using our system!")
print(" " * 20 + "Built for the welfare of Indian farmers 🌾")
print("="*80)
