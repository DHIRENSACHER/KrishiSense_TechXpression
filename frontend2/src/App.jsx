import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Droplets, 
  Sun, 
  Wind, 
  Sprout, 
  TrendingUp, 
  ShieldCheck, 
  Globe, 
  Menu, 
  X, 
  ChevronRight, 
  User, 
  LogOut,
  Bell,
  Search,
  LayoutDashboard,
  Settings,
  FileText,
  Thermometer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Assets & Data ---

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
];

const TRANSLATIONS = {
  en: {
    heroTitle: "Smart Agriculture Advisory System",
    heroSubtitle: "Empowering farmers with AI-driven insights for better yields and sustainable growth.",
    ctaStart: "Explore Solutions",
    ctaLogin: "Farmer Login",
    features: "Smart Features",
    feat1: "Govt. Schemes",
    feat1Desc: "AI-personalized subsidy & scheme predictions.",
    feat2: "Crop Recommendation",
    feat2Desc: "Future-ready crop advice based on soil & weather.",
    feat3: "Smart Irrigation",
    feat3Desc: "Precise water scheduling to save resources.",
    feat4: "Sowing Window",
    feat4Desc: "Optimal time prediction for maximum germination.",
    feat5: "Market Forecast",
    feat5Desc: "Real-time price trends and profit analysis.",
    dashboard: "Farm Dashboard",
    welcome: "Welcome back,",
    soil: "Soil Moisture",
    weather: "Weather",
    alerts: "Alerts"
  },
  hi: {
    heroTitle: "स्मार्ट कृषि सलाहकार प्रणाली",
    heroSubtitle: "बेहतर पैदावार और सतत विकास के लिए एआई-संचालित अंतर्दृष्टि के साथ किसानों को सशक्त बनाना।",
    ctaStart: "समाधान देखें",
    ctaLogin: "किसान लॉगिन",
    features: "स्मार्ट सुविधाएँ",
    feat1: "सरकारी योजनाएं",
    feat1Desc: "एआई-व्यक्तिगत सब्सिडी और योजना भविष्यवाणियां।",
    feat2: "फसल सिफारिश",
    feat2Desc: "मिट्टी और मौसम के आधार पर भविष्य के लिए तैयार फसल सलाह।",
    feat3: "स्मार्ट सिंचाई",
    feat3Desc: "संसाधनों को बचाने के लिए सटीक जल समय-सारिणी।",
    feat4: "बुवाई का समय",
    feat4Desc: "अधिकतम अंकुरण के लिए इष्टतम समय की भविष्यवाणी।",
    feat5: "बाजार पूर्वानुमान",
    feat5Desc: "वास्तविक समय मूल्य रुझान और लाभ विश्लेषण।",
    dashboard: "डैशबोर्ड",
    welcome: "वापसी पर स्वागत है,",
    soil: "मिट्टी की नमी",
    weather: "मौसम",
    alerts: "चेतावनी"
  },
  mr: {
    heroTitle: "स्मार्ट कृषी सल्लागार प्रणाली",
    heroSubtitle: "शेतकऱ्यांना अधिक उत्पादनासाठी एआय-आधारित माहितीसह सक्षम करणे.",
    ctaStart: "उपाय पहा",
    ctaLogin: "शेतकरी लॉगिन",
    features: "वैशिष्ट्ये",
    feat1: "सरकारी योजना",
    feat1Desc: "एआय-आधारित वैयक्तिक अनुदान आणि योजना अंदाज.",
    feat2: "पीक शिफारस",
    feat2Desc: "माती आणि हवामानावर आधारित पीक सल्ला.",
    feat3: "स्मार्ट सिंचन",
    feat3Desc: "पाणी वाचवण्यासाठी अचूक सिंचन वेळापत्रक.",
    feat4: "पेरणीची वेळ",
    feat4Desc: "जास्तीत जास्त उगवण क्षमतेसाठी योग्य वेळ.",
    feat5: "बाजार भाव",
    feat5Desc: "रिअल-टाइम दर आणि नफा विश्लेषण.",
    dashboard: "डॅशबोर्ड",
    welcome: "स्वागत आहे,",
    soil: "मातीची आर्द्रता",
    weather: "हवामान",
    alerts: "सूचना"
  },
  pa: {
    heroTitle: "ਸਮਾਰਟ ਖੇਤੀਬਾੜੀ ਸਲਾਹਕਾਰ ਪ੍ਰਣਾਲੀ",
    heroSubtitle: "ਵਧੀਆ ਪੈਦਾਵਾਰ ਲਈ ਏਆਈ-ਅਧਾਰਤ ਜਾਣਕਾਰੀ ਨਾਲ ਕਿਸਾਨਾਂ ਨੂੰ ਸ਼ਕਤੀਸ਼ਾਲੀ ਬਣਾਉਣਾ।",
    ctaStart: "ਹੱਲ ਵੇਖੋ",
    ctaLogin: "ਕਿਸਾਨ ਲਾਗਇਨ",
    features: "ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ",
    feat1: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
    feat1Desc: "ਏਆਈ ਦੁਆਰਾ ਭਵਿੱਖਬਾਣੀ ਕੀਤੀਆਂ ਸਕੀਮਾਂ।",
    feat2: "ਫਸਲ ਦੀ ਸਿਫਾਰਸ਼",
    feat2Desc: "ਮੌਸਮ ਅਤੇ ਮਿੱਟੀ ਦੇ ਅਧਾਰ ਤੇ ਸਲਾਹ।",
    feat3: "ਸਮਾਰਟ ਸਿੰਚਾਈ",
    feat3Desc: "ਪਾਣੀ ਦੀ ਬਚਤ ਲਈ ਸਹੀ ਸਮਾਂ।",
    feat4: "ਬਿਜਾਈ ਦਾ ਸਮਾਂ",
    feat4Desc: "ਵਧੀਆ ਉਗਾਉਣ ਲਈ ਸਹੀ ਸਮਾਂ।",
    feat5: "ਮਾਰਕੀਟ ਭਵਿੱਖਬਾਣੀ",
    feat5Desc: "ਮੁੱਲ ਦਾ ਰੁਝਾਨ।",
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    welcome: "ਜੀ ਆਇਆਂ ਨੂੰ,",
    soil: "ਮਿੱਟੀ ਦੀ ਨਮੀ",
    weather: "ਮੌਸਮ",
    alerts: "ਚੇਤਾਵਨੀ"
  },
  ta: {
    heroTitle: "ஸ்மார்ட் விவசாய ஆலோசனை அமைப்பு",
    heroSubtitle: "சிறந்த மகசூலுக்கான செயற்கை நுண்ணறிவு சார்ந்த தகவல்கள்.",
    ctaStart: "தீர்வுகளை ஆராயுங்கள்",
    ctaLogin: "விவசாயி உள்நுழைவு",
    features: "அம்சங்கள்",
    feat1: "அரசு திட்டங்கள்",
    feat1Desc: "AI கணித்த மானியங்கள்.",
    feat2: "பயிர் பரிந்துரை",
    feat2Desc: "மண் மற்றும் வானிலை அடிப்படையிலான ஆலோசனை.",
    feat3: "ஸ்மார்ட் நீர்ப்பாசனம்",
    feat3Desc: "நீரை சேமிக்க துல்லியமான அட்டவணை.",
    feat4: "விதைப்பு நேரம்",
    feat4Desc: "சிறந்த விதைப்பு நேர கணிப்பு.",
    feat5: "சந்தை முன்னறிவிப்பு",
    feat5Desc: "விலை நிலவரம்.",
    dashboard: "டாஷ்போர்டு",
    welcome: "மீண்டும் வருக,",
    soil: "மண் ஈரம்",
    weather: "வானிலை",
    alerts: "எச்சரிக்கைகள்"
  }
};

