import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './DynamicPage.css';

/**
 * Componente reutilizável para páginas com conteúdo dinâmico
 * @param {string} contentKey - Chave da configuração (ex: 'page_como_funciona')
 * @param {string} defaultTitle - Título padrão caso não haja conteúdo
 * @param {React.ReactNode} children - Conteúdo adicional a ser renderizado após o conteúdo dinâmico
 */
const DynamicPage = ({ contentKey, defaultTitle = 'Página', children }) => {
  const { settings, loading } = useTheme();


    // Função para limpar estilos rígidos de largura
    const cleanHtmlContent = (htmlString) => {
        if (!htmlString) return "";

        let clean = htmlString;

        // 1. Remove style="width: ..." inline
        // Regex procura por 'width:' seguido de qualquer coisa até ';' ou fim das aspas
        clean = clean.replace(/width:\s*[0-9]+(px|%|em|rem)?\s*;?/gi, 'width: 100%;');

        // 2. Remove atributos width="1000" fixos de tabelas e imagens
        // Substitui por width="100%" ou remove
        clean = clean.replace(/width=["']\d+["']/gi, 'width="100%"');

        // 3. (Opcional) Remove heights fixos para evitar distorção ao redimensionar width
        clean = clean.replace(/height=["']\d+["']/gi, 'height="auto"');

        return clean;
    };

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

  // Usar o conteúdo da API se existir, caso contrário, exibir uma mensagem padrão.
  const content = settings[contentKey] || `<h1>${defaultTitle}</h1><p>Nenhum conteúdo disponível para esta página no momento.</p>`;

  return (
    <main className="page-content">
      <div className="container">
        <div 
          className="dynamic-content mx-auto"
          dangerouslySetInnerHTML={{ __html: cleanHtmlContent(content) }}
        />
        {children}
      </div>
    </main>
  );
};

export default DynamicPage;
