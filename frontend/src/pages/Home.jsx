import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();

  // features removed

  // stats removed

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

      {/* Stats removed */}

      {/* Features removed */}

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