// --- Components ---

const Navbar = ({ lang, setLang, currentView, setView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => setView('landing')}
          >
            <div className="w-10 h-10 bg-lime-500 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-lime-200">
              <Leaf className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">Krishi<span className="text-lime-600">Sense</span></span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => setView('landing')} className="text-gray-600 hover:text-lime-600 font-medium transition-colors">Home</button>
            <button className="text-gray-600 hover:text-lime-600 font-medium transition-colors">About</button>
            <button className="text-gray-600 hover:text-lime-600 font-medium transition-colors">Services</button>
            
            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 bg-gray-100 px-3 py-2 rounded-full hover:bg-gray-200 transition">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium uppercase">{lang}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right border border-gray-100">
                <div className="py-2">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-lime-50 hover:text-lime-700"
                    >
                      {l.flag} {l.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {currentView !== 'dashboard' && (
              <button 
                onClick={() => setView('login')}
                className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-black transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {t.ctaLogin}
              </button>
            )}
            {currentView === 'dashboard' && (
              <button 
                onClick={() => setView('landing')}
                className="flex items-center space-x-2 text-red-500 hover:text-red-700 font-medium"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
             <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <button onClick={() => { setView('landing'); setIsOpen(false); }} className="block w-full text-left py-3 text-base font-medium text-gray-700">Home</button>
              <div className="flex flex-wrap gap-2 py-2">
                {LANGUAGES.map((l) => (
                  <button key={l.code} onClick={() => setLang(l.code)} className={`px-3 py-1 rounded-full text-sm border ${lang === l.code ? 'bg-lime-100 border-lime-300 text-lime-800' : 'border-gray-200'}`}>
                    {l.name}
                  </button>
                ))}
              </div>
              <button onClick={() => { setView('login'); setIsOpen(false); }} className="w-full mt-4 bg-lime-600 text-white py-3 rounded-xl font-medium">{t.ctaLogin}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, delay, color = "bg-white" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className={`${color} p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden group`}
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-bl-full z-0 transition-transform group-hover:scale-150 duration-700" />
    <div className="relative z-10">
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-sm">
        <Icon className="w-7 h-7 text-gray-900" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{desc}</p>
      
      <div className="mt-6 flex items-center text-sm font-semibold text-gray-900 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        Learn more <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </div>
  </motion.div>
);

const LandingPage = ({ lang, setView }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-16 pb-32 max-w-7xl mx-auto">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-lime-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />
        
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-lime-500 mr-2 animate-pulse" />
            <span className="text-sm font-medium text-gray-600">Now live in 10+ regions</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-tight"
          >
            {t.heroTitle.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? "text-lime-600" : ""}>{word} </span>
            ))}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {t.heroSubtitle}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-black transition-all shadow-lg hover:shadow-lime-500/20 text-lg flex items-center justify-center">
              {t.ctaStart} <ChevronRight className="ml-2 w-5 h-5" />
            </button>
            <button 
              onClick={() => setView('login')}
              className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-semibold hover:bg-gray-50 transition-all text-lg"
            >
              {t.ctaLogin}
            </button>
          </motion.div>
        </div>

        {/* Hero Image / Graphic */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border-8 border-white/50 backdrop-blur-sm relative bg-gray-100">
             {/* Abstract Representation of Digital Farming */}
             <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-200 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-1 opacity-20">
                   {Array.from({length: 72}).map((_, i) => (
                      <div key={i} className="bg-lime-500/30 rounded-sm" />
                   ))}
                </div>
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <img src="https://images.unsplash.com/photo-1625246333195-581962374a1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Smart Farm" className="object-cover w-full h-full opacity-90 hover:scale-105 transition-transform duration-1000" />
                    
                    {/* Floating UI Cards */}
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 4 }}
                      className="absolute top-10 left-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-3"
                    >
                      <div className="bg-lime-100 p-2 rounded-lg"><Leaf className="text-lime-600 w-5 h-5" /></div>
                      <div>
                        <p className="text-xs text-gray-500">Crop Health</p>
                        <p className="font-bold text-gray-900">98% Excellent</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      animate={{ y: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 5, delay: 1 }}
                      className="absolute bottom-10 right-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-3"
                    >
                      <div className="bg-blue-100 p-2 rounded-lg"><Droplets className="text-blue-600 w-5 h-5" /></div>
                      <div>
                        <p className="text-xs text-gray-500">Soil Moisture</p>
                        <p className="font-bold text-gray-900">Optimal (42%)</p>
                      </div>
                    </motion.div>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.features}</h2>
          <div className="h-1 w-20 bg-lime-500 rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large Card - Govt Schemes */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="md:col-span-2 bg-[#1A1A1A] p-10 rounded-3xl relative overflow-hidden text-white min-h-[300px] flex flex-col justify-between"
          >
             <div className="absolute top-0 right-0 p-10 opacity-10">
                <ShieldCheck className="w-64 h-64 text-white" />
             </div>
             <div>
                <div className="inline-block px-3 py-1 bg-lime-500/20 text-lime-400 rounded-full text-xs font-semibold mb-4 border border-lime-500/30">
                  AI POWERED
                </div>
                <h3 className="text-3xl font-bold mb-2">{t.feat1}</h3>
                <p className="text-gray-400 max-w-md">{t.feat1Desc}</p>
             </div>
             <div className="mt-8">
                <button className="bg-white text-black px-6 py-2 rounded-full font-medium text-sm hover:bg-gray-200 transition">Check Eligibility</button>
             </div>
          </motion.div>

          {/* Tall Card - Market */}
          <div className="md:row-span-2 bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-full h-1/2 bg-green-50/50 rounded-b-full transform -translate-y-1/2 transition-transform group-hover:translate-y-[-40%]" />
             <div className="relative z-10 h-full flex flex-col">
                <div className="mb-auto">
                  <div className="w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center mb-6 text-lime-700">
                    <TrendingUp />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.feat5}</h3>
                  <p className="text-gray-500">{t.feat5Desc}</p>
                </div>
                {/* Mock Chart */}
                <div className="mt-8 h-32 flex items-end justify-between gap-2 opacity-50">
                  {[40, 60, 45, 70, 85, 65, 90].map((h, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      className="w-full bg-lime-500 rounded-t-sm"
                    />
                  ))}
                </div>
             </div>
          </div>

          {/* Card - Crop Rec */}
          <FeatureCard icon={Sprout} title={t.feat2} desc={t.feat2Desc} delay={0.1} />

          {/* Card - Irrigation */}
          <FeatureCard icon={Droplets} title={t.feat3} desc={t.feat3Desc} delay={0.2} color="bg-blue-50/50" />

          {/* Card - Sowing Window */}
          <div className="md:col-span-2 bg-lime-50 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 border border-lime-100">
            <div>
               <div className="flex items-center gap-3 mb-4">
                  <Sun className="text-orange-500" />
                  <h3 className="text-2xl font-bold text-gray-900">{t.feat4}</h3>
               </div>
               <p className="text-gray-600 max-w-lg mb-6">{t.feat4Desc}</p>
               <div className="flex gap-4">
                 <div className="bg-white px-4 py-2 rounded-xl shadow-sm text-center">
                    <span className="block text-xs text-gray-400">Start Date</span>
                    <span className="font-bold text-gray-900">15 Oct</span>
                 </div>
                 <div className="bg-white px-4 py-2 rounded-xl shadow-sm text-center">
                    <span className="block text-xs text-gray-400">End Date</span>
                    <span className="font-bold text-gray-900">25 Oct</span>
                 </div>
               </div>
            </div>
            <div className="w-full md:w-1/3">
               <div className="aspect-square bg-white rounded-2xl shadow-sm p-4 flex items-center justify-center relative">
                 <div className="absolute inset-4 border-4 border-dashed border-gray-100 rounded-full animate-spin-slow" />
                 <div className="text-center">
                    <span className="text-4xl font-bold text-lime-600">94%</span>
                    <span className="block text-xs text-gray-400 mt-1">Success Rate</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section (Hecta Style) */}
      <section className="bg-gray-900 text-white py-24 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
           <div className="md:w-1/2">
              <div className="relative aspect-square rounded-3xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1595246140625-573b715e11d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Farmer" className="object-cover w-full h-full" />
                <div className="absolute bottom-6 left-6 right-6 bg-lime-400 text-black p-6 rounded-2xl">
                   <p className="font-bold text-lg">"KrishiSense helped me reduce water usage by 30% and doubled my wheat yield this season."</p>
                   <div className="flex justify-between items-center mt-4">
                      <span className="text-sm font-medium opacity-80">Rajesh Kumar, Punjab</span>
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                        <ChevronRight className="text-white w-4 h-4" />
                      </div>
                   </div>
                </div>
              </div>
           </div>
           <div className="md:w-1/2 space-y-12">
              <h2 className="text-4xl font-bold">Trusted by 50,000+ Farmers across India</h2>
              <div className="grid grid-cols-2 gap-8">
                 <div>
                    <h3 className="text-5xl font-bold text-lime-400 mb-2">80+</h3>
                    <p className="text-gray-400">Government Schemes Linked</p>
                 </div>
                 <div>
                    <h3 className="text-5xl font-bold text-lime-400 mb-2">97%</h3>
                    <p className="text-gray-400">Prediction Accuracy</p>
                 </div>
                 <div>
                    <h3 className="text-5xl font-bold text-lime-400 mb-2">24/7</h3>
                    <p className="text-gray-400">AI Advisory Support</p>
                 </div>
                 <div>
                    <h3 className="text-5xl font-bold text-lime-400 mb-2">12+</h3>
                    <p className="text-gray-400">Regional Languages</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
           <div className="flex items-center mb-4 md:mb-0">
              <Leaf className="text-lime-600 mr-2" />
              <span className="text-xl font-bold">KrishiSense</span>
           </div>
           <div className="text-gray-500 text-sm">
              © 2026 KrishiSense Technologies. All rights reserved.
           </div>
        </div>
      </footer>
    </div>
  );
};

