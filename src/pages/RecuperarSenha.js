import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './RecuperarSenha.css';

const RecuperarSenha = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password recovery logic here
    console.log('Recuperar senha:', email);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/" className="auth-logo">
          <div className="auth-logo-icon">LC</div>
        </Link>
        <div className="auth-content">
          <h1>Recuperar Senha</h1>
          <p>Digite seu email para receber instruções de recuperação</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <div className="input-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-submit">
              Enviar Instruções
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </form>
          <p className="auth-footer">
            Lembrou sua senha? <Link to="/login">Fazer login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecuperarSenha;

