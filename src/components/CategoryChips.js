import React from 'react';
import './categoryChips.css';

const CategoryChips = ({ categories = [], onSelectCategory, selectedCategory }) => {
  return (
    <div className="chips-row">
      <button 
        onClick={() => onSelectCategory(null)} 
        className={`chip ${!selectedCategory ? 'active' : ''}`}
      >
        <span className="chip-emoji">✨</span>
        <span className="chip-name">Todos</span>
      </button>
      {categories.map(cat => (
        <button 
          key={cat.id} 
          onClick={() => onSelectCategory(cat.id)} 
          className={`chip ${selectedCategory === cat.id ? 'active' : ''}`}
        >
          {cat.icon && <span className="chip-emoji">{cat.icon}</span>}
          <span className="chip-name">{cat.name}</span>
          <span className="chip-count">{cat.products_count || 0}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryChips;
