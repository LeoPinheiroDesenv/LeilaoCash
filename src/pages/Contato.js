import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import './Contato.css';

const Contato = () => {
  const { getText, loading } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Texto principal da página (acima do formulário)
  const introHtml = getText('page_contact_text', getText('page_contato', ''));

  // Header / Hero
  const headerTitle = getText('text_header_contact_title', 'Fale Conosco');
  const headerSubtitle = getText('text_header_contact_subtitle', 'Estamos aqui para ajudar e tirar suas dúvidas');

  // Form labels/placeholders/button
  const formTitle = getText('text_contact_form_title', 'Envie sua mensagem');
  const labelName = getText('text_contact_name', 'Nome *');
  const phName = getText('text_contact_name_placeholder', 'Seu nome completo');
  const labelEmail = getText('text_contact_email', 'E-mail *');
  const phEmail = getText('text_contact_email_placeholder', 'seu@email.com');
  const labelSubject = getText('text_contact_subject', 'Assunto');
  const phSubject = getText('text_contact_subject_placeholder', 'Qual é o assunto da sua mensagem?');
  const labelMessage = getText('text_contact_message', 'Mensagem *');
  const phMessage = getText('text_contact_message_placeholder', 'Escreva sua mensagem aqui...');
  const btnSend = getText('text_contact_send', 'Enviar Mensagem');
  const btnSending = getText('text_contact_sending', 'Enviando...');
  const successMsg = getText('text_contact_success', 'Mensagem enviada com sucesso! Obrigado.');

  // Info box
  const infoTitle = getText('text_contact_info_title', 'Outras Formas de Contato');
  const emailLabel = getText('text_contact_email_label', 'E-mail');
  const emailValue = getText('text_contact_email_value', 'contato@leilaocash.com');
  const phoneLabel = getText('text_contact_phone_label', 'Telefone');
  const phoneValue = getText('text_contact_phone_value', '+55 (11) 3000-0000');
  const addressLabel = getText('text_contact_address_label', 'Endereço');
  const addressValue = getText('text_contact_address_value', 'São Paulo, SP - Brasil');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name) {
      setError(getText('text_contact_error_name', 'Por favor informe seu nome.'));
      return;
    }
    if (!email) {
      setError(getText('text_contact_error_email', 'Por favor informe um e-mail válido.'));
      return;
    }
    if (!message) {
      setError(getText('text_contact_error_message', 'Por favor escreva sua mensagem.'));
      return;
    }

    setSubmitting(true);
    try {
      const payload = { name, email, subject, message };
      const response = await api.post('/contacts', payload);
      if (response.data.success) {
        setSuccess(response.data.message || successMsg);
        setName(''); setEmail(''); setSubject(''); setMessage('');
      } else {
        setError(response.data.message || getText('text_contact_error_generic', 'Erro ao enviar mensagem. Tente novamente.'));
      }
    } catch (err) {
      // Mostrar erros de validação vindos do backend se existirem
      const backendErrors = err.response?.data?.errors;
      if (backendErrors) {
        const firstKey = Object.keys(backendErrors)[0];
        setError(backendErrors[firstKey][0]);
      } else {
        setError(err.response?.data?.message || getText('text_contact_error_generic', 'Erro ao enviar mensagem. Tente novamente.'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="page-content">
        <div className="container">
          <div className="loading-container"><p>Carregando...</p></div>
        </div>
      </main>
    );
  }

  return (
    <>
      <section className="contact-hero">
        <div className="container">
          <h1>{headerTitle}</h1>
          <p className="hero-subtitle">{headerSubtitle}</p>
        </div>
      </section>

      <main className="page-content">
        <div className="container contact-container">

          <div className="contact-grid">
            <div className="card contact-card">
              <h2>{formTitle}</h2>

              {success && <div className="alert alert-success">{success}</div>}
              {error && <div className="alert alert-error">{error}</div>}

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>{labelName}</label>
                    <input type="text" placeholder={phName} value={name} onChange={(e) => setName(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label>{labelEmail}</label>
                    <input type="email" placeholder={phEmail} value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label>{labelSubject}</label>
                  <input type="text" placeholder={phSubject} value={subject} onChange={(e) => setSubject(e.target.value)} />
                </div>

                <div className="form-group">
                  <label>{labelMessage}</label>
                  <textarea rows="6" placeholder={phMessage} value={message} onChange={(e) => setMessage(e.target.value)} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <button type="submit" className="btn-submit" disabled={submitting}>
                    {submitting ? btnSending : btnSend}
                  </button>
                </div>
              </form>
            </div>

            <aside className="card info-card">
              <h3>{infoTitle}</h3>

              <div className="info-item">
                <div className="info-icon">📧</div>
                <div>
                  <div className="info-label">{emailLabel}</div>
                  <div className="info-value">{emailValue}</div>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">📞</div>
                <div>
                  <div className="info-label">{phoneLabel}</div>
                  <div className="info-value">{phoneValue}</div>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">📍</div>
                <div>
                  <div className="info-label">{addressLabel}</div>
                  <div className="info-value">{addressValue}</div>
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
