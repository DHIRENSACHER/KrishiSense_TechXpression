import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Droplets, Wind, ThermometerSun, CloudRain, Sprout, Sparkles, Gauge, Waves } from 'lucide-react';
import { modelAPI } from '../services/api';

export default function Irrigation() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    crop: 'Rice',
    soil_moisture: '',
    temperature: '',
    humidity: '',
    rainfall: '',
    growth_stage: 'Vegetative',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const crops = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Vegetables', 'Potato'];
  const growthStages = ['Sowing', 'Vegetative', 'Flowering', 'Harvest'];

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
        soil_moisture: parseFloat(form.soil_moisture) || 0,
        temperature: parseFloat(form.temperature) || 0,
        humidity: parseFloat(form.humidity) || 0,
        rainfall: parseFloat(form.rainfall) || 0,
        growth_stage: form.growth_stage,
      };
      const res = await modelAPI.predictIrrigation(payload);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  const getNeedLevelColor = (level) => {
    switch (level) {
      case 'High':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Low':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white pt-24 pb-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16"
      >
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Droplets className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Smart Irrigation Advisory
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get precise water management recommendations based on real-time soil and weather data
          </p>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16"
      >
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-cyan-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Crop Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Sprout size={18} className="text-cyan-600" />
                  Crop Type
                </label>
                <select
                  name="crop"
                  value={form.crop}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition bg-gray-50"
                  required
                >
                  {crops.map((crop) => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>

              {/* Soil Moisture */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Droplets size={18} className="text-cyan-600" />
                  Soil Moisture (%)
                </label>
                <input
                  name="soil_moisture"
                  type="number"
                  step="0.1"
                  value={form.soil_moisture}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                  placeholder="e.g. 45"
                  required
                />
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <ThermometerSun size={18} className="text-cyan-600" />
                  Temperature (°C)
                </label>
                <input
                  name="temperature"
                  type="number"
                  step="0.1"
                  value={form.temperature}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                  placeholder="e.g. 28"
                  required
                />
              </div>

              {/* Humidity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Wind size={18} className="text-cyan-600" />
                  Humidity (%)
                </label>
                <input
                  name="humidity"
                  type="number"
                  step="0.1"
                  value={form.humidity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                  placeholder="e.g. 70"
                  required
                />
              </div>

              {/* Rainfall */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <CloudRain size={18} className="text-cyan-600" />
                  Recent Rainfall (mm)
                </label>
                <input
                  name="rainfall"
                  type="number"
                  step="0.1"
                  value={form.rainfall}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                  placeholder="e.g. 20"
                  required
                />
              </div>

              {/* Growth Stage */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Gauge size={18} className="text-cyan-600" />
                  Growth Stage
                </label>
                <select
                  name="growth_stage"
                  value={form.growth_stage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition bg-gray-50"
                  required
                >
                  {growthStages.map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold py-4 px-8 rounded-xl hover:shadow-lg hover:scale-[1.02] transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">Analyzing...</span>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Get Recommendation
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setForm({
                    crop: 'Rice',
                    soil_moisture: '',
                    temperature: '',
                    humidity: '',
                    rainfall: '',
                    growth_stage: 'Vegetative',
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
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-8 border border-cyan-200 shadow-lg">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <Waves className="w-8 h-8 text-cyan-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Irrigation Plan</h2>
            </div>
            
            <div className={`border-l-4 p-8 rounded-2xl bg-white shadow-md mb-8 ${getNeedLevelColor(result.irrigation_need)}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider opacity-70 mb-2">Priority Level</p>
                  <p className="text-4xl font-bold">{result.irrigation_need} Priority</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold uppercase tracking-wider opacity-70 mb-2">Recommended Water</p>
                  <p className="text-4xl font-bold text-gray-900">{result.recommended_amount_mm} mm</p>
                  <p className="text-sm text-gray-500 mt-1">≈ {result.recommended_amount_liters_per_sqm} Liters / m²</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Frequency</p>
                <p className="text-xl font-bold text-indigo-600">{result.frequency}</p>
              </div>

              {result.factors && (
                <>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Soil Moisture Impact</p>
                    <div className="flex items-end gap-2">
                      <p className="text-2xl font-bold text-blue-600">{result.factors.soil_moisture_impact}%</p>
                    </div>
                    <div className="w-full bg-gray-100 h-2 mt-2 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${result.factors.soil_moisture_impact}%` }}></div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Heat Stress Impact</p>
                    <div className="flex items-end gap-2">
                      <p className="text-2xl font-bold text-orange-600">{result.factors.temperature_impact}%</p>
                    </div>
                    <div className="w-full bg-gray-100 h-2 mt-2 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: `${result.factors.temperature_impact}%` }}></div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Humidity Impact</p>
                    <div className="flex items-end gap-2">
                      <p className="text-2xl font-bold text-emerald-600">{result.factors.humidity_impact}%</p>
                    </div>
                    <div className="w-full bg-gray-100 h-2 mt-2 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${result.factors.humidity_impact}%` }}></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
