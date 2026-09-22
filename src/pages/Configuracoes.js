import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import ConfiguracoesLayout from './ConfiguracoesLayout';
import ConfiguracoesTextos from './ConfiguracoesTextos';
import ConfiguracoesLogs from './ConfiguracoesLogs';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Modal from '../components/Modal';
import './Configuracoes.css';

// Base URL da API (remove /api do final)
const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:8000/api').replace('/api', '');

const Configuracoes = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { refreshTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    theme: [],
    appearance: [],
    general: [],
    content: [],
    social: [],
    payment: [],
    text: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', success: false });
  const [activeTextGroup, setActiveTextGroup] = useState('header'); // Estado para o submenu de textos

  // Determinar a aba ativa com base na URL
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/layout')) return 'layout';
    if (path.includes('/textos')) return 'textos';
    if (path.includes('/sistema')) return 'sistema';
    return 'layout'; // Default
  };

  const activeTab = getActiveTabFromPath();

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
        const data = response.data.data;
        
        // Garantir que as chaves de páginas dinâmicas existam, mesmo que vazias
        const ensureSettingExists = (group, key, description, defaultValue = '', type = 'html') => {
          if (!data[group]) data[group] = [];
          if (!data[group].some(s => s.key === key)) {
            data[group].push({
              key,
              value: defaultValue,
              description,
              type,
              group
            });
          }
        };

        // HTML padrão da tabela para a página Como Funciona
        const defaultComoFunciona = `
<div class="tabela-comparativa-container">
  <h2 class="tabela-titulo">Comparativo de Vantagens</h2>
  <div class="tabela-wrapper">
    <table class="tabela-comparativa">
      <thead>
        <tr>
          <th></th>
          <th class="coluna-leilaocash">
            <div class="logo-header">LeilãoCash</div>
          </th>
          <th class="coluna-outros">Outros Sites de Leilão</th>
          <th class="coluna-varejo">Varejo Tradicional</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="feature-cell">Preço dos Produtos</td>
          <td class="highlight-cell">Até 90% OFF</td>
          <td>Até 90% OFF</td>
          <td>Preço Cheio</td>
        </tr>
        <tr>
          <td class="feature-cell">Cashback em Lances</td>
          <td class="highlight-cell">SIM (Até 10%)</td>
          <td>NÃO</td>
          <td>NÃO</td>
        </tr>
        <tr>
          <td class="feature-cell">Garantia de Entrega</td>
          <td class="highlight-cell">SIM</td>
          <td>Variável</td>
          <td>SIM</td>
        </tr>
        <tr>
          <td class="feature-cell">Produtos Novos</td>
          <td class="highlight-cell">SIM</td>
          <td>Variável</td>
          <td>SIM</td>
        </tr>
        <tr>
          <td class="feature-cell">Frete Grátis</td>
          <td class="highlight-cell">Em Promoções</td>
          <td>Raro</td>
          <td>Depende do Valor</td>
        </tr>
        <tr>
          <td class="feature-cell">Suporte 24h</td>
          <td class="highlight-cell">SIM</td>
          <td>NÃO</td>
          <td>Horário Comercial</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>`;

        // Injetar configurações padrão para páginas dinâmicas se não existirem
        ensureSettingExists('content', 'page_como_funciona', 'Conteúdo da página Como Funciona', defaultComoFunciona);
        ensureSettingExists('content', 'page_contato', 'Conteúdo da página Contato');
        ensureSettingExists('content', 'page_termos', 'Conteúdo da página Termos de Uso');
        ensureSettingExists('content', 'page_privacidade', 'Conteúdo da página Privacidade');
        ensureSettingExists('content', 'page_regras', 'Conteúdo da página Regras');
        ensureSettingExists('content', 'page_faq', 'Conteúdo da página FAQ');
        ensureSettingExists('content', 'page_suba_de_nivel', 'Conteúdo da página Suba de Nível');

        setSettings(prev => ({
          ...prev,
          ...data
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
      
      Object.keys(newSettings).forEach(group => {
        if (Array.isArray(newSettings[group])) {
          const settingIndex = newSettings[group].findIndex(s => s.key === key);
          if (settingIndex !== -1) {
            newSettings[group][settingIndex].value = value;
            found = true;
          }
        }
      });

      if (!found) {
        const groupName = key.startsWith('mercadopago_') ? 'payment' : 'general';
        const groupKey = groupName;

        if (newSettings[groupKey]) {
            if (!newSettings[groupKey].some(s => s.key === key)) {
                 newSettings[groupKey].push({ key, value, group: groupKey });
            }
        } else {
             newSettings[groupKey] = [{ key, value, group: groupKey }];
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
        await refreshTheme();
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
        await refreshTheme();
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
            <img 
              src={setting.value.startsWith('http') ? setting.value : `${API_BASE_URL}${setting.value}`} 
              alt="Preview" 
            />
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
    
    // Adicionar configuração de visibilidade de lances se não existir
    const showBidHistorySetting = generalSettings.find(s => s.key === 'show_bid_history') || {
        key: 'show_bid_history',
        value: 'true',
        description: 'Exibir histórico de lances na página do produto',
        group: 'general'
    };

    // Mesclar com as configurações existentes para exibição
    const displaySettings = [...generalSettings];
    if (!generalSettings.some(s => s.key === 'show_bid_history')) {
        displaySettings.push(showBidHistorySetting);
    }

    // Separar configurações SEO das demais
    const seoKeys = ['site_name', 'site_description', 'site_keywords'];
    const seoSettings = displaySettings.filter(s => seoKeys.includes(s.key));
    const otherSettings = displaySettings.filter(s => !seoKeys.includes(s.key));

    // Descrições amigáveis para SEO
    const seoDescriptions = {
      site_name: 'Nome do site (aparece na aba do navegador)',
      site_description: 'Descrição do site (aparece nos resultados do Google)',
      site_keywords: 'Palavras-chave do site (separadas por vírgula, ajudam na indexação)'
    };
    
    return (
      <>
        {seoSettings.length > 0 && (
          <div className="settings-section" style={{marginBottom: '2rem'}}>
            <h3>SEO — Otimização para Buscadores</h3>
            <p className="section-description">
              Estas configurações controlam como o site aparece nos resultados do Google e outros buscadores.
            </p>
            <div className="settings-grid">
              {seoSettings.map(setting => (
                <div key={setting.key} className="setting-item">
                  <div className="setting-header">
                    <label className="setting-label" htmlFor={`input-${setting.key}`}>{seoDescriptions[setting.key] || setting.description || setting.key}</label>
                    <span className="setting-key">{setting.key}</span>
                  </div>
                  {setting.key === 'site_keywords' ? (
                    <>
                      <input
                        type="text"
                        id={`input-${setting.key}`}
                        name={setting.key}
                        value={setting.value || ''}
                        onChange={(e) => handleInputChange(setting.key, e.target.value)}
                        className="text-input"
                        placeholder="leilão online, cashback, comprar barato (separadas por vírgula)"
                      />
                      <p className="setting-help-text" style={{fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem'}}>
                        Palavras-chave ajudam os buscadores a entender o conteúdo do site
                      </p>
                    </>
                  ) : setting.key === 'site_description' ? (
                    <>
                      <textarea
                        id={`input-${setting.key}`}
                        name={setting.key}
                        value={setting.value || ''}
                        onChange={(e) => handleInputChange(setting.key, e.target.value)}
                        className="text-input"
                        rows="3"
                        placeholder="Descrição curta do site para os buscadores"
                        style={{resize: 'vertical', minHeight: '60px'}}
                      />
                      <p className="setting-help-text" style={{fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem'}}>
                        Recomendado: entre 50 e 160 caracteres
                      </p>
                    </>
                  ) : (
                    renderTextInput(setting)
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="settings-grid">
          {otherSettings.map(setting => (
            <div key={setting.key} className="setting-item">
              <div className="setting-header">
                <label className="setting-label" htmlFor={`input-${setting.key}`}>{setting.description || setting.key}</label>
                <span className="setting-key">{setting.key}</span>
              </div>
              
              {setting.key === 'show_bid_history' ? (
                  <select
                      id={`input-${setting.key}`}
                      name={setting.key}
                      value={setting.value || 'true'}
                      onChange={(e) => handleInputChange(setting.key, e.target.value)}
                      className="text-input"
                  >
                      <option value="true">Sim</option>
                      <option value="false">Não</option>
                  </select>
              ) : (
                  renderTextInput(setting)
              )}
            </div>
          ))}
        </div>
      </>
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

    const displaySettings = defaultFields.map(field => {
      const existing = paymentSettings.find(s => s.key === field.key);
      return existing ? { ...existing, ...field, value: existing.value } : field;
    });

    // Getcoin settings
    const pixCashbackEnabled = paymentSettings.find(s => s.key === 'pix_cashback_enabled')?.value ?? 'true';
    const pixCashbackPercentage = paymentSettings.find(s => s.key === 'pix_cashback_percentage')?.value ?? '10';
    const welcomeBonusEnabled = paymentSettings.find(s => s.key === 'welcome_bonus_enabled')?.value ?? 'true';
    const welcomeBonusGetcoin = paymentSettings.find(s => s.key === 'welcome_bonus_getcoin')?.value ?? '10';

    return (
      <div className="settings-section">
        {/* Getcoin — Bônus de Boas-vindas */}
        <h3>Getcoin — Bônus de Boas-vindas</h3>
        <p className="section-description">
          Quando ativado, todo novo usuário recebe automaticamente uma quantidade fixa de Getcoin ao concluir o cadastro.
        </p>
        <div className="settings-grid" style={{marginBottom: '2rem'}}>
          <div className="setting-item">
            <div className="setting-header">
              <label className="setting-label">Ativar Getcoin de boas-vindas</label>
              <span className="setting-key">welcome_bonus_enabled</span>
            </div>
            <select
              value={welcomeBonusEnabled}
              onChange={(e) => handleInputChange('welcome_bonus_enabled', e.target.value)}
              className="text-input"
            >
              <option value="true">Sim — ativado</option>
              <option value="false">Não — desativado</option>
            </select>
          </div>
          <div className="setting-item">
            <div className="setting-header">
              <label className="setting-label">Quantidade de Getcoin no cadastro</label>
              <span className="setting-key">welcome_bonus_getcoin</span>
            </div>
            <input
              type="number"
              min="0"
              step="0.5"
              value={welcomeBonusGetcoin}
              onChange={(e) => handleInputChange('welcome_bonus_getcoin', e.target.value)}
              className="text-input"
              placeholder="10"
            />
            <p className="setting-help-text" style={{fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem'}}>
              Quantidade de Getcoin creditada a cada novo cadastro.
            </p>
          </div>
        </div>

        <div className="settings-divider"></div>

        {/* Getcoin — Cashback em Pix */}
        <h3>Getcoin — Cashback em Recargas via Pix</h3>
        <p className="section-description">
          Quando ativado, o usuário recebe automaticamente um percentual do valor recarregado via Pix como Getcoin (saldo de cashback).
        </p>
        <div className="settings-grid" style={{marginBottom: '2rem'}}>
          <div className="setting-item">
            <div className="setting-header">
              <label className="setting-label">Ativar Getcoin no Pix</label>
              <span className="setting-key">pix_cashback_enabled</span>
            </div>
            <select
              value={pixCashbackEnabled}
              onChange={(e) => handleInputChange('pix_cashback_enabled', e.target.value)}
              className="text-input"
            >
              <option value="true">Sim — ativado</option>
              <option value="false">Não — desativado</option>
            </select>
          </div>
          <div className="setting-item">
            <div className="setting-header">
              <label className="setting-label">Percentual de Getcoin (%)</label>
              <span className="setting-key">pix_cashback_percentage</span>
            </div>
            <input
              type="number"
              min="1"
              max="100"
              step="0.5"
              value={pixCashbackPercentage}
              onChange={(e) => handleInputChange('pix_cashback_percentage', e.target.value)}
              className="text-input"
              placeholder="10"
            />
            <p className="setting-help-text" style={{fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem'}}>
              Recomendado: entre 10% e 15%. Ex: recarga de R$ 100 com 10% = R$ 10 em Getcoin
            </p>
          </div>
        </div>

        <div className="settings-divider"></div>

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

  // Lista de grupos de texto para o submenu
  const textGroups = [
    // Traduções de Interface
    { id: 'header', label: '🧭 Cabeçalho', type: 'translation', description: 'Menu de navegação superior' },
    { id: 'footer', label: '🦶 Rodapé', type: 'translation', description: 'Rodapé do site' },
    { id: 'hero', label: '🎯 Hero', type: 'translation', description: 'Banner principal da homepage' },
    { id: 'home', label: '🏠 Página Inicial', type: 'translation', description: 'Seções da homepage' },
    { id: 'why_choose_us', label: '⭐ Por Que Escolher', type: 'translation', description: 'Cards de benefícios' },
    { id: 'products', label: '📦 Produtos', type: 'translation', description: 'Página de produtos e leilões' },
    { id: 'contact', label: '📧 Contato', type: 'translation', description: 'Formulário de contato' },
    { id: 'auth', label: '🔐 Autenticação', type: 'translation', description: 'Login, cadastro, recuperação de senha' },
    { id: 'auctions', label: '🏷️ Leilões', type: 'translation', description: 'Página de leilões públicos' },
    { id: 'common', label: '🔧 Textos Comuns', type: 'translation', description: 'Botões, mensagens genéricas' },
    { id: 'separator', label: '─────────────────', type: 'separator' },
    // Páginas HTML Completas (Traduções de Conteúdo)
    { id: 'how_it_works', label: '📖 Como Funciona', type: 'translation', description: 'Conteúdo da página institucional' },
    { id: 'terms', label: '📜 Termos de Uso', type: 'translation', description: 'Conteúdo dos termos e condições' },
    { id: 'privacy', label: '🔒 Privacidade', type: 'translation', description: 'Conteúdo da política de privacidade' },
    { id: 'rules', label: '⚖️ Regras', type: 'translation', description: 'Conteúdo das regras dos leilões' },
    { id: 'faq', label: '❓ FAQ', type: 'translation', description: 'Conteúdo de perguntas frequentes' },
    { id: 'level_up', label: '🚀 Suba de Nível', type: 'translation', description: 'Conteúdo do sistema de níveis' }
  ];

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
            onClick={() => navigate('/dashboard/configuracoes/layout')}
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
            onClick={() => navigate('/dashboard/configuracoes/textos')}
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
            className={`tab-button ${activeTab === 'sistema' ? 'active' : ''}`}
            onClick={() => navigate('/dashboard/configuracoes/sistema')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m-9-9h6m6 0h6"></path>
            </svg>
            Sistema
          </button>
        </div>

        {/* Submenu para Textos */}
        {activeTab === 'textos' && (
          <div className="text-sub-tabs">
            {textGroups.map(group => {
              if (group.type === 'separator') {
                return (
                  <div key={group.id} style={{ 
                    width: '100%', 
                    textAlign: 'center', 
                    color: 'rgba(255,255,255,0.2)', 
                    fontSize: '0.7rem',
                    padding: '0.5rem 0',
                    userSelect: 'none'
                  }}>
                    PÁGINAS HTML
                  </div>
                );
              }
              return (
                <button
                  key={group.id}
                  className={`text-tab-button ${activeTextGroup === group.id ? 'active' : ''}`}
                  onClick={() => setActiveTextGroup(group.id)}
                  title={group.description}
                >
                  {group.label}
                </button>
              );
            })}
          </div>
        )}

        <div className="settings-content">
          {activeTab === 'layout' && (
            <>
              <ConfiguracoesLayout 
                settings={settings} 
                onInputChange={handleInputChange} 
              />
              <div className="settings-divider"></div>
              <h3 className="section-subtitle">Imagens do Sistema</h3>
              {renderAppearanceSettings()}
            </>
          )}

          {activeTab === 'textos' && (
            <ConfiguracoesTextos 
              activeGroup={activeTextGroup}
            />
          )}

          {activeTab === 'sistema' && (
            <>
              <h3 className="section-subtitle">Configurações Gerais</h3>
              {renderGeneralSettings()}
              
              <div className="settings-divider"></div>
              
              {renderPaymentSettings()}

              <div className="settings-divider"></div>

              <div className="settings-section">
                <h3>Níveis de Viber</h3>
                <p className="section-description">
                  Configure os requisitos e benefícios de cada nível. Os Vibers sobem de nível ao vencer Vibes.
                </p>
                <div className="settings-grid">
                  {[
                    { level: 'inscrito', label: '📝 Inscrito', pctKey: 'getcoin_pct_inscrito', refKey: 'referral_getcoin_inscrito' },
                    { level: 'bronze', label: '🥉 Bronze', pctKey: 'getcoin_pct_bronze', refKey: 'referral_getcoin_bronze', vibesKey: 'vibes_to_bronze' },
                    { level: 'silver', label: '🥈 Silver', pctKey: 'getcoin_pct_silver', refKey: 'referral_getcoin_silver', vibesKey: 'vibes_to_silver' },
                    { level: 'gold', label: '🥇 Gold', pctKey: 'getcoin_pct_gold', refKey: 'referral_getcoin_gold', vibesKey: 'vibes_to_gold' },
                    { level: 'platinum', label: '👑 Platinum', pctKey: 'getcoin_pct_platinum', refKey: 'referral_getcoin_platinum', vibesKey: 'vibes_to_platinum' },
                    { level: 'diamond', label: '💎 Diamond', pctKey: 'getcoin_pct_diamond', refKey: 'referral_getcoin_diamond', vibesKey: 'vibes_to_diamond' },
                  ].map(({ level, label, pctKey, refKey, vibesKey }) => {
                    const paymentSettings = settings.payment || [];
                    const pctVal = paymentSettings.find(s => s.key === pctKey)?.value ?? '';
                    const refVal = paymentSettings.find(s => s.key === refKey)?.value ?? '';
                    const vibesVal = vibesKey ? (paymentSettings.find(s => s.key === vibesKey)?.value ?? '') : null;
                    return (
                      <div key={level} className="setting-item" style={{border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '10px'}}>
                        <div className="setting-header">
                          <label className="setting-label" style={{fontSize: '1.1rem'}}>{label}</label>
                        </div>
                        {vibesKey && (
                          <div style={{marginBottom: '0.5rem'}}>
                            <label style={{fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)'}}>Vibes para atingir</label>
                            <input
                              type="number" min="1"
                              value={vibesVal}
                              onChange={(e) => handleInputChange(vibesKey, e.target.value)}
                              className="text-input"
                              style={{marginTop: '0.25rem'}}
                            />
                          </div>
                        )}
                        <div style={{marginBottom: '0.5rem'}}>
                          <label style={{fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)'}}>% GetCoin por Get</label>
                          <input
                            type="number" min="0" max="100" step="0.5"
                            value={pctVal}
                            onChange={(e) => handleInputChange(pctKey, e.target.value)}
                            className="text-input"
                            style={{marginTop: '0.25rem'}}
                          />
                        </div>
                        <div>
                          <label style={{fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)'}}>GetCoins por indicação</label>
                          <input
                            type="number" min="0"
                            value={refVal}
                            onChange={(e) => handleInputChange(refKey, e.target.value)}
                            className="text-input"
                            style={{marginTop: '0.25rem'}}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="settings-divider"></div>
              
              <h3 className="section-subtitle">Logs do Sistema</h3>
              <ConfiguracoesLogs />
            </>
          )}
        </div>

        <div className="settings-actions">
          {activeTab !== 'textos' && (
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
          )}
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
