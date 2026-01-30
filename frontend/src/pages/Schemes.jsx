import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { schemesAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Search, FileText, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Schemes = () => {
  const { t } = useTranslation();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSchemes();
  }, [filter]);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const params = {
        limit: 20,
        ...(filter !== 'all' && { cropCategory: filter }),
        ...(searchTerm && { search: searchTerm }),
      };
      const response = await schemesAPI.getSchemes(params);
      if (response.data.success) {
        setSchemes(response.data.schemes || []);
      }
    } catch (error) {
      console.error('Error fetching schemes:', error);
      // Mock data for demo
      setSchemes([
        {
          _id: '1',
          title: 'PM-KISAN Scheme',
          description: 'Direct income support to farmers',
          category: 'cereals',
          eligibility: 'All farmers',
          benefits: '₹6,000 per year',
          deadline: '2025-12-31',
        },
        {
          _id: '2',
          title: 'KCC Scheme',
          description: 'Credit card for farmers',
          category: 'all',
          eligibility: 'Farmers with land',
          benefits: 'Up to ₹3 lakh credit',
          deadline: '2025-12-31',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'cereals', label: 'Cereals' },
    { value: 'pulses', label: 'Pulses' },
    { value: 'oilseeds', label: 'Oilseeds' },
    { value: 'horticulture', label: 'Horticulture' },
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
              {t('nav.schemes')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover personalized government schemes tailored to your farming needs
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search schemes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Schemes List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schemes.map((scheme, index) => (
                <motion.div
                  key={scheme._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FileText className="text-primary-600" size={24} />
                    </div>
                    <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-medium">
                      {scheme.category || 'All'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{scheme.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{scheme.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="text-primary-500" size={16} />
                      <span className="text-gray-700">
                        <strong>Eligibility:</strong> {scheme.eligibility}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="text-primary-500" size={16} />
                      <span className="text-gray-700">
                        <strong>Benefits:</strong> {scheme.benefits}
                      </span>
                    </div>
                    {scheme.deadline && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="text-primary-500" size={16} />
                        <span className="text-gray-700">
                          <strong>Deadline:</strong> {new Date(scheme.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <button className="w-full mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 font-medium">
                    Apply Now
                    <ArrowRight size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && schemes.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No schemes found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Schemes;

