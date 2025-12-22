import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Countdown from './Countdown';
import api from '../services/api';
import './productPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCheckingFavorite, setIsCheckingFavorite] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        // Usar rota pública para visualização (não requer autenticação)
        const response = await api.get(`/products/public/${id}`);
        if (response.data.success) {
          setProduct(response.data.data);
        } else {
          setError('Produto não encontrado');
        }
      } catch (err) {
        console.error('Erro ao carregar produto:', err);
        setError('Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  // Resetar índice da imagem quando o produto mudar
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product]);

  // Verificar se produto está favoritado
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
  }, [product, isAuthenticated]);

  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    return parseFloat(priceString.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
  };

  if (loading) {
    return (
      <main>
        <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <p style={{ color: '#8da4bf', fontSize: '1.1rem' }}>Carregando produto...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main>
        <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <h2 style={{ color: '#E55F52', marginBottom: '1rem' }}>Produto não encontrado</h2>
          <p style={{ color: '#8da4bf', marginBottom: '2rem' }}>{error || 'O produto que você está procurando não existe.'}</p>
          <Link to="/" style={{ color: '#4A9FD8', textDecoration: 'none' }}>Voltar para a página inicial</Link>
        </div>
      </main>
    );
  }

  // Obter dados do produto e leilão
  const auction = product.auction || {};
  const productImage = product.image_url 
    ? (product.image_url.startsWith('http') 
        ? product.image_url 
        : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8000'}${product.image_url}`)
    : 'https://via.placeholder.com/400x300?text=Sem+Imagem';
  
  const additionalImages = product.images && Array.isArray(product.images) 
    ? product.images.map(img => 
        img.startsWith('http') 
          ? img 
          : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8000'}${img}`
      )
    : [];

  // Combinar todas as imagens em um array (imagem principal + adicionais)
  const allImages = [productImage, ...additionalImages].filter(Boolean);
  
  // Garantir que o índice atual está dentro dos limites
  const currentImage = allImages[currentImageIndex] || allImages[0] || productImage;

  // Handlers para navegação do carrossel
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const currentBid = parsePrice(auction.current_bid || auction.starting_bid || product.price);
  const minBid = currentBid + 0.5;
  const currentLeader = auction.winner_id ? 'Usuário #' + auction.winner_id : 'Nenhum';
  
  const formatPrice = (price) => {
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

  const handleBid = (e) => {
    e.preventDefault();
    
    // Verificar se o usuário está autenticado
    if (!isAuthenticated) {
      // Redirecionar para login com retorno para esta página
      navigate('/login', { state: { from: `/produto/${id}` } });
      return;
    }
    
    // TODO: Implementar lógica de lance
    console.log('Lance:', bidAmount);
    // Aqui você implementaria a chamada à API para dar o lance
    // Exemplo: await api.post(`/auctions/${auction.id}/bids`, { amount: bidAmount });
  };

  const handleFavorite = async () => {
    // Verificar se o usuário está autenticado
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/produto/${id}` } });
      return;
    }

    try {
      const response = await api.post(`/favorites/${product.id}/toggle`);
      if (response.data.success) {
        setIsFavorite(response.data.data.is_favorite);
      }
    } catch (error) {
      console.error('Erro ao favoritar produto:', error);
      alert('Erro ao favoritar produto. Tente novamente.');
    }
  };

  const handleShare = async () => {
    const productUrl = window.location.href;
    const shareData = {
      title: product.name,
      text: `Confira este produto: ${product.name}`,
      url: productUrl
    };

    try {
      // Tentar usar a Web Share API se disponível
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copiar URL para clipboard
        await navigator.clipboard.writeText(productUrl);
        alert('Link copiado para a área de transferência!');
      }
    } catch (error) {
      // Se o usuário cancelar o compartilhamento, não fazer nada
      if (error.name !== 'AbortError') {
        // Fallback: copiar URL para clipboard
        try {
          await navigator.clipboard.writeText(productUrl);
          alert('Link copiado para a área de transferência!');
        } catch (clipboardError) {
          console.error('Erro ao copiar link:', clipboardError);
          alert('Erro ao compartilhar. Tente copiar o link manualmente.');
        }
      }
    }
  };

  return (
      <main>
        <section className="product-detail">
          <div className="container">
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Voltar
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
                    <span>Hot Deal</span>
                  </div>
                )}
                {auction.cashback_percentage && (
                  <div className="product-badge discount-badge">
                    {auction.cashback_percentage}% Cashback
                  </div>
                )}
                {allImages.length > 1 && (
                  <>
                    <button 
                      className="gallery-nav prev" 
                      aria-label="Imagem anterior"
                      onClick={handlePrevImage}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6"/>
                      </svg>
                    </button>
                    <button 
                      className="gallery-nav next" 
                      aria-label="Próxima imagem"
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
                      aria-label={`Imagem ${index + 1}`}
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
                    {auction.cashback_percentage}% Cashback
                  </div>
                )}
                <span className="product-status">{product.is_active ? 'Ativo' : 'Inativo'}</span>
              </div>
              <h1>{product.name}</h1>

              <div className="product-meta-info">
                <div className="meta-row">
                  <div className="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span className="meta-label">Visitas:</span>
                    <span className="meta-value">{product.visits || '1,234'}</span>
                  </div>
                  <div className="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 7h-9"></path>
                      <path d="M14 17H5"></path>
                      <circle cx="17" cy="17" r="3"></circle>
                      <circle cx="7" cy="7" r="3"></circle>
                    </svg>
                    <span className="meta-label">Categoria:</span>
                    <span className="meta-value">{product.categoryModel?.name || product.category || 'Geral'}</span>
                  </div>
                </div>
              </div>

              {(product.brand || product.model) && (
                <div className="product-info-section">
                  <h3>Informações</h3>
                  <div className="info-grid">
                    {product.brand && (
                      <div className="info-item">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <div>
                          <span className="info-label">Marca:</span>
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
                          <span className="info-label">Modelo:</span>
                          <span className="info-value">{product.model}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {auction && (
                <div className="get-section">
                  <h3>Leilão</h3>
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
                        <span className="get-label">Status:</span>
                        <span className="get-value">{auction.status === 'active' ? 'Ativo' : auction.status === 'scheduled' ? 'Agendado' : 'Encerrado'}</span>
                      </div>
                    </div>
                    <div className="get-info-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                      <div>
                        <span className="get-label">Lance Inicial:</span>
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
                    Tempo restante
                  </div>
                  <div className="timer-display">
                    <Countdown timeString={calculateTimeRemaining(auction.end_date)} displayMode="display" />
                  </div>
                </div>
              )}

              <div className="price-section">
                <div className="price-group">
                  <p className="price-label">Lance atual</p>
                  <p className="price-value">{formatPrice(currentBid)}</p>
                </div>
                <div className="price-group">
                  <p className="price-label">Preço do produto</p>
                  <p className="price-old">{formatPrice(product.price)}</p>
                </div>
              </div>

              <div className="leader-section">
                <div className="leader-avatar">
                  <div className="avatar-placeholder">{currentLeader.charAt(0)}</div>
                </div>
                <div className="leader-info">
                  <p className="leader-name">{currentLeader}</p>
                  <p className="leader-label">Líder atual</p>
                </div>
                <div className="bids-count">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  {auction.min_bids || 0} lances mínimos
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
                  />
                  <button type="submit" className="btn-bid">Dar Lance</button>
                </div>
                <p className="bid-info">Lance mínimo: R$ {minBid.toFixed(2).replace('.', ',')} | Incremento: R$ 0,50</p>
              </form>

              <div className="action-buttons">
                <button 
                  className={`action-btn favorite ${isFavorite ? 'active' : ''}`}
                  aria-label="Favoritar"
                  onClick={handleFavorite}
                  disabled={isCheckingFavorite}
                  title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
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
                  aria-label="Compartilhar"
                  onClick={handleShare}
                  title="Compartilhar produto"
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
                  <Link to="/dashboard-usuario" className="action-btn credits">
                    Comprar Créditos
                  </Link>
                ) : (
                  <Link to="/login" className="action-btn credits">
                    Comprar Créditos
                  </Link>
                )}
              </div>

              <div className="features-grid">
                <div className="feature-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <p>Compra Segura</p>
                </div>
                <div className="feature-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M5 12l4-4m-4 4l4 4"/>
                  </svg>
                  <p>Entrega Grátis</p>
                </div>
                <div className="feature-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <p>12 meses</p>
                </div>
              </div>

              <div className="product-description-section">
                <h3>Descrição</h3>
                <p>{product.description}</p>
              </div>

              {product.specifications && (
                <div className="product-specs-section">
                  <h3>Especificações</h3>
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

          <div className="bid-history-section">
            <h3>Histórico de Lances</h3>
            <div className="bid-history-list">
              <p className="no-bids">Histórico de lances será implementado em breve.</p>
            </div>
          </div>
          </div>
        </section>
      </main>
  );
};

export default ProductPage;
