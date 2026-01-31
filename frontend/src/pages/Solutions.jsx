import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Sparkles, Leaf, Droplets, Calendar, DollarSign, TrendingUp, Cloud, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Solutions() {
  const { t } = useTranslation();

  const solutions = [
    {
      icon: Sparkles,
      title: t('features.schemes.title'),
      description: t('features.schemes.description'),
      features: ['AI-powered matching', 'Real-time updates', 'Personalized recommendations'],
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Leaf,
      title: t('features.cropRecommendation.title'),
      description: t('features.cropRecommendation.description'),
      features: ['Weather analysis', 'Soil quality assessment', 'Market demand insights'],
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Droplets,
      title: t('features.irrigation.title'),
      description: t('features.irrigation.description'),
      features: ['Irrigation prediction', 'Water amount optimization', 'Weather integration'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: TrendingUp,
      title: t('features.cropYield.title'),
      description: t('features.cropYield.description'),
      features: ['Soil & moisture inputs', 'Historical yields integration', 'Actionable harvest forecasts'],
      color: 'from-indigo-500 to-violet-500',
    },
    {
      icon: DollarSign,
      title: t('features.market.title'),
      description: t('features.market.description'),
      features: ['Price forecasting', 'Market trends', 'Selling recommendations'],
      color: 'from-yellow-500 to-amber-500',
    },
    {
      icon: Cloud,
      title: 'Live Weather Dashboard',
      description: 'Real-time weather monitoring and agricultural advisories',
      features: ['Weather forecasts', 'UV index tracking', 'Farming advisories'],
      color: 'from-sky-500 to-blue-500',
    },
  ];

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Our Solutions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300"
          >
            Comprehensive agricultural advisory solutions powered by AI
          </motion.p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${solution.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <solution.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{solution.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{solution.description}</p>
                <ul className="space-y-2 mb-6">
                  {solution.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-primary-600 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium group-hover:gap-3 transition-all"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of farmers already using KrishiSense to improve their yields.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

