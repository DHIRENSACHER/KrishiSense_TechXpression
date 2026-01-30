import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Calendar, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const Market = () => {
  const { t } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState('rice');

  const crops = ['rice', 'wheat', 'maize', 'cotton', 'sugarcane'];

  // Mock data - replace with actual API call
  const priceData = [
    { date: 'Jan', price: 1800 },
    { date: 'Feb', price: 1850 },
    { date: 'Mar', price: 1900 },
    { date: 'Apr', price: 1950 },
    { date: 'May', price: 2000 },
    { date: 'Jun', price: 2050 },
    { date: 'Jul', price: 2100 },
    { date: 'Aug', price: 2150 },
  ];

  const forecast = [
    { period: 'Next Week', price: 2200, change: '+5%', trend: 'up' },
    { period: 'Next Month', price: 2300, change: '+8%', trend: 'up' },
    { period: 'Next Quarter', price: 2400, change: '+12%', trend: 'up' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('features.marketForecast.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Make informed decisions with accurate market price predictions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Crop Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Crop</h2>
            <div className="flex flex-wrap gap-3">
              {crops.map((crop) => (
                <button
                  key={crop}
                  onClick={() => setSelectedCrop(crop)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    selectedCrop === crop
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {crop.charAt(0).toUpperCase() + crop.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Price Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)} Price Trend
                  </h2>
                  <p className="text-gray-600">Historical and forecasted prices</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">₹2,150</div>
                  <div className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp size={16} />
                    +5.2% from last month
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ fill: '#22c55e', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Forecast Cards */}
            <div className="space-y-4">
              {forecast.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-primary-500" size={20} />
                      <span className="font-semibold text-gray-900">{item.period}</span>
                    </div>
                    {item.trend === 'up' ? (
                      <TrendingUp className="text-green-500" size={20} />
                    ) : (
                      <TrendingDown className="text-red-500" size={20} />
                    )}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">₹{item.price}</div>
                  <div className={`text-sm font-medium ${
                    item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.change}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-lg p-8 text-white"
          >
            <h3 className="text-2xl font-bold mb-4">Market Insights</h3>
            <p className="text-primary-50 mb-6">
              Based on current trends and historical data, {selectedCrop} prices are expected to
              continue rising over the next quarter. This is an optimal time to plan your harvest
              and sales strategy.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              View Full Analysis
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Market;

