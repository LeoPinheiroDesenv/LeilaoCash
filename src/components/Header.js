import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './header.css';

const Header = () => {
  const { isAuthenticated } = useAuth();
  const { getLogoUrl, getText } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const logoSrc = getLogoUrl();

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img src={logoSrc} alt="Logo" className="logo-full" />
          </Link>
          <nav className="main-nav">
            <Link to="/leiloes" className="nav-link">{getText('text_header_leiloes', 'Leilões')}</Link>
            <Link to="/como-funciona" className="nav-link">{getText('text_header_como_funciona', 'Como Funciona')}</Link>
            <Link to="/suba-de-nivel" className="nav-link">{getText('text_header_suba_de_nivel', 'Suba de Nível')}</Link>
          </nav>
          <div className="header-actions">
            <div className="auth-buttons">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-register">Meu Painel</Link>
              ) : (
                <>
                  <Link to="/login" className="btn-login">{getText('text_header_login', 'Entrar')}</Link>
                  <Link to="/cadastro" className="btn-register">{getText('text_header_cadastro', 'Cadastre-se Grátis')}</Link>
                </>
              )}
            </div>
            <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isMenuOpen ? (
                  <line x1="18" y1="6" x2="6" y2="18" />
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
            <Link to="/leiloes" className="nav-link" onClick={() => setIsMenuOpen(false)}>{getText('text_header_leiloes', 'Leilões')}</Link>
            <Link to="/como-funciona" className="nav-link" onClick={() => setIsMenuOpen(false)}>{getText('text_header_como_funciona', 'Como Funciona')}</Link>
            <Link to="/suba-de-nivel" className="nav-link" onClick={() => setIsMenuOpen(false)}>{getText('text_header_suba_de_nivel', 'Suba de Nível')}</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
