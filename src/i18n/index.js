import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// URL da API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'pt',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    backend: {
      // Atualizado para usar a nova rota pública
      loadPath: `${API_URL}/translations/public?lng={{lng}}`,
      parse: (data) => {
        return JSON.parse(data);
      }
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    react: {
      useSuspense: false // Evita problemas de carregamento inicial
    }
  });

export default i18n;
