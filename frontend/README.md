# KrishiSense Frontend

Modern, responsive frontend for the Smart Agriculture Advisory System built with React, Vite, and Tailwind CSS.

## Features

- 🌐 **Multi-language Support**: Supports 9 Indian languages (Hindi, Marathi, Tamil, Telugu, Punjabi, Gujarati, Kannada, Bengali, English)
- 🎨 **Modern UI**: Built with Tailwind CSS and Framer Motion for smooth animations
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🔐 **Authentication**: OTP-based login system
- 📊 **Dashboard**: Comprehensive farm overview with weather, soil moisture, and analytics
- 🚀 **Fast**: Built with Vite for lightning-fast development and builds

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **i18next** - Internationalization
- **Axios** - HTTP client
- **Recharts** - Chart library
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your backend API URL:
```
VITE_API_URL=http://localhost:3000/api
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── LanguageSelector.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/         # React context providers
│   │   └── AuthContext.jsx
│   ├── i18n/            # Internationalization
│   │   ├── config.js
│   │   └── locales/     # Translation files
│   ├── pages/           # Page components
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── About.jsx
│   │   ├── Solutions.jsx
│   │   ├── Features.jsx
│   │   └── Contact.jsx
│   ├── utils/           # Utility functions
│   │   └── api.js       # API client
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Pages

- **Landing** (`/`) - Main landing page with hero section and features
- **Login** (`/login`) - OTP-based authentication
- **Dashboard** (`/dashboard`) - Farm overview with analytics (protected)
- **About** (`/about`) - About page
- **Solutions** (`/solutions`) - Solutions overview
- **Features** (`/features`) - Detailed features page
- **Contact** (`/contact`) - Contact form

## API Integration

The frontend connects to the backend API through the `api.js` utility. All API calls are configured with:

- Automatic token injection for authenticated requests
- Error handling and token expiration management
- Base URL configuration via environment variables

## Language Support

The app supports the following languages:

- English (en)
- Hindi (hi)
- Marathi (mr)
- Tamil (ta)
- Telugu (te)
- Punjabi (pa)
- Gujarati (gu)
- Kannada (kn)
- Bengali (bn)

Users can switch languages using the language selector in the navbar. The selected language is persisted in localStorage.

## Authentication

The app uses OTP-based authentication:

1. User enters phone number
2. OTP is sent to the phone
3. User verifies OTP
4. JWT token is stored in localStorage
5. Token is automatically included in API requests

## Environment Variables

- `VITE_API_URL` - Backend API base URL (default: `http://localhost:3000/api`)

## Contributing

1. Follow the existing code style
2. Use meaningful component and variable names
3. Add translations for all user-facing text
4. Ensure responsive design works on all screen sizes
5. Test authentication flows thoroughly

## License

ISC

