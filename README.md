<div align="center">

  <h1 align="center">
  KrishiSense
</h1>
  <h3><em>Precision intelligence, offline resilience, and sustainable growth for every acre</em></h3>

</div>

<div align="center">
<img src="https://readme-typing-svg.demolab.com/?font=Anton&letterSpacing=0.044rem&pause=1000&color=488C5C&width=435&lines=Initializing+KrishiSense+OS...;Syncing+Weather+Data...;Analyzing+Soil+Patterns...;Predicting+Pest+Outbreaks...;Welcome+to+Smart+Agriculture." alt="Terminal Animation">
</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="Divider">

## 🎯 Summary

<table>
<tr>
<td>

KrishiSense is an AI-powered Smart Agriculture Advisory System designed to bridge the gap between traditional farming and modern data science. 
Built to support **SDG-2 (Zero Hunger)**, the platform empowers farmers with localized, real-time insights—even in low-connectivity zones—to optimize crop yields, reduce resource waste, and mitigate climate risks.

</td>
<td width="40%">
<img src="frontend\src\assets\images\logo.png" width="80%" alt="KrishiSense logo">
</td>
</tr>
</table>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=divider">

## Platform Highlights

- **Offline-First PWA** – Seamless operation in remote fields using Capacitor.
- **Predictive Intelligence** – ML-driven pest alerts and irrigation prediction.
- **Automated Governance** – Real-time scraping of government schemes and subsidies.
- **Multilingual Support** – Localized interface for diverse farming communities.
- **Sustainability Driven** – Precision irrigation to conserve water and energy.

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="Divider">

## Landing Page
<img src="frontend\src\assets\images\landing-page.png" alt="Dashboard Overview" width="100%">

## 🧠 What It Does

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="frontend\src\assets\images\image.png" alt="Crop Prediction" width="260" height="180" />
        <h4>🌾 Smart Crop Recommendation</h4>
        <p>
          ML-powered crop selection based on soil conditions, temperature, rainfall, and seasonal patterns for optimal yield.
        </p>
      </td>
      <td align="center">
        <img src="frontend\src\assets\images\cropyield.jpeg" alt="Yield Prediction" width="260" height="180" />
        <h4>📊 Crop Yield Forecasting</h4>
        <p>
          Predicts expected harvest per hectare using soil moisture, pH levels, and environmental data to plan resources.
        </p>
      </td>
      <td align="center">
        <img src="frontend\src\assets\images\scheme.jpeg" alt="Scheme Finder" width="260" height="180" />
        <h4>🎯 Government Scheme Finder</h4>
        <p>
          AI-powered matching system that identifies the most suitable agricultural schemes based on farm parameters.
        </p>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="frontend\src\assets\images\irrigation.jpeg" alt="Irrigation Advisory" width="260" height="180" />
        <h4>💧 Precision Irrigation Advisory</h4>
        <p>
          Real-time irrigation recommendations based on crop type, soil moisture, weather, and growth stage to conserve water.
        </p>
      </td>
      <td align="center">
        <img src="frontend\src\assets\images\market.jpeg" alt="Market Price AI" width="260" height="180" />
        <h4>💰 AI Market Price Prediction</h4>
        <p>
          Google Gemini-powered commodity price forecasting with real-time market data for informed selling decisions.
        </p>
      </td>
      <td align="center">
        <img src="frontend\src\assets\images\weather.jpeg" alt="Weather Dashboard" width="260" height="180" />
        <h4>🌤️ Real-Time Weather Intelligence</h4>
        <p>
          Comprehensive weather dashboard with farming advisories, UV index, and actionable insights for field operations.
        </p>
      </td>
    </tr>
  </table>
</div>



## 🧠 AI Agriculture Intelligence

This module transforms traditional farming into a **data-driven operation**. By merging real-time environmental data with historical patterns, the system offers precision advisories through **5 powerful ML models**.

### 🚀 Key ML Capabilities

#### 1. 🌾 Smart Crop Recommendation Engine
- **Technology**: Rule-based ML with environmental parameter analysis
- **Inputs**: Temperature, rainfall, soil pH, humidity, season
- **Output**: Top 3 recommended crops with suitability scores
- **Use Case**: Helps farmers select the most profitable crops for their soil and climate conditions
- **Location**: `ml-service/models/crop_prediction/`

#### 2. 📊 Crop Yield Prediction Model
- **Technology**: Regression-based ML for yield forecasting
- **Inputs**: Soil moisture, soil pH, crop type
- **Output**: Expected yield per hectare with impact factor analysis
- **Use Case**: Resource planning and harvest estimation
- **Location**: `ml-service/models/crop_yield_prediction/`

#### 3. 🎯 Government Scheme Recommendation System
- **Technology**: Multi-parameter matching algorithm
- **Inputs**: NPK values, pH, rainfall, temperature, humidity, soil type, crop type, farm size, location
- **Output**: Most suitable government scheme with eligibility reasoning
- **Use Case**: Connects farmers with agricultural subsidies and support programs
- **Location**: `ml-service/models/government_scheme_predictor/`

#### 4. 💧 Precision Irrigation Advisory
- **Technology**: Decision tree model for water requirement calculation
- **Inputs**: Crop type, soil moisture, weather conditions, growth stage, temperature, rainfall
- **Output**: Irrigation need level (High/Medium/Low) with precise water amount in liters
- **Use Case**: Water conservation and optimal irrigation scheduling
- **Location**: `ml-service/models/irrigateAI/`

#### 5. 💰 AI-Powered Market Price Forecasting
- **Technology**: Google Gemini (gemini-1.5-flash) for real-time price intelligence
- **Inputs**: State, district, commodity name
- **Output**: Minimum, maximum, and modal prices with source and accuracy metrics
- **Use Case**: Informed selling decisions and market trend analysis
- **Location**: `ml-service/models/SmartMarket/`

