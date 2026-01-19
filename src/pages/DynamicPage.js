import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './DynamicPage.css';

const DynamicPage = ({ contentKey, defaultTitle }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState(defaultTitle);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get(`/settings/public/${contentKey}`);
        if (response.data && response.data.success) {
          setContent(response.data.data.content_html);
          setTitle(response.data.data.title);
        } else {
          setContent('<p>Conteúdo não encontrado.</p>');
        }
      } catch (error) {
        console.error(`Erro ao carregar conteúdo da página ${contentKey}:`, error);
        setContent('<p>Ocorreu um erro ao carregar o conteúdo. Tente novamente mais tarde.</p>');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentKey]);

  return (
    <div className="dynamic-page-container">
      <div className="page-header">
        <h1>{title}</h1>
      </div>
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando...</p>
        </div>
      ) : (
        <div 
          className="dynamic-page-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
};

export default DynamicPage;