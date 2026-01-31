import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { motion } from 'framer-motion';
import { Phone, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import logoImg from '../assets/images/newlogo.png';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: phone, 2: OTP
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');

    // TEMPORARY: Direct login bypass for testing
    if (phone === '9999999999' || phone === '+919999999999') {
      const tempUser = {
        id: 'temp-user',
        name: 'Test User',
        phone: phone,
        role: 'farmer'
      };
      const tempToken = 'temp-token-for-testing';
      login(tempToken, tempUser);
      navigate('/dashboard');
      return;
    }

    if (!phone.match(/^\+?[1-9]\d{9,14}$/)) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.sendOTP(phone);
      if (response.data.success) {
        setOtpSent(true);
        setStep(2);
        setCountdown(60);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.verifyOTP(phone, otp);
      if (response.data.success) {
        login(response.data.token, response.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-green-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src={logoImg} alt="KrishiSense logo" className="mx-auto w-20 h-20 mb-4 object-contain" />
            <h1 className="text-3xl font-bold text-gray-900">{t('login.title')}</h1>
            <p className="text-gray-600 mt-2">Welcome back! Please login to continue.</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('login.phone')}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+919876543210"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">{t('login.enterPhone')}</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    {t('login.sendOtp')}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Don't have an account? <Link to="/signup" className="text-primary-600 font-semibold hover:underline">Sign Up</Link>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              {otpSent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>OTP sent to {phone}</span>
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('login.otp')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-2xl tracking-widest"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">{t('login.enterOtp')}</p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp('');
                    setOtpSent(false);
                    setError('');
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      {t('login.verify')}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {countdown > 0 && (
                <p className="text-center text-sm text-gray-600">
                  Resend OTP in {countdown}s
                </p>
              )}
              {countdown === 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setCountdown(60);
                    handleSendOTP({ preventDefault: () => { } });
                  }}
                  className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Resend OTP
                </button>
              )}
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

