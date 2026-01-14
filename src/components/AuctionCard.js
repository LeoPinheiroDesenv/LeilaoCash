import React from 'react';
import { Link } from 'react-router-dom';
import Countdown from './Countdown'; // Import Countdown
import './auctionCard.css';

export default function AuctionCard({
  title, 
  price, 
  oldPrice, 
  cashbackPercent, 
  discount, 
  tag, 
  isHot, 
  timer, 
  isEnded,
  bids,
  url,
  image
}){
  return (
    <article className="card">
      <div className="card-media" aria-hidden>
        <img src={image} alt={title} className="media-placeholder" />
        
        {isEnded && <div className="badge badge-danger">Encerrado</div>}
        {discount && !isEnded && <div className="discount-badge">-{discount}%</div>}
        {cashbackPercent && (
          <div className="cashback-badge">
            {cashbackPercent}% Cashback
          </div>
        )}
      </div>
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <div className="price-row">
          <div className="card-price">{price}</div>
          {oldPrice && <div className="card-old">{oldPrice}</div>}
        </div>
        {timer && !isEnded && (
          <div className="timer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <Countdown timeString={timer} />
          </div>
        )}
        {bids && (
          <div className="bids-count">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            {bids} lances
          </div>
        )}
        <div className="card-actions">
          <Link to={url || '#'} className="btn-outline">Ver Leilão</Link>
        </div>
      </div>
    </article>
  )
}
