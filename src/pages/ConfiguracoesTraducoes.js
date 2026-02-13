import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Configuracoes.css';

const ConfiguracoesTraducoes = () => {
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filter, setFilter] = useState('');

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
        setTranslations(prev => prev.map(t => 
          t.id === id ? { ...t, isDirty: false } : t
        ));
        setMessage({ type: 'success', text: 'Tradução salva com sucesso!' });
        
        // Limpar mensagem após 3 segundos
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Erro ao salvar tradução:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar tradução.' });
    } finally {
      setSaving(false);
    }
  };

  const filteredTranslations = translations.filter(t => 
    t.key.toLowerCase().includes(filter.toLowerCase()) || 
    t.group.toLowerCase().includes(filter.toLowerCase()) ||
    (t.text_pt && t.text_pt.toLowerCase().includes(filter.toLowerCase()))
  );

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div><p>Carregando traduções...</p></div>;
  }

  return (
    <div className="configuracoes-traducoes">
      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="filters-bar" style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Filtrar por chave ou texto..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-input"
          style={{ width: '100%' }}
        />
      </div>

      <div className="translations-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filteredTranslations.map(t => (
          <div key={t.id} className="translation-item" style={{ 
            background: 'rgba(255,255,255,0.03)', 
            padding: '1.5rem', 
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div className="translation-header" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="setting-key">{t.group}.{t.key}</span>
              {t.isDirty && (
                <button 
                  className="btn-save" 
                  onClick={() => handleSave(t.id)}
                  disabled={saving}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                >
                  {saving ? '...' : 'Salvar'}
                </button>
              )}
            </div>
            
            <div className="translation-fields" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              <div className="field-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8da4bf', fontSize: '0.9rem' }}>🇧🇷 Português</label>
                <textarea
                  className="text-input"
                  value={t.text_pt || ''}
                  onChange={(e) => handleInputChange(t.id, 'text_pt', e.target.value)}
                  rows="2"
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>
              <div className="field-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8da4bf', fontSize: '0.9rem' }}>🇺🇸 Inglês</label>
                <textarea
                  className="text-input"
                  value={t.text_en || ''}
                  onChange={(e) => handleInputChange(t.id, 'text_en', e.target.value)}
                  rows="2"
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>
              <div className="field-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8da4bf', fontSize: '0.9rem' }}>🇪🇸 Espanhol</label>
                <textarea
                  className="text-input"
                  value={t.text_es || ''}
                  onChange={(e) => handleInputChange(t.id, 'text_es', e.target.value)}
                  rows="2"
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConfiguracoesTraducoes;
