import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import './whyChooseUs.css';

export default function WhyChooseUs() {
  const { t } = useTranslation();
  const { getText } = useTheme();

  return (
    <section className="why-choose-us-section">
      <div className="container">
        <div className="why-header">
          <h2>{t('why_choose_us.title')}</h2>
        </div>
        
        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon why-icon-1">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div className="why-number">1</div>
            <h3>{t('why_choose_us.card_1_title')}</h3>
            <p>{t('why_choose_us.card_1_desc')}</p>
          </div>

          <div className="why-card">
            <div className="why-icon why-icon-2">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/>
                <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>
              </svg>
            </div>
            <div className="why-number">2</div>
            <h3>{t('why_choose_us.card_2_title')}</h3>
            <p>{t('why_choose_us.card_2_desc')}</p>
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
            <h3>{t('why_choose_us.card_3_title')}</h3>
            <p>{t('why_choose_us.card_3_desc')}</p>
          </div>

          <div className="why-card">
            <div className="why-icon why-icon-4">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <div className="why-number">4</div>
            <h3>{t('why_choose_us.card_4_title')}</h3>
            <p>{t('why_choose_us.card_4_desc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
