import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

// Base URL da API (remove /api do final)
const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:8000/api').replace('/api', '');

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    primary_color: '#E55F52',
    secondary_color: '#4A9FD8',
    background_color: '#0a1628',
    text_color: '#e6eef8',
    font_primary: 'Inter',
    font_secondary: 'Orbitron',
    logo_url: '/logo-vibeget.png',
    site_name: 'VibeGet',
    site_description: 'Leilões Online com Cashback',
    favicon_url: '/favicon.ico',
    background_image: null,
    // Content settings
    home_hero_title: 'Leilões Online com Cashback',
    home_hero_subtitle: 'Dispute produtos incríveis e ganhe dinheiro de volta em cada lance!',
    home_hero_description: '',
    page_como_funciona: '',
    page_categorias: '',
    page_termos: '',
    page_faq: '',
    page_privacidade: '',
    page_regras: '',
    page_contato: '',
    page_suba_de_nivel: '',
    why_choose_content: '',
    // Social
    social_facebook: '',
    social_instagram: '',
    social_twitter: '',
    social_linkedin: '',
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      console.log('[Theme] Carregando configurações públicas da API...');
      const response = await api.get('/settings/public');
      if (response.data.success) {
        console.log('[Theme] Configurações carregadas com sucesso');
        const newSettings = { ...settings, ...response.data.data };
        setSettings(newSettings);
        applyTheme(newSettings);
      } else {
        // Se a API retornar success: false, usa o padrão
        console.warn('[Theme] API retornou success: false, usando configurações padrão.');
        applyTheme(settings);
      }
    } catch (error) {
      // Em caso de erro (404, rede, etc), usa configurações padrão
      console.warn('[Theme] Erro ao carregar configurações, usando padrão:', error.message);
      applyTheme(settings);
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar fonte do Google Fonts
  const loadGoogleFont = (fontFamily) => {
    if (!fontFamily) return;
    
    // Verificar se a fonte já foi carregada
    const linkId = `google-font-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
    if (document.getElementById(linkId)) {
      return;
    }

    // Criar link para carregar a fonte
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;500;600;700;800;900&display=swap`;
    document.head.appendChild(link);
  };

  const applyTheme = (themeSettings) => {
    const root = document.documentElement;
    
    // Apply colors
    if (themeSettings.primary_color) {
      root.style.setProperty('--color-primary', themeSettings.primary_color);
      root.style.setProperty('--color-coral', themeSettings.primary_color); // Legacy compatibility
    }
    
    if (themeSettings.secondary_color) {
      root.style.setProperty('--color-secondary', themeSettings.secondary_color);
      root.style.setProperty('--color-blue', themeSettings.secondary_color); // Legacy compatibility
    }
    
    if (themeSettings.background_color) {
      root.style.setProperty('--color-background', themeSettings.background_color);
      root.style.setProperty('--color-dark-bg', themeSettings.background_color); // Legacy compatibility
    }
    
    if (themeSettings.text_color) {
      root.style.setProperty('--color-text', themeSettings.text_color);
      root.style.setProperty('--color-text-light', themeSettings.text_color); // Legacy compatibility
    }
    
    // Apply fonts
    if (themeSettings.font_primary) {
      loadGoogleFont(themeSettings.font_primary);
      root.style.setProperty('--font-primary', `'${themeSettings.font_primary}', system-ui, -apple-system, sans-serif`);
    }
    
    if (themeSettings.font_secondary) {
      loadGoogleFont(themeSettings.font_secondary);
      root.style.setProperty('--font-secondary', `'${themeSettings.font_secondary}', system-ui, sans-serif`);
    }

    // Apply background image if exists
    if (themeSettings.background_image) {
      document.body.style.backgroundImage = `url(${API_BASE_URL}${themeSettings.background_image})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed';
    } else {
      document.body.style.backgroundImage = 'none';
    }

    // Update document title
    if (themeSettings.site_name) {
      document.title = themeSettings.site_name;
    }

    // Update meta description
    if (themeSettings.site_description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', themeSettings.site_description);
      }
    }

    // Update favicon
    if (themeSettings.favicon_url) {
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon) {
        favicon.href = `${API_BASE_URL}${themeSettings.favicon_url}`;
      }
    }
  };

  const refreshTheme = async () => {
    await loadSettings();
  };

  const getLogoUrl = () => {
    if (settings.logo_url && settings.logo_url.startsWith('/uploads/')) {
      return `${API_BASE_URL}${settings.logo_url}`;
    }
    // Use local logo for default
    return settings.logo_url || '/logo-vibeget.png';
  };

  const value = {
    settings,
    loading,
    refreshTheme,
    getLogoUrl,
    applyTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
