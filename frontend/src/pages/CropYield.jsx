import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BarChart3, Cloud, Droplets, Gauge, Sparkles, ThermometerSun } from 'lucide-react';
import { modelAPI } from '../services/api';

const CropYield = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    moisture: '',
    ph: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await modelAPI.predictCropYield({
        soil_moisture: parseFloat(formData.moisture),
        soil_ph: parseFloat(formData.ph),
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error predicting crop yield:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16"
      >
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Crop Yield Prediction
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Forecast your harvest yield using soil parameters and environmental data
          </p>
        </div>
      </motion.section>

      {/* Form Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16"
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100"
        >
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Moisture Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Droplets size={18} className="text-blue-600" />
                Soil Moisture (%)
              </label>
              <input
                type="number"
                name="moisture"
                value={formData.moisture}
                onChange={handleInputChange}
                placeholder="e.g., 65"
                step="0.1"
                min="0"
                max="100"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <p className="text-xs text-gray-500 mt-2">Optimal: 50-70%</p>
            </div>

            {/* pH Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Gauge size={18} className="text-blue-600" />
                Soil pH Level
              </label>
              <input
                type="number"
                name="ph"
                value={formData.ph}
                onChange={handleInputChange}
                placeholder="e.g., 6.5"
                step="0.1"
                min="0"
                max="14"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <p className="text-xs text-gray-500 mt-2">Optimal: 6.0-7.0</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-4 px-8 rounded-xl hover:shadow-lg hover:scale-105 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Sparkles size={20} />
            {loading ? 'Predicting...' : 'Predict Yield'}
          </button>
        </form>
      </motion.section>

      {/* Results Section */}
      {result && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <BarChart3 size={32} className="text-blue-600" />
              Predicted Yield
            </h2>

            {/* Main Result */}
            <div className="mb-8 p-8 bg-white rounded-2xl border-2 border-blue-300 shadow-md">
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">
                Expected Harvest
              </p>
              <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {result.predicted_yield?.toFixed(2)} kg/ha
              </p>
            </div>

            {/* Impact Factors */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Moisture Impact */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Droplets size={24} className="text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Moisture Impact</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Current Level: {formData.moisture}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min((parseFloat(formData.moisture) / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">Optimal: 50-70%</p>
                </div>
              </div>

              {/* pH Impact */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Gauge size={24} className="text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">pH Impact</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Current Level: {formData.ph}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: `${Math.min((parseFloat(formData.ph) / 14) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">Optimal: 6.0-7.0</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default CropYield;
