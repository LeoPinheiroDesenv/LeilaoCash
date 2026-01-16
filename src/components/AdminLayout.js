import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import '../pages/DashboardAdmin.css';

const AdminLayout = ({ children, pageTitle, pageSubtitle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getLogoUrl, settings } = useTheme();
  const [expandedMenu, setExpandedMenu] = useState({});

  // Expandir automaticamente o menu de Configurações se estiver em uma página de configurações
  useEffect(() => {
    if (location.pathname.includes('/configuracoes')) {
      setExpandedMenu(prev => ({ ...prev, 'Configurações': true }));
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const logoSrc = getLogoUrl();
  
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/dashboard/usuarios', label: 'Usuários', icon: 'users' },
    { path: '/dashboard/categorias', label: 'Categorias', icon: 'categories' },
    { path: '/dashboard/marcas', label: 'Marcas', icon: 'categories' },
    { path: '/dashboard/modelos', label: 'Modelos', icon: 'categories' },
    { path: '/dashboard/produtos', label: 'Produtos', icon: 'products' },
    { path: '/dashboard/leiloes', label: 'Leilões', icon: 'auctions' },
    { path: '/dashboard/lances', label: 'Lances', icon: 'bids' },
    { path: '/dashboard/cashback', label: 'Cashback', icon: 'cashback' },
    { path: '/dashboard/transacoes', label: 'Transações', icon: 'transactions' },
    { path: '/dashboard/relatorios', label: 'Relatórios', icon: 'reports' },
    { path: '/dashboard/contatos', label: 'Mensagens', icon: 'messages' },
    { 
      label: 'Configurações', 
      icon: 'settings',
      subItems: [
        { path: '/dashboard/configuracoes/layout', label: 'Layout' },
        { path: '/dashboard/configuracoes/textos', label: 'Textos' },
        { path: '/dashboard/configuracoes/sistema', label: 'Sistema' }
      ]
    }
  ];

  const toggleSubMenu = (label) => {
    setExpandedMenu(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

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
      users: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      products: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="5" rx="2"></rect>
          <path d="M2 10h20"></path>
        </svg>
      ),
      auctions: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
          <path d="M3 6h18"></path>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
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
      ),
      transactions: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="2" x2="12" y2="22"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
      reports: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18"></path>
          <path d="m19 9-5 5-4-4-3 3"></path>
        </svg>
      ),
      messages: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
      settings: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ),
      categories: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      )
    };
    return icons[iconName] || icons.dashboard;
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <img src={logoSrc} alt={settings.site_name || "VibeGet"} style={{height: '45px', width: 'auto', objectFit: 'contain'}} />
          </Link>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <div key={item.label}>
              {item.subItems ? (
                <>
                  <div 
                    className={`nav-item ${expandedMenu[item.label] ? 'expanded' : ''}`}
                    onClick={() => toggleSubMenu(item.label)}
                    style={{ cursor: 'pointer', justifyContent: 'space-between' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {getIcon(item.icon)}
                      <span>{item.label}</span>
                    </div>
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      style={{ transform: expandedMenu[item.label] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                  {expandedMenu[item.label] && (
                    <div className="sub-menu">
                      {item.subItems.map(subItem => (
                        <Link 
                          key={subItem.path} 
                          to={subItem.path} 
                          className={`nav-item sub-item ${location.pathname === subItem.path ? 'active' : ''}`}
                        >
                          <span>{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link 
                  to={item.path} 
                  className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {getIcon(item.icon)}
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.name || 'Administrador'}</p>
              <p className="user-role">Administrador</p>
            </div>
          </div>
          <div className="sidebar-actions">
            <Link to="/" className="btn-ver-site">Ver Site</Link>
            <button className="btn-logout" onClick={handleLogout} title="Sair">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </aside>
      <main className="admin-main">
        <div className="dashboard-content">
          {pageSubtitle ? (
            <div className="content-header">
              <div>
                <h1 className="page-title">{pageTitle || 'Dashboard'}</h1>
                <p className="page-subtitle">{pageSubtitle}</p>
              </div>
            </div>
          ) : (
            <header className="page-header">
              <h1>{pageTitle || 'Dashboard'}</h1>
            </header>
          )}
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
