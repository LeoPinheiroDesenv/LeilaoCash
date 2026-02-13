import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import './header.css';

const Header = ({ onSearch, showSearch = true }) => {
  const { isAuthenticated } = useAuth();
  const { getLogoUrl, getText } = useTheme();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const logoSrc = getLogoUrl();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleLogoClick = () => {
    if (onSearch) {
      onSearch('');
    }
    setSearchTerm(''); // Limpa o estado local do input também
    setIsMenuOpen(false);
  };

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo" onClick={handleLogoClick}>
            <img src={logoSrc} alt="Logo" className="logo-full" />
          </Link>
          <nav className="main-nav">
            <Link to="/" className="nav-link">{t('header.home')}</Link>
            <Link to="/?filter=featured" className="nav-link">{t('header.highlights')}</Link>
            <Link to="/?filter=ending" className="nav-link">{t('header.ending_soon')}</Link>
            <Link to="/leiloes" className="nav-link">{t('header.auctions')}</Link>
            <Link to="/como-funciona" className="nav-link">{t('header.how_it_works')}</Link>
            <Link to="/suba-de-nivel" className="nav-link">{t('header.upgrade_level')}</Link>
            <Link to="/contato" className="nav-link">{t('header.contact')}</Link>
          </nav>
          

          <div className="header-actions">
            <LanguageSelector />
            <div className="auth-buttons">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard/meus-favoritos" className="btn-favorites" title={t('header.my_favorites')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </Link>
                  <Link to="/dashboard" className="btn-register">{t('header.my_dashboard')}</Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-login">{t('header.login')}</Link>
                  <Link to="/cadastro" className="btn-register">{t('header.register')}</Link>
                </>
              )}
            </div>
            <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="mobile-menu-overlay" role="dialog" aria-modal="true" onKeyDown={(e) => { if (e.key === 'Escape') setIsMenuOpen(false); }} tabIndex={-1}>
          <div className="mobile-overlay-top">
            <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
              <img src={logoSrc} alt="Logo" className="logo-full" />
            </Link>
            <button className="menu-close" onClick={() => setIsMenuOpen(false)} aria-label="Fechar menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="mobile-nav">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('header.home')}</Link>
            <Link to="/?filter=featured" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('header.highlights')}</Link>
            <Link to="/?filter=ending" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('header.ending_soon')}</Link>
            <Link to="/leiloes" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('header.auctions')}</Link>
            <Link to="/como-funciona" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('header.how_it_works')}</Link>
            <Link to="/suba-de-nivel" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('header.upgrade_level')}</Link>
            <Link to="/contato" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('header.contact')}</Link>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <LanguageSelector />
            </div>

            <div className="mobile-auth">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard/meus-favoritos" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('header.my_favorites')}</Link>
                  <Link to="/dashboard" className="nav-link nav-cta" onClick={() => setIsMenuOpen(false)}>{t('header.my_dashboard')}</Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('header.login')}</Link>
                  <Link to="/cadastro" className="nav-link nav-cta" onClick={() => setIsMenuOpen(false)}>{t('header.register')}</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
