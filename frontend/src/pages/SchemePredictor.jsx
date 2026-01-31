import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Target, Award, Shield, Sparkles, Sprout, Gauge, CloudRain, ThermometerSun, Droplets, MapPin } from 'lucide-react';
import { modelAPI } from '../services/api';

export default function SchemePredictor() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    crop: 'Rice',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph: '',
    rainfall: '',
    temperature: '',
    humidity: '',
    land_size: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const crops = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Jute', 'Sugarcane', 'Pulses', 'Vegetables', 'Fruits', 'Spices'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = {
        crop: form.crop,
        nitrogen: parseFloat(form.nitrogen) || 0,
        phosphorus: parseFloat(form.phosphorus) || 0,
        potassium: parseFloat(form.potassium) || 0,
        ph: parseFloat(form.ph) || 0,
        rainfall: parseFloat(form.rainfall) || 0,
        temperature: parseFloat(form.temperature) || 0,
        humidity: parseFloat(form.humidity) || 0,
        land_size: parseFloat(form.land_size) || 0,
      };
      const res = await modelAPI.predictScheme(payload);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-24 pb-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16"
      >
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Government Scheme Finder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover eligible government subsidies and schemes tailored to your farm profile
          </p>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16"
      >
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-purple-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Crop Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Sprout size={18} className="text-purple-600" />
                  Crop Type
                </label>
                <select
                  name="crop"
                  value={form.crop}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition bg-gray-50"
                  required
                >
                  {crops.map((crop) => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>

              {/* Nitrogen */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Gauge size={18} className="text-purple-600" />
                  Nitrogen (N)
                </label>
                <input
                  name="nitrogen"
                  type="number"
                  value={form.nitrogen}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="e.g. 50"
                  required
                />
              </div>

              {/* Phosphorus */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Gauge size={18} className="text-purple-600" />
                  Phosphorus (P)
                </label>
                <input
                  name="phosphorus"
                  type="number"
                  value={form.phosphorus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="e.g. 40"
                  required
                />
              </div>

              {/* Potassium */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Gauge size={18} className="text-purple-600" />
                  Potassium (K)
                </label>
                <input
                  name="potassium"
                  type="number"
                  value={form.potassium}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="e.g. 50"
                  required
                />
              </div>

              {/* Soil pH */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Droplets size={18} className="text-purple-600" />
                  Soil pH
                </label>
                <input
                  name="ph"
                  type="number"
                  step="0.1"
                  value={form.ph}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="e.g. 6.5"
                  required
                />
              </div>

              {/* Rainfall */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <CloudRain size={18} className="text-purple-600" />
                  Rainfall (mm)
                </label>
                <input
                  name="rainfall"
                  type="number"
                  value={form.rainfall}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="e.g. 1000"
                  required
                />
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <ThermometerSun size={18} className="text-purple-600" />
                  Temperature (°C)
                </label>
                <input
                  name="temperature"
                  type="number"
                  step="0.1"
                  value={form.temperature}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="e.g. 28"
                  required
                />
              </div>

              {/* Humidity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Droplets size={18} className="text-purple-600" />
                  Humidity (%)
                </label>
                <input
                  name="humidity"
                  type="number"
                  step="0.1"
                  value={form.humidity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="e.g. 70"
                  required
                />
              </div>

              {/* Land Size */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-purple-600" />
                  Land Size (hectares)
                </label>
                <input
                  name="land_size"
                  type="number"
                  step="0.1"
                  value={form.land_size}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="e.g. 1.5"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-8 rounded-xl hover:shadow-lg hover:scale-[1.02] transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">Searching Schemes...</span>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Find Scheme
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setForm({
                    crop: 'Rice',
                    nitrogen: '',
                    phosphorus: '',
                    potassium: '',
                    ph: '',
                    rainfall: '',
                    temperature: '',
                    humidity: '',
                    land_size: '',
                  });
                  setResult(null);
                  setError(null);
                }}
                className="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </motion.section>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-4 mb-8"
        >
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-2">
            <span className="font-bold">Error:</span> {error}
          </div>
        </motion.div>
      )}

      {result && result.success && (
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-200 shadow-lg">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Recommended Scheme</h2>
            </div>
            
            <div className="border-l-4 border-purple-500 p-8 rounded-2xl bg-white shadow-md mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <p className="text-sm font-semibold uppercase tracking-wider opacity-70 mb-2">Best Match For You</p>
                  <p className="text-3xl font-bold text-purple-900">{result.recommended_scheme}</p>
                  {result.confidence && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${Math.round(result.confidence * 100)}%` }}></div>
                      </div>
                      <span className="text-sm font-medium text-green-600">{Math.round(result.confidence * 100)}% Match</span>
                    </div>
                  )}
                </div>
                {result.reason && (
                  <div className="md:w-1/2 bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <p className="text-sm font-bold text-purple-800 mb-1 flex items-center gap-2">
                      <Shield size={16} /> Why this scheme?
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">{result.reason}</p>
                  </div>
                )}
              </div>
            </div>

            {result.parameters_analyzed && (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Land Eligibility</p>
                  <p className="text-2xl font-bold text-green-700">
                    {result.parameters_analyzed.land_size} ha
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Soil Health Status</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {result.parameters_analyzed.soil_health}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Weather Risk Profile</p>
                  <p className="text-2xl font-bold text-orange-700">
                    {result.parameters_analyzed.weather_risk}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.section>
      )}
    </div>
  );
}
