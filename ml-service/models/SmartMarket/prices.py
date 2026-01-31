import google.generativeai as genai

# Configure Gemini API - Add your API key here
GEMINI_API_KEY = "AIzaSyDniTSoytr_eKCmju04Brkt-wyMEpLw5Kg"  # Replace with your actual API key
genai.configure(api_key=GEMINI_API_KEY)

# Get input from user
state = input("Enter State: ").strip()
district = input("Enter District: ").strip()
commodity = input("Enter Commodity: ").strip()

def get_commodity_prices(state, district, commodity):
    """Use Gemini API to fetch commodity pricing details"""
    
    prompt = f"""Please provide current commodity pricing information for:
    
State: {state}
District: {district}
Commodity: {commodity}

Please only provide the following details in your response in the format mentioned below:
1. Minimum Price :  (per quintal/kg)
2. Maximum Price : (per quintal/kg)
3. Modal/Average Price : (per quintal/kg)
4. Source of Data : (e.g., Government Market Reports, Local Market Surveys)
5. Accuracy of the data : (Percentage)
"""
    
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        
        if response.text:
            print(f"\n{'='*60}")
            print(f"📊 Commodity Pricing Information for {commodity}")
            print(f"   Location: {district}, {state}")
            print(f"{'='*60}\n")
            print(response.text)
            print(f"\n{'='*60}\n")
        else:
            print("❌ No response received from Gemini API")
            
    except Exception as e:
        print(f"❌ Error connecting to Gemini API: {e}")
        print("Make sure you have entered a valid Gemini API Key")

# Call the function
get_commodity_prices(state, district, commodity)