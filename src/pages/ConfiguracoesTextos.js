import React, { useState, useEffect, useMemo } from 'react';
import TextEditor from '../components/TextEditor';
import api from '../services/api';
import '../components/TextEditor.css';

const ConfiguracoesTextos = ({ activeGroup }) => {
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadTranslations();
  }, []);

  const loadTranslations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/translations'); // Rota admin que retorna lista completa
      if (response.data.success) {
        setTranslations(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar traduções:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar traduções.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (id, field, value) => {
    setTranslations(prev => prev.map(t => 
      t.id === id ? { ...t, [field]: value, isDirty: true } : t
    ));
  };

  const handleSave = async (id) => {
    const translation = translations.find(t => t.id === id);
    if (!translation) return;

    try {
      setSaving(true);
      const response = await api.put(`/translations/${id}`, {
        text_pt: translation.text_pt,
        text_en: translation.text_en,
        text_es: translation.text_es
      });

      if (response.data.success) {
        // Atualiza o estado com os dados retornados do servidor para garantir sincronia
        setTranslations(prev => prev.map(t => 
          t.id === id ? { ...response.data.data, isDirty: false } : t
        ));
        setMessage({ type: 'success', text: 'Tradução salva com sucesso!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Erro ao salvar tradução:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar tradução.' });
    } finally {
      setSaving(false);
    }
  };

  // Agrupar traduções por 'group'
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

  // Função para determinar se deve usar o editor rico
  const shouldUseRichEditor = (translation) => {
    // Se a chave termina em 'content' ou 'html', ou se o grupo é de uma página específica
    if (translation.key.endsWith('content') || translation.key.endsWith('html')) return true;
    
    const richTextGroups = [
      'how_it_works', 'terms', 'privacy', 'rules', 'faq', 'about', 
      'page_como_funciona', 'page_contato', 'page_termos', 'page_privacidade', 
      'page_regras', 'page_faq', 'page_suba_de_nivel'
    ];
    
    if (richTextGroups.includes(translation.group)) return true;

    // Fallback: se o texto for muito longo ou contiver tags HTML
    const text = translation.text_pt || '';
    return text.length > 100 || /<[a-z][\s\S]*>/i.test(text);
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div><p>Carregando textos...</p></div>;
  }

  // Se não houver grupo ativo ou o grupo não tiver traduções
  if (!activeGroup || !groupedTranslations[activeGroup]) {
    return (
      <div className="no-content" style={{ padding: '2rem', textAlign: 'center', color: '#8da4bf' }}>
        <p>Selecione uma seção no menu acima para editar os textos.</p>
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
