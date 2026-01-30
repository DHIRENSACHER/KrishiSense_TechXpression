# KrushiSense Backend

Smart Agriculture Advisory System Backend built with Node.js, Express, and MongoDB.

## Terminal Commands (Initialization)

```bash
# Navigate to backend folder
cd backend

# Initialize npm project (if not done)
npm init -y

# Install dependencies
npm install express mongoose jsonwebtoken dotenv axios node-cron cheerio cors helmet morgan

# Install dev dependencies
npm install --save-dev nodemon
```

## Tech Stack

- **Runtime**: Node.js (ES6 Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Auth**: JWT (JSON Web Tokens)
- **Security**: Helmet
- **Logging**: Morgan
- **Scheduler**: node-cron
- **Scraping**: Cheerio

## Project Structure

```
src/
├── config/
│   ├── db.js           # MongoDB connection
│   └── auth.js         # JWT utilities & middleware
├── models/
│   ├── User.js         # User schema (GeoJSON location)
│   ├── Scheme.js       # Government schemes
│   └── Advisory.js     # Personalized alerts
├── controllers/
│   ├── authController.js      # OTP & profile
│   ├── advisoryController.js  # Weather & alerts
│   ├── syncController.js      # Offline sync
│   └── marketController.js    # ML proxy & schemes
├── services/
│   ├── weatherService.js   # OpenWeatherMap integration
│   └── scraperService.js   # Cheerio-based scraper
├── routes/
│   └── api.js          # All API routes
└── index.js            # Entry point
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

3. Start the server:
```bash
npm run dev   # Development
npm start     # Production
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/send-otp | Send OTP to phone |
| POST | /api/auth/verify-otp | Verify OTP & get token |
| GET | /api/auth/profile | Get user profile |
| PUT | /api/auth/profile | Update profile |
| GET | /api/advisories | List user advisories |
| GET | /api/advisories/weather | Get weather advisory |
| POST | /api/sync | Push batch documents |
| GET | /api/sync/pull | Pull changes |
| POST | /api/market/forecast | ML price prediction |
| GET | /api/schemes | List gov schemes |

## Testing

```bash
# Send OTP
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210"}'

# Verify OTP (mock OTP is always 123456)
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210", "otp": "123456"}'
```
