import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import './footer.css';

const Footer = ({ onSearch }) => {
  const { t } = useTranslation();
  const { getLogoUrl, getText } = useTheme();
  const logoSrc = getLogoUrl();
  const phoneLabel = t('contact.info_phone_label', 'Telefone');
  const phoneValue = getText('text_contact_phone_value', '+55 (11) 3000-0000');
  const addressLabel = t('contact.info_address_label', 'Endereço');
  const addressValue = getText('text_contact_address_value', 'São Paulo, SP - Brasil');

  const handleLogoClick = () => {
    if (onSearch) {
      onSearch('');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <Link to="/" state={{ reset: Date.now() }} className="footer-logo" onClick={handleLogoClick}>
                <img src={logoSrc} alt="Logo" className="logo-full" style={{ height: '40px' }} />
              </Link>
              <p className="footer-description">
                {t('footer.description')}
              </p>
              <div className="social-links">
                <a href="#" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="#" aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="#" aria-label="Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
                </a>
              </div>
            </div>
            <div className="footer-col">
              <h4>{t('footer.quick_links')}</h4>
              <ul>
                <li><Link to="/leiloes">{t('footer.auctions')}</Link></li>
                <li><Link to="/como-funciona">{t('footer.how_it_works')}</Link></li>
                <li><Link to="/faq">{t('footer.faq')}</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>{t('footer.legal')}</h4>
              <ul>
                <li><Link to="/termos">{t('footer.terms')}</Link></li>
                <li><Link to="/privacidade">{t('footer.privacy')}</Link></li>
                <li><Link to="/regras">{t('footer.rules')}</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>{t('footer.contact')}</h4>
              <ul>
                <li><a href={`mailto:${getText('contact_email', 'contato@leilaocash.com')}`}>{getText('contact_email', 'contato@leilaocash.com')}</a></li>
              </ul>
              <ul>
                <li>
                  <div className="footer-col">{phoneValue}</div>
                </li>
              </ul>

              <ul>
                <li>
                  <div className="footer-col">{addressValue}</div>
                </li>
              </ul>



            </div>
          </div>
          <div className="footer-copyright">
            <p>© {new Date().getFullYear()} VibeGet. {t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
