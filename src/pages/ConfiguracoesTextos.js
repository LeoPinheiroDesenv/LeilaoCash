import React, { useState, useMemo } from 'react';
import TextEditor from '../components/TextEditor';
import '../components/TextEditor.css';

const ConfiguracoesTextos = ({ settings, onInputChange }) => {
  const [activeTextTab, setActiveTextTab] = useState('home');

  // Organizar páginas individualmente
  const pageGroups = useMemo(() => {
    const contentSettings = settings.content || [];
    const socialSettings = settings.social || [];
    
    const groups = {
      home: {
        name: 'Home',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        ),
        settings: contentSettings.filter(s => 
          s.key.startsWith('home_') || s.key.startsWith('why_')
        )
      },
      como_funciona: {
        name: 'Como Funciona',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
        ),
        settings: contentSettings.filter(s => s.key === 'page_como_funciona')
      },
      categorias: {
        name: 'Categorias',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        ),
        settings: contentSettings.filter(s => s.key === 'page_categorias')
      },
      termos: {
        name: 'Termos',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        ),
        settings: contentSettings.filter(s => s.key === 'page_termos')
      },
      faq: {
        name: 'FAQ',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <path d="M12 17h.01"></path>
          </svg>
        ),
        settings: contentSettings.filter(s => s.key === 'page_faq')
      },
      privacidade: {
        name: 'Privacidade',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        ),
        settings: contentSettings.filter(s => s.key === 'page_privacidade')
      },
      regras: {
        name: 'Regras',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <line x1="10" y1="9" x2="8" y2="9"></line>
          </svg>
        ),
        settings: contentSettings.filter(s => s.key === 'page_regras')
      },
      contato: {
        name: 'Contato',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        ),
        settings: contentSettings.filter(s => s.key === 'page_contato')
      },
      suba_de_nivel: {
        name: 'Suba de Nível',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        ),
        settings: contentSettings.filter(s => s.key === 'page_suba_de_nivel')
      },
      redes_sociais: {
        name: 'Redes Sociais',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
        ),
        settings: socialSettings
      }
    };

    // Filtrar apenas grupos que têm settings
    return Object.entries(groups).filter(([_, group]) => group.settings.length > 0);
  }, [settings.content, settings.social]);

  const renderTextEditor = (setting) => (
    <div key={setting.key} className="setting-item-full">
      <div className="setting-header">
        <label className="setting-label">{setting.description || setting.key}</label>
        <span className="setting-key">{setting.key}</span>
      </div>
      {setting.type === 'html' ? (
        <TextEditor
          value={setting.value || ''}
          onChange={(value) => onInputChange(setting.key, value)}
          placeholder={setting.description}
        />
      ) : (
        <input
          type="text"
          value={setting.value || ''}
          onChange={(e) => onInputChange(setting.key, e.target.value)}
          className="text-input"
          placeholder={setting.description}
        />
      )}
    </div>
  );

  const renderSocialInput = (setting) => (
    <div key={setting.key} className="setting-item">
      <div className="setting-header">
        <label className="setting-label">{setting.description || setting.key}</label>
        <span className="setting-key">{setting.key}</span>
      </div>
      <input
        type="url"
        value={setting.value || ''}
        onChange={(e) => onInputChange(setting.key, e.target.value)}
        className="text-input"
        placeholder={setting.description}
      />
    </div>
  );

  const activeGroup = pageGroups.find(([key]) => key === activeTextTab)?.[1];

  return (
    <div className="configuracoes-textos">
      <div className="text-sub-tabs">
        {pageGroups.map(([key, group]) => (
          <button
            key={key}
            className={`text-tab-button ${activeTextTab === key ? 'active' : ''}`}
            onClick={() => setActiveTextTab(key)}
          >
            {group.icon}
            {group.name}
          </button>
        ))}
      </div>

      <div className="text-content">
        {activeGroup && (
          <div className={activeTextTab === 'redes_sociais' ? 'settings-grid' : 'settings-grid-full'}>
            {activeTextTab === 'redes_sociais' ? (
              <>
                <h3 className="section-subtitle">Links das Redes Sociais</h3>
                {activeGroup.settings.map(renderSocialInput)}
              </>
            ) : (
              <>
                <h3 className="section-subtitle">Conteúdo da Página: {activeGroup.name}</h3>
                {activeGroup.settings.map(renderTextEditor)}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfiguracoesTextos;

