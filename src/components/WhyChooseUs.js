import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './whyChooseUs.css';

export default function WhyChooseUs() {
  const { getText } = useTheme();

  return (
    <section className="why-choose-us-section">
      <div className="container">
        <div className="why-header">
          <h2>{getText('text_why_title', 'Por que comprar na VibeGet?')}</h2>
        </div>
        
        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon why-icon-1">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div className="why-number">1</div>
            <h3>{getText('text_why_card_1_title', 'Uma Nova Forma de Adquirir')}</h3>
            <p>{getText('text_why_card_1_desc', 'Ao invés de comprar de forma convencional, você participa de uma Vibe interativa onde o Get que você está disposto a investir é o que define sua chance de ganhar. Isso transforma cada Vibe em uma experiência emocionante!')}</p>
          </div>

          <div className="why-card">
            <div className="why-icon why-icon-2">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/>
                <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>
              </svg>
            </div>
            <div className="why-number">2</div>
            <h3>{getText('text_why_card_2_title', 'Cash Back Sempre ao Seu Lado')}</h3>
            <p>{getText('text_why_card_2_desc', 'Não importa se você ganha ou perde a Vibe, você sempre ganha Cash back! Mesmo não sendo o Champion Get, você recebe 40% de volta do valor que investiu, para continuar participando de mais Vibes. Mais oportunidades, mais chances de ganhar!')}</p>
          </div>

          <div className="why-card">
            <div className="why-icon why-icon-3">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1"/>
                <circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
            </div>
            <div className="why-number">3</div>
            <h3>{getText('text_why_card_3_title', 'Produtos Cobiçados')}</h3>
            <p>{getText('text_why_card_3_desc', 'Oferecemos uma ampla variedade de produtos que atendem aos mais diversos gostos. A cada Vibe, você tem a chance de adquirir itens que são realmente desejados por todos.')}</p>
          </div>

          <div className="why-card">
            <div className="why-icon why-icon-4">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <div className="why-number">4</div>
            <h3>{getText('text_why_card_4_title', 'Agilidade e Praticidade')}</h3>
            <p>{getText('text_why_card_4_desc', 'Nosso cadastro é rápido e gratuito, e a recarga de crédito pode ser feita de forma simples por Pix ou Cartão de Crédito. Tudo é feito para ser rápido, seguro e sem complicação, permitindo que você participe de Vibes sem perder tempo.')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
