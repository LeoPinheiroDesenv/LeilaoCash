import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();
  const location = useLocation();

  // Debug em desenvolvimento
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('ProtectedRoute:', {
        path: location.pathname,
        isAuthenticated,
        isAdmin,
        loading,
        hasUser: !!user,
        hasToken: !!localStorage.getItem('access_token')
      });
    }
  }, [isAuthenticated, isAdmin, loading, location, user]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0a1628 0%, #1a2942 100%)',
        color: '#e6eef8'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid rgba(229, 95, 82, 0.3)',
            borderTop: '3px solid #E55F52',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Carregando...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Verificar token no localStorage como fallback
  const hasToken = localStorage.getItem('access_token');
  let storedUser = null;
  
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      storedUser = JSON.parse(userStr);
    }
  } catch (e) {
    console.error('Erro ao parsear usuário do localStorage:', e);
  }
  
  // Se tem token e usuário no localStorage, mas não está autenticado no context
  // (pode acontecer em refresh), considera autenticado
  const isActuallyAuthenticated = isAuthenticated || (hasToken && storedUser);

  // Verificar se está autenticado
  if (!isActuallyAuthenticated) {
    console.warn('Usuário não autenticado, redirecionando para login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar se precisa ser admin
  if (adminOnly) {
    // Verificar is_admin de múltiplas fontes
    const userIsAdmin = 
      isAdmin || 
      (user && (user.is_admin === 1 || user.is_admin === true)) ||
      (storedUser && (storedUser.is_admin === 1 || storedUser.is_admin === true));
    
    if (!userIsAdmin) {
      console.warn('Usuário não é admin, redirecionando. isAdmin:', isAdmin, 'user.is_admin:', user?.is_admin, 'storedUser.is_admin:', storedUser?.is_admin);
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

