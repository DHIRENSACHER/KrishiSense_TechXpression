import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  sendOTP: (phone) => api.post('/auth/send-otp', { phone }),
  verifyOTP: (phone, otp) => api.post('/auth/verify-otp', { phone, otp }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const advisoryAPI = {
  getAdvisories: (params) => api.get('/advisories', { params }),
  getWeatherAdvisory: () => api.get('/advisories/weather'),
  markAsRead: (id) => api.patch(`/advisories/${id}/read`),
  markAllAsRead: () => api.patch('/advisories/read-all'),
};

export const marketAPI = {
  getForecast: (data) => api.post('/market/forecast', data),
  getPriceHistory: (params) => api.get('/market/history', { params }),
};

export const schemesAPI = {
  getSchemes: (params) => api.get('/schemes', { params }),
  getSchemeById: (id) => api.get(`/schemes/${id}`),
};

export const modelAPI = {
  predictCrop: (data) => {
    const mlAPI = axios.create({
      baseURL: import.meta.env.VITE_ML_URL || 'http://localhost:5001',
    });
    return mlAPI.post('/predict/crop', data);
  },
  predictCropYield: (data) => {
    const mlAPI = axios.create({
      baseURL: import.meta.env.VITE_ML_URL || 'http://localhost:5001',
    });
    return mlAPI.post('/predict/crop-yield', data);
  },
  predictScheme: (data) => {
    const mlAPI = axios.create({
      baseURL: import.meta.env.VITE_ML_URL || 'http://localhost:5001',
    });
    return mlAPI.post('/predict/scheme', data);
  },
  predictIrrigation: (data) => {
    const mlAPI = axios.create({
      baseURL: import.meta.env.VITE_ML_URL || 'http://localhost:5001',
    });
    return mlAPI.post('/predict/irrigation', data);
  },
};

export default api;

