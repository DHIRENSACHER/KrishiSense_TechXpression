import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './locales/en.json';
import hiTranslations from './locales/hi.json';
import mrTranslations from './locales/mr.json';
import taTranslations from './locales/ta.json';
import teTranslations from './locales/te.json';
import paTranslations from './locales/pa.json';
import guTranslations from './locales/gu.json';
import knTranslations from './locales/kn.json';
import bnTranslations from './locales/bn.json';

const resources = {
  en: { translation: enTranslations },
  hi: { translation: hiTranslations },
  mr: { translation: mrTranslations },
  ta: { translation: taTranslations },
  te: { translation: teTranslations },
  pa: { translation: paTranslations },
  gu: { translation: guTranslations },
  kn: { translation: knTranslations },
  bn: { translation: bnTranslations },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;

