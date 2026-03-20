import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import './RecuperarSenha.css';

const RecuperarSenha = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { getText, getLogoUrl } = useTheme();
  const logoSrc = getLogoUrl();


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
        <Link to="/" className="logo">
                    <img src={logoSrc} alt="Logo" className="logo-full" />
                  </Link>
        <div className="auth-content">
          <h1>{t('auth.recover_password_title', 'Recuperar Senha')}</h1>
          <p>{t('auth.recover_password_subtitle', 'Insira seu email para receber o link de redefinição.')}</p>
          
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
              <label>{t('auth.email_label', 'Email')}</label>
              <div className="input-wrapper">
                
                <input
                  type="email"
                  placeholder={t('auth.email_placeholder', 'seu@email.com')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? t('auth.sending_link', 'Enviando link...') : t('auth.send_link_button', 'Enviar Link')}
            </button>
          </form>
          <p className="auth-footer">
            {t('auth.remembered_password', 'Lembrou a senha?')} <Link to="/login">{t('auth.do_login', 'Fazer login')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecuperarSenha;
