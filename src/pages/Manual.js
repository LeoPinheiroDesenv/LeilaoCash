import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import './Manual.css';

const Manual = () => {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/MANUAL_DO_USUARIO.md')
      .then(res => res.text())
      .then(text => {
        setHtml(marked.parse(text));
        setLoading(false);
      })
      .catch(() => {
        setHtml('<p>Erro ao carregar o manual.</p>');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="manual-page">
        <div className="manual-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Carregando manual...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="manual-page">
      <div
        className="manual-container"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
};

export default Manual;