const LoginPage = ({ setView }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setView('dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block w-1/2 bg-gray-900 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
          alt="Farming" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-20 left-12 right-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Welcome to the future of farming.</h2>
          <p className="text-lg text-gray-300">Join thousands of farmers optimizing their yields with AI-driven insights.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <button onClick={() => setView('landing')} className="mb-8 text-gray-500 hover:text-gray-900 flex items-center text-sm font-medium">
            ← Back to Home
          </button>
          
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Farmer Login</h2>
            <p className="text-gray-500">Access your personalized dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number / Kissan ID</label>
              <input 
                type="text" 
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none transition-all"
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none transition-all"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-lime-600 text-white py-3.5 rounded-xl font-bold hover:bg-lime-700 transition-all shadow-lg shadow-lime-200 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Login to Dashboard"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account? <span className="text-lime-600 font-bold cursor-pointer hover:underline">Register at nearby Kissan Kendra</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex pt-20">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-white border-r border-gray-200 fixed h-full z-10 hidden md:flex flex-col items-center lg:items-start py-8 lg:px-6">
         <div className="space-y-2 w-full">
            <button className="w-full flex items-center space-x-3 bg-lime-50 text-lime-700 px-4 py-3 rounded-xl font-medium transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              <span className="hidden lg:block">{t.dashboard}</span>
            </button>
            <button className="w-full flex items-center space-x-3 text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-xl font-medium transition-colors">
              <Sun className="w-5 h-5" />
              <span className="hidden lg:block">Weather</span>
            </button>
            <button className="w-full flex items-center space-x-3 text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-xl font-medium transition-colors">
              <Sprout className="w-5 h-5" />
              <span className="hidden lg:block">Crops</span>
            </button>
            <button className="w-full flex items-center space-x-3 text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-xl font-medium transition-colors">
              <FileText className="w-5 h-5" />
              <span className="hidden lg:block">Reports</span>
            </button>
            <button className="w-full flex items-center space-x-3 text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-xl font-medium transition-colors">
              <Settings className="w-5 h-5" />
              <span className="hidden lg:block">Settings</span>
            </button>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-20 lg:ml-64 p-6 lg:p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.dashboard}</h1>
            <p className="text-gray-500">{t.welcome} <span className="font-semibold text-gray-900">Rajesh Kumar</span></p>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative">
                <Bell className="w-6 h-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white" />
             </div>
             <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                <img src="https://images.unsplash.com/photo-1595246140625-573b715e11d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="User" />
             </div>
          </div>
        </header>

        {/* Dashboard Grid - Based on uploaded image layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* Weather Widget (Top Left) */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 col-span-1 md:col-span-2">
            <div className="flex justify-between items-start mb-6">
               <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full text-green-700 text-sm font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Salem, TN
               </div>
               <div className="flex gap-2">
                 <span className="text-gray-400 font-medium">°C</span>
                 <span className="text-gray-200">|</span>
                 <span className="text-gray-400">°F</span>
               </div>
            </div>
            <div className="flex items-center justify-between">
               <div>
                  <p className="text-gray-500 text-lg">Monday, 16 Dec</p>
                  <h2 className="text-5xl font-bold text-gray-900 mt-2">24°C</h2>
                  <div className="flex gap-4 mt-4 text-sm text-gray-500">
                    <span>H: 27°</span>
                    <span>L: 15°</span>
                  </div>
               </div>
               <Sun className="w-24 h-24 text-yellow-400" />
            </div>
          </div>

          {/* Soil Moisture (Top Mid) */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
             <h3 className="text-gray-500 font-medium mb-4">{t.soil}</h3>
             <div className="relative flex items-center justify-center py-4">
                <svg className="w-32 h-32 transform -rotate-90">
                   <circle cx="64" cy="64" r="56" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                   <circle cx="64" cy="64" r="56" stroke="#84cc16" strokeWidth="12" fill="none" strokeDasharray="351" strokeDashoffset="100" strokeLinecap="round" />
                </svg>
                <div className="absolute text-center">
                   <span className="text-2xl font-bold text-gray-900">72%</span>
                   <span className="block text-xs text-gray-400">Moist</span>
                </div>
             </div>
             <p className="text-center text-sm text-green-600 font-medium mt-2">Optimal Level</p>
          </div>

          {/* Alert Widget (Top Right) */}
          <div className="bg-red-50 p-6 rounded-3xl shadow-sm border border-red-100">
             <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="text-red-500 w-5 h-5" />
                <h3 className="text-red-700 font-bold">{t.alerts}</h3>
             </div>
             <p className="text-gray-700 font-medium mb-4">Field B requires irrigation today. Low moisture detected.</p>
             <button className="w-full bg-white text-red-600 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-red-500 hover:text-white transition">View Details</button>
          </div>

          {/* Farm Image / Main Card (Bottom Left) */}
          <div className="col-span-1 md:col-span-2 row-span-2 relative rounded-3xl overflow-hidden shadow-sm group">
             <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Farm Field" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
             <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                   <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg">Paddy Field A</h3>
                      <button className="text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition">Details</button>
                   </div>
                   <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                         <p className="text-gray-300 text-xs">Health</p>
                         <p className="font-semibold text-green-400">Good</p>
                      </div>
                      <div>
                         <p className="text-gray-300 text-xs">Planted</p>
                         <p className="font-semibold">16 Dec</p>
                      </div>
                      <div>
                         <p className="text-gray-300 text-xs">Harvest</p>
                         <p className="font-semibold">6 Months</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Activity List */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 col-span-1 md:col-span-2">
             <h3 className="font-bold text-gray-900 mb-6">Today's Activity</h3>
             <div className="space-y-4">
                <div className="flex gap-4 items-start pb-4 border-b border-gray-50">
                   <div className="w-12 h-12 bg-lime-100 rounded-xl flex-shrink-0 flex items-center justify-center">
                      <Leaf className="text-lime-600 w-6 h-6" />
                   </div>
                   <div>
                      <div className="flex justify-between w-full mb-1">
                         <span className="font-bold text-gray-900">Crop Monitoring</span>
                         <span className="text-xs text-gray-400">7:45 AM</span>
                      </div>
                      <p className="text-sm text-gray-500">Checked for pest infection in Sector 4. No issues found.</p>
                      <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md font-medium">Completed</span>
                   </div>
                </div>

                <div className="flex gap-4 items-start">
                   <div className="w-12 h-12 bg-blue-100 rounded-xl flex-shrink-0 flex items-center justify-center">
                      <Droplets className="text-blue-600 w-6 h-6" />
                   </div>
                   <div>
                      <div className="flex justify-between w-full mb-1">
                         <span className="font-bold text-gray-900">Irrigation Schedule</span>
                         <span className="text-xs text-gray-400">Scheduled 4:00 PM</span>
                      </div>
                      <p className="text-sm text-gray-500">Automated drip irrigation for Tomato patch.</p>
                      <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">Pending</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Yield Analysis Chart (Mock) */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 col-span-1 md:col-span-2 xl:col-span-2">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Monthly Yield Prediction</h3>
                <select className="bg-gray-50 border-none text-sm rounded-lg px-3 py-1 text-gray-600 outline-none cursor-pointer">
                   <option>2025</option>
                   <option>2024</option>
                </select>
             </div>
             <div className="h-48 flex items-end justify-between gap-1 px-2">
                {[30, 45, 35, 60, 50, 75, 40, 55, 70, 65, 80, 90].map((h, i) => (
                   <motion.div 
                     key={i}
                     initial={{ height: 0 }}
                     whileInView={{ height: `${h}%` }}
                     transition={{ duration: 1, delay: i * 0.05 }}
                     className="w-full bg-gradient-to-t from-lime-200 to-lime-500 rounded-t-lg relative group"
                   >
                     <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition">
                        {h}%
                     </div>
                   </motion.div>
                ))}
             </div>
             <div className="flex justify-between mt-4 text-xs text-gray-400 uppercase tracking-wide">
                <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Dec</span>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

const App = () => {
  const [lang, setLang] = useState('en');
  const [currentView, setView] = useState('landing'); // 'landing', 'login', 'dashboard'

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  return (
    <div className="font-sans text-gray-900 bg-white">
      <Navbar lang={lang} setLang={setLang} currentView={currentView} setView={setView} />
      
      <AnimatePresence mode="wait">
        {currentView === 'landing' && (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LandingPage lang={lang} setView={setView} />
          </motion.div>
        )}

        {currentView === 'login' && (
          <motion.div 
            key="login"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <LoginPage setView={setView} />
          </motion.div>
        )}

        {currentView === 'dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Dashboard lang={lang} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;