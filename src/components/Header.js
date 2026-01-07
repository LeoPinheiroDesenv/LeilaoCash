import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './header.css';

const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const { getLogoUrl, getText } = useTheme();
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
        </div>
      </div>
    </header>
  );
};

export default Header;
