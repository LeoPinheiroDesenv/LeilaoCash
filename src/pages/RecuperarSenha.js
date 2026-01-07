import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import './RecuperarSenha.css';

const RecuperarSenha = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { getText } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/auth/forgot-password', { email });
      if (response.data.success) {
        setMessage(response.data.message);
      } else {
        setError(response.data.message || 'Erro ao solicitar redefinição de senha.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/" className="auth-logo">
          <div className="auth-logo-icon">LC</div>
        </Link>
        <div className="auth-content">
          <h1>{getText('text_recover_password_title', 'Recuperar Senha')}</h1>
          <p>{getText('text_recover_password_subtitle', 'Insira seu email para receber o link de redefinição.')}</p>
          
          {message && (
            <div className="alert alert-success">
              {message}
            </div>
          )}
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>{getText('text_email_label', 'Email')}</label>
              <div className="input-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email"
                  placeholder={getText('text_email_placeholder', 'seu@email.com')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? getText('text_sending_link', 'Enviando link...') : getText('text_send_link_button', 'Enviar Link')}
            </button>
          </form>
          <p className="auth-footer">
            {getText('text_remembered_password', 'Lembrou a senha?')} <Link to="/login">{getText('text_login_button', 'Fazer login')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecuperarSenha;
