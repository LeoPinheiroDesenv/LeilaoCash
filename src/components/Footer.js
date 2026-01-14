import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import './footer.css';

const Footer = () => {
  const { getLogoUrl, getText } = useTheme();
  const logoSrc = getLogoUrl();

  return (
    <>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <Link to="/" className="footer-logo">
                <img src={logoSrc} alt="Logo" className="logo-full" style={{ height: '40px' }} />
              </Link>
              <p className="footer-description">
                {getText('text_footer_sobre_desc', 'A maior plataforma de leilões com cashback do Brasil. Produtos novos, lacrados e com garantia.')}
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
              <h4>{getText('text_footer_quick_links', 'Links Rápidos')}</h4>
              <ul>
                <li><Link to="/leiloes">Leilões</Link></li>
                <li><Link to="/como-funciona">Como Funciona</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>{getText('text_footer_legal', 'Legal')}</h4>
              <ul>
                <li><Link to="/termos">Termos de Uso</Link></li>
                <li><Link to="/privacidade">Política de Privacidade</Link></li>
                <li><Link to="/regras">Regras</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>{getText('text_footer_contato', 'Contato')}</h4>
              <ul>
                <li><a href={`mailto:${getText('contact_email', 'contato@leilaocash.com')}`}>{getText('contact_email', 'contato@leilaocash.com')}</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-copyright">
            <p>{getText('text_footer_copyright', `© ${new Date().getFullYear()} LeilaoCash. Todos os direitos reservados.`)}</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
