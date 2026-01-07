import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import './footer.css';

const Footer = () => {
  const { getLogoUrl, getText } = useTheme();
  const logoSrc = getLogoUrl();

  return (
    <>
      <section className="footer-cta-section">
        <div className="container">
          <div className="footer-cta-content">
            <h2>{getText('text_cta_title', 'Pronto para começar?')}</h2>
            <p>{getText('text_cta_subtitle', 'Crie sua conta agora e comece a dar lances para ganhar produtos incríveis com cashback.')}</p>
            <Link to="/cadastro" className="btn-footer-cta">
              {getText('text_header_cadastro', 'Cadastre-se Grátis')}
            </Link>
          </div>
        </div>
      </section>
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
            </div>
            <div className="footer-col">
              <h4>{getText('text_footer_links_uteis', 'Links Úteis')}</h4>
              <ul>
                <li><Link to="/como-funciona">Como Funciona</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/termos">Termos de Uso</Link></li>
                <li><Link to="/privacidade">Política de Privacidade</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>{getText('text_footer_contato', 'Contato')}</h4>
              <ul>
                <li><a href={`mailto:${getText('contact_email', 'contato@leilaocash.com')}`}>{getText('contact_email', 'contato@leilaocash.com')}</a></li>
                <li>{getText('contact_phone', '+55 (11) 99999-9999')}</li>
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
