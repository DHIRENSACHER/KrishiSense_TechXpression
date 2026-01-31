import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Thermometer, CloudRain, Droplets, MapPin, Calendar, TrendingUp, Sparkles } from 'lucide-react';
import { modelAPI } from '../services/api';

export default function Predict() {
  const [form, setForm] = useState({
    temperature: '',
    rainfall: '',
    soil_ph: '',
    area: '',
    season: 'kharif',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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
        temperature: parseFloat(form.temperature) || 0,
        rainfall: parseFloat(form.rainfall) || 0,
        soil_ph: parseFloat(form.soil_ph) || 0,
        area: parseFloat(form.area) || 0,
        season: form.season,
      };
      const res = await modelAPI.predictCrop(payload);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Leaf className="text-green-600" size={40} />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Smart Crop Recommendation
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI-powered crop selection based on environmental conditions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-lg">
                <Sparkles className="text-green-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Enter Field Parameters</h2>
                <p className="text-gray-600">Provide environmental data for accurate crop recommendations</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Thermometer size={18} className="text-red-500" />
                    Temperature (°C)
                  </span>
                  <input 
                    name="temperature" 
                    type="number"
                    step="0.1"
                    value={form.temperature} 
                    onChange={handleChange} 
                    className="input px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all" 
                    placeholder="e.g. 28.5"
                    required
                  />
                  <span className="text-xs text-gray-500 mt-1">Average temperature in your region</span>
                </label>
                
                <label className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <CloudRain size={18} className="text-blue-500" />
                    Rainfall (mm)
                  </span>
                  <input 
                    name="rainfall" 
                    type="number"
                    step="0.1"
                    value={form.rainfall} 
                    onChange={handleChange} 
                    className="input px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all" 
                    placeholder="e.g. 200"
                    required
                  />
                  <span className="text-xs text-gray-500 mt-1">Annual rainfall in mm</span>
                </label>
                
                <label className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Droplets size={18} className="text-purple-500" />
                    Soil pH
                  </span>
                  <input 
                    name="soil_ph" 
                    type="number"
                    step="0.1"
                    value={form.soil_ph} 
                    onChange={handleChange} 
                    className="input px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all" 
                    placeholder="e.g. 6.5"
                    required
                  />
                  <span className="text-xs text-gray-500 mt-1">Optimal range: 6.0-7.5</span>
                </label>
                
                <label className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin size={18} className="text-green-500" />
                    Area (hectares)
                  </span>
                  <input 
                    name="area" 
                    type="number"
                    step="0.1"
                    value={form.area} 
                    onChange={handleChange} 
                    className="input px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all" 
                    placeholder="e.g. 1.2"
                    required
                  />
                  <span className="text-xs text-gray-500 mt-1">Total farmland area</span>
                </label>
              </div>

              <label className="flex flex-col">
                <span className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={18} className="text-orange-500" />
                  Growing Season
                </span>
                <select 
                  name="season" 
                  value={form.season} 
                  onChange={handleChange} 
                  className="input px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                >
                  <option value="kharif">🌾 Kharif (Monsoon: June-October)</option>
                  <option value="rabi">🌻 Rabi (Winter: October-March)</option>
                  <option value="zaid">🌽 Zaid (Summer: March-June)</option>
                </select>
              </label>

              <div className="flex items-center gap-4 pt-4">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 justify-center">
                      <Sparkles size={20} />
                      Get Crop Recommendations
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => { 
                    setForm({ temperature:'', rainfall:'', soil_ph:'', area:'', season:'kharif' }); 
                    setResult(null); 
                    setError(null); 
                  }}
                  className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                >
                  Reset
                </button>
              </div>
            </form>

            {/* Results Section */}
            <div className="mt-8">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border-2 border-red-200 text-red-700 p-6 rounded-xl flex items-start gap-3"
                >
                  <div className="p-2 bg-red-100 rounded-lg">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Prediction Error</h4>
                    <p>{error}</p>
                  </div>
                </motion.div>
              )}
              
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-8 rounded-xl"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-green-500 rounded-full">
                      <Leaf className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Recommended Crop</h3>
                      <p className="text-green-700">Based on your field conditions</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Best Match</p>
                        <p className="text-4xl font-bold text-green-700">{result.prediction}</p>
                      </div>
                      {result.confidence !== undefined && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-2">Confidence</p>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all"
                                style={{ width: `${Math.round((result.confidence || 0) * 100)}%` }}
                              />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">
                              {Math.round((result.confidence || 0) * 100)}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {result.alternatives && result.alternatives.length > 0 && (
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-600" />
                        Alternative Crop Options
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {result.alternatives.map((crop, idx) => (
                          <div 
                            key={idx}
                            className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-300 rounded-lg text-blue-800 font-medium"
                          >
                            {crop}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500"
            >
              <div className="p-3 bg-green-100 rounded-lg w-fit mb-4">
                <Leaf className="text-green-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Smart Selection</h3>
              <p className="text-gray-600 text-sm">AI analyzes temperature, rainfall, and soil conditions to recommend optimal crops</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500"
            >
              <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Maximize Yield</h3>
              <p className="text-gray-600 text-sm">Choose crops best suited for your land to increase productivity and profits</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-purple-500"
            >
              <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
                <Sparkles className="text-purple-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Data-Driven</h3>
              <p className="text-gray-600 text-sm">Recommendations based on proven agricultural science and ML algorithms</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
