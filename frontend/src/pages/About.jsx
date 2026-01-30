import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Target, Users, Award, Heart } from 'lucide-react';

export default function About() {
  const { t } = useTranslation();

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To empower farmers with AI-driven insights for sustainable and profitable agriculture.',
    },
    {
      icon: Users,
      title: 'Our Vision',
      description: 'A future where every farmer has access to smart agricultural technology.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to delivering the highest quality agricultural advisory services.',
    },
    {
      icon: Heart,
      title: 'Impact',
      description: 'Dedicated to improving farmer livelihoods and food security.',
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
            About KrishiSense
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300"
          >
            Empowering farmers with intelligent agricultural solutions
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              KrishiSense was born from a simple observation: farmers need better access to technology
              and data-driven insights to make informed decisions about their crops. We combine artificial
              intelligence, weather data, soil analysis, and market trends to provide personalized
              recommendations that help farmers maximize yields while minimizing resource usage.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our platform serves thousands of farmers across India, helping them navigate the complexities
              of modern agriculture with confidence. We believe that technology should be accessible,
              affordable, and easy to use for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">What drives us every day</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats removed */}
    </div>
  );
}

