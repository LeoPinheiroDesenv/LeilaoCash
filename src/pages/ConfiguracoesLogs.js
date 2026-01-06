import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const ConfiguracoesLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 50,
    current_page: 1,
    last_page: 1
  });

  const fetchLogs = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/logs?page=${page}`);
      
      if (response.data.success) {
        setLogs(response.data.data);
        setPagination(response.data.meta);
      } else {
        setError('Erro ao carregar logs.');
      }
    } catch (err) {
      console.error('Erro ao buscar logs:', err);
      setError(err.response?.data?.message || 'Ocorreu um erro ao carregar os logs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleClearLogs = async () => {
    if (window.confirm('Tem certeza que deseja limpar todos os logs? Esta ação não pode ser desfeita.')) {
      try {
        setLoading(true);
        const response = await api.delete('/logs');
        if (response.data.success) {
          setLogs([]);
          setPagination({ ...pagination, total: 0, last_page: 1, current_page: 1 });
        }
      } catch (err) {
        console.error('Erro ao limpar logs:', err);
        alert('Erro ao limpar logs.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getLogLevelClass = (level) => {
    const l = level.toLowerCase();
    if (['error', 'critical', 'alert', 'emergency'].includes(l)) return 'log-error';
    if (['warning', 'notice'].includes(l)) return 'log-warning';
    if (['info', 'debug'].includes(l)) return 'log-info';
    return '';
  };

  if (loading && logs.length === 0) {
    return (
      <div className="logs-loading">
        <div className="spinner"></div>
        <p>Carregando logs...</p>
      </div>
    );
  }

  return (
    <div className="logs-container">
      <div className="logs-header">
        <div className="logs-info">
          <h3>Logs do Sistema</h3>
          <p>Exibindo {logs.length} de {pagination.total} registros</p>
        </div>
        <div className="logs-actions">
          <button className="btn-refresh" onClick={() => fetchLogs(pagination.current_page)} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6"></path>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
            Atualizar
          </button>
          <button className="btn-clear" onClick={handleClearLogs} disabled={loading || logs.length === 0}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Limpar Logs
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="logs-list">
        {logs.length === 0 ? (
          <div className="no-logs">Nenhum log encontrado.</div>
        ) : (
          logs.map((log, index) => (
            <div key={`${log.timestamp}-${index}`} className={`log-item ${getLogLevelClass(log.level)}`}>
              <div className="log-meta">
                <span className="log-timestamp">{log.timestamp}</span>
                <span className={`log-level-badge ${log.level.toLowerCase()}`}>{log.level}</span>
                <span className="log-env">{log.environment}</span>
              </div>
              <div className="log-content">
                <pre className="log-message">{log.message}</pre>
              </div>
            </div>
          ))
        )}
      </div>

      {pagination.last_page > 1 && (
        <div className="logs-pagination">
          <button 
            disabled={pagination.current_page === 1 || loading}
            onClick={() => fetchLogs(pagination.current_page - 1)}
            className="btn-page"
          >
            Anterior
          </button>
          <span className="page-info">
            Página {pagination.current_page} de {pagination.last_page}
          </span>
          <button 
            disabled={pagination.current_page === pagination.last_page || loading}
            onClick={() => fetchLogs(pagination.current_page + 1)}
            className="btn-page"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

export default ConfiguracoesLogs;
