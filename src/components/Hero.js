import React from 'react';
import './hero.css';
import CategoryChips from './CategoryChips';
import SearchAutocomplete from './SearchAutocomplete';
import { useTheme } from '../contexts/ThemeContext';

const Hero = ({ categories, selectedCategory, onSelectCategory, onSearch }) => {
  const { getText, settings } = useTheme();
  
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

        <div className="hero-search">
          <SearchAutocomplete
            placeholder={getText('text_hero_search_placeholder', 'Buscar produtos em leilão...')}
            onSearch={onSearch}
            minChars={3}
          />
        </div>

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
