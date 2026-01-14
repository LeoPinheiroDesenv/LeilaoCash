import React, { useState } from 'react';
import './hero.css';
import CategoryChips from './CategoryChips';
import { useTheme } from '../contexts/ThemeContext';

const Hero = ({ categories, selectedCategory, onSelectCategory, onSearch }) => {
  const { getText, settings } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };
  
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="cashback-banner">
          <span className="banner-icon">⚡</span>
          {getText('text_hero_cashback_banner', 'Até 10% de Cashback em cada lance')}
        </div>
        
        <h1 className="hero-title">
          {getText('text_hero_title', 'Leilões Online com')} <span className="hero-title-highlight">{getText('text_hero_title_highlight', 'Cashback Real')}</span>
        </h1>
        
        <p className="hero-sub">
          {getText('text_hero_subtitle', 'Participe dos melhores leilões de eletrônicos e ganhe cashback em cada lance. Economize até 90% em produtos premium!')}
        </p>

        <form className="hero-search" onSubmit={handleSearchSubmit}>
          <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 14.5L19 18M17 9C17 13.4183 13.4183 17 9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input 
            type="text" 
            placeholder={getText('text_hero_search_placeholder', 'Buscar produtos em leilão...')} 
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </form>

        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-value stat-value-blue">{getText('text_hero_stat_users', '15K+')}</div>
            <div className="stat-label">{getText('text_hero_stat_users_label', 'Usuários')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-value stat-value-green">{getText('text_hero_stat_cashback', 'R$2M+')}</div>
            <div className="stat-label">{getText('text_hero_stat_cashback_label', 'Em Cashback')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-value stat-value-orange">{getText('text_hero_stat_auctions', '1.8K+')}</div>
            <div className="stat-label">{getText('text_hero_stat_auctions_label', 'Leilões')}</div>
          </div>
        </div>

        <CategoryChips 
          categories={categories} 
          selectedCategory={selectedCategory} 
          onSelectCategory={onSelectCategory} 
        />
      </div>
    </section>
  );
};

export default Hero;
