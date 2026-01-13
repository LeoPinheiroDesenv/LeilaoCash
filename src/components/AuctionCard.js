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
          <img src={product.image} alt={product.title} className="media-placeholder" />
        </Link>
        {product.isHot && <div className="badge badge-hot">Hot</div>}
        {product.discount && <div className="discount-badge">-{product.discount}%</div>}
        <div className="timer-overlay">
          <Countdown timeString={product.timer} />
        </div>
      </div>
      <div className="card-body">
        <div className="card-category">{product.type}</div>
        <h3 className="card-title">
          <Link to={product.url}>{product.title}</Link>
        </h3>
        
        <div className="price-container">
          <div className="price-main">
            <span className="price-label">Lance Atual</span>
            <span className="card-price">{product.price}</span>
          </div>
          <div className="price-details">
            <span className="price-label">Varejo</span>
            <span className="card-old">{product.oldPrice}</span>
          </div>
        </div>

        <div className="card-footer">
          <div className="bids-info">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
            <span>{product.bids} lances</span>
          </div>
          <Link to={product.url} className="btn-bid">Dar Lance</Link>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
