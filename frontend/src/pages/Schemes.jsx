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
  }, [filter, searchTerm]);

  const fetchSchemes = async () => {
    const mockSchemes = [
  {
    _id: '1',
    title: 'Agriculture Infrastructure Fund',
    description: 'Funding support for post-harvest and farm infrastructure projects',
    publishDate: '2024-12-06',
    benefits: 'Loans with interest subsidy',
    link: 'https://agriinfra.dac.gov.in',
  },
  {
    _id: '2',
    title: 'PM-Kisan Samman Nidhi',
    description: 'Direct income support scheme for farmers',
    publishDate: '2023-12-28',
    benefits: '₹6,000 per year',
    link: 'https://pmkisan.gov.in/',
  },
  {
    _id: '3',
    title: 'ATMA',
    description: 'Agricultural extension and farmer training program',
    publishDate: '2025-04-04',
    benefits: 'Training and technical support',
    link: 'https://extensionreforms.da.gov.in/DashBoard_Statusatma.aspx',
  },
  {
    _id: '4',
    title: 'AGMARKNET',
    description: 'Online system for agricultural market prices and info',
    publishDate: '2014-03-14',
    benefits: 'Access to real-time market data',
    link: 'https://agmarknet.gov.in/PriceAndArrivals/arrivals1.aspx',
  },
  {
    _id: '5',
    title: 'Horticulture',
    description: 'Development of fruits, vegetables, and flower crops',
    publishDate: '2014-04-05',
    benefits: 'Subsidies and assistance',
    link: 'https://midh.gov.in/',
  },
  {
    _id: '6',
    title: 'Online Pesticide Registration',
    description: 'Digital platform for pesticide approvals',
    publishDate: '2009-09-23',
    benefits: 'Faster registration process',
    link: 'https://agriinfra.dac.gov.in',
  },
  {
    _id: '7',
    title: 'Plant Quarantine Clearance',
    description: 'Regulation of plant imports and exports',
    publishDate: '2011-01-05',
    benefits: 'Safe agricultural trade',
    link: 'https://pqms.cgg.gov.in/pqms-angular/home',
  },
  {
    _id: '8',
    title: 'DBT in Agriculture',
    description: 'Direct transfer of subsidies to farmers',
    publishDate: '2014-05-12',
    benefits: 'Money directly into bank accounts',
    link: 'https://www.dbtdacfw.gov.in/',
  },
  {
    _id: '9',
    title: 'Pradhan Mantri Krishi Sinchayee Yojana',
    description: 'Improving irrigation and water efficiency',
    publishDate: '2016-05-06',
    benefits: 'Subsidy on irrigation systems',
    link: 'https://pmksy.gov.in/mis/frmDashboard.aspx',
  },
  {
    _id: '10',
    title: 'Kisan Call Center',
    description: '24x7 helpline for farmers’ queries',
    publishDate: '2015-05-01',
    benefits: 'Free expert advice',
    link: 'https://mkisan.gov.in/Home/KCCDashboard',
  },
  {
    _id: '11',
    title: 'mKisan',
    description: 'Mobile-based agricultural advisory service',
    publishDate: '2015-05-06',
    benefits: 'SMS alerts and updates',
    link: 'https://mkisan.gov.in/',
  },
  {
    _id: '12',
    title: 'Jaivik Kheti',
    description: 'Promotion of organic farming',
    publishDate: '2015-05-18',
    benefits: 'Support for organic practices',
    link: 'https://pgsindia-ncof.gov.in/home.aspx',
  },
  {
    _id: '13',
    title: 'e-NAM',
    description: 'Online national agricultural marketplace',
    publishDate: '2016-10-04',
    benefits: 'Better crop prices through online trading',
    link: 'https://enam.gov.in/web/',
  },
  {
    _id: '14',
    title: 'Soil Health Card',
    description: 'Soil testing and nutrient recommendations',
    publishDate: '2016-09-01',
    benefits: 'Improved soil productivity',
    link: 'https://soilhealth.dac.gov.in/home',
  },
  {
    _id: '15',
    title: 'Pradhan Mantri Fasal Bima Yojana',
    description: 'Crop insurance scheme for farmers',
    publishDate: '2017-08-05',
    benefits: 'Insurance against crop loss',
    link: 'https://pmfby.gov.in/ext/rpt/ssfr_17',
  },
];


    try {
      setLoading(true);
      const params = {
        limit: 20,
        ...(filter !== 'all' && { cropCategory: filter }),
        ...(searchTerm && { search: searchTerm }),
      };
      const response = await schemesAPI.getSchemes(params);
      const data = response?.data;

      // Accept multiple response shapes: array, { schemes: [] }, or { success: true, schemes: [] }
      let fetched = [];
      if (Array.isArray(data)) {
        fetched = data;
      } else if (Array.isArray(data?.schemes)) {
        fetched = data.schemes;
      } else if (Array.isArray(data?.data)) {
        fetched = data.data;
      }

      if (fetched.length > 0) {
        setSchemes(fetched);
      } else if (data && fetched.length === 0) {
        // API returned but no schemes found -> show mock/demo data
        setSchemes(mockSchemes);
      } else {
        // Unexpected shape -> fallback to mock
        setSchemes(mockSchemes);
      }
    } catch (error) {
      console.error('Error fetching schemes:', error);
      // Mock data for demo
      setSchemes(mockSchemes);
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
              {t('Government Schemes')}
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
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100 flex flex-col h-full"
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

                  <div className="mt-auto flex flex-col gap-3">
                    { (scheme.publishDate || scheme.publishedAt || scheme.createdAt || scheme.deadline) && (
                      <div className="text-sm text-gray-500">{new Date(scheme.publishDate || scheme.publishedAt || scheme.createdAt || scheme.deadline).toLocaleDateString()}</div>
                    )}

                    <a
                      href={scheme.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      Apply Now
                      <ArrowRight size={16} />
                    </a>
                  </div>

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

