# KrishiSense - Smart Agriculture Advisory System

A comprehensive smart agriculture advisory system that empowers farmers with AI-driven insights for precision farming, crop recommendations, and sustainable agriculture.

## 🌾 Features

- **Personalized AI-Predicted Government Schemes** - Get matched with relevant government agricultural schemes based on your profile
- **Crop Recommendation** - Discover which crops to grow based on weather patterns, soil quality, and market demand
- **Smart Irrigation Scheduling** - Optimize water usage with AI-driven irrigation schedules and precise water amount recommendations
- **Optimal Seed Sowing Time Prediction** - Predict the best time window for seed sowing to maximize yield
- **Market Price Forecasting** - Get accurate price predictions to make informed decisions about when and where to sell

## 🚀 Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Swagger API Documentation
- OpenWeatherMap Integration

### Frontend
- React 18 with Vite
- Tailwind CSS
- React Router
- i18next (Multi-language support)
- Framer Motion
- Recharts

## 📋 Prerequisites

- Node.js 16+ and npm/yarn
- MongoDB (local or Atlas)
- OpenWeatherMap API key (optional, for weather features)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd KrishiSense_TechXpression/eie
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/krushisense
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:5173
OPENWEATHER_API_KEY=your-openweather-api-key
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

The backend API will be available at `http://localhost:3000`
API documentation: `http://localhost:3000/api-docs`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🌐 Multi-Language Support

The application supports 9 Indian languages:

- English (en)
- Hindi (hi)
- Marathi (mr)
- Tamil (ta)
- Telugu (te)
- Punjabi (pa)
- Gujarati (gu)
- Kannada (kn)
- Bengali (bn)

Users can switch languages using the language selector in the navbar.

## 📱 Pages

### Public Pages
- **Landing Page** (`/`) - Main landing page with features and hero section
- **About** (`/about`) - About KrishiSense
- **Solutions** (`/solutions`) - Overview of solutions
- **Features** (`/features`) - Detailed features
- **Contact** (`/contact`) - Contact form

### Protected Pages
- **Login** (`/login`) - OTP-based authentication
- **Dashboard** (`/dashboard`) - Farm overview with:
  - Weather information
  - Soil moisture levels
  - Today's activities
  - Farm map
  - Monthly yield analysis

## 🔐 Authentication

The app uses OTP-based authentication:

1. Enter your phone number
2. Receive OTP via SMS
3. Verify OTP to login
4. Access personalized dashboard

## 📊 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and get token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Advisories
- `GET /api/advisories` - Get all advisories
- `GET /api/advisories/weather` - Get weather advisory
- `PATCH /api/advisories/:id/read` - Mark advisory as read

### Market & Schemes
- `POST /api/market/forecast` - Get market price forecast
- `GET /api/market/history` - Get price history
- `GET /api/schemes` - Get government schemes
- `GET /api/schemes/:id` - Get scheme details

Full API documentation available at `/api-docs` when backend is running.

## 🏗️ Project Structure

```
eie/
├── backend/
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic services
│   │   └── index.js      # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── context/      # React context
│   │   ├── i18n/         # Translations
│   │   ├── pages/        # Page components
│   │   ├── utils/        # Utilities
│   │   └── App.jsx       # Main app
│   └── package.json
└── README.md
```

## 🧪 Development

### Backend Development

```bash
cd backend
npm run dev  # Starts with nodemon for auto-reload
```

### Frontend Development

```bash
cd frontend
npm run dev  # Starts Vite dev server
```

### Building for Production

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview  # Preview production build
```

## 📝 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CORS_ORIGIN` - Allowed CORS origin
- `OPENWEATHER_API_KEY` - OpenWeatherMap API key
- `NODE_ENV` - Environment (development/production)

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add translations for new text
5. Test thoroughly
6. Submit a pull request

## 📄 License

ISC

## 🙏 Acknowledgments

- OpenWeatherMap for weather data
- MongoDB for database
- All the open-source libraries that made this possible

## 📞 Support

For support, email hello@krushisense.ag or create an issue in the repository.
