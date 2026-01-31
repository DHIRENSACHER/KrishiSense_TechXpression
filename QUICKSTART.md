# 🚀 Quick Start Guide - ML Models

## Step-by-Step Instructions

### 1️⃣ Start ML Service

Open a terminal and run:

```bash
cd /Users/dhirensacher/Project/KrishiSense_TechXpression/ml-service
python3 app.py
```

✅ You should see:
```
✅ ML Service initialized successfully
🚀 Starting ML Service on port 5001
 * Running on http://127.0.0.1:5001
```

**Keep this terminal open!**

---

### 2️⃣ Test ML Service

Open a **NEW terminal** and test:

```bash
curl http://localhost:5001/
```

Expected response:
```json
{
  "endpoints": [...],
  "service": "KrishiSense ML Service",
  "status": "running"
}
```

---

### 3️⃣ Start Frontend

In another **NEW terminal**:

```bash
cd /Users/dhirensacher/Project/KrishiSense_TechXpression/frontend
npm run dev
```

✅ You should see:
```
VITE v... ready in ... ms
➜  Local:   http://localhost:5173/
```

---

### 4️⃣ Test in Browser

1. Open: http://localhost:5173
2. Login or signup
3. Go to Dashboard → Click ⚡ (AI Tools) in sidebar
4. Or directly visit:
   - http://localhost:5173/predict
   - http://localhost:5173/crop-yield
   - http://localhost:5173/scheme-predictor
   - http://localhost:5173/irrigation

---

## 🐛 Troubleshooting

### ML Service not starting

**Error:** `ModuleNotFoundError: No module named 'flask'`

**Fix:**
```bash
cd ml-service
pip3 install flask flask-cors python-dotenv
```

### Port 5001 already in use

**Check what's using port 5001:**
```bash
lsof -ti:5001
```

**Kill the process:**
```bash
kill -9 $(lsof -ti:5001)
```

### Frontend can't connect to ML service

1. **Check ML service is running:**
   ```bash
   curl http://localhost:5001/
   ```

2. **Check .env file exists:**
   ```bash
   cat frontend/.env
   ```
   
   Should contain:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_ML_URL=http://localhost:5001
   ```

3. **Restart frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

### Browser shows CORS errors

Make sure:
1. ML service is running
2. CORS is enabled in `ml-service/app.py` (already done)
3. Clear browser cache and reload

---

## 📝 Quick Test Commands

Test each ML endpoint:

```bash
# Test Crop Predictor
curl -X POST http://localhost:5001/predict/crop \
  -H "Content-Type: application/json" \
  -d '{"temperature":28,"rainfall":150,"soil_ph":6.5,"area":1,"season":"kharif"}'

# Test Crop Yield
curl -X POST http://localhost:5001/predict/crop-yield \
  -H "Content-Type: application/json" \
  -d '{"soil_moisture":45.5,"soil_ph":6.5}'

# Test Scheme Predictor
curl -X POST http://localhost:5001/predict/scheme \
  -H "Content-Type: application/json" \
  -d '{"crop":"Rice","nitrogen":50,"phosphorus":40,"potassium":50,"ph":6.5,"rainfall":1000,"temperature":28,"humidity":70,"land_size":1.5}'

# Test Irrigation
curl -X POST http://localhost:5001/predict/irrigation \
  -H "Content-Type: application/json" \
  -d '{"crop":"Rice","soil_moisture":45,"temperature":28,"humidity":70,"rainfall":20,"growth_stage":"Vegetative"}'
```

---

## ✅ Checklist

- [ ] ML service running on port 5001
- [ ] ML service responds to `curl http://localhost:5001/`
- [ ] Frontend .env file exists with correct URLs
- [ ] Frontend running on port 5173
- [ ] Can access http://localhost:5173/predict
- [ ] ML predictions work in browser

---

**Need help?** Check the browser console (F12) for error messages.
