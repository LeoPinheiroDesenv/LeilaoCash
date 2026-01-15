import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import './auctionCard.css';

const AuctionCard = ({ product }) => {
  const { getText } = useTheme();
  const [displayTimer, setDisplayTimer] = useState(product.timer || '00:00:00');

  useEffect(() => {
    // Se houver remainingSeconds, calcular e atualizar o timer a cada segundo
    if (product.remainingSeconds !== undefined && product.remainingSeconds > 0) {
      const timer = setInterval(() => {
        setDisplayTimer(prevTimer => {
          const parts = String(prevTimer).split(':');
          let seconds = parseInt(parts[2] || '0', 10);
          let minutes = parseInt(parts[1] || '0', 10);
          let hours = parseInt(parts[0] || '0', 10);

          seconds--;

          if (seconds < 0) {
            seconds = 59;
            minutes--;
          }

          if (minutes < 0) {
            minutes = 59;
            hours--;
          }

          if (hours < 0) {
            hours = 0;
            minutes = 0;
            seconds = 0;
          }

          return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [product.remainingSeconds]);

  const parts = String(displayTimer).split(':');
  const hours = parts[0] || '00';
  const minutes = parts[1] || '00';
  const seconds = parts[2] || '00';

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
          </div>
          <div className="top-badges-right">
            {product.cashbackPercent && (
              <div className="badge-item cashback">
                ✔ {product.cashbackPercent}% Cashback
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
