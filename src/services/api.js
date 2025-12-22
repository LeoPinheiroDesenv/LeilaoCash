import axios from 'axios';

// Buscar URL da API do arquivo .env
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Log da URL da API em produção para debug
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
  console.log('[API] Configuração da API:', {
    apiUrl: API_URL,
    currentHost: window.location.hostname,
    currentOrigin: window.location.origin,
    isProduction: true
  });
}

// Criar instância do axios com configurações padrão
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Garantir que credenciais são enviadas em produção
  withCredentials: false, // Sanctum usa Bearer token, não cookies
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Garantir que o token está sendo enviado corretamente
      config.headers.Authorization = `Bearer ${token}`;
      
      // Log detalhado em produção para debug
      if (config.url?.includes('/settings') || config.url?.includes('/auth/me')) {
        const fullUrl = `${config.baseURL}${config.url}`;
        console.log('[API Interceptor] Enviando requisição:', {
          hasToken: !!token,
          tokenLength: token?.length,
          tokenPrefix: token ? token.substring(0, 20) + '...' : 'N/A',
          url: config.url,
          fullUrl: fullUrl,
          method: config.method,
          headers: {
            'Authorization': token ? `Bearer ${token.substring(0, 20)}...` : 'N/A',
            'Content-Type': config.headers['Content-Type']
          }
        });
      }
    }
    
    // Se for FormData, remover Content-Type para o navegador definir automaticamente
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      // Se não for FormData e não tiver Content-Type, definir como JSON
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }
    }
    
    if (!token) {
      console.warn('[API Interceptor] Requisição sem token:', {
        url: config.url,
        method: config.method
      });
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Só redireciona para login se for 401 E não for uma rota de validação ou pública
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      const isAuthMeRequest = url.includes('/auth/me');
      const isLoginRequest = url.includes('/auth/login');
      const isRegisterRequest = url.includes('/auth/register');
      const isPublicRoute = url.includes('/public') || url.includes('/categories') || url.includes('/health');
      
      // Não fazer logout em requisições de validação, autenticação ou rotas públicas
      if (isAuthMeRequest || isLoginRequest || isRegisterRequest || isPublicRoute) {
        // Apenas loga o erro, não faz logout
        if (isAuthMeRequest) {
          console.warn('Falha ao validar token com /auth/me');
        }
        return Promise.reject(error);
      }
      
      // Para outras requisições 401, verificar se é erro de rede ou token realmente inválido
      // Se não há resposta (erro de rede), não fazer logout
      if (!error.response) {
        console.warn('Erro de rede ao fazer requisição:', error.message);
        return Promise.reject(error);
      }
      
      // Token inválido ou expirado em requisição real
      // Mas só fazer logout se não estiver em uma rota protegida que pode ter erro temporário
      const currentPath = window.location.pathname;
      const isProtectedRoute = currentPath.includes('/dashboard-admin') || currentPath.includes('/dashboard-usuario');
      
      // Log detalhado para debug em produção
      const token = localStorage.getItem('access_token');
      console.warn('[API Interceptor] Erro 401 detectado:', {
        url: error.config?.url,
        method: error.config?.method,
        currentPath: currentPath,
        isProtectedRoute: isProtectedRoute,
        hasToken: !!token,
        tokenLength: token?.length,
        responseData: error.response?.data
      });
      
      if (isProtectedRoute) {
        // Em rotas protegidas, tentar validar o token antes de fazer logout
        if (token) {
          // Verificar se o token ainda existe antes de remover
          console.warn('[API Interceptor] Erro 401 em rota protegida, mas token ainda existe. Pode ser erro temporário. Deixando componente tratar.');
          // Não fazer logout imediato, deixar o componente tratar
          return Promise.reject(error);
        }
      }
      
      // Se chegou aqui, token realmente inválido ou ausente
      console.warn('Token inválido ou expirado, redirecionando para login');
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      
      // Só redireciona se não estiver já na página de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const { access_token, user } = response.data.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user, token: access_token };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao fazer login',
      };
    }
  },

  // Registro
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success) {
        const { access_token, user } = response.data.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user, token: access_token };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao fazer registro',
        errors: error.response?.data?.errors,
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  },

  // Obter usuário autenticado
  me: async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        const user = response.data.data;
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  },

  // Verificar se está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  // Obter usuário do localStorage
  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Atualizar perfil
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      if (response.data.success) {
        const user = response.data.data;
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao atualizar perfil',
        errors: error.response?.data?.errors,
      };
    }
  },

  // Alterar senha
  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    try {
      const response = await api.put('/auth/change-password', {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      return { success: response.data.success, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao alterar senha',
        errors: error.response?.data?.errors,
      };
    }
  },

  // Obter saldo
  getBalance: async () => {
    try {
      const response = await api.get('/user/balance');
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  },
};

export default api;

