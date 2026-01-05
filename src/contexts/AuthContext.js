import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';
import { startTokenRefresh, stopTokenRefresh } from '../utils/tokenRefresh';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar autenticação ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      const storedUser = authService.getUser();

      if (token && storedUser) {
        // Define o usuário imediatamente do localStorage
        setUser(storedUser);
        setIsAuthenticated(true);
        setLoading(false);
        
        // Inicia renovação automática do token
        startTokenRefresh(60);
        
        // Validar token com a API em background (não bloqueia)
        try {
          const result = await authService.me();
          if (result.success) {
            // Atualiza com dados frescos da API
            setUser(result.user);
            localStorage.setItem('user', JSON.stringify(result.user));
          } else {
            // Apenas loga o erro, não desloga automaticamente
            console.warn('Falha ao validar token, usando dados locais');
          }
        } catch (error) {
          // Em caso de erro de rede, mantém o usuário logado
          console.warn('Erro ao validar token:', error.message);
        }
      } else {
        // Sem token ou usuário
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
      // Inicia renovação automática do token (a cada 60 minutos)
      startTokenRefresh(60);
    }
    return result;
  };

  const register = async (userData) => {
    const result = await authService.register(userData);
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
      // Inicia renovação automática do token
      startTokenRefresh(60);
    }
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    // Para renovação do token
    stopTokenRefresh();
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Calcular isAdmin de forma mais robusta
  const isAdmin = user ? (user.is_admin === 1 || user.is_admin === true || user.is_admin === '1') : false;

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
