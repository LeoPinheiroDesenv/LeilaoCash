import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './header.css';
import logo from '../assets/images/logo-vibeget.png';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { getLogoUrl, settings } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    return user.is_admin ? '/dashboard' : '/dashboard';
  };

  const logoSrc = getLogoUrl();

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img src={logoSrc} alt={settings.site_name || "VibeGet"} className="logo-full" />
          </Link>
          <nav className="main-nav">
            <Link to="/" className="nav-link">Início</Link>
            <Link to="/?filter=featured" className="nav-link">Destaques</Link>
            <Link to="/?filter=ending" className="nav-link">Encerrando</Link>
            <Link to="/suba-de-nivel" className="nav-link">
              Suba de Nível e Ganhe Mais!
            </Link>
          </nav>
          <div className="auth-buttons">
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} className="btn-login">
                  Painel
                </Link>
                <button onClick={handleLogout} className="btn-register">
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-login">Entrar</Link>
                <Link to="/cadastro" className="btn-register">Cadastrar</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

