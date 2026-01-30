# Quick Start Guide

Get KrishiSense up and running in 5 minutes!

## Step 1: Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/krushisense
JWT_SECRET=your-super-secret-jwt-key-change-this
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

✅ Backend running at http://localhost:3000

## Step 2: Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

Start frontend:
```bash
npm run dev
```

✅ Frontend running at http://localhost:5173

## Step 3: Test the Application

1. Open http://localhost:5173 in your browser
2. Click "Login" or navigate to `/login`
3. Enter a phone number (format: +919876543210)
4. Enter the OTP (in development mode, check console/alert)
5. Access the dashboard!

## Features to Try

- 🌐 **Language Switcher** - Click the globe icon in navbar to change language
- 📊 **Dashboard** - View farm overview, weather, and analytics
- 🔍 **Navigation** - All links work! Try About, Solutions, Features, Contact
- 📱 **Responsive** - Resize browser or test on mobile

## Troubleshooting

### Backend won't start
- Check MongoDB is running: `mongod` or use MongoDB Atlas
- Verify `.env` file exists and has correct values
- Check port 3000 is not in use

### Frontend won't start
- Check Node.js version: `node --version` (should be 16+)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check port 5173 is not in use

### API calls failing
- Verify backend is running
- Check `VITE_API_URL` in frontend `.env` matches backend URL
- Check browser console for CORS errors

### OTP not working
- In development, OTP is shown in alert/console
- Check backend logs for OTP value
- Verify phone number format: +919876543210

## Next Steps

- Read the full README.md for detailed documentation
- Explore the API docs at http://localhost:3000/api-docs
- Customize the landing page content
- Add your own features!

Happy coding! 🌾

