import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import './Cadastro.css';

const Cadastro = () => {
  const navigate = useNavigate();
  const { getText } = useTheme();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    senha: '',
    confirmarSenha: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formatCPF = (value) => {
    const cpf = value.replace(/\D/g, '');
    if (cpf.length <= 11) {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const formatPhone = (value) => {
    const phone = value.replace(/\D/g, '');
    if (phone.length <= 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'telefone') {
      formattedValue = formatPhone(value);
    }

    setFormData({
      ...formData,
      [name]: formattedValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      // Remover formatação antes de enviar
      const cpfClean = formData.cpf.replace(/\D/g, '');
      const phoneClean = formData.telefone.replace(/\D/g, '');

      const response = await api.post('/auth/register', {
        name: formData.nome,
        email: formData.email,
        password: formData.senha,
        password_confirmation: formData.confirmarSenha,
        phone: phoneClean,
        cpf: cpfClean
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Erro no cadastro:', err);
      
      if (err.response?.data?.errors) {
        // Erros de validação do backend
        const errors = err.response.data.errors;
        const firstErrorKey = Object.keys(errors)[0];
        const firstError = Array.isArray(errors[firstErrorKey]) 
          ? errors[firstErrorKey][0] 
          : errors[firstErrorKey];
        setError(firstError || err.response?.data?.message || 'Erro ao realizar cadastro.');
      } else {
        setError(err.response?.data?.message || 'Erro ao realizar cadastro. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: '💰', text: getText('text_benefit_cashback', 'Cashback em cada lance') },
    { icon: '💸', text: getText('text_benefit_economy', 'Economize até 90%') },
    { icon: '✅', text: getText('text_benefit_guarantee', 'Produtos garantidos') },
    { icon: '🛡️', text: getText('text_benefit_support', 'Suporte 24/7') }
  ];

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/" className="auth-logo">
          <div className="auth-logo-icon">LC</div>
        </Link>
        <div className="auth-content">
          <h1>{getText('text_signup_title', 'Criar Conta')}</h1>
          <p>{getText('text_signup_subtitle', 'Junte-se a milhares de usuários')}</p>
          
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-item">
                <span className="benefit-icon">{benefit.icon}</span>
                <span className="benefit-text">{benefit.text}</span>
              </div>
            ))}
          </div>

          {error && <div className="error-message" style={{color: 'red', marginBottom: '1rem', textAlign: 'center'}}>{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label>{getText('text_fullname_label', 'Nome completo')}</label>
                <div className="input-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input
                    type="text"
                    name="nome"
                    placeholder={getText('text_fullname_placeholder', 'João Silva')}
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>{getText('text_email_label', 'Email')}</label>
                <div className="input-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    type="email"
                    name="email"
                    placeholder={getText('text_email_placeholder', 'seu@email.com')}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{getText('text_phone_label', 'Telefone')}</label>
                <div className="input-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <input
                    type="tel"
                    name="telefone"
                    placeholder="(11) 99999-9999"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>{getText('text_cpf_label', 'CPF')}</label>
                <div className="input-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <input
                    type="text"
                    name="cpf"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{getText('text_password_label', 'Senha')}</label>
                <div className="input-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="senha"
                    placeholder="••••••••"
                    value={formData.senha}
                    onChange={handleChange}
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
              <div className="form-group">
                <label>{getText('text_confirm_password_label', 'Confirmar senha')}</label>
                <div className="input-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmarSenha"
                    placeholder="••••••••"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showConfirmPassword ? (
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
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                />
                <span>{getText('text_accept_terms_prefix', 'Li e aceito os')} <Link to="/termos">{getText('text_terms_of_use', 'Termos de Uso')}</Link> {getText('text_and', 'e')} <Link to="/privacidade">{getText('text_privacy_policy', 'Política de Privacidade')}</Link></span>
              </label>
            </div>
            <button type="submit" className="btn-submit" disabled={!acceptTerms || loading}>
              {loading ? getText('text_creating_account', 'Criando conta...') : getText('text_create_account_button', 'Criar Conta')}
              {!loading && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              )}
            </button>
          </form>
          <p className="auth-footer">
            {getText('text_already_have_account', 'Já tem uma conta?')} <Link to="/login">{getText('text_login_button', 'Fazer login')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
