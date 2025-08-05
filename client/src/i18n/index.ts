import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLanguage } from '../utils/languageUtils.ts';

// Import translation resources
import translationEN from './locales/en.json';
import translationHI from './locales/hi.json';
import translationPA from './locales/pa.json';
import translationBN from './locales/bn.json';
import translationTE from './locales/te.json';
import translationTA from './locales/ta.json';
import translationMR from './locales/mr.json';
import translationGU from './locales/gu.json';
import translationKN from './locales/kn.json';
import translationML from './locales/ml.json';

// Configure i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: translationEN
      },
      hi: {
        translation: translationHI
      },
      pa: {
        translation: translationPA
      },
      bn: {
        translation: translationBN
      },
      te: {
        translation: translationTE
      },
      ta: {
        translation: translationTA
      },
      mr: {
        translation: translationMR
      },
      gu: {
        translation: translationGU
      },
      kn: {
        translation: translationKN
      },
      ml: {
        translation: translationML
      }
    },
    lng: getLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;