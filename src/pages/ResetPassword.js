import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import './Login.css'; // Reutilizando o CSS da página de Login

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getText } = useTheme();

  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');
    if (!tokenParam || !emailParam) {
      setError('Link de redefinição inválido ou incompleto.');
    }
    setToken(tokenParam);
    setEmail(emailParam);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (password !== passwordConfirmation) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/reset-password', {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      if (response.data.success) {
        setMessage('Senha redefinida com sucesso! Redirecionando para o login...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.data.message || 'Erro ao redefinir a senha.');
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
          <h1>{getText('text_reset_password_title', 'Redefinir Senha')}</h1>
          <p>{getText('text_reset_password_subtitle', 'Crie uma nova senha para sua conta.')}</p>
          
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>{getText('text_email_label', 'Email')}</label>
              <input
                type="email"
                value={email}
                readOnly
                className="form-input"
                style={{ paddingLeft: '1rem' }}
              />
            </div>
            <div className="form-group">
              <label>{getText('text_new_password_label', 'Nova Senha')}</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                style={{ paddingLeft: '1rem' }}
              />
            </div>
            <div className="form-group">
              <label>{getText('text_confirm_new_password_label', 'Confirmar Nova Senha')}</label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                className="form-input"
                style={{ paddingLeft: '1rem' }}
              />
            </div>
            <button type="submit" className="btn-submit" disabled={loading || !token}>
              {loading ? getText('text_redefining_password', 'Redefinindo...') : getText('text_redefine_password_button', 'Redefinir Senha')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
