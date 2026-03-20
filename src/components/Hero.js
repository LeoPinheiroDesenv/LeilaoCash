import React from 'react';
import './hero.css';
import CategoryChips from './CategoryChips';
import SearchAutocomplete from './SearchAutocomplete';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const Hero = ({ categories, selectedCategory, onSelectCategory, onSearch }) => {
  const { getText, settings } = useTheme();
  const { t } = useTranslation();
  
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="cashback-banner">
          <span className="banner-icon">⚡</span>
          {t('hero.cashback_banner')}
        </div>
        
        <h1 className="hero-title">
          {t('hero.title')} <span className="hero-title-highlight">{t('hero.title_highlight')}</span>
        </h1>
        
        <p className="hero-sub">
          {t('hero.subtitle')}
        </p>

        <div className="hero-search">
          <SearchAutocomplete
            placeholder={t('hero.search_placeholder')}
            onSearch={onSearch}
            minChars={3}
          />
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-value stat-value-blue">{getText('text_hero_stat_users', '15K+')}</div>
            <div className="stat-label">{t('hero.stat_users')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-value stat-value-green">{getText('text_hero_stat_cashback', 'R$2M+')}</div>
            <div className="stat-label">{t('hero.stat_cashback')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-value stat-value-orange">{getText('text_hero_stat_auctions', '1.8K+')}</div>
            <div className="stat-label">{t('hero.stat_auctions')}</div>
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
