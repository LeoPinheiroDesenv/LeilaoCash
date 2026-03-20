import React, { useState, useEffect, useMemo } from 'react';
import TextEditor from '../components/TextEditor';
import api from '../services/api';
import '../components/TextEditor.css';

const ConfiguracoesTextos = ({ activeGroup }) => {
  const [translations, setTranslations] = useState([]);
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [translationsRes, settingsRes] = await Promise.all([
        api.get('/translations'),
        api.get('/settings')
      ]);

      if (translationsRes.data.success) {
        setTranslations(translationsRes.data.data);
      }
      
      if (settingsRes.data.success) {
        const data = settingsRes.data.data;
        
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

        ensureSettingExists('content', 'page_como_funciona', 'Conteúdo da página Como Funciona');
        ensureSettingExists('content', 'page_contato', 'Conteúdo da página Contato');
        ensureSettingExists('content', 'page_termos', 'Conteúdo da página Termos de Uso');
        ensureSettingExists('content', 'page_privacidade', 'Conteúdo da página Privacidade');
        ensureSettingExists('content', 'page_regras', 'Conteúdo da página Regras');
        ensureSettingExists('content', 'page_faq', 'Conteúdo da página FAQ');
        ensureSettingExists('content', 'page_suba_de_nivel', 'Conteúdo da página Suba de Nível');
        
        setSettings(data.content || []);
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar dados.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (id, field, value) => {
    setTranslations(prev => prev.map(t => 
      t.id === id ? { ...t, [field]: value, isDirty: true } : t
    ));
  };
  
  const handleSettingChange = (key, value) => {
    setSettings(prev => prev.map(s => 
      s.key === key ? { ...s, value: value, isDirty: true } : s
    ));
  };

  const handleSave = async (id) => {
    const translation = translations.find(t => t.id === id);
    if (!translation) return;

    // Validação: Português é obrigatório
    if (!translation.text_pt || translation.text_pt.trim() === '') {
      setMessage({ type: 'error', text: 'O texto em Português é obrigatório!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    try {
      setSaving(true);
      const response = await api.put(`/translations/${id}`, {
        text_pt: translation.text_pt,
        text_en: translation.text_en,
        text_es: translation.text_es
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: '✅ Tradução salva com sucesso!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        await loadData(); // Recarregar dados
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Erro ao salvar tradução.' });
      }
    } catch (error) {
      console.error('Erro ao salvar tradução:', error);
      setMessage({ type: 'error', text: '❌ Erro ao salvar tradução. Tente novamente.' });
    } finally {
      setSaving(false);
    }
  };
  
  const handleSettingSave = async (key) => {
    const setting = settings.find(s => s.key === key);
    if (!setting) return;

    // Validação: Conteúdo não pode estar vazio
    if (!setting.value || setting.value.trim() === '') {
      setMessage({ type: 'error', text: 'O conteúdo não pode estar vazio!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    try {
      setSaving(true);
      const response = await api.post('/settings/batch', {
        settings: { [key]: setting.value }
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: '✅ Conteúdo salvo com sucesso!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        await loadData(); // Recarregar dados
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Erro ao salvar conteúdo.' });
      }
    } catch (error) {
      console.error('Erro ao salvar conteúdo:', error);
      setMessage({ type: 'error', text: '❌ Erro ao salvar conteúdo. Tente novamente.' });
    } finally {
      setSaving(false);
    }
  };

  const groupedTranslations = useMemo(() => {
    const groups = {};
    translations.forEach(t => {
      if (!groups[t.group]) {
        groups[t.group] = [];
      }
      groups[t.group].push(t);
    });
    return groups;
  }, [translations]);

  const shouldUseRichEditor = (translation) => {
    if (translation.key === 'content') {
      return true;
    }
    const text = translation.text_pt || '';
    return text.length > 100 || /<[a-z][\s\S]*>/i.test(text);
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div><p>Carregando textos...</p></div>;
  }
  
  const isPageContentGroup = activeGroup && activeGroup.startsWith('page_');

  if (isPageContentGroup) {
    const setting = settings.find(s => s.key === activeGroup);
    
    if (!setting) {
      return <div className="no-content" style={{ padding: '2rem', textAlign: 'center', color: '#8da4bf' }}>Conteúdo não encontrado para esta página.</div>;
    }

    return (
      <div className="configuracoes-textos-layout">
        {message.text && (
          <div className={`alert alert-${message.type}`} style={{ marginBottom: '2rem' }}>
            {message.text}
          </div>
        )}
        <div className="translation-card" style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ color: '#e6eef8', fontWeight: '500' }}>{setting.description || setting.key}</span>
            </div>
            {setting.isDirty && (
              <button 
                className="btn-save" 
                onClick={() => handleSettingSave(setting.key)} 
                disabled={saving}
                style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            )}
          </div>
          <TextEditor
            value={setting.value || ''}
            onChange={(val) => handleSettingChange(setting.key, val)}
          />
        </div>
      </div>
    );
  }

  if (!activeGroup || !groupedTranslations[activeGroup]) {
    return (
      <div className="no-content" style={{ padding: '3rem', textAlign: 'center', color: '#8da4bf' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
        <h3 style={{ color: '#e6eef8', marginBottom: '0.5rem' }}>Selecione uma seção</h3>
        <p>Escolha um grupo no menu acima para editar os textos e traduções.</p>
      </div>
    );
  }

  return (
    <div className="configuracoes-textos-layout">
      {message.text && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: '2rem' }}>
          {message.text}
        </div>
      )}

      <div className="translations-list" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {groupedTranslations[activeGroup]?.map(t => (
          <div key={t.id} className="translation-card" style={{ 
            background: 'rgba(255,255,255,0.03)', 
            padding: '1.5rem', 
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ 
                  display: 'inline-block', 
                  padding: '0.25rem 0.75rem', 
                  background: 'rgba(255,255,255,0.1)', 
                  borderRadius: '4px', 
                  fontSize: '0.8rem', 
                  color: '#8da4bf',
                  fontFamily: 'monospace'
                }}>
                  {t.key}
                </span>
              </div>
              {t.isDirty && (
                <button 
                  className="btn-save" 
                  onClick={() => handleSave(t.id)}
                  disabled={saving}
                  style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
                >
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              )}
            </div>

            <div className="languages-grid" style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Português */}
              <div className="lang-field">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#e6eef8', fontWeight: '500' }}>
                  <span style={{ fontSize: '1.2rem' }}>🇧🇷</span> Português (Padrão)
                </label>
                {shouldUseRichEditor(t) ? (
                  <TextEditor
                    value={t.text_pt}
                    onChange={(val) => handleInputChange(t.id, 'text_pt', val)}
                  />
                ) : (
                  <textarea
                    className="text-input"
                    value={t.text_pt || ''}
                    onChange={(e) => handleInputChange(t.id, 'text_pt', e.target.value)}
                    rows={3}
                    style={{ width: '100%', resize: 'vertical', minHeight: '80px' }}
                  />
                )}
              </div>

              {/* Inglês */}
              <div className="lang-field">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#e6eef8', fontWeight: '500' }}>
                  <span style={{ fontSize: '1.2rem' }}>🇺🇸</span> Inglês
                  {(!t.text_en || t.text_en.trim() === '') && (
                    <span style={{ fontSize: '0.7rem', color: '#ff9800', marginLeft: '0.5rem' }}>⚠️ Vazio</span>
                  )}
                </label>
                {shouldUseRichEditor(t) ? (
                  <TextEditor
                    value={t.text_en}
                    onChange={(val) => handleInputChange(t.id, 'text_en', val)}
                  />
                ) : (
                  <textarea
                    className="text-input"
                    value={t.text_en || ''}
                    onChange={(e) => handleInputChange(t.id, 'text_en', e.target.value)}
                    rows={3}
                    style={{ width: '100%', resize: 'vertical', minHeight: '80px' }}
                  />
                )}
              </div>

              {/* Espanhol */}
              <div className="lang-field">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#e6eef8', fontWeight: '500' }}>
                  <span style={{ fontSize: '1.2rem' }}>🇪🇸</span> Espanhol
                  {(!t.text_es || t.text_es.trim() === '') && (
                    <span style={{ fontSize: '0.7rem', color: '#ff9800', marginLeft: '0.5rem' }}>⚠️ Vazio</span>
                  )}
                </label>
                {shouldUseRichEditor(t) ? (
                  <TextEditor
                    value={t.text_es}
                    onChange={(val) => handleInputChange(t.id, 'text_es', val)}
                  />
                ) : (
                  <textarea
                    className="text-input"
                    value={t.text_es || ''}
                    onChange={(e) => handleInputChange(t.id, 'text_es', e.target.value)}
                    rows={3}
                    style={{ width: '100%', resize: 'vertical', minHeight: '80px' }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConfiguracoesTextos;
