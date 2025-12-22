import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './ComoFunciona.css';

const ComoFunciona = () => {
  const { settings, loading } = useTheme();

  if (loading) {
    return (
      <main className="page-content">
        <div className="container">
          <div className="loading-spinner">Carregando...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-content">
      <div className="container">
        <div 
          className="dynamic-content" 
          dangerouslySetInnerHTML={{ __html: settings.page_como_funciona || '<h1>Como Funciona</h1><p>Configure este conteúdo no painel administrativo.</p>' }}
        />
      </div>
    </main>
  );
};

export default ComoFunciona;

