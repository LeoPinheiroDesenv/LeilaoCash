import React, { useRef } from 'react';
import AuctionCard from './AuctionCard';

function ProductSection({ title, subtitle, icon, products }) {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="product-section" id={title.toLowerCase().replace(/\s+/g, '-')}>
      <div className="container">
        <div className="section-header">
          <div className="section-title-group">
            <h2>
              {icon && <span className="section-icon">{icon}</span>}
              {title}
            </h2>
            <p>{subtitle}</p>
          </div>
          <button className="btn-see-all">
            Ver todos
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </div>
        <div className="carousel-wrapper">
          <button className="carousel-btn carousel-btn-left" onClick={scrollLeft} aria-label="Anterior">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <div className="grid carousel-grid" ref={scrollContainerRef}>
          {products.map(product => (
            <AuctionCard key={product.id} {...product} />
          ))}
          </div>
          <button className="carousel-btn carousel-btn-right" onClick={scrollRight} aria-label="Próximo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductSection;

