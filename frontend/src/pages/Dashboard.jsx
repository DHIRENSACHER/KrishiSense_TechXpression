import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { advisoryAPI, marketAPI } from '../utils/api';
import { schemesAPI } from '../services/api';
import { motion } from 'framer-motion';
import {
  Home,
  Leaf,
  MapPin,
  Cloud,
  Camera,
  Settings,
  User,
  AlertCircle,
  Sun,
  Droplets,
  TrendingUp,
  Calendar,
  Zap,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Predict from './Predict';
import Modal from '../components/Modal';
import ProfileModal from '../components/ProfileModal';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [weather, setWeather] = useState(null);
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState('Unknown');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [weatherRes, advisoriesRes] = await Promise.all([
        advisoryAPI.getWeatherAdvisory(),
        advisoryAPI.getAdvisories({ limit: 10 }),
      ]);

      if (weatherRes.data.success) {
        setWeather(weatherRes.data.data.weather);
        setLocationName(weatherRes.data.data.location?.name || weatherRes.data.data.weather?.location || 'Your Farm');
      }
      if (advisoriesRes.data.success) {
        setAdvisories(advisoriesRes.data.data.advisories || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Check if the error is due to missing location
      if (error.response?.data?.message?.toLowerCase().includes('location not set')) {
        setShowLocationModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // UI state for dashboard navigation and crops inventory
  const [activeSection, setActiveSection] = useState('Home');
  const [crops, setCrops] = useState([]);
  const [search, setSearch] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCrop, setNewCrop] = useState({ name: '', area: '', season: 'kharif', details: '' });
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const filteredCrops = crops.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.details.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCrop = () => setShowAddForm(true);

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewCrop({ name: '', area: '', season: 'kharif', details: '' });
  };

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewCrop((s) => ({ ...s, [name]: value }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newCrop.name) {
      alert('Please enter a crop name');
      return;
    }
    const details = `Area: ${newCrop.area || 'N/A'} ha • Season: ${newCrop.season}${newCrop.details ? ' • ' + newCrop.details : ''}`;
    setCrops((prev) => [{ name: newCrop.name, details }, ...prev]);
    handleCancelAdd();
  };

  const handleSelectCrop = (crop) => setSelectedCrop(crop);

  const handleDeleteCrop = (crop) => {
    setCrops((prev) => prev.filter((c) => c !== crop));
    if (selectedCrop === crop) setSelectedCrop(null);
  };



  useEffect(() => {
    fetchData();
  }, []);

  const sidebarItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Leaf, label: 'Crops' },
    { icon: Zap, label: 'AI Tools' },
    { icon: Cloud, label: 'Weather' },
    { icon: Settings, label: 'Settings' },
    { icon: User, label: 'Profile' },
  ];

  const soilMoistureData = [
    { name: 'Water', value: 0.5, color: '#16a34a' },
    { name: 'Air', value: 0.15, color: '#86efac' },
    { name: 'Soil Minerals', value: 0.35, color: '#4ade80' },
  ];

  const yieldData = [
    { month: 'Jan', yield: 200 },
    { month: 'Feb', yield: 250 },
    { month: 'Mar', yield: 300 },
    { month: 'Apr', yield: 280 },
    { month: 'May', yield: 350 },
    { month: 'Jun', yield: 400 },
    { month: 'Aug', yield: 380 },
    { month: 'Sep', yield: 420 },
  ];

  const activities = [
    {
      status: 'In Progress',
      time: '7:45 AM',
      description: 'Crops were monitored for signs of disease or nutrient deficiency.',
      color: 'bg-green-100 text-green-700',
    },
    {
      status: 'Not Started',
      time: '7:45 AM',
      description: 'Pesticide was sprayed to prevent pests from damaging the field.',
      color: 'bg-gray-100 text-gray-700',
    },
  ];

  // Schemes shown in dashboard
  const [schemes, setSchemes] = useState([]);
  const [schemesLoading, setSchemesLoading] = useState(true);
  const [schemesError, setSchemesError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const mockSchemes = [
      { _id: '1', title: 'PM-KISAN Scheme', description: 'Direct income support to farmers', publishDate: '2025-01-15' },
      { _id: '2', title: 'KCC Scheme', description: 'Credit card for farmers', publishDate: '2024-11-01' },
    ];

    const fetchSchemes = async () => {
      if (!mounted) return;
      setSchemesLoading(true);
      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${base}/schemes?limit=4`);
        if (!res.ok) {
          if (mounted) setSchemes(mockSchemes);
          return;
        }
        const data = await res.json();
        let fetched = [];
        if (Array.isArray(data)) fetched = data;
        else if (Array.isArray(data.schemes)) fetched = data.schemes;
        else if (Array.isArray(data.data)) fetched = data.data;

        if (fetched.length > 0) {
          if (mounted) setSchemes(fetched);
        } else {
          if (mounted) setSchemes(mockSchemes);
        }
      } catch (err) {
        console.error('Error fetching dashboard schemes:', err);
        if (mounted) setSchemes(mockSchemes);
        if (mounted) setSchemesError(err.message || 'Failed to load schemes');
      } finally {
        if (mounted) setSchemesLoading(false);
      }
    };
    fetchSchemes();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-20 bg-white border-r border-gray-200 min-h-screen pt-4">
          <div className="flex flex-col items-center gap-4">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveSection(item.label);
                  if (item.label === 'Profile') setProfileOpen(true);
                }}
                className={`p-3 rounded-lg transition-colors ${activeSection === item.label
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
                title={item.label}
              >
                <item.icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
                <p className="text-gray-600 mt-1">{t('dashboard.subtitle')}</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <Cloud className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                  <AlertCircle className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button
                  onClick={() => setProfileOpen(true)}
                  title="Your profile"
                  className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </button>
              </div>
            </div>

            {/* Alert Banner */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">
                Alert! Field B and Field C need irrigation Today.
              </span>
            </motion.div>
          </div>

          {activeSection === 'Crops' ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl p-6 shadow-sm h-full flex flex-col">
                  <h2 className="text-xl font-bold mb-3">Inventory</h2>

                  <div className="flex items-center gap-2 mb-4">
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or details..." className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                    <button onClick={handleAddCrop} className="px-3 py-2 bg-primary-600 text-white rounded-lg text-sm">Add Crop</button>
                  </div>

                  <Modal isOpen={showAddForm} onClose={handleCancelAdd} title="Add Crop" size="max-w-2xl">
                    <form onSubmit={handleAddSubmit} className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label className="flex flex-col">
                          <span className="text-sm text-gray-700">Crop Name</span>
                          <input autoFocus name="name" value={newCrop.name} onChange={handleNewChange} className="mt-1 input" />
                        </label>
                        <label className="flex flex-col">
                          <span className="text-sm text-gray-700">Area (ha)</span>
                          <input name="area" value={newCrop.area} onChange={handleNewChange} className="mt-1 input" />
                        </label>
                        <label className="flex flex-col">
                          <span className="text-sm text-gray-700">Season</span>
                          <select name="season" value={newCrop.season} onChange={handleNewChange} className="mt-1 input">
                            <option value="kharif">Kharif</option>
                            <option value="rabi">Rabi</option>
                            <option value="zaid">Zaid</option>
                          </select>
                        </label>
                        <label className="flex flex-col md:col-span-2">
                          <span className="text-sm text-gray-700">Notes / Details</span>
                          <input name="details" value={newCrop.details} onChange={handleNewChange} className="mt-1 input" />
                        </label>
                      </div>

                      <div className="mt-3 flex gap-2 justify-end">
                        <button type="button" onClick={handleCancelAdd} className="px-3 py-2 border rounded">Cancel</button>
                        <button type="submit" className="px-3 py-2 bg-primary-600 text-white rounded">Save</button>
                      </div>
                    </form>
                  </Modal>

                  <div className="space-y-4 overflow-auto max-h-[50vh]">
                    {filteredCrops.map((crop, i) => (
                      <button key={i} onClick={() => handleSelectCrop(crop)} className={`w-full text-left bg-gray-200 rounded-lg p-4 ${selectedCrop === crop ? 'ring-2 ring-primary-300' : ''}`}>
                        <div className="font-semibold">{crop.name}</div>
                        <div className="text-sm text-gray-600">{crop.details}</div>
                      </button>
                    ))}
                    {filteredCrops.length === 0 && <div className="text-sm text-gray-500">No crops found.</div>}
                  </div>

                  {selectedCrop && (
                    <div className="mt-4 bg-white border rounded p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-semibold text-lg">{selectedCrop.name}</div>
                          <div className="text-sm text-gray-600">{selectedCrop.details}</div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => navigator.clipboard?.writeText(selectedCrop.name)} className="px-3 py-1 border rounded text-sm">Copy</button>
                          <button onClick={() => handleDeleteCrop(selectedCrop)} className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm">Delete</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2">
                <Predict />
              </div>
            </div>
          ) : activeSection === 'AI Tools' ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered Tools</h2>
                <p className="text-gray-600">
                  Use our machine learning models to make smarter farming decisions
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Crop Predictor */}
                <Link
                  to="/predict"
                  className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-green-500 rounded-lg group-hover:scale-110 transition-transform">
                      <Leaf className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-green-700 bg-green-200 px-2 py-1 rounded-full">
                      ML Model
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Crop Predictor</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Get AI recommendations for the best crops based on temperature, rainfall, soil pH, and season.
                  </p>
                  <div className="flex items-center text-green-600 font-medium text-sm">
                    Try it now
                    <TrendingUp className="w-4 h-4 ml-2" />
                  </div>
                </Link>

                {/* Crop Yield Predictor */}
                <Link
                  to="/crop-yield"
                  className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-blue-700 bg-blue-200 px-2 py-1 rounded-full">
                      ML Model
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Crop Yield Predictor</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Predict expected crop yield per hectare based on soil moisture and pH levels.
                  </p>
                  <div className="flex items-center text-blue-600 font-medium text-sm">
                    Try it now
                    <TrendingUp className="w-4 h-4 ml-2" />
                  </div>
                </Link>

                {/* Government Scheme Predictor */}
                <Link
                  to="/scheme-predictor"
                  className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-purple-500 rounded-lg group-hover:scale-110 transition-transform">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-purple-700 bg-purple-200 px-2 py-1 rounded-full">
                      ML Model
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Scheme Finder</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Find the most suitable government agricultural scheme based on your farm parameters.
                  </p>
                  <div className="flex items-center text-purple-600 font-medium text-sm">
                    Try it now
                    <TrendingUp className="w-4 h-4 ml-2" />
                  </div>
                </Link>

                {/* Irrigation Predictor */}
                <Link
                  to="/irrigation"
                  className="bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-cyan-500 rounded-lg group-hover:scale-110 transition-transform">
                      <Droplets className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-cyan-700 bg-cyan-200 px-2 py-1 rounded-full">
                      ML Model
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Irrigation Advisor</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Get precise irrigation recommendations based on crop type, soil moisture, and weather conditions.
                  </p>
                  <div className="flex items-center text-cyan-600 font-medium text-sm">
                    Try it now
                    <TrendingUp className="w-4 h-4 ml-2" />
                  </div>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Use AI Tools?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-1">85%+</div>
                    <div className="text-sm text-gray-600">Prediction Accuracy</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-1">4</div>
                    <div className="text-sm text-gray-600">ML Models Available</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-1">24/7</div>
                    <div className="text-sm text-gray-600">Always Available</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Top Row Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Weather Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {locationName}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-5xl font-bold text-gray-900">{weather?.temp ?? '--'}°C</div>
                    <Sun className="w-16 h-16 text-yellow-400" />
                  </div>
                  <div className="text-gray-600 mb-1 capitalize">{weather?.condition?.replace('_', ' ') || 'Clear'}</div>
                  <div className="text-sm text-gray-500">Humidity: {weather?.humidity ?? '--'}%</div>
                  <div className="text-sm text-gray-500 mt-1">Wind: {weather?.windSpeed ?? '--'} km/h</div>
                </motion.div>

                {/* Soil Moisture Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{t('dashboard.soilMoisture')}</h3>
                  <div className="text-sm text-gray-600 mb-4">16 Dec 2025</div>
                  <div className="flex items-center justify-center mb-4">
                    <ResponsiveContainer width={150} height={150}>
                      <PieChart>
                        <Pie
                          data={soilMoistureData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          dataKey="value"
                        >
                          {soilMoistureData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center mb-2">
                    <div className="text-2xl font-bold text-gray-900">1m³/soil</div>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Healthy Moisture</span>
                  </div>
                </motion.div>

                {/* Available Government Schemes Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Available Government Schemes</h3>
                    <Link to="/schemes" className="text-sm text-primary-600 hover:underline">View all</Link>
                  </div>

                  {schemesLoading ? (
                    <div className="flex justify-center py-6">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                    </div>
                  ) : schemes.length > 0 ? (
                    <div className="space-y-3">
                      {schemes.map((s, idx) => (
                        <div key={s._id || idx} className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{s.title}</div>
                            <div className="text-sm text-gray-600 line-clamp-2">{s.description}</div>
                            {(s.publishDate || s.publishedAt || s.createdAt || s.deadline) && (
                              <div className="text-xs text-gray-500 mt-1">{new Date(s.publishDate || s.publishedAt || s.createdAt || s.deadline).toLocaleDateString()}</div>
                            )}
                          </div>
                          <div className="flex flex-col items-end">
                            <Link to="/schemes" className="text-sm text-primary-600 hover:underline">Details</Link>
                            <button className="mt-2 px-3 py-1 bg-primary-600 text-white rounded text-sm">Apply</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">No schemes available right now.</div>
                  )}

                </motion.div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Farm Map Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="h-64 bg-gradient-to-br from-green-400 to-emerald-600 relative">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800')] bg-cover bg-center opacity-30"></div>
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg">
                      <MapPin className="w-4 h-4 text-red-600 inline mr-1" />
                      <span className="text-sm font-medium">Field Selected</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Paddy Field</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Crop Health:</span>
                        <span className="font-medium text-green-600">Good</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Planting Date:</span>
                        <span className="font-medium">16 Dec, 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Harvest Time:</span>
                        <span className="font-medium">6 months</span>
                      </div>
                    </div>
                    <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                      More Details →
                    </button>
                  </div>
                </motion.div>

                {/* Yield Analysis Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.yieldAnalysis')}</h3>
                    <div className="flex gap-2">
                      <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                        <option>Paddy</option>
                        <option>Wheat</option>
                        <option>Maize</option>
                      </select>
                      <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                        <option>2025</option>
                        <option>2024</option>
                      </select>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={yieldData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="yield"
                        stroke="#16a34a"
                        strokeWidth={2}
                        dot={{ fill: '#16a34a', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-sm text-gray-600 mt-4">
                    Monthly comparison of crop yield to track growth performance.
                  </p>
                </motion.div>
              </div>
            </>
          )}

          <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
        </main>
      </div>
    </div>
  );
}

