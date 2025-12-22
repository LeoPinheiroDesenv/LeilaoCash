import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import ConfiguracoesLayout from './ConfiguracoesLayout';
import ConfiguracoesTextos from './ConfiguracoesTextos';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './Configuracoes.css';

const Configuracoes = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [settings, setSettings] = useState({
    theme: [],
    appearance: [],
    general: [],
    content: [],
    social: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('layout');

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      // Verificar se há token antes de fazer a requisição
      const token = localStorage.getItem('access_token');
      if (!token) {
        setMessage({ type: 'error', text: 'Você precisa estar autenticado para acessar esta página. Faça login novamente.' });
        setLoading(false);
        return;
      }
      
      // Debug: verificar token e usuário (sempre logar em produção também para debug)
      const user = localStorage.getItem('user');
      console.log('[Configuracoes] Verificando autenticação:', {
        hasToken: !!token,
        tokenLength: token?.length,
        hasUser: !!user,
        userData: user ? JSON.parse(user) : null,
        isAdmin: isAdmin,
        isAuthenticated: isAuthenticated
      });
      
      // Tentar revalidar token antes de fazer requisição crítica
      // Isso garante que o token ainda é válido
      let tokenIsValid = false;
      try {
        console.log('[Configuracoes] Validando token com /auth/me...');
        const meResponse = await api.get('/auth/me');
        if (meResponse.data.success) {
          tokenIsValid = true;
          console.log('[Configuracoes] ✅ Token válido, usuário autenticado:', meResponse.data.data);
        }
      } catch (meError) {
        // Se /auth/me falhar, o token pode estar inválido
        console.error('[Configuracoes] ❌ Falha ao validar token com /auth/me:', {
          status: meError.response?.status,
          statusText: meError.response?.statusText,
          data: meError.response?.data,
          message: meError.message,
          config: {
            url: meError.config?.url,
            baseURL: meError.config?.baseURL,
            headers: meError.config?.headers
          }
        });
        
        // Se o token está inválido, não fazer requisição de configurações
        if (meError.response?.status === 401) {
          setMessage({ type: 'error', text: 'Sessão expirada. Faça login novamente.' });
          setLoading(false);
          return;
        }
        // Continuar mesmo assim se for outro tipo de erro (rede, etc)
      }
      
      // Só fazer requisição de configurações se o token foi validado ou se não houve erro crítico
      console.log('[Configuracoes] Fazendo requisição para /settings...');
      const response = await api.get('/settings');
      
      if (response.data.success) {
        setSettings(response.data.data);
        console.log('[Configuracoes] Configurações carregadas com sucesso');
      }
    } catch (error) {
      console.error('[Configuracoes] Erro ao carregar configurações:', error);
      console.error('[Configuracoes] Detalhes do erro:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          baseURL: error.config?.baseURL
        }
      });
      
      // Tratar diferentes tipos de erro com mensagens amigáveis
      if (error.response?.status === 401) {
        // Token inválido ou expirado - SEMPRE mostrar mensagem amigável
        const backendMessage = error.response?.data?.message;
        
        // Nunca mostrar "Unauthenticated" diretamente
        let friendlyMessage = 'Sessão expirada. Faça login novamente.';
        
        if (backendMessage && !backendMessage.toLowerCase().includes('unauthenticated')) {
          friendlyMessage = backendMessage;
        } else if (backendMessage && backendMessage.includes('Não autenticado')) {
          friendlyMessage = 'Sessão expirada. Faça login novamente.';
        }
        
        setMessage({ type: 'error', text: friendlyMessage });
        
        // Não fazer logout imediato aqui, deixar o interceptor ou ProtectedRoute tratar
      } else if (error.response?.status === 403) {
        // Acesso negado (não é admin)
        setMessage({ type: 'error', text: 'Acesso negado. Apenas administradores podem acessar esta página.' });
      } else if (error.response?.status >= 500) {
        // Erro do servidor
        setMessage({ type: 'error', text: 'Erro no servidor. Tente novamente mais tarde.' });
      } else if (!error.response) {
        // Erro de rede
        setMessage({ type: 'error', text: 'Erro de conexão. Verifique sua internet e tente novamente.' });
      } else {
        // Outros erros - sempre usar mensagem amigável
        const backendMessage = error.response?.data?.message;
        
        // Nunca mostrar "Unauthenticated" ou mensagens técnicas
        let friendlyMessage = 'Erro ao carregar configurações. Tente novamente.';
        
        if (backendMessage && !backendMessage.toLowerCase().includes('unauthenticated')) {
          friendlyMessage = backendMessage;
        } else if (error.message && !error.message.toLowerCase().includes('unauthenticated')) {
          friendlyMessage = error.message;
        }
        
        setMessage({ type: 'error', text: friendlyMessage });
      }
    } finally {
      setLoading(false);
    }
  }, [isAdmin, isAuthenticated]);

  useEffect(() => {
    // Só carregar configurações se estiver autenticado e for admin
    if (isAuthenticated && isAdmin) {
      loadSettings();
    } else if (!isAuthenticated) {
      setMessage({ type: 'error', text: 'Você precisa estar autenticado para acessar esta página.' });
      setLoading(false);
    } else if (!isAdmin) {
      setMessage({ type: 'error', text: 'Acesso negado. Apenas administradores podem acessar esta página.' });
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin, loadSettings]);

  const handleInputChange = (key, value) => {
    setSettings(prevSettings => {
      const newSettings = { ...prevSettings };
      Object.keys(newSettings).forEach(group => {
        const settingIndex = newSettings[group].findIndex(s => s.key === key);
        if (settingIndex !== -1) {
          newSettings[group][settingIndex].value = value;
        }
      });
      return newSettings;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      // Prepare settings object for batch update
      const settingsToUpdate = {};
      Object.keys(settings).forEach(group => {
        settings[group].forEach(setting => {
          settingsToUpdate[setting.key] = setting.value;
        });
      });

      const response = await api.post('/settings/batch', {
        settings: settingsToUpdate
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
        // Reload settings to ensure sync
        await loadSettings();
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar configurações' });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (key, file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('key', key);

      const response = await api.post('/settings/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Imagem enviada com sucesso!' });
        await loadSettings();
      }
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      setMessage({ type: 'error', text: 'Erro ao enviar imagem' });
    }
  };

  const renderImageInput = (setting) => (
    <div className="setting-input-group">
      <div className="image-upload-wrapper">
        {setting.value && (
          <div className="image-preview">
            <img src={`http://localhost:8000${setting.value}`} alt="Preview" />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files[0]) {
              handleImageUpload(setting.key, e.target.files[0]);
            }
          }}
          className="file-input"
          id={`file-${setting.key}`}
        />
        <label htmlFor={`file-${setting.key}`} className="file-input-label">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          Escolher Imagem
        </label>
      </div>
    </div>
  );

  const renderTextInput = (setting) => (
    <input
      type="text"
      value={setting.value || ''}
      onChange={(e) => handleInputChange(setting.key, e.target.value)}
      className="text-input"
      placeholder={setting.description}
    />
  );

  const renderAppearanceSettings = () => {
    const appearanceSettings = settings.appearance || [];
    
    return (
      <div className="settings-grid">
        {appearanceSettings.map(setting => (
          <div key={setting.key} className="setting-item">
            <div className="setting-header">
              <label className="setting-label">{setting.description || setting.key}</label>
              <span className="setting-key">{setting.key}</span>
            </div>
            {setting.type === 'image' ? renderImageInput(setting) : renderTextInput(setting)}
          </div>
        ))}
      </div>
    );
  };

  const renderGeneralSettings = () => {
    const generalSettings = settings.general || [];
    
    return (
      <div className="settings-grid">
        {generalSettings.map(setting => (
          <div key={setting.key} className="setting-item">
            <div className="setting-header">
              <label className="setting-label">{setting.description || setting.key}</label>
              <span className="setting-key">{setting.key}</span>
            </div>
            {renderTextInput(setting)}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout pageTitle="Configurações" pageSubtitle="Personalize a aparência e funcionalidades do sistema">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando configurações...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Configurações" pageSubtitle="Personalize a aparência e funcionalidades do sistema">
      <div className="configuracoes-page">
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="settings-tabs">
          <button
            className={`tab-button ${activeTab === 'layout' ? 'active' : ''}`}
            onClick={() => setActiveTab('layout')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            Layout
          </button>
          <button
            className={`tab-button ${activeTab === 'textos' ? 'active' : ''}`}
            onClick={() => setActiveTab('textos')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Textos
          </button>
          <button
            className={`tab-button ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            Imagens
          </button>
          <button
            className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m-9-9h6m6 0h6"></path>
            </svg>
            Geral
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'layout' && (
            <ConfiguracoesLayout 
              settings={settings} 
              onInputChange={handleInputChange} 
            />
          )}

          {activeTab === 'textos' && (
            <ConfiguracoesTextos 
              settings={settings} 
              onInputChange={handleInputChange} 
            />
          )}

          {activeTab === 'appearance' && renderAppearanceSettings()}
          
          {activeTab === 'general' && renderGeneralSettings()}
        </div>

        <div className="settings-actions">
          <button 
            className="btn-save" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="spinner-small"></div>
                Salvando...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Salvar Configurações
              </>
            )}
          </button>
          <button 
            className="btn-cancel" 
            onClick={loadSettings}
            disabled={saving}
          >
            Cancelar
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Configuracoes;
