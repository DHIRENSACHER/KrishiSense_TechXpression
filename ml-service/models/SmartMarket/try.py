import google.generativeai as genai

# Configure Gemini API - Add your API key here
GEMINI_API_KEY = "AIzaSyCD4t2tUsrCror5LA0y2nlE5mCK2tBic38"  # Replace with your actual API key
genai.configure(api_key=GEMINI_API_KEY)

for m in genai.list_models():
    print(m.name, m.supported_generation_methods)