import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import AuctionCard from './AuctionCard';
import { useTheme } from '../contexts/ThemeContext';
import './productSection.css';

const ProductSection = ({ title, subtitle, icon, products, viewAllLink }) => {
  const { getText } = useTheme();
  const scrollContainer = useRef(null);

  const scroll = (scrollOffset) => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="product-section" id={title.toLowerCase().replace(/\s/g, '-')}>
      <div className="container">
        <div className="section-header">
          <div className="section-title-group">
            <h2>
              {icon && (
                <span className="section-icon" role="img" aria-label={title}>
                  {icon === '⭐' || icon === 'text_section_destaques_icon' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 .587l3.668 7.431L24 9.748l-6 5.848 1.417 8.264L12 19.771 4.583 23.86 6 15.596 0 9.748l8.332-1.73z"/>
                    </svg>
                  ) : icon === '🔥' || icon === 'text_section_quentes_icon' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                    </svg>
                  ) : icon === '⏰' || icon === 'text_section_encerrando_icon' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  ) : (
                    icon
                  )}
                </span>
              )}
              {title}
            </h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div className="section-header-actions">
            {viewAllLink && (
              <Link to={viewAllLink} className="btn-see-all">
                {getText('text_ver_todos', 'Ver todos')}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link>
            )}
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
