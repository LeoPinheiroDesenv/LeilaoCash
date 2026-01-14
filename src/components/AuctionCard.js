import React from 'react';
import { Link } from 'react-router-dom';
import Countdown from './Countdown';
import './auctionCard.css';

const StarRating = ({ rating = 4.5 }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="star-rating">
            {[...Array(fullStars)].map((_, i) => <svg key={`full-${i}`} viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>)}
            {halfStar && <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/></svg>}
            {[...Array(emptyStars)].map((_, i) => <svg key={`empty-${i}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>)}
        </div>
    );
};

const AuctionCard = ({ product }) => {
  return (
    <div className="card">
      <div className="card-media">
        <Link to={product.url}>
          <img src={product.image} alt={product.title} className="product-image" />
        </Link>
        <div className="top-badges">
          {product.isHot && <div className="badge-item hot">HOT</div>}
          {product.discount && <div className="badge-item discount">-{product.discount}%</div>}
        </div>
        <div className="bottom-overlay">
          {product.cashbackPercent && (
            <div className="badge-item cashback">
              {product.cashbackPercent} Cashback
            </div>
          )}
          <div className="timer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <Countdown timeString={product.timer} />
          </div>
        </div>
      </div>
      <div className="card-content">
        <h3 className="product-title">
          <Link to={product.url}>{product.title}</Link>
        </h3>
        <StarRating />
        <div className="price-section">
          <div className="price-group">
            <p className="price-label">Lance Atual</p>
            <p className="current-price">{product.price}</p>
          </div>
          <div className="price-group market-price-group">
            <p className="price-label">Valor de Mercado</p>
            <p className="market-price">{product.oldPrice}</p>
          </div>
        </div>
        <div className="meta-row">
          <div className="bids-count">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            {product.bids} lances
          </div>
          <Link to={product.url} className="btn-view">Dar Lance</Link>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
