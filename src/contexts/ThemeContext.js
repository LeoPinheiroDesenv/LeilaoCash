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
        console.log('[Theme] Configurações carregadas:', newSettings);
        setSettings(newSettings);
        applyTheme(newSettings);
      } else {
        console.warn('[Theme] Resposta sem sucesso:', response.data);
        applyTheme({});
      }
    } catch (error) {
      console.error('[Theme] Erro ao carregar configurações:', error.message);
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

    // Cores Base
    apply('primary_color', '--color-primary', '#E55F52');
    apply('secondary_color', '--color-secondary', '#4A9FD8');
    apply('background_color', '--color-background', '#0a1628');
    apply('text_color', '--color-text', '#e6eef8');

    // Cores Específicas (Header, Hero, Cards, Footer)
    // Itera sobre todas as chaves que começam com 'color_' e aplica como variável CSS
    Object.keys(themeSettings).forEach(key => {
        if (key.startsWith('color_')) {
            const cssVar = '--' + key.replace(/_/g, '-');
            root.style.setProperty(cssVar, themeSettings[key]);
        }
    });

    // Fallbacks para cores específicas se não existirem no banco
    if (!themeSettings['color_header_bg']) root.style.setProperty('--color-header-bg', 'rgba(7, 16, 38, 0.8)');
    if (!themeSettings['color_header_link']) root.style.setProperty('--color-header-link', '#9fb0c8');
    if (!themeSettings['color_header_link_hover']) root.style.setProperty('--color-header-link-hover', '#e6eef8');
    
    if (!themeSettings['color_hero_bg']) root.style.setProperty('--color-hero-bg', '#07080d');
    if (!themeSettings['color_hero_title']) root.style.setProperty('--color-hero-title', '#ffffff');
    if (!themeSettings['color_hero_subtitle']) root.style.setProperty('--color-hero-subtitle', '#8da4bf');
    
    if (!themeSettings['color_card_bg']) root.style.setProperty('--color-card-bg', '#0D1529');
    if (!themeSettings['color_card_border']) root.style.setProperty('--color-card-border', 'rgba(255, 255, 255, 0.1)');
    if (!themeSettings['color_card_title']) root.style.setProperty('--color-card-title', '#ffffff');
    if (!themeSettings['color_card_price']) root.style.setProperty('--color-card-price', '#584eff');
    
    if (!themeSettings['color_footer_bg']) root.style.setProperty('--color-footer-bg', '#061026');
    if (!themeSettings['color_footer_text']) root.style.setProperty('--color-footer-text', '#9fb0c8');
    if (!themeSettings['color_footer_title']) root.style.setProperty('--color-footer-title', '#e6eef8');


    if (themeSettings.font_primary) {
      loadGoogleFont(themeSettings.font_primary);
      root.style.setProperty('--font-primary', `'${themeSettings.font_primary}', system-ui, sans-serif`);
    } else {
      // Se não tiver font_primary, usar o padrão
      root.style.setProperty('--font-primary', "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif");
    }
    
    if (themeSettings.font_secondary) {
      loadGoogleFont(themeSettings.font_secondary);
      root.style.setProperty('--font-secondary', `'${themeSettings.font_secondary}', system-ui, sans-serif`);
    } else {
      // Se não tiver font_secondary, usar o padrão
      root.style.setProperty('--font-secondary', "'Orbitron', system-ui, sans-serif");
    }

    if (themeSettings.background_image) {
      document.body.style.backgroundImage = `url(${API_BASE_URL}${themeSettings.background_image})`;
    } else {
      document.body.style.backgroundImage = 'none';
    }

    document.title = themeSettings.site_name || 'VibeGet - Leilões Online com Cashback';
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
    try {
      console.log('[Theme] Recarregando configurações...');
      const response = await api.get('/settings/public');
      if (response.data.success) {
        const newSettings = response.data.data;
        console.log('[Theme] Configurações recarregadas:', newSettings);
        setSettings(newSettings);
        applyTheme(newSettings);
        console.log('[Theme] Tema aplicado com sucesso');
      } else {
        console.warn('[Theme] Erro na resposta:', response.data);
      }
    } catch (error) {
      console.error('[Theme] Erro ao recarregar configurações:', error.message);
    }
  };

  const getLogoUrl = () => {
    if (settings.logo_url && settings.logo_url.startsWith('/uploads/')) {
      return `${API_BASE_URL}${settings.logo_url}`;
    }
    return settings.logo_url || '/logo-vibeget.png';
  };

  // Retorna o valor da configuração ou o defaultValue se não existir
  const getText = (key, defaultValue = '') => {
    return settings[key] !== undefined && settings[key] !== null ? settings[key] : defaultValue;
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
