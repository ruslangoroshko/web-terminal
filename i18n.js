import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(LanguageDetector).init({
  // we init with resources
  resources: {
    en: {
      translations: {
        Introduction: 'Introduction',
        'is an internationalization-framework which offers a complete solution to localize your product from web to mobile and desktop':
          'is an internationalization-framework which offers a complete solution to localize your product from web to mobile and desktop',
        'Plugins to detect the user language':
          'Plugins to detect the user language',
        'Plugins to load translations': 'Plugins to load translations',
        'Optionally cache the translations':
          'Optionally cache the translations',
        Advantages: 'Advantages',
        'Flexibility to use other packages':
          'Flexibility to use other packages',
      },
    },
  },
  fallbackLng: 'en',
  debug: true,

  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ',',
  },

  react: {
    wait: true,
  },
});

export default i18n;
