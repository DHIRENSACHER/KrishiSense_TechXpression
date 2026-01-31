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
<img src="frontend\src\assets\images\logo.png" width="100%" alt="KrishiSense logo">
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
        <img src="https://via.placeholder.com/260x180.png?text=Pest+Intelligence" alt="Pest Intelligence" width="260" height="180" />
        <h4>Pest & Disease Intelligence</h4>
        <p>
          AI-driven outbreak prediction that alerts farmers of potential threats
          before they devastate crops.
        </p>
      </td>
      <td align="center">
        <img src="https://via.placeholder.com/260x180.png?text=Smart+Irrigation" alt="Irrigation Scheduling" width="260" height="180" />
        <h4>Irrigation Prediction</h4>
        <p>
          Predicts precise irrigation needs using weather and soil moisture data to maximize resource efficiency and save water.
        </p>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://via.placeholder.com/260x180.png?text=Market+Forecasting" alt="Market Price Forecasting" width="260" height="180" />
        <h4>Market Price Forecasting</h4>
        <p>
          Predicts future crop values to help farmers choose the most profitable
          time to harvest and sell.
        </p>
      </td>
      <td align="center">
        <img src="https://via.placeholder.com/260x180.png?text=Govt+Schemes" alt="Govt Notifications" width="260" height="180" />
        <h4>Govt Scheme Scraping</h4>
        <p>
          Automated Puppeteer scripts scrape official portals to notify farmers 
          of relevant subsidies and programs.
        </p>
      </td>
    </tr>
  </table>
</div>



## 🧠 AI Agriculture Intelligence

This module transforms traditional farming into a **data-driven operation**. By merging real-time environmental data with historical patterns, the system offers precision advisories.

### 🚀 Key Capabilities

#### 1. Irrigation Prediction
- Integrates Third-Party Weather APIs and soil moisture data to predict irrigation needs.
- Provides actionable recommendations to prevent over-irrigation and save water and energy.

#### 2. Resource Intelligence (Soil & Weather)
- Uses historical and live weather data for broader agrometeorological insights.
- Helps optimize inputs and field operations based on predicted risk and needs.

#### 3. Offline-First Architecture
- Uses **Capacitor** and local sync logic to ensure that if a farmer is in a "dead zone," the data caches and syncs as soon as they reach a 4G/LTE area.

#### 4. Automated Notifications
- **Notifme-SDK** integration for a multi-channel alert system (SMS, Push, Email).
- Alerts for sudden weather shifts, pest risks, or new government welfare schemes.

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=divider">

## ⚙️ Tech Stack

<div align="center">

**Backend:** Node.js • Express • MongoDB • Mongoose • JWT Auth 

**Scraping & Automation:** Puppeteer • Cheerio • PDF-Parse • Node-Cron

**Frontend:** React • Tailwind CSS • Framer Motion • Recharts • Lucide Icons

**Mobile/PWA:** Capacitor • PWA Features • i18next (Multilingual)

</div>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

## 🛠️ Technical Workflow

1. **Ingestion**: Weather APIs, Web Scrapers, and sensor data (mocked) feed into the **Express** backend.
2. **Analysis**: **Node-Cron** jobs trigger ML inference cycles for pest prediction and price forecasting.
3. **Storage**: User profiles and localized crop data are managed via **Mongoose** in a schema optimized for geospatial queries.
4. **Communication**: **Notifme-SDK** dispatches critical alerts based on ML thresholds.
5. **Consumption**: The **React PWA** provides a high-performance, responsive UI with **i18next** supporting regional languages.

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=80&section=divider&text=How%20to%20Run&fontColor=ffffff&fontSize=28"/>

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Twilio / Firebase (For notifications via Notifme)

### Installation & Setup

1. **Clone Repository**
   ```bash
   git clone [https://github.com/yourusername/KrishiSense.git](https://github.com/yourusername/KrishiSense.git)
   cd KrishiSense

2. Backend Setup
    ```bash
    cd backend
    npm install
    Create .env with MONGODB_URI, JWT_SECRET, and API keys
    npm start

3. Frontend 
```bash
    cd frontend
    npm install
    npm run dev

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="Divider">
<div align="center"> <sub>Built with ❤️ to support Sustainable Development Goal 2: Zero Hunger</sub> </div>