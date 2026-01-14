import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Countdown from './Countdown';
import api from '../services/api';
import './productPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { settings, getText } = useTheme();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCheckingFavorite, setIsCheckingFavorite] = useState(false);
  const [bidding, setBidding] = useState(false);
  const [bidMessage, setBidMessage] = useState({ type: '', text: '' });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const prevBidRef = useRef(0);

  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    if (typeof priceString === 'number') return priceString;
    
    const cleanString = priceString.toString().replace('R$', '').trim();
    
    if (cleanString.includes(',') && cleanString.indexOf('.') < cleanString.indexOf(',')) {
        return parseFloat(cleanString.replace(/\./g, '').replace(',', '.'));
    }
    
    return parseFloat(cleanString.replace(/,/g, ''));
  };

  const loadProduct = async (isPolling = false) => {
    try {
      if (!isPolling) setError(null);
      
      const response = await api.get(`/products/public/${id}`);
      if (response.data.success) {
        const newProductData = response.data.data;
        const newAuction = newProductData.auction || {};
        
        const newCurrentBid = parsePrice(newAuction.current_bid || newAuction.starting_bid || newProductData.price);
        
        if (isPolling && prevBidRef.current > 0 && newCurrentBid > prevBidRef.current) {
            setToastMessage(`${getText('text_new_bid_notification', 'Novo lance! Valor atual:')} ${formatPrice(newCurrentBid)}`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
        
        prevBidRef.current = newCurrentBid;
        setProduct(newProductData);
        
        const minBid = newCurrentBid + 0.5;
        if (!bidAmount || parseFloat(bidAmount) < minBid) {
            setBidAmount(minBid.toFixed(2));
        }
      } else {
        if (!isPolling) setError(getText('text_product_not_found', 'Produto não encontrado'));
      }
    } catch (err) {
      console.error('Erro ao carregar produto:', err);
      if (!isPolling) setError(getText('text_product_load_error', 'Erro ao carregar produto'));
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      loadProduct();
      
      const interval = setInterval(() => {
          loadProduct(true);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [id]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product?.id]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!isAuthenticated || !product) {
        setIsFavorite(false);
        return;
      }

      try {
        setIsCheckingFavorite(true);
        const response = await api.get(`/favorites/${product.id}/check`);
        if (response.data.success) {
          setIsFavorite(response.data.data.is_favorite);
        }
      } catch (error) {
        console.error('Erro ao verificar favorito:', error);
        setIsFavorite(false);
      } finally {
        setIsCheckingFavorite(false);
      }
    };

    checkFavorite();
  }, [product?.id, isAuthenticated]);

  const auction = product?.auction || {};
  const productImage = product?.image_url 
    ? (product.image_url.startsWith('http') 
        ? product.image_url 
        : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8000'}${product.image_url}`)
    : 'https://via.placeholder.com/400x300?text=Sem+Imagem';
  
  const additionalImages = product?.images && Array.isArray(product.images) 
    ? product.images.map(img => 
        img.startsWith('http') 
          ? img 
          : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8000'}${img}`
      )
    : [];

  const allImages = [productImage, ...additionalImages].filter(Boolean);
  const currentImage = allImages[currentImageIndex] || allImages[0] || productImage;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const currentBid = parsePrice(auction.current_bid || auction.starting_bid || product?.price);
  const minBid = currentBid + 0.5;
  
  const formatWinnerName = (name) => {
      if (!name) return getText('text_no_leader', 'Nenhum');
      const parts = name.split(' ');
      if (parts.length > 1) {
          return `${parts[0]} ${parts[1].charAt(0)}.`;
      }
      return parts[0];
  };

  const currentLeader = auction.winner ? formatWinnerName(auction.winner.name) : getText('text_no_leader', 'Nenhum');
  
  const formatPrice = (price) => {
    if (price === undefined || price === null) return 'R$ 0,00';
    return `R$ ${parseFloat(price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const calculateTimeRemaining = (endDate) => {
    if (!endDate) return '00:00:00';
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) return '00:00:00';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleBid = async (e) => {
    e.preventDefault();
    setBidMessage({ type: '', text: '' });
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/produto/${id}` } });
      return;
    }

    if (!auction || !auction.id) {
        setBidMessage({ type: 'error', text: getText('text_not_in_auction', 'Este produto não está em leilão.') });
        return;
    }
    
    try {
        setBidding(true);
        const response = await api.post(`/auctions/${auction.id}/bids`, { 
            amount: parseFloat(bidAmount) 
        });

        if (response.data.success) {
            setBidMessage({ type: 'success', text: getText('text_bid_success', 'Lance realizado com sucesso!') });
            await loadProduct();
        } else {
            setBidMessage({ type: 'error', text: response.data.message || getText('text_bid_error_generic', 'Erro ao realizar lance.') });
        }
    } catch (error) {
        console.error('Erro no lance:', error);
        setBidMessage({ 
            type: 'error', 
            text: error.response?.data?.message || getText('text_bid_error_balance', 'Erro ao processar lance. Verifique seu saldo.') 
        });
    } finally {
        setBidding(false);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/produto/${id}` } });
      return;
    }

    if (!product || !product.id) {
      console.error('Produto não encontrado');
      return;
    }

    try {
      setIsCheckingFavorite(true);
      const response = await api.post(`/favorites/${product.id}/toggle`, {}, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.success) {
        setIsFavorite(response.data.data?.is_favorite ?? !isFavorite);
      } else {
        throw new Error('Resposta inválida da API');
      }
    } catch (error) {
      console.error('Erro ao favoritar produto:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          getText('text_favorite_error', 'Erro ao favoritar produto. Tente novamente.');
      
      if (error.response?.status === 401) {
        // Token expirado ou inválido
        navigate('/login', { state: { from: `/produto/${id}` } });
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsCheckingFavorite(false);
    }
  };

  const handleShare = async () => {
    const productUrl = window.location.href;
    const shareData = {
      title: product.name,
      text: `${getText('text_share_product', 'Confira este produto:')} ${product.name}`,
      url: productUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(productUrl);
        alert(getText('text_link_copied', 'Link copiado para a área de transferência!'));
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(productUrl);
          alert(getText('text_link_copied', 'Link copiado para a área de transferência!'));
        } catch (clipboardError) {
          console.error('Erro ao copiar link:', clipboardError);
          alert(getText('text_share_error', 'Erro ao compartilhar. Tente copiar o link manualmente.'));
        }
      }
    }
  };

  if (loading) {
    return (
      <main>
        <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <p style={{ color: '#8da4bf', fontSize: '1.1rem' }}>{getText('text_loading_product', 'Carregando produto...')}</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main>
        <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <h2 style={{ color: '#E55F52', marginBottom: '1rem' }}>{getText('text_product_not_found', 'Produto não encontrado')}</h2>
          <p style={{ color: '#8da4bf', marginBottom: '2rem' }}>{error || getText('text_product_not_found_subtitle', 'O produto que você está procurando não existe.')}</p>
          <Link to="/" style={{ color: '#4A9FD8', textDecoration: 'none' }}>{getText('text_back_to_home', 'Voltar para a página inicial')}</Link>
        </div>
      </main>
    );
  }

  return (
      <main>
        {showToast && (
            <div className="toast-notification">
                {toastMessage}
            </div>
        )}
        <section className="product-detail">
          <div className="container">
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              {getText('text_back', 'Voltar')}
            </Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{product.name}</span>
          </div>

          <div className="product-layout">
            <div className="product-gallery">
              <div className="main-image">
                <img src={currentImage} alt={product.name} />
                {auction.status === 'active' && (
                  <div className="product-badge hot-badge">
                    <span>{getText('text_hot_deal', 'Hot Deal')}</span>
                  </div>
                )}
                {auction.cashback_percentage && (
                  <div className="product-badge discount-badge">
                    {auction.cashback_percentage}% {getText('text_cashback', 'Cashback')}
                  </div>
                )}
                {allImages.length > 1 && (
                  <>
                    <button 
                      className="gallery-nav prev" 
                      aria-label={getText('text_previous_image', 'Imagem anterior')}
                      onClick={handlePrevImage}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6"/>
                      </svg>
                    </button>
                    <button 
                      className="gallery-nav next" 
                      aria-label={getText('text_next_image', 'Próxima imagem')}
                      onClick={handleNextImage}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="thumbnail-list">
                  {allImages.map((img, index) => (
                    <button 
                      key={index} 
                      className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                      aria-label={`${getText('text_image', 'Imagem')} ${index + 1}`}
                      onClick={() => handleThumbnailClick(index)}
                    >
                      <img src={img} alt={`Thumbnail ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="product-info">
              <div className="product-header">
                {auction.cashback_percentage && (
                  <div className="cashback-tag">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                    {auction.cashback_percentage}% {getText('text_cashback', 'Cashback')}
                  </div>
                )}
                <span className="product-status">{product.is_active ? getText('text_active', 'Ativo') : getText('text_inactive', 'Inativo')}</span>
              </div>
              <h1>{product.name}</h1>

              <div className="product-meta-info">
                <div className="meta-row">
                  <div className="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span className="meta-label">{getText('text_visits', 'Visitas')}:</span>
                    <span className="meta-value">{product.visits || '1,234'}</span>
                  </div>
                  <div className="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 7h-9"></path>
                      <path d="M14 17H5"></path>
                      <circle cx="17" cy="17" r="3"></circle>
                      <circle cx="7" cy="7" r="3"></circle>
                    </svg>
                    <span className="meta-label">{getText('text_category', 'Categoria')}:</span>
                    <span className="meta-value">{product.categoryModel?.name || product.category || 'Geral'}</span>
                  </div>
                </div>
              </div>

              {(product.brand || product.model) && (
                <div className="product-info-section">
                  <h3>{getText('text_information', 'Informações')}</h3>
                  <div className="info-grid">
                    {product.brand && (
                      <div className="info-item">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <div>
                          <span className="info-label">{getText('text_brand', 'Marca')}:</span>
                          <span className="info-value">{product.brand}</span>
                        </div>
                      </div>
                    )}
                    {product.model && (
                      <div className="info-item">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <div>
                          <span className="info-label">{getText('text_model', 'Modelo')}:</span>
                          <span className="info-value">{product.model}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {auction && (
                <div className="get-section">
                  <h3>{getText('text_auction', 'Leilão')}</h3>
                  <div className="get-info-grid">
                    <div className="get-info-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.5 12.5l-8 8a2.119 2.119 0 1 1-3-3l8-8"></path>
                        <path d="m16 16 6-6"></path>
                        <path d="m8 8 6-6"></path>
                        <path d="m9 7 8 8"></path>
                        <path d="m21 11-8-8"></path>
                      </svg>
                      <div>
                        <span className="get-label">{getText('text_status', 'Status')}:</span>
                        <span className="get-value">{auction.status === 'active' ? getText('text_active', 'Ativo') : auction.status === 'scheduled' ? getText('text_scheduled', 'Agendado') : getText('text_finished', 'Encerrado')}</span>
                      </div>
                    </div>
                    <div className="get-info-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                      <div>
                        <span className="get-label">{getText('text_starting_bid', 'Lance Inicial')}:</span>
                        <span className="get-value">{formatPrice(auction.starting_bid || product.price)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {auction.end_date && (
                <div className="timer-section">
                  <div className="timer-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {getText('text_time_remaining', 'Tempo restante')}
                  </div>
                  <div className="timer-display">
                    <Countdown timeString={calculateTimeRemaining(auction.end_date)} displayMode="display" />
                  </div>
                </div>
              )}

              <div className="price-section">
                <div className="price-group">
                  <p className="price-label">{getText('text_current_bid', 'Lance atual')}</p>
                  <p className="price-value">{formatPrice(currentBid)}</p>
                </div>
                <div className="price-group">
                  <p className="price-label">{getText('text_product_price', 'Preço do produto')}</p>
                  <p className="price-old">{formatPrice(product.price)}</p>
                </div>
              </div>

              <div className="leader-section">
                <div className="leader-avatar">
                  <div className="avatar-placeholder">{currentLeader.charAt(0)}</div>
                </div>
                <div className="leader-info">
                  <p className="leader-name">{currentLeader}</p>
                  <p className="leader-label">{getText('text_current_leader', 'Líder atual')}</p>
                </div>
                <div className="bids-count">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  {auction.bids_count || 0} {getText('text_bids', 'lances')}
                </div>
              </div>

              <form onSubmit={handleBid} className="bid-form">
                <div className="bid-input-group">
                  <span className="currency">R$</span>
                  <input
                    type="number"
                    className="bid-input"
                    placeholder="0,00"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={minBid}
                    step="0.50"
                    required
                    disabled={bidding || auction.status !== 'active'}
                  />
                  <button 
                    type="submit" 
                    className="btn-bid"
                    disabled={bidding || auction.status !== 'active'}
                  >
                    {bidding ? getText('text_bidding', 'Enviando...') : getText('text_place_bid', 'Dar Lance')}
                  </button>
                </div>
                <p className="bid-info">{getText('text_min_bid', 'Lance mínimo')}: R$ {minBid.toFixed(2).replace('.', ',')} | {getText('text_increment', 'Incremento')}: R$ 0,50</p>
                
                {bidMessage.text && (
                    <div className={`alert alert-${bidMessage.type}`} style={{ marginTop: '1rem', padding: '0.8rem', fontSize: '0.9rem' }}>
                        {bidMessage.text}
                    </div>
                )}
              </form>

              <div className="action-buttons">
                <button 
                  className={`action-btn favorite ${isFavorite ? 'active' : ''}`}
                  aria-label={getText('text_favorite', 'Favoritar')}
                  onClick={handleFavorite}
                  disabled={isCheckingFavorite}
                  title={isFavorite ? getText('text_remove_favorite', 'Remover dos favoritos') : getText('text_add_favorite', 'Adicionar aos favoritos')}
                >
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill={isFavorite ? "currentColor" : "none"} 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
                <button 
                  className="action-btn share" 
                  aria-label={getText('text_share', 'Compartilhar')}
                  onClick={handleShare}
                  title={getText('text_share_product_title', 'Compartilhar produto')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3"/>
                    <circle cx="6" cy="12" r="3"/>
                    <circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                </button>
                {isAuthenticated ? (
                  <Link to="/dashboard" className="action-btn credits">
                    {getText('text_buy_credits', 'Comprar Créditos')}
                  </Link>
                ) : (
                  <Link to="/login" className="action-btn credits">
                    {getText('text_buy_credits', 'Comprar Créditos')}
                  </Link>
                )}
              </div>

              <div className="features-grid">
                <div className="feature-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <p>{getText('text_secure_purchase', 'Compra Segura')}</p>
                </div>
                <div className="feature-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M5 12l4-4m-4 4l4 4"/>
                  </svg>
                  <p>{getText('text_free_shipping', 'Entrega Grátis')}</p>
                </div>
                <div className="feature-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <p>{getText('text_warranty', '12 meses')}</p>
                </div>
              </div>

              <div className="product-description-section">
                <h3>{getText('text_description', 'Descrição')}</h3>
                <p>{product.description}</p>
              </div>

              {product.specifications && (
                <div className="product-specs-section">
                  <h3>{getText('text_specifications', 'Especificações')}</h3>
                  <div className="specs-grid">
                    {typeof product.specifications === 'object' && product.specifications !== null ? (
                      Object.entries(product.specifications).map(([key, value]) => (
                        <span key={key} className="spec-item">{key}: {value}</span>
                      ))
                    ) : (
                      <span className="spec-item">{product.specifications}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {settings?.show_bid_history === 'true' && (
            <div className="bid-history-section">
                <h3>{getText('text_bid_history', 'Histórico de Lances')}</h3>
                <div className="bid-history-list">
                <p className="no-bids">{getText('text_bid_history_soon', 'Histórico de lances será implementado em breve.')}</p>
                </div>
            </div>
          )}
          </div>
        </section>
      </main>
  );
};

export default ProductPage;
