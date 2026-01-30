import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  Droplet, 
  Calendar, 
  DollarSign,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Sparkles,
      title: t('features.schemes.title'),
      description: t('features.schemes.description'),
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: TrendingUp,
      title: t('features.cropRecommendation.title'),
      description: t('features.cropRecommendation.description'),
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Droplet,
      title: t('features.irrigation.title'),
      description: t('features.irrigation.description'),
      color: 'bg-cyan-100 text-cyan-600',
    },
    {
      icon: Calendar,
      title: t('features.sowing.title'),
      description: t('features.sowing.description'),
      color: 'bg-orange-100 text-orange-600',
    },
    {
      icon: DollarSign,
      title: t('features.marketForecast.title'),
      description: t('features.marketForecast.description'),
      color: 'bg-green-100 text-green-600',
    },
  ];

  const stats = [
    { value: '6', label: t('stats.fields'), suffix: '/day' },
    { value: '9K+', label: t('stats.activeUsers') },
    { value: '10', label: t('stats.regions') },
    { value: '32%', label: t('stats.efficiency') },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                {t('hero.title')}
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <span>{t('hero.cta')}</span>
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/features"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 border-2 border-gray-900 rounded-full font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  {t('common.learnMore')}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="text-white" size={24} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">AI Scheme Match</div>
                        <div className="text-sm text-gray-500">3 schemes found</div>
                      </div>
                    </div>
                    <div className="h-px bg-gray-200"></div>
                    <div className="space-y-2">
                      {['PM-KISAN', 'KCC Scheme', 'Crop Insurance'].map((scheme, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="text-primary-500" size={16} />
                          <span className="text-gray-700">{scheme}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl z-10">
                <div className="text-3xl font-bold text-gray-900">32%</div>
                <div className="text-sm text-gray-600">Reduced pesticide usage</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 bg-gradient-to-br from-primary-50 to-white rounded-2xl border border-primary-100"
              >
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
                {stat.suffix && (
                  <div className="text-xs text-gray-500 mt-1">{stat.suffix}</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 group"
                >
                  <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('hero.tagline')}
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of farmers using KrishiSense to make smarter agricultural decisions.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white rounded-full font-semibold hover:bg-primary-600 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <span>{t('common.getStarted')}</span>
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

