import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Countdown from '../components/Countdown';
import UserLayout from '../components/UserLayout';
import Modal from '../components/Modal';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './DashboardUsuario.css';

const DashboardUsuario = () => {
  const { user, updateUser } = useAuth();
  const { settings } = useTheme();
  const [isBuyCreditsModalOpen, setIsBuyCreditsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null); // 'credit_card' or 'pix'
  const [creditAmount, setCreditAmount] = useState('');
  
  // Pix states
  const [pixData, setPixData] = useState(null);
  const [loadingPix, setLoadingPix] = useState(false);
  const [pixError, setPixError] = useState('');
  const [pixSuccess, setPixSuccess] = useState('');

  // Credit Card states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiration, setCardExpiration] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardCpf, setCardCpf] = useState('');
  const [loadingCard, setLoadingCard] = useState(false);
  const [cardError, setCardError] = useState('');
  const [cardSuccess, setCardSuccess] = useState('');

  const pollingIntervalRef = useRef(null);

  const activeAuctions = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max 256GB',
      price: 'R$ 4.523,00',
      oldPrice: 'R$ 9.999',
      cashbackPercent: '5',
      discount: '55',
      isHot: true,
      timer: '01:59:55',
      bids: '892',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800'
    },
  ];

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const handleOpenBuyCredits = (e) => {
    e.preventDefault();
    setIsBuyCreditsModalOpen(true);
    resetStates();
  };

  const handleCloseBuyCredits = () => {
    setIsBuyCreditsModalOpen(false);
    stopPolling();
    resetStates();
  };

  const resetStates = () => {
    setPaymentMethod(null);
    setCreditAmount('');
    setPixData(null);
    setPixError('');
    setPixSuccess('');
    setCardNumber('');
    setCardExpiration('');
    setCardCvv('');
    setCardHolderName('');
    setCardCpf('');
    setCardError('');
    setCardSuccess('');
  };

  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method);
    setPixData(null);
    setPixError('');
    setCardError('');
    setCardSuccess('');
  };

  const formatCPF = (value) => {
    // Remove tudo que não é dígito e limita a 11 caracteres
    const cleaned = value.replace(/\D/g, '').slice(0, 11);
    // Aplica a máscara 000.000.000-00
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const startPolling = (transactionId) => {
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await api.get(`/payments/${transactionId}/status`);
        if (response.data.success && response.data.data.status === 'completed') {
          stopPolling();
          const pct = parseFloat(settings?.pix_cashback_percentage || '10');
          const bonus = (parseFloat(creditAmount) * pct / 100).toFixed(2);
          const cashbackMsg = settings?.pix_cashback_enabled !== 'false'
            ? ` + R$ ${bonus} em Getcoin!`
            : '';
          setPixSuccess(`Pagamento aprovado! Seus créditos foram adicionados${cashbackMsg}`);
          // Atualizar saldo do usuário no contexto
          const meResponse = await api.get('/auth/me');
          if (meResponse.data.success) {
            updateUser(meResponse.data.data);
          }
          setTimeout(() => {
            handleCloseBuyCredits();
          }, 3000);
        }
      } catch (error) {
        console.error('Erro no polling de status:', error);
        // Opcional: parar o polling após X tentativas
      }
    }, 5000); // Verifica a cada 5 segundos
  };

  const handleGeneratePix = async () => {
    if (!creditAmount || creditAmount <= 0) {
      setPixError('Informe um valor válido para recarga.');
      return;
    }

    const minCredit = parseFloat(settings?.min_credit_amount || '20');
    if (parseFloat(creditAmount) < minCredit) {
      setPixError(`O valor mínimo para recarga é R$ ${minCredit.toFixed(2).replace('.', ',')}.`);
      return;
    }

    try {
      setLoadingPix(true);
      setPixError('');
      
      const response = await api.post('/payments/pix', {
        amount: parseFloat(creditAmount)
      });

      if (response.data.success) {
        setPixData(response.data.data);
        startPolling(response.data.data.id); // Inicia o polling
      } else {
        setPixError(response.data.message || 'Erro ao gerar Pix.');
      }
    } catch (error) {
      console.error('Erro ao gerar Pix:', error);
      setPixError(error.response?.data?.message || 'Erro ao processar pagamento. Verifique as configurações do Mercado Pago.');
    } finally {
      setLoadingPix(false);
    }
  };

  const getPaymentMethodId = (number) => {
    const bin = number.substring(0, 6);
    if (/^4/.test(bin)) return 'visa';
    if (/^5[1-5]/.test(bin)) return 'master';
    if (/^3[47]/.test(bin)) return 'amex';
    if (/^6(?:011|5)/.test(bin)) return 'discover';
    return 'master'; // Fallback
  };

  const handleCreditCardPayment = async (e) => {
    e.preventDefault();
    
    if (!creditAmount || creditAmount <= 0) {
      setCardError('Informe um valor válido para recarga.');
      return;
    }

    const minCreditCard = parseFloat(settings?.min_credit_amount || '20');
    if (parseFloat(creditAmount) < minCreditCard) {
      setCardError(`O valor mínimo para recarga é R$ ${minCreditCard.toFixed(2).replace('.', ',')}.`);
      return;
    }

    if (!cardNumber || !cardExpiration || !cardCvv || !cardHolderName || !cardCpf) {
      setCardError('Preencha todos os campos do cartão.');
      return;
    }

    try {
      setLoadingCard(true);
      setCardError('');
      setCardSuccess('');

      const [month, year] = cardExpiration.split('/');
      const fullYear = year.length === 2 ? `20${year}` : year;

      const payload = {
        amount: parseFloat(creditAmount),
        card_number: cardNumber.replace(/\s/g, ''),
        expiration_month: parseInt(month),
        expiration_year: parseInt(fullYear),
        security_code: cardCvv,
        cardholderName: cardHolderName,
        identificationNumber: cardCpf.replace(/\D/g, ''),
        identificationType: 'CPF',
        installments: 1,
        payment_method_id: getPaymentMethodId(cardNumber),
        email: user.email
      };

      const response = await api.post('/payments/credit-card', payload);

      if (response.data.success) {
        setCardSuccess('Pagamento realizado com sucesso! Seus créditos foram adicionados.');
        const meResponse = await api.get('/auth/me');
        if (meResponse.data.success) {
            updateUser(meResponse.data.data);
        }
        setTimeout(() => {
            handleCloseBuyCredits();
        }, 2000);
      } else {
        setCardError(response.data.message || 'Erro ao processar pagamento.');
      }
    } catch (error) {
      console.error('Erro no pagamento com cartão:', error);
      setCardError(error.response?.data?.message || 'Erro ao processar pagamento. Verifique os dados do cartão.');
    } finally {
      setLoadingCard(false);
    }
  };

  // Função para calcular o nível do Viber
  const getUserLevel = (wins) => {
    if (wins >= 15) return { name: 'Diamond', icon: '💎', nextLevel: null, color: '#b9f2ff' };
    if (wins >= 13) return { name: 'Platinum', icon: '👑', nextLevel: 15, color: '#e5e4e2' };
    if (wins >= 10) return { name: 'Gold', icon: '🥇', nextLevel: 13, color: '#ffd700' };
    if (wins >= 5) return { name: 'Silver', icon: '🥈', nextLevel: 10, color: '#c0c0c0' };
    if (wins >= 1) return { name: 'Bronze', icon: '🥉', nextLevel: 5, color: '#cd7f32' };
    return { name: 'Inscrito', icon: '📝', nextLevel: 1, color: '#9fb0c8' };
  };

  const userLevel = getUserLevel(user?.auctions_won || 0);

  return (
    <UserLayout>
            <div className="welcome-section">
              <div className="welcome-text">
                <h1>Olá, {user?.name?.split(' ')[0] || 'Usuário'}! 👋</h1>
                <p>Bem-vindo ao seu painel de controle</p>
              </div>
              <a href="#" onClick={handleOpenBuyCredits} className="btn-buy-credits">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="2" x2="12" y2="22"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                <span>Comprar Créditos</span>
              </a>
            </div>

            {user?.referral_code && (
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(74,159,216,0.08)', border: '1px solid rgba(74,159,216,0.2)', borderRadius: '10px', marginBottom: '1.5rem', flexWrap: 'wrap'}}>
                <span style={{color: '#8da4bf', fontSize: '0.9rem'}}>Seu código de indicação:</span>
                <code style={{background: 'rgba(255,255,255,0.1)', padding: '0.3rem 0.75rem', borderRadius: '6px', color: '#4A9FD8', fontWeight: '700', letterSpacing: '1px'}}>{user.referral_code}</code>
                <button onClick={() => { navigator.clipboard.writeText(user.referral_code); alert('Código copiado!'); }} style={{padding: '0.3rem 0.75rem', background: 'rgba(74,159,216,0.15)', border: '1px solid rgba(74,159,216,0.3)', borderRadius: '6px', color: '#4A9FD8', cursor: 'pointer', fontSize: '0.8rem'}}>Copiar</button>
                <span style={{color: '#8da4bf', fontSize: '0.8rem'}}>Indicações: {user.referral_count || 0}</span>
              </div>
            )}
            <div className="stats-grid">
              <div className="stat-card level-card" style={{ borderColor: userLevel.color }}>
                <div className="stat-content">
                  <p className="stat-label">Seu Nível</p>
                  <p className="stat-value" style={{ color: userLevel.color }}>
                    {userLevel.icon} {userLevel.name}
                  </p>
                  <p className="stat-description">
                    {userLevel.nextLevel 
                      ? `${userLevel.nextLevel - (user?.auctions_won || 0)} Vibe(s) para o próximo nível`
                      : 'Você atingiu o nível máximo!'}
                  </p>
                </div>
                <div className="stat-icon" style={{ color: userLevel.color }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
              </div>
              <div className="stat-card cashback-card">
                <div className="stat-content">
                  <p className="stat-label">GetCoin Disponível</p>
                  <p className="stat-value">R$ {user?.cashback_balance || '0.00'}</p>
                  <p className="stat-description">Disponível para uso</p>
                </div>
                <div className="stat-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
                  </svg>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <p className="stat-label">Saldo de Créditos</p>
                  <p className="stat-value">R$ {user?.balance || '0.00'}</p>
                  <p className="stat-description">Disponível para Gets</p>
                </div>
                <div className="stat-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </div>
              </div>
            </div>
            
            <Modal
              isOpen={isBuyCreditsModalOpen}
              onClose={handleCloseBuyCredits}
              title="Comprar Créditos"
            >
              {!paymentMethod ? (
                <div className="payment-method-selection">
                  <p className="modal-description">Escolha como deseja pagar pelos seus créditos:</p>
                  <div className="payment-options">
                    <button 
                      className="payment-option-btn"
                      onClick={() => handleSelectPaymentMethod('credit_card')}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                      </svg>
                      <span>Cartão de Crédito</span>
                    </button>
                    <button 
                      className="payment-option-btn"
                      onClick={() => handleSelectPaymentMethod('pix')}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <path d="M12 8v8"></path>
                        <path d="M8 12h8"></path>
                      </svg>
                      <span>Pix</span>
                    </button>
                  </div>
                </div>
              ) : paymentMethod === 'credit_card' ? (
                <div className="credit-card-form">
                  <button className="btn-back" onClick={() => setPaymentMethod(null)}>
                    ← Voltar
                  </button>
                  <h3>Pagamento com Cartão de Crédito</h3>
                  
                  {cardError && <div className="alert alert-error" style={{marginBottom: '1rem', padding: '0.8rem', fontSize: '0.9rem'}}>{cardError}</div>}
                  {cardSuccess && <div className="alert alert-success" style={{marginBottom: '1rem', padding: '0.8rem', fontSize: '0.9rem'}}>{cardSuccess}</div>}
                  
                  <form onSubmit={handleCreditCardPayment}>
                    <div className="form-group">
                      <label>Valor da Recarga (R$)</label>
                      <input 
                        type="number" 
                        placeholder="0,00" 
                        value={creditAmount}
                        onChange={(e) => setCreditAmount(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Número do Cartão</label>
                      <input 
                        type="text" 
                        placeholder="0000 0000 0000 0000" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Validade</label>
                        <input 
                          type="text" 
                          placeholder="MM/AA" 
                          value={cardExpiration}
                          onChange={(e) => setCardExpiration(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input 
                          type="text" 
                          placeholder="123" 
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Nome no Cartão</label>
                      <input 
                        type="text" 
                        placeholder="Nome como está no cartão" 
                        value={cardHolderName}
                        onChange={(e) => setCardHolderName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CPF do Titular</label>
                      <input 
                        type="text" 
                        placeholder="000.000.000-00" 
                        value={cardCpf}
                        onChange={(e) => setCardCpf(formatCPF(e.target.value))}
                        required
                      />
                    </div>
                    <button className="btn-submit-payment" disabled={loadingCard}>
                        {loadingCard ? 'Processando...' : 'Finalizar Pagamento'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="pix-payment">
                  <button className="btn-back" onClick={() => setPaymentMethod(null)}>
                    ← Voltar
                  </button>
                  <h3>Pagamento via Pix</h3>
                  {pixError && <div className="alert alert-error" style={{marginBottom: '1rem', padding: '0.8rem', fontSize: '0.9rem'}}>{pixError}</div>}
                  {pixSuccess && <div className="alert alert-success" style={{marginBottom: '1rem', padding: '0.8rem', fontSize: '0.9rem'}}>{pixSuccess}</div>}
                  
                  {!pixData && !pixSuccess ? (
                     <div className="form-group">
                      <label>Valor da Recarga (R$)</label>
                      <div className="input-with-button">
                        <input 
                          type="number" 
                          placeholder="0,00" 
                          value={creditAmount}
                          onChange={(e) => setCreditAmount(e.target.value)}
                        />
                        <button 
                          className="btn-generate-pix"
                          onClick={handleGeneratePix}
                          disabled={!creditAmount || loadingPix}
                        >
                          {loadingPix ? 'Gerando...' : 'Gerar Pix'}
                        </button>
                      </div>
                      {/* Preview do Getcoin */}
                      {settings?.pix_cashback_enabled !== 'false' && creditAmount > 0 && (() => {
                        const pct = parseFloat(settings?.pix_cashback_percentage || '10');
                        const bonus = (parseFloat(creditAmount) * pct / 100).toFixed(2);
                        return (
                          <div style={{
                            marginTop: '0.75rem',
                            padding: '0.75rem 1rem',
                            background: 'rgba(74, 159, 216, 0.1)',
                            border: '1px solid rgba(74, 159, 216, 0.3)',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            color: '#4A9FD8',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/>
                              <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>
                            </svg>
                            Você receberá <strong style={{margin: '0 0.25rem'}}>R$ {bonus}</strong> em Getcoin ({pct}% de cashback)
                          </div>
                        );
                      })()}
                    </div>
                  ) : pixData && (
                    <div className="pix-content">
                      <p>Escaneie o QR Code abaixo para pagar:</p>
                      <div className="qr-code-placeholder" style={{ background: '#fff', padding: '10px', borderRadius: '8px' }}>
                        <img src={`data:image/png;base64,${pixData.qr_code_base64}`} alt="QR Code Pix" style={{ width: '100%', height: 'auto' }} />
                      </div>
                      <div className="pix-copy-paste">
                        <label>Código Pix Copia e Cola</label>
                        <div className="copy-paste-input">
                          <input type="text" value={pixData.qr_code} readOnly />
                          <button onClick={() => {
                            navigator.clipboard.writeText(pixData.qr_code);
                            alert('Código copiado!');
                          }}>
                            Copiar
                          </button>
                        </div>
                      </div>
                      <p style={{ marginTop: '1rem', fontSize: '0.8rem', textAlign: 'center', color: '#666' }}>
                        Aguardando pagamento... A tela atualizará automaticamente.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Modal>
    </UserLayout>
  );
};

export default DashboardUsuario;
