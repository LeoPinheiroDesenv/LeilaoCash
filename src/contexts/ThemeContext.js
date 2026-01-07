import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

// Base URL da API (remove /api do final)
const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:8000/api').replace('/api', '');

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await api.get('/settings/public');
      if (response.data.success) {
        const newSettings = response.data.data;
        setSettings(newSettings);
        applyTheme(newSettings);
      } else {
        applyTheme({});
      }
    } catch (error) {
      console.warn('[Theme] Erro ao carregar configurações, usando padrão:', error.message);
      applyTheme({});
    } finally {
      setLoading(false);
    }
  };

  const loadGoogleFont = (fontFamily) => {
    if (!fontFamily) return;
    const linkId = `google-font-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
    if (document.getElementById(linkId)) return;

    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;500;600;700;800;900&display=swap`;
    document.head.appendChild(link);
  };

  const applyTheme = (themeSettings) => {
    const root = document.documentElement;
    
    const apply = (key, cssVar, fallback) => {
        root.style.setProperty(cssVar, themeSettings[key] || fallback);
    };

    apply('primary_color', '--color-primary', '#E55F52');
    apply('secondary_color', '--color-secondary', '#4A9FD8');
    apply('background_color', '--color-background', '#0a1628');
    apply('text_color', '--color-text', '#e6eef8');

    if (themeSettings.font_primary) {
      loadGoogleFont(themeSettings.font_primary);
      root.style.setProperty('--font-primary', `'${themeSettings.font_primary}', system-ui, sans-serif`);
    }
    
    if (themeSettings.font_secondary) {
      loadGoogleFont(themeSettings.font_secondary);
      root.style.setProperty('--font-secondary', `'${themeSettings.font_secondary}', system-ui, sans-serif`);
    }

    if (themeSettings.background_image) {
      document.body.style.backgroundImage = `url(${API_BASE_URL}${themeSettings.background_image})`;
    } else {
      document.body.style.backgroundImage = 'none';
    }

    document.title = themeSettings.site_name || 'LeilaoCash';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', themeSettings.site_description || 'Leilões Online com Cashback');
    }
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon && themeSettings.favicon_url) {
      favicon.href = `${API_BASE_URL}${themeSettings.favicon_url}`;
    }
  };

  const refreshTheme = async () => {
    await loadSettings();
  };

  const getLogoUrl = () => {
    if (settings.logo_url && settings.logo_url.startsWith('/uploads/')) {
      return `${API_BASE_URL}${settings.logo_url}`;
    }
    return settings.logo_url || '/logo-vibeget.png';
  };

  const getText = (key, defaultValue = '') => {
    return settings[key] || defaultValue;
  };

  const value = {
    settings,
    loading,
    refreshTheme,
    getLogoUrl,
    getText,
    applyTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
