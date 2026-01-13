import React, { useRef } from 'react';
import AuctionCard from './AuctionCard';
import './productSection.css';

const ProductSection = ({ title, subtitle, icon, products }) => {
  const scrollContainer = useRef(null);

  const scroll = (scrollOffset) => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  return (
    <section className="product-section" id={title.toLowerCase().replace(' ', '-')}>
      <div className="container">
        <div className="section-header">
          <div className="section-title-group">
            <h2>
              <span className="section-icon" role="img" aria-label={title}>{icon}</span>
              {title}
            </h2>
            <p>{subtitle}</p>
          </div>
          <div className="carousel-controls">
            <button className="carousel-btn" onClick={() => scroll(-300)} aria-label="Scroll Left">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <button className="carousel-btn" onClick={() => scroll(300)} aria-label="Scroll Right">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="carousel-wrapper">
          <div className="carousel-grid" ref={scrollContainer}>
            {products.map((product, index) => (
              <AuctionCard key={index} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
