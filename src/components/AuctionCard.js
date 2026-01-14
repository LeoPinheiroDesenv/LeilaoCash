import React from 'react';
import { Link } from 'react-router-dom';
import Countdown from './Countdown';
import { useTheme } from '../contexts/ThemeContext';
import './auctionCard.css';

const AuctionCard = ({ product }) => {
  const { getText } = useTheme();
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
          <div className="timer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v6l4 2" />
            </svg>
            <Countdown timeString={product.timer} />
          </div>
        </div>
      </div>
      <div className="card-content">
        <h3 className="product-title">
          <Link to={product.url}>{product.title}</Link>
        </h3>
        <div className="price-section">
          <div className="price-group">
            <p className="current-price">{product.price}</p>
            <p className="market-price">{product.oldPrice}</p>
          </div>
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