### 🌐 Additional Intelligence Features

#### 6. Real-Time Weather Intelligence
- Integrates OpenWeatherMap API for current conditions and forecasts
- Provides farming-specific advisories (temperature alerts, humidity warnings, wind advisories)
- UV index monitoring and visibility tracking
- Sunrise/sunset times for optimal field operation planning

#### 7. Offline-First Architecture
- Uses **Capacitor** and local sync logic to ensure that if a farmer is in a "dead zone," the data caches and syncs as soon as they reach a 4G/LTE area.
- Critical ML predictions cached for offline access

#### 8. Automated Notifications
- **Notifme-SDK** integration for a multi-channel alert system (SMS, Push, Email).
- Alerts for sudden weather shifts, pest risks, or new government welfare schemes.
- ML-driven threshold alerts for irrigation and market opportunities

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=divider">

## ⚙️ Tech Stack

<div align="center">

**Backend:** Node.js • Express • MongoDB • Mongoose • JWT Auth 

**ML Service:** Python 3.13 • Flask • Flask-CORS • Google Generative AI (Gemini)

**Machine Learning:** NumPy • Pandas • Scikit-learn • Decision Trees • Regression Models

**AI Integration:** Google Gemini 1.5 Flash • Prompt Engineering • JSON Parsing

**Scraping & Automation:** Puppeteer • Cheerio • PDF-Parse • Node-Cron

**Frontend:** React • Vite • Tailwind CSS • Framer Motion • Recharts • Lucide Icons • Axios

**Mobile/PWA:** Capacitor • PWA Features • i18next (Multilingual)

**APIs:** OpenWeatherMap • Google Gemini API • Custom REST Endpoints

</div>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

## 🛠️ Technical Workflow

1. **Ingestion**: Weather APIs, Web Scrapers, and sensor data (mocked) feed into the **Express** backend.
2. **ML Processing**: 
   - **Flask ML Service** (Port 5001) hosts 5 independent prediction endpoints
   - **Crop Predictor**: Environmental analysis using rule-based algorithms
   - **Yield Predictor**: Regression models for harvest forecasting
   - **Scheme Finder**: Multi-parameter matching with agricultural datasets
   - **Irrigation Advisor**: Decision tree model for water optimization
   - **Market Forecaster**: Real-time Gemini AI API calls for price intelligence
3. **Analysis**: **Node-Cron** jobs trigger ML inference cycles and automated data syncing.
4. **Storage**: User profiles, ML results, and localized crop data are managed via **Mongoose** in a schema optimized for geospatial queries.
5. **Communication**: **Notifme-SDK** dispatches critical alerts based on ML thresholds and weather conditions.
6. **Consumption**: The **React PWA** provides a high-performance, responsive UI with **i18next** supporting regional languages and seamless ML model integration.

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=80&section=divider&text=How%20to%20Run&fontColor=ffffff&fontSize=28"/>

### Prerequisites
- Node.js (v18+)
- Python 3.13+
- MongoDB (Local or Atlas)
- Google Gemini API Key
- OpenWeatherMap API Key (optional)
- Twilio / Firebase (For notifications via Notifme)

### Installation & Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/KrishiSense.git
   cd KrishiSense
   ```

2. **ML Service Setup** (Port 5001)
   ```bash
   cd ml-service
   pip3 install flask flask-cors python-dotenv google-generativeai
   # Create .env file with:
   # ML_PORT=5001
   # GEMINI_API_KEY=your_gemini_api_key_here
   python3 app.py
   ```

3. **Backend Setup** (Port 3000)
   ```bash
   cd backend
   npm install
   # Create .env with:
   # PORT=3000
   # MONGODB_URI=your_mongodb_connection_string
   # JWT_SECRET=your_jwt_secret
   # OPENWEATHER_API_KEY=your_api_key (optional)
   npm start
   ```

4. **Frontend Setup** (Port 5173)
   ```bash
   cd frontend
   npm install
   # Create .env with:
   # VITE_API_URL=http://localhost:3000/api
   # VITE_ML_URL=http://localhost:5001
   npm run dev
   ```

### 🚀 Quick Start (All Services)

Run all three services in separate terminals:

```bash
# Terminal 1 - ML Service
cd ml-service && python3 app.py

# Terminal 2 - Backend
cd backend && npm start

# Terminal 3 - Frontend
cd frontend && npm run dev
```

Access the application at `http://localhost:5173`


## 🔗 Useful Links
<div align="center">
  <a href="https://www.linkedin.com/in/viraj-rathod-7a7857344/" target="_blank">
    <img src="https://img.shields.io/badge/Viraj_Rathod-LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white" alt="Viraj Rathod">
  </a>
  <a href="https://www.linkedin.com/in/advait-panhalkar-280b30329/?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAFG4OzEB0sb_rfikqAW2Jv0aBfi4AxXjvF0" target="_blank">
    <img src="https://img.shields.io/badge/Advait_Panhalkar-LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white" alt="Advait Panhalkar">
  </a>
  <a href="https://www.linkedin.com/in/ayush-s-893324310/" target="_blank">
    <img src="https://img.shields.io/badge/Ayush_Sahu-LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white" alt="Ayush Sahu">
  </a>
  <a href="https://www.linkedin.com/in/dhirensacher" target="_blank">
    <img src="https://img.shields.io/badge/Dhiren_Sacher-LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white" alt="Dhiren Sacher">
  </a>
</div>

<br>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="Divider">
<div align="center"> <sub>Built with ❤️ to support Sustainable Development Goal 2: Zero Hunger</sub> </div>