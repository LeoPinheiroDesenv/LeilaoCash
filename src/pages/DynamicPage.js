import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './DynamicPage.css';

/**
 * Componente reutilizável para páginas com conteúdo dinâmico
 * @param {string} contentKey - Chave da configuração (ex: 'page_como_funciona')
 * @param {string} defaultTitle - Título padrão caso não haja conteúdo
 * @param {string} defaultContent - Conteúdo padrão caso não haja conteúdo
 */
const DynamicPage = ({ contentKey, defaultTitle = 'Página', defaultContent = '' }) => {
  const { settings, loading } = useTheme();

  if (loading) {
    return (
      <main className="page-content">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Carregando conteúdo...</p>
          </div>
        </div>
      </main>
    );
  }

  const content = settings[contentKey] || `<h1>${defaultTitle}</h1><p>${defaultContent}</p>`;

  return (
    <main className="page-content">
      <div className="container">
        <div 
          className="dynamic-content" 
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </main>
  );
};

export default DynamicPage;

