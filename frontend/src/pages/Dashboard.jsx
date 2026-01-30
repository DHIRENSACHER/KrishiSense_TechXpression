import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { advisoryAPI, marketAPI } from '../utils/api';
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
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [weather, setWeather] = useState(null);
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [weatherRes, advisoriesRes] = await Promise.all([
          advisoryAPI.getWeatherAdvisory(),
          advisoryAPI.getAdvisories({ limit: 10 }),
        ]);
        
        if (weatherRes.data.success) {
          setWeather(weatherRes.data.data);
        }
        if (advisoriesRes.data.success) {
          setAdvisories(advisoriesRes.data.advisories || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sidebarItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Leaf, label: 'Crops' },
    { icon: MapPin, label: 'Fields' },
    { icon: Cloud, label: 'Weather' },
    { icon: Camera, label: 'Photos' },
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
                className={`p-3 rounded-lg transition-colors ${
                  item.active
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
                <div className="w-8 h-8 bg-primary-600 rounded-full"></div>
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
                    Salem
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">C</button>
                  <button className="px-2 py-1 rounded text-xs font-medium text-gray-400">F</button>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-2">Monday, 16 Dec 2025</div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-5xl font-bold text-gray-900">24°C</div>
                <Sun className="w-16 h-16 text-yellow-400" />
              </div>
              <div className="text-gray-600 mb-1">Cloudy</div>
              <div className="text-sm text-gray-500">High: 27 Low: 15</div>
              <div className="text-sm text-gray-500 mt-1">Feels like 26</div>
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

            {/* Today Activity Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.todayActivity')}</h3>
                <span className="text-sm text-gray-600">6 Activity</span>
              </div>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${activity.color}`}>
                          {activity.status}
                        </span>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                      <p className="text-sm text-gray-700">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
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
        </main>
      </div>
    </div>
  );
}

