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
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .substring(0, 14);
  };

  const formatPhone = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 15);
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
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>{getText('text_confirm_password_label', 'Confirmar senha')}</label>
                <div className="input-wrapper">
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
