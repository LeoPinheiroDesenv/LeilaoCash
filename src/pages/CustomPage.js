import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import './DynamicPage.css';

const CustomPage = () => {
  const { slug } = useParams();
  const { i18n, t } = useTranslation();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await api.get(`/pages/public/${slug}`);
        if (res.data.success) {
          setPage(res.data.data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadPage();
  }, [slug]);

  if (loading) {
    return (
      <main className="page-content">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>{t('common.loading_content', 'Carregando conteúdo...')}</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !page) {
    return (
      <main className="page-content">
        <div className="container">
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <h1 style={{ color: '#fff', marginBottom: '1rem' }}>Página não encontrada</h1>
            <p style={{ color: '#8da4bf' }}>A página que você procura não existe ou foi desativada.</p>
          </div>
        </div>
      </main>
    );
  }

  const lang = i18n.language;
  let content = page.content_pt;
  if (lang === 'en' && page.content_en) content = page.content_en;
  if (lang === 'es' && page.content_es) content = page.content_es;

  if (!content) content = page.content_pt || '<p>Nenhum conteúdo disponível.</p>';

  return (
    <main className="page-content">
      <div className="container">
        <div
          className="dynamic-content mx-auto"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </main>
  );
};

export default CustomPage;
