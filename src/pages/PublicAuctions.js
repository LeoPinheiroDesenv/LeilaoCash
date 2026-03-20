import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import ProductSection from '../components/ProductSection';
import api from '../services/api';
import './PublicAuctions.css';

// Função utilitária movida para fora do componente para evitar recriação
const calculateTimeRemaining = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end - now;

  if (diff <= 0) return '00:00:00';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const PublicAuctions = ({ searchTerm }) => {
  const { t, i18n } = useTranslation();
  const { getText } = useTheme();

  const getCategoryName = (cat) => {
    const lang = i18n.language;
    if (lang === 'en' && cat.name_en) return cat.name_en;
    if (lang === 'es' && cat.name_es) return cat.name_es;
    return cat.name;
  };
  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category_id: ''
  });
  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories/public?is_active=true');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const loadAuctions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = '/auctions/public?status=active&per_page=50';
      if (filters.category_id) url += `&category_id=${filters.category_id}`;
      if (searchTerm && searchTerm.trim()) {
        url += `&search=${encodeURIComponent(searchTerm.trim())}`;
      }

      const response = await api.get(url, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.data.success) {
        const auctionsData = response.data.data.data || response.data.data || [];
        
        const products = auctionsData.flatMap(auction => 
          (auction.products || [])
            .filter(product => !filters.category_id || String(product.category_id) === String(filters.category_id) || String(product.category) === String(filters.category_id))
            .map(product => ({
              id: product.id,
              title: product.name,
            price: `R$ ${parseFloat(auction.current_bid || auction.starting_bid).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            oldPrice: `R$ ${parseFloat(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            cashbackPercent: parseFloat(auction.cashback_percentage || 0).toFixed(0),
            discount: Math.round(((parseFloat(product.price) - parseFloat(auction.current_bid || auction.starting_bid)) / parseFloat(product.price)) * 100),
            isHot: auction.status === 'active',
            timer: auction.end_date ? calculateTimeRemaining(auction.end_date) : '00:00:00',
            bids: auction.bids_count || '0',
            url: `/produto/${product.id}`,
            image: product.image_url 
              ? (product.image_url.startsWith('http') 
                  ? product.image_url 
                  : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8000'}${product.image_url}`)
              : 'https://via.placeholder.com/400x300?text=Sem+Imagem',
            description: product.description || '',
            type: product.categoryModel?.name || product.category || 'Geral',
          }))
        );

        setAuctions(products);
      }
    } catch (error) {
      console.error('Erro ao carregar leilões:', error);
      setError('Erro ao carregar leilões. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm]); // Dependência de filters e searchTerm

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    // Adicionando debounce para evitar requisições excessivas na busca
    const timeoutId = setTimeout(() => {
        loadAuctions();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [loadAuctions]);

  return (
    <div className="public-auctions-page">
      <div className="container">
        <div className="page-header">
          <h1>{t('auctions.title', 'Todos os Leilões')}</h1>

          <p className="corrije_sub">{t('auctions.subtitle', '')}</p>
        </div>

        <div className="filters-bar">
          <select 
            value={filters.category_id}
            onChange={(e) => setFilters({...filters, category_id: e.target.value})}
            className="category-select"
          >
            <option value="">{t('auctions.all_categories', 'Todas as Categorias')}</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{getCategoryName(cat)}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>{t('common.loading', 'Carregando...')}</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
            <button onClick={loadAuctions} className="btn-retry">{t('common.try_again', 'Tentar Novamente')}</button>
          </div>
        ) : auctions.length === 0 ? (
          <div className="empty-state">
            <p>{t('auctions.no_auctions', 'Nenhum leilão encontrado com os filtros selecionados.')}</p>
          </div>
        ) : (
          <ProductSection 
            title="" 
            products={auctions}
          />
        )}
      </div>
    </div>
  );
};

export default PublicAuctions;
