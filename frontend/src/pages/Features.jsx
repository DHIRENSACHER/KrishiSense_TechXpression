import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Sparkles, Leaf, Droplets, Calendar, DollarSign, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function Features() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Sparkles,
      title: t('features.schemes.title'),
      description: t('features.schemes.description'),
      benefits: [
        'Get matched with relevant government schemes',
        'Receive notifications about new opportunities',
        'Simplified application process guidance',
      ],
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Leaf,
      title: t('features.cropRecommendation.title'),
      description: t('features.cropRecommendation.description'),
      benefits: [
        'AI analyzes weather patterns and soil data',
        'Recommendations based on market demand',
        'Maximize yield potential',
      ],
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: TrendingUp,
      title: t('features.cropYield.title'),
      description: t('features.cropYield.description'),
      benefits: [
        'Predict yield from soil type and moisture',
        'Helps plan harvesting and resource allocation',
        'Supports seasonal forecasting and storage planning',
      ],
      color: 'from-indigo-500 to-violet-500',
    },
    {
      icon: Droplets,
      title: t('features.irrigation.title'),
      description: t('features.irrigation.description'),
      benefits: [
        'Predict irrigation needs using weather and soil data',
        'Precise water amount recommendations',
        'Reduce water waste and costs',
      ],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: DollarSign,
      title: t('features.market.title'),
      description: t('features.market.description'),
      benefits: [
        'Accurate price predictions',
        'Best time to sell recommendations',
        'Market trend analysis',
      ],
      color: 'from-yellow-500 to-amber-500',
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
            {t('features.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300"
          >
            {t('features.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Features List */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              >
                <div className="flex-1">
                  <div className={`inline-flex w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} items-center justify-center mb-6`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{feature.title}</h2>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1">
                  <div className={`aspect-square rounded-2xl bg-gradient-to-br ${feature.color} p-8 flex items-center justify-center`}>
                    <feature.icon className="w-32 h-32 text-white opacity-80" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

