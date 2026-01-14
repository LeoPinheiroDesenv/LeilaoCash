import React from 'react';
import './productSection.css';
import AuctionCard from './AuctionCard';

function ProductSection({ title, subtitle, icon, products }) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="product-section" id={title.toLowerCase().replace(/\s+/g, '-')}>
      <div className="container">
        <div className="section-header">
          <div className="section-title-group">
            <h2 className={!icon ? 'no-icon' : ''}>
              {icon && <span className="section-icon">{icon}</span>}
              {title}
            </h2>
            <p>{subtitle}</p>
          </div>
        </div>
        <div className="grid">
          {products.map(product => (
            <AuctionCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductSection;

