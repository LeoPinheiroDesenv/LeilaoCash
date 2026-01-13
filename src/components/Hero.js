import React from 'react';
import './hero.css';
import CategoryChips from './CategoryChips';
import { useTheme } from '../contexts/ThemeContext';

const Hero = ({ categories, selectedCategory, onSelectCategory }) => {
  const { getText } = useTheme();

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="cashback-banner">{getText('text_hero_tag', '#LeilõesDeCentavos')}</div>
        
        <h1 className="hero-title">{getText('text_hero_title', 'Sua chance de ter os produtos mais desejados com ')}<span>{getText('text_hero_title_highlight', 'até 90% de desconto!')}</span></h1>
        <p className="hero-sub">{getText('text_hero_subtitle', 'Participe dos melhores leilões de eletrônicos e ganhe cashback em cada lance. Economize até 90% em produtos premium!')}</p>

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
