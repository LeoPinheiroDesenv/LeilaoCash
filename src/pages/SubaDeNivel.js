import React from 'react';
import { Link } from 'react-router-dom';
import './SubaDeNivel.css';

export default function SubaDeNivel() {
  return (
    <div className="suba-de-nivel-page">
      <section className="nivel-hero">
        <div className="container">
          <div className="nivel-hero-content">
            <div className="nivel-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
              </svg>
            </div>
            <h1 className="nivel-title">Suba de Nível e Ganhe Mais!</h1>
            <p className="nivel-subtitle">
              Participe das <span className="text-gradient">Vibes</span> e conquiste prêmios especiais!
            </p>
          </div>
        </div>
      </section>

      <section className="nivel-content-section">
        <div className="container">
          <div className="nivel-intro">
            <h2>Como Funciona o Sistema de Níveis?</h2>
            <p className="intro-text">
              Quanto mais você participa, mais você sobe de nível e desbloqueia benefícios incríveis! 
              Cadastre-se agora, faça seu primeiro <span className="text-gradient">Get</span> e comece sua ascensão! 
              Benefícios, recompensas e mais esperam por você.
            </p>
          </div>

          <div className="niveis-grid">
            <div className="nivel-card nivel-card-bronze">
              <div className="nivel-card-header">
                <span className="nivel-emoji">🌟</span>
                <h3>Nível Iniciante</h3>
                <span className="nivel-range">Níveis 1-3</span>
              </div>
              <div className="nivel-card-body">
                <ul className="beneficios-list">
                  <li>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Cashback de até 3%
                  </li>
                  <li>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Acesso aos leilões básicos
                  </li>
                  <li>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Suporte por e-mail
                  </li>
                </ul>
              </div>
            </div>

            <div className="nivel-card nivel-card-silver">
              <div className="nivel-card-header">
                <span className="nivel-emoji">⚡</span>
                <h3>Nível Intermediário</h3>
                <span className="nivel-range">Níveis 4-7</span>
              </div>
              <div className="nivel-card-body">
                <ul className="beneficios-list">
                  <li>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Cashback de até 6%
                  </li>
                  <li>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Acesso a leilões exclusivos
                  </li>
                  <li>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Notificações prioritárias
                  </li>
                  <li>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Badge especial no perfil
                  </li>
                </ul>
              </div>
            </div>

            <div className="nivel-card nivel-card-gold">
              <div className="nivel-card-badge">Popular</div>
              <div className="nivel-card-header">
                <span className="nivel-emoji">👑</span>
                <h3>Nível Avançado</h3>
                <span className="nivel-range">Níveis 8-10</span>
              </div>
              <div className="nivel-card-body">
                <ul className="beneficios-list">
                  <li>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Cashback de até 10%
                  </li>
                  <li>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Acesso VIP a todos os leilões
                  </li>
                  <li>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Suporte prioritário 24/7
                  </li>
                  <li>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Bônus mensais exclusivos
                  </li>
                  <li>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Convites para eventos especiais
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="como-subir-section">
            <h2>Como Subir de Nível?</h2>
            <div className="acoes-grid">
              <div className="acao-card">
                <div className="acao-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8"></path>
                    <path d="m16 16 6-6"></path>
                    <path d="m8 8 6-6"></path>
                    <path d="m9 7 8 8"></path>
                    <path d="m21 11-8-8"></path>
                  </svg>
                </div>
                <h3>Participe de Leilões</h3>
                <p>Cada lance que você dá conta pontos para subir de nível</p>
                <span className="pontos">+10 pontos</span>
              </div>

              <div className="acao-card">
                <div className="acao-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                    <path d="M3 6h18"></path>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </div>
                <h3>Vença Leilões</h3>
                <p>Ganhar um leilão te dá pontos extras e recompensas</p>
                <span className="pontos">+50 pontos</span>
              </div>

              <div className="acao-card">
                <div className="acao-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3>Convide Amigos</h3>
                <p>Indique amigos e ganhe pontos quando eles se cadastrarem</p>
                <span className="pontos">+25 pontos</span>
              </div>

              <div className="acao-card">
                <div className="acao-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                </div>
                <h3>Atividade Diária</h3>
                <p>Faça login todos os dias e complete missões diárias</p>
                <span className="pontos">+5 pontos</span>
              </div>
            </div>
          </div>

          <div className="cta-final-section">
            <h2>Pronto para Começar Sua Jornada?</h2>
            <p>Cadastre-se agora e comece a ganhar benefícios desde o primeiro dia!</p>
            <div className="cta-buttons">
              <Link to="/cadastro" className="btn-cta-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <line x1="19" x2="19" y1="8" y2="14"></line>
                  <line x1="22" x2="16" y1="11" y2="11"></line>
                </svg>
                Criar Conta Grátis
              </Link>
              <Link to="/" className="btn-cta-secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 19-7-7 7-7"></path>
                  <path d="M19 12H5"></path>
                </svg>
                Voltar ao Início
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

