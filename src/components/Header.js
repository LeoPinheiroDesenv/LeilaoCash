import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './header.css';

const Header = ({ onSearch, showSearch = true }) => {
  const { isAuthenticated } = useAuth();
  const { getLogoUrl, getText } = useTheme();
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
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img src={logoSrc} alt="Logo" className="logo-full" />
          </Link>
          <nav className="main-nav">
            <Link to="/" className="nav-link">{getText('text_header_home', 'Início')}</Link>
            <Link to="/?filter=featured" className="nav-link">{getText('text_header_highlights', 'Destaques')}</Link>
            <Link to="/?filter=ending" className="nav-link">{getText('text_header_ending_soon', 'Encerrando')}</Link>
            <Link to="/leiloes" className="nav-link">{getText('text_header_auctions', 'Leilões')}</Link>
            <Link to="/como-funciona" className="nav-link">{getText('text_header_how_it_works', 'Como Funciona')}</Link>
            <Link to="/contato" className="nav-link">{getText('text_header_contact', 'Fale Conosco')}</Link>
          </nav>
          

          <div className="header-actions">
            <div className="auth-buttons">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-register">Meu Painel</Link>
              ) : (
                <>
                  <Link to="/login" className="btn-login">{getText('text_header_login', 'Entrar')}</Link>
                  <Link to="/cadastro" className="btn-register">{getText('text_header_cadastro', 'Cadastrar')}</Link>
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
        <div className="mobile-menu-overlay">
          <nav className="mobile-nav">
            <Link to="/leiloes" className="nav-link" onClick={() => setIsMenuOpen(false)}>{getText('text_header_auctions', 'Leilões')}</Link>
            <Link to="/como-funciona" className="nav-link" onClick={() => setIsMenuOpen(false)}>{getText('text_header_how_it_works', 'Como Funciona')}</Link>
            <Link to="/contato" className="nav-link" onClick={() => setIsMenuOpen(false)}>{getText('text_header_contact', 'Fale Conosco')}</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
