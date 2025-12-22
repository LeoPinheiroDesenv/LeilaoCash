/**
 * Gerenciador de renovação de token
 * Atualiza o token periodicamente para evitar expiração
 */

import { authService } from '../services/api';

let refreshInterval = null;

/**
 * Inicia renovação automática do token
 * @param {number} intervalMinutes - Intervalo em minutos para renovar
 */
export const startTokenRefresh = (intervalMinutes = 60) => {
  // Limpa intervalo anterior se existir
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }

  // Configura novo intervalo
  refreshInterval = setInterval(async () => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      try {
        console.log('[TokenRefresh] Renovando token...');
        const result = await authService.me();
        
        if (result.success) {
          console.log('[TokenRefresh] Token validado com sucesso');
          // Token ainda válido, dados do usuário atualizados
          localStorage.setItem('user', JSON.stringify(result.user));
        } else {
          console.warn('[TokenRefresh] Token inválido, parar renovação');
          stopTokenRefresh();
        }
      } catch (error) {
        console.error('[TokenRefresh] Erro ao renovar token:', error.message);
      }
    } else {
      // Sem token, para renovação
      console.log('[TokenRefresh] Sem token, parando renovação');
      stopTokenRefresh();
    }
  }, intervalMinutes * 60 * 1000); // Converte minutos para milissegundos

  console.log(`[TokenRefresh] Iniciado (intervalo: ${intervalMinutes} minutos)`);
};

/**
 * Para a renovação automática do token
 */
export const stopTokenRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
    console.log('[TokenRefresh] Parado');
  }
};

/**
 * Verifica se a renovação está ativa
 */
export const isRefreshActive = () => {
  return refreshInterval !== null;
};

