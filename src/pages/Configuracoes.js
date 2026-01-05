import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import ConfiguracoesLayout from './ConfiguracoesLayout';
import ConfiguracoesTextos from './ConfiguracoesTextos';
import ConfiguracoesLogs from './ConfiguracoesLogs';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/Modal';
import './Configuracoes.css';

const Configuracoes = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [settings, setSettings] = useState({
    theme: [],
    appearance: [],
    general: [],
    content: [],
    social: [],
    payment: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('layout');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', success: false });

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        setMessage({ type: 'error', text: 'Você precisa estar autenticado para acessar esta página. Faça login novamente.' });
        setLoading(false);
        return;
      }
      
      const response = await api.get('/settings');
      
      if (response.data.success) {
        setSettings(prev => ({
          ...prev,
          ...response.data.data
        }));
      }
    } catch (error) {
      console.error('[Configuracoes] Erro ao carregar configurações:', error);
      
      if (error.response?.status === 401) {
        setMessage({ type: 'error', text: 'Sessão expirada. Faça login novamente.' });
      } else if (error.response?.status === 403) {
        setMessage({ type: 'error', text: 'Acesso negado. Apenas administradores podem acessar esta página.' });
      } else {
        setMessage({ type: 'error', text: 'Erro ao carregar configurações. Tente novamente.' });
      }
    } finally {
      setLoading(false);
    }
  }, [isAdmin, isAuthenticated]);

  useEffect(() => {
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
      let found = false;
      
      // Tentar encontrar e atualizar a configuração existente
      Object.keys(newSettings).forEach(group => {
        if (Array.isArray(newSettings[group])) {
          const settingIndex = newSettings[group].findIndex(s => s.key === key);
          if (settingIndex !== -1) {
            newSettings[group][settingIndex].value = value;
            found = true;
          }
        }
      });

      // Se não encontrou (caso de configurações novas como as de pagamento que são mescladas na renderização),
      // precisamos adicionar ao grupo correto (payment neste caso)
      if (!found) {
        // Verificar se é uma chave de pagamento
        if (key.startsWith('mercadopago_')) {
          // Se o grupo payment não existir, cria
          if (!newSettings.payment) newSettings.payment = [];
          
          // Adiciona a nova configuração
          newSettings.payment.push({
            key: key,
            value: value,
            group: 'payment' // Assumindo que o backend usa 'payment' como grupo
          });
        }
      }
      
      return newSettings;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      const settingsToUpdate = {};
      
      Object.keys(settings).forEach(group => {
        if (Array.isArray(settings[group])) {
          settings[group].forEach(setting => {
            settingsToUpdate[setting.key] = setting.value;
          });
        }
      });

      const response = await api.post('/settings/batch', {
        settings: settingsToUpdate
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
        await loadSettings();
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar configurações' });
    } finally {
      setSaving(false);
    }
  };

  const handleValidateMercadoPago = async () => {
    setValidating(true);
    
    const paymentList = settings.payment || [];
    const paymentSettings = paymentList.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});

    try {
      const response = await api.post('/mercadopago/validate', paymentSettings);
      
      if (response.data.success) {
        setModalContent({
          title: 'Validação bem-sucedida',
          message: 'As credenciais do Mercado Pago são válidas!',
          success: true,
        });
      } else {
        setModalContent({
          title: 'Erro na Validação',
          message: response.data.message || 'As credenciais do Mercado Pago são inválidas.',
          success: false,
        });
      }
    } catch (error) {
      console.error('Erro ao validar Mercado Pago:', error);
      setModalContent({
        title: 'Erro na Validação',
        message: error.response?.data?.message || 'Ocorreu um erro ao tentar validar as credenciais.',
        success: false,
      });
    } finally {
      setValidating(false);
      setIsModalOpen(true);
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
          name={setting.key}
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
      id={`input-${setting.key}`}
      name={setting.key}
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
              <label className="setting-label" htmlFor={`input-${setting.key}`}>{setting.description || setting.key}</label>
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
              <label className="setting-label" htmlFor={`input-${setting.key}`}>{setting.description || setting.key}</label>
              <span className="setting-key">{setting.key}</span>
            </div>
            {renderTextInput(setting)}
          </div>
        ))}
      </div>
    );
  };

  const renderPaymentSettings = () => {
    const paymentSettings = settings.payment || [];
    
    const defaultFields = [
      { key: 'mercadopago_environment', description: 'Ambiente (Sandbox/Produção)', value: 'sandbox', type: 'select', options: ['sandbox', 'production'] },
      { key: 'mercadopago_public_key', description: 'Chave Pública (Public Key)', value: '' },
      { key: 'mercadopago_access_token', description: 'Token de Acesso (Access Token)', value: '' },
      { key: 'mercadopago_client_id', description: 'Client ID (Opcional)', value: '' },
      { key: 'mercadopago_client_secret', description: 'Client Secret (Opcional)', value: '' }
    ];

    // Mesclar configurações existentes com padrão
    const displaySettings = defaultFields.map(field => {
      const existing = paymentSettings.find(s => s.key === field.key);
      // Se existir, usa o valor existente. Se não, usa o valor padrão (vazio ou 'sandbox')
      // Importante: Se o valor no estado for undefined, o input fica "uncontrolled", o que pode causar problemas.
      // Garantimos que value nunca seja undefined.
      return existing ? { ...existing, ...field, value: existing.value } : field;
    });

    return (
      <div className="settings-section">
        <h3>Configurações do Mercado Pago</h3>
        <p className="section-description">
          Configure as credenciais de integração com o Mercado Pago para processar pagamentos via Pix e Cartão de Crédito.
          <br />
          <small>Para obter suas credenciais, acesse o <a href="https://www.mercadopago.com.br/developers/panel" target="_blank" rel="noopener noreferrer" style={{color: '#4A9FD8'}}>Painel de Desenvolvedores do Mercado Pago</a>.</small>
        </p>
        <div className="settings-grid">
          {displaySettings.map(setting => (
            <div key={setting.key} className="setting-item">
              <div className="setting-header">
                <label className="setting-label" htmlFor={`input-${setting.key}`}>{setting.description}</label>
                <span className="setting-key">{setting.key}</span>
              </div>
              
              {setting.type === 'select' ? (
                <select
                  id={`input-${setting.key}`}
                  name={setting.key}
                  value={setting.value || 'sandbox'}
                  onChange={(e) => handleInputChange(setting.key, e.target.value)}
                  className="text-input"
                >
                  {setting.options.map(option => (
                    <option key={option} value={option}>
                      {option === 'sandbox' ? 'Sandbox (Testes)' : 'Produção (Real)'}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  id={`input-${setting.key}`}
                  name={setting.key}
                  value={setting.value || ''}
                  onChange={(e) => handleInputChange(setting.key, e.target.value)}
                  className="text-input"
                  placeholder={`Insira ${setting.description}`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="settings-actions" style={{marginTop: '2rem'}}>
          <button 
            className="btn-validate" 
            onClick={handleValidateMercadoPago}
            disabled={validating}
          >
            {validating ? 'Validando...' : 'Validar Credenciais'}
          </button>
        </div>
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
          <button
            className={`tab-button ${activeTab === 'payment' ? 'active' : ''}`}
            onClick={() => setActiveTab('payment')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            Pagamentos
          </button>
          <button
            className={`tab-button ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
              <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
            Logs
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

          {activeTab === 'payment' && renderPaymentSettings()}

          {activeTab === 'logs' && <ConfiguracoesLogs />}
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
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
      >
        <p style={{color: modalContent.success ? 'green' : 'red'}}>{modalContent.message}</p>
      </Modal>
    </AdminLayout>
  );
};

export default Configuracoes;
