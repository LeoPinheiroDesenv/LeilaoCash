import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated, user } = useAuth();
  const { getText,getLogoUrl } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/dashboard';

 const logoSrc = getLogoUrl();


  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (!result.success) {
        setError(result.message || 'Credenciais inválidas');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
      console.error('Erro no login:', err);
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
          <h1>{getText('text_login_title', 'Bem-vindo de volta')}</h1>
          <p>{getText('text_login_subtitle', 'Entre na sua conta para continuar')}</p>
          
          {error && (
            <div className="alert alert-error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>{getText('text_email_label', 'Email')}</label>
              <div className="input-wrapper">

                <input
                  type="email"
                  placeholder={getText('text_email_placeholder', 'seu@email.com')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="label-row">
                <label>{getText('text_password_label', 'Senha')}</label>
                <Link to="/recuperar-senha" className="forgot-link">{getText('text_forgot_password_link', 'Esqueceu a senha?')}</Link>
              </div>
              <div className="input-wrapper">

                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? getText('text_logging_in', 'Entrando...') : getText('text_login_button', 'Entrar')}
              {!loading && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              )}
            </button>
            
          </form>
          <p className="auth-footer">
            {getText('text_no_account', 'Não tem uma conta?')} <Link to="/cadastro">{getText('text_signup_free', 'Cadastre-se grátis')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
