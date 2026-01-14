import React from 'react';
import './hero.css';
import CategoryChips from './CategoryChips';
import { useTheme } from '../contexts/ThemeContext';

const Hero = ({ categories, selectedCategory, onSelectCategory, searchTerm, onSearch }) => {
  const { getText } = useTheme();

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="cashback-banner">
          <span className="banner-icon">⚡</span>
          {getText('text_hero_tag', 'Até 10% de Cashback em cada lance')}
        </div>
        
        <h1 className="hero-title">
          {getText('text_hero_title_1', 'Leilões Online com')}
          <div className="hero-title-highlight">
            <span>{getText('text_hero_title_highlight', 'Cashback Real')}</span>
          </div>
        </h1>
        
        <p className="hero-sub">
          {getText('text_hero_subtitle', 'Participe dos melhores leilões de eletrônicos e ganhe cashback em cada lance. Economize até 90% em produtos premium!')}
        </p>

        <div className="hero-search">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input 
            type="text"
            placeholder={getText('text_hero_search_placeholder', 'Buscar produtos em leilão...')} 
            value={searchTerm || ''}
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <strong>15K+</strong>
            <span>Usuários</span>
          </div>
          <div className="stat-item">
            <strong>R$2M+</strong>
            <span>Em Cashback</span>
          </div>
          <div className="stat-item">
            <strong>1.8K+</strong>
            <span>Leilões</span>
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
