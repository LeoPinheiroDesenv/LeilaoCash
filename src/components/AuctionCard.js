import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import './auctionCard.css';

const AuctionCard = ({ product }) => {
  const { getText } = useTheme();

  const [hours = '00', minutes = '00', seconds = '00'] = String(product.timer || '00:00:00').split(':');

  return (
    <div className="card">
      <div className="card-media">
        <Link to={product.url}>
          <img
            src={product.image}
            alt={product.title}
            className="product-image"
            onError={(e) => { e.target.onerror = null; e.target.src = (process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8000') + '/uploads/padrao.jpg'; }}
          />
        </Link>
        <div className="top-badges">
          <div className="top-badges-left">
            {product.isHot && <div className="badge-item hot">Hot</div>}
            {product.discount && <div className="badge-item discount">-{product.discount}%</div>}
          </div>
          <div className="top-badges-right">
            {product.cashbackPercent && (
              <div className="badge-item cashback">
                {product.cashbackPercent} Cashback
              </div>
            )}
          </div>
        </div>
        <div className="bottom-overlay">
          <div className="timer-pills" aria-label={getText('text_time_remaining', 'Tempo restante')}>
            <span className="timer-pill">{hours}</span>
            <span className="timer-sep">:</span>
            <span className="timer-pill">{minutes}</span>
            <span className="timer-sep">:</span>
            <span className="timer-pill">{seconds}</span>
          </div>
        </div>
      </div>
      <div className="card-content">
        <h3 className="product-title">
          <Link to={product.url}>{product.title}</Link>
        </h3>
        <div className="price-row">
          <span className="current-price">{product.price}</span>
          <span className="market-price">{product.oldPrice}</span>
        </div>
        <div className="meta-row">
          <div className="bids-count">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            {product.bids} {getText('text_bids', 'lances')}
          </div>
          <Link to={product.url} className="btn-view">{getText('text_ver_leilao', 'Ver Leilão')}</Link>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
