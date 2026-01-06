import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import '../pages/DashboardUsuario.css';
import logo from '../assets/images/logo-vibeget.png';

const UserLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getLogoUrl, settings } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const logoSrc = getLogoUrl();
  
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/dashboard/minha-conta', label: 'Minha Conta', icon: 'account' },
    { path: '/dashboard/meus-lances', label: 'Meus Lances', icon: 'bids' },
    { path: '/dashboard/meu-cashback', label: 'Meu Cashback', icon: 'cashback' }
  ];

  const getIcon = (iconName) => {
    const icons = {
      dashboard: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="9" x="3" y="3" rx="1"></rect>
          <rect width="7" height="5" x="14" y="3" rx="1"></rect>
          <rect width="7" height="9" x="14" y="12" rx="1"></rect>
          <rect width="7" height="5" x="3" y="16" rx="1"></rect>
        </svg>
      ),
      account: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      bids: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8"></path>
          <path d="m16 16 6-6"></path>
          <path d="m8 8 6-6"></path>
          <path d="m9 7 8 8"></path>
          <path d="m21 11-8-8"></path>
        </svg>
      ),
      cashback: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
          <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
        </svg>
      )
    };
    return icons[iconName] || icons.dashboard;
  };

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <Link to="/" className="header-logo">
            <img src={logoSrc} alt={settings.site_name || "VibeGet"} style={{height: '45px', width: 'auto', objectFit: 'contain'}} />
          </Link>
          <div className="header-actions">
            <div className="cashback-display">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
              </svg>
              <span>R$ {user?.cashback_balance || '0.00'}</span>
            </div>
            <button className="user-menu">
              <div className="user-avatar-small">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span>{user?.name?.split(' ')[0] || 'Usuário'}</span>
            </button>
            <button className="btn-logout" onClick={handleLogout} title="Sair">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>
      <div className="dashboard-layout">
        <aside className="user-sidebar">
          <nav className="sidebar-nav">
            {menuItems.map(item => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                {getIcon(item.icon)}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>
        <main className="user-main">
          <div className="dashboard-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
