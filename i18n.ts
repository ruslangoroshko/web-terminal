import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import * as en from './src/locales/en/translations.json';
import { initReactI18next } from 'react-i18next';

// i18n
//   .use(LanguageDetector)
//   .use(initReactI18next)
//   .init({
//     // we init with resources
//     resources: {
//       en: JSON.stringify(en),
//     },
//     fallbackLng: 'en',
//     debug: true,

//     // have a common namespace used around the full app
//     ns: ['translations'],
//     defaultNS: 'translations',

//     keySeparator: false, // we use content as keys

//     interpolation: {
//       escapeValue: false, // not needed for react!!
//       formatSeparator: ',',
//     },

//     react: {
//       wait: true,
//     },
//   });

const resources = {
  en: {
    translation: en,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
