import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import './Cadastro.css';

const Cadastro = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getText, getLogoUrl } = useTheme();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    data_nascimento: '',
    guardian_name: '',
    guardian_cpf: '',
    referral_code: '',
    senha: '',
    confirmarSenha: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinor, setIsMinor] = useState(false);
  const [isTooYoung, setIsTooYoung] = useState(false);
  const logoSrc = getLogoUrl();

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatCPF = (value) => {
    // Remove tudo que não é dígito e limita a 11 caracteres
    const cleaned = value.replace(/\D/g, '').slice(0, 11);
    // Aplica a máscara 000.000.000-00
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value) => {
    // Remove tudo que não é dígito e limita a 11 caracteres
    const cleaned = value.replace(/\D/g, '').slice(0, 11);
    // Aplica a máscara (00) 00000 0000
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2 $3');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpf' || name === 'guardian_cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'telefone') {
      formattedValue = formatPhone(value);
    }

    setFormData({
      ...formData,
      [name]: formattedValue
    });

    // Verificar idade ao mudar data de nascimento
    if (name === 'data_nascimento') {
      const age = calculateAge(value);
      if (age !== null) {
        setIsMinor(age >= 16 && age < 18);
        setIsTooYoung(age < 16);
      } else {
        setIsMinor(false);
        setIsTooYoung(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    if (isTooYoung) {
      setError('Menores de 16 anos não podem se cadastrar.');
      return;
    }

    if (isMinor && (!formData.guardian_name || !formData.guardian_cpf)) {
      setError('Para menores entre 16 e 17 anos, informe o responsável.');
      return;
    }

    setLoading(true);

    try {
      // Remover formatação antes de enviar
      const cpfClean = formData.cpf.replace(/\D/g, '');
      const phoneClean = formData.telefone.replace(/\D/g, '');
      const guardianCpfClean = formData.guardian_cpf ? formData.guardian_cpf.replace(/\D/g, '') : '';

      const payload = {
        name: formData.nome,
        email: formData.email,
        password: formData.senha,
        password_confirmation: formData.confirmarSenha,
        phone: phoneClean,
        cpf: cpfClean,
        birth_date: formData.data_nascimento || null,
        referral_code: formData.referral_code ? formData.referral_code.toUpperCase().trim() : null
      };

      if (isMinor && formData.guardian_name) {
        payload.guardian_name = formData.guardian_name;
        payload.guardian_cpf = guardianCpfClean;
      }

      const response = await api.post('/auth/register', payload);

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
    { icon: '💰', text: t('auth.benefit_cashback', 'Cashback em cada lance') },
    { icon: '💸', text: t('auth.benefit_economy', 'Economize até 90%') },
    { icon: '✅', text: t('auth.benefit_guarantee', 'Produtos garantidos') },
    { icon: '🛡️', text: t('auth.benefit_support', 'Suporte 24/7') }
  ];

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/" className="logo">
                    <img src={logoSrc} alt="Logo" className="logo-full" />
                  </Link>
        <div className="auth-content">
          <h1>{t('auth.signup_title', 'Criar Conta')}</h1>
          <p>{t('auth.signup_subtitle', 'Junte-se a milhares de usuários')}</p>
          
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
                <label>{t('auth.fullname_label', 'Nome completo')}</label>
                <div className="input-wrapper">
                  
                  <input
                    type="text"
                    name="nome"
                    placeholder={t('auth.fullname_placeholder', 'João Silva')}
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>{t('auth.email_label', 'Email')}</label>
                <div className="input-wrapper">
                  
                  <input
                    type="email"
                    name="email"
                    placeholder={t('auth.email_placeholder', 'seu@email.com')}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('auth.phone_label', 'Telefone')}</label>
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
                <label>{t('auth.cpf_label', 'CPF')}</label>
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
                <label>Data de Nascimento</label>
                <div className="input-wrapper">
                  <input
                    type="date"
                    name="data_nascimento"
                    value={formData.data_nascimento}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {isTooYoung && (
              <div className="error-message" style={{color: '#E55F52', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(229,95,82,0.1)', borderRadius: '8px', textAlign: 'center'}}>
                Menores de 16 anos não podem se cadastrar na plataforma.
              </div>
            )}

            {isMinor && !isTooYoung && (
              <div style={{marginBottom: '1rem', padding: '0.75rem', background: 'rgba(74,159,216,0.1)', border: '1px solid rgba(74,159,216,0.3)', borderRadius: '8px'}}>
                <p style={{color: '#4A9FD8', fontSize: '0.9rem', marginBottom: '0.75rem'}}>
                  Para menores entre 16 e 17 anos é necessário informar um responsável (pai, mãe ou tutor).
                </p>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nome do Responsável *</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        name="guardian_name"
                        placeholder="Nome completo do responsável"
                        value={formData.guardian_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>CPF do Responsável *</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        name="guardian_cpf"
                        placeholder="000.000.000-00"
                        value={formData.guardian_cpf}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Código de indicação (opcional)</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="referral_code"
                    placeholder="Ex: AB12CD34"
                    value={formData.referral_code}
                    onChange={handleChange}
                    style={{textTransform: 'uppercase'}}
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('auth.password_label', 'Senha')}</label>
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
                <label>{t('auth.confirm_password_label', 'Confirmar senha')}</label>
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
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                />
                <span>{t('auth.accept_terms_prefix', 'Li e aceito os')} <Link to="/termos">{t('auth.terms_of_use', 'Termos de Uso')}</Link> {t('auth.and', 'e')} <Link to="/privacidade">{t('auth.privacy_policy', 'Política de Privacidade')}</Link></span>
              </label>
            </div>
            <button type="submit" className="btn-submit" disabled={!acceptTerms || loading || isTooYoung}>
              {loading ? t('auth.creating_account', 'Criando conta...') : t('auth.create_account_button', 'Criar Conta')}
              {!loading && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              )}
            </button>
          </form>
          <p className="auth-footer">
            {t('auth.already_have_account', 'Já tem uma conta?')} <Link to="/login">{t('auth.do_login', 'Fazer login')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
