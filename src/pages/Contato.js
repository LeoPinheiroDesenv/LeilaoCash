import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import './Contato.css';

const Contato = () => {
  const { getText, loading } = useTheme();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Texto principal da página (acima do formulário)
  const introHtml = getText('page_contact_text', getText('page_contato', ''));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name) {
      setError(t('contact.error_name'));
      return;
    }
    if (!email) {
      setError(t('contact.error_email'));
      return;
    }
    if (!message) {
      setError(t('contact.error_message'));
      return;
    }

    setSubmitting(true);
    try {
      const payload = { name, email, subject, message };
      const response = await api.post('/contacts', payload);
      if (response.data.success) {
        setSuccess(response.data.message || t('contact.success_message'));
        setName(''); setEmail(''); setSubject(''); setMessage('');
      } else {
        setError(response.data.message || t('contact.error_generic'));
      }
    } catch (err) {
      // Mostrar erros de validação vindos do backend se existirem
      const backendErrors = err.response?.data?.errors;
      if (backendErrors) {
        const firstKey = Object.keys(backendErrors)[0];
        setError(backendErrors[firstKey][0]);
      } else {
        setError(err.response?.data?.message || t('contact.error_generic'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="page-content">
        <div className="container">
          <div className="loading-container"><p>{t('common.loading')}</p></div>
        </div>
      </main>
    );
  }

  return (
    <>
      <section className="contact-hero">
        <div className="container">
          <h1>{t('contact.header_title')}</h1>
          <p className="hero-subtitle">{t('contact.header_subtitle')}</p>
        </div>
      </section>

      <main className="page-content">
        <div className="container contact-container">

          <div className="contact-grid">
            <div className="card contact-card">
              <h2>{t('contact.form_title')}</h2>

              {success && <div className="alert alert-success">{success}</div>}
              {error && <div className="alert alert-error">{error}</div>}

              <form className="contact-form" onSubmit={handleSubmit}>
                {/* AQUI: Usamos 'row' para ativar o grid system */}
                <div className="row">

                  {/* 'col-12' garante 100% de largura no mobile */}
                  {/* 'col-md-6' faz ficar lado a lado a partir de telas médias */}
                  <div className="col-12 col-md-6 form-group mb-3">
                    <label>{t('contact.name_label')}</label>
                    <input
                        type="text"
                        className="form-control" /* Classe padrão do Bootstrap para inputs */
                        placeholder={t('contact.name_placeholder')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="col-12 col-md-6 form-group mb-3">
                    <label>{t('contact.email_label')}</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder={t('contact.email_placeholder')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label>{t('contact.subject_label')}</label>
                  <input
                      type="text"
                      className="form-control"
                      placeholder={t('contact.subject_placeholder')}
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="form-group mb-3">
                  <label>{t('contact.message_label')}</label>
                  <textarea
                      className="form-control"
                      rows="6"
                      placeholder={t('contact.message_placeholder')}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <button type="submit" className="btn btn-primary btn-submit" disabled={submitting}>
                    {submitting ? t('contact.sending_button') : t('contact.send_button')}
                  </button>
                </div>
              </form>
            </div>

            <aside className="card info-card">
              <h3>{t('contact.info_title')}</h3>

              <div className="info-item">
                <div className="info-icon">📧</div>
                <div>
                  <div className="info-label">{t('contact.info_email_label')}</div>
                  <div className="info-value">{getText('text_contact_email_value', 'contato@leilaocash.com')}</div>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">📞</div>
                <div>
                  <div className="info-label">{t('contact.info_phone_label')}</div>
                  <div className="info-value">{getText('text_contact_phone_value', '+55 (11) 3000-0000')}</div>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">📍</div>
                <div>
                  <div className="info-label">{t('contact.info_address_label')}</div>
                  <div className="info-value">{getText('text_contact_address_value', 'São Paulo, SP - Brasil')}</div>
                </div>
              </div>

            </aside>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contato;
