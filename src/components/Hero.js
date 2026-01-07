import React from 'react';
import './hero.css';
import CategoryChips from './CategoryChips';
import { useTheme } from '../contexts/ThemeContext';

const Hero = ({ categories, selectedCategory, onSelectCategory }) => {
  const { getText } = useTheme();

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="cashback-banner">{getText('text_hero_cashback_banner', 'Até 10% de Cashback em cada lance')}</div>
        
        <h1 className="hero-title">{getText('text_hero_title', 'Leilões Online com Cashback Real')}</h1>
        <p className="hero-sub">{getText('text_hero_subtitle', 'Participe dos melhores leilões de eletrônicos e ganhe cashback em cada lance. Economize até 90% em produtos premium!')}</p>

        <div className="hero-search">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input placeholder={getText('text_hero_search_placeholder', 'Buscar produtos em leilão...')} />
        </div>

        <div className="hero-stats">
          <div><strong>15K+</strong> Usuários</div>
          <div><strong>R$2M+</strong> Em Cashback</div>
          <div><strong>1.8K+</strong> Leilões</div>
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
