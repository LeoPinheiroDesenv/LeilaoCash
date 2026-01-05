import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Countdown from '../components/Countdown';
import UserLayout from '../components/UserLayout';
import Modal from '../components/Modal';
import api from '../services/api';
import './DashboardUsuario.css';

const DashboardUsuario = () => {
  const [isBuyCreditsModalOpen, setIsBuyCreditsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null); // 'credit_card' or 'pix'
  const [creditAmount, setCreditAmount] = useState('');
  const [pixData, setPixData] = useState(null);
  const [loadingPix, setLoadingPix] = useState(false);
  const [pixError, setPixError] = useState('');

  const activeAuctions = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max 256GB',
      price: 'R$ 4.523,00',
      oldPrice: 'R$ 9.999',
      cashbackPercent: '5%',
      discount: '55',
      isHot: true,
      timer: '01:59:55',
      bids: '892',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800'
    },
    {
      id: 2,
      title: 'MacBook Pro M3 14"',
      price: 'R$ 8.234,50',
      oldPrice: 'R$ 16.999',
      cashbackPercent: '7%',
      discount: '52',
      timer: '00:59:55',
      bids: '1205',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'
    },
    {
      id: 5,
      title: 'Samsung Galaxy S24 Ultra',
      price: 'R$ 5.678,50',
      oldPrice: 'R$ 8.999',
      cashbackPercent: '4%',
      isHot: true,
      timer: '01:29:55',
      bids: '934',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800'
    }
  ];

  const handleOpenBuyCredits = (e) => {
    e.preventDefault();
    setIsBuyCreditsModalOpen(true);
    setPaymentMethod(null);
    setCreditAmount('');
    setPixData(null);
    setPixError('');
  };

  const handleCloseBuyCredits = () => {
    setIsBuyCreditsModalOpen(false);
    setPaymentMethod(null);
    setCreditAmount('');
    setPixData(null);
    setPixError('');
  };

  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method);
    setPixData(null);
    setPixError('');
  };

  const handleGeneratePix = async () => {
    if (!creditAmount || creditAmount <= 0) {
      setPixError('Informe um valor válido para recarga.');
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

  return (
    <UserLayout>
            <div className="welcome-section">
              <div className="welcome-text">
                <h1>Olá, João! 👋</h1>
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
            <div className="stats-grid">
              <div className="stat-card cashback-card">
                <div className="stat-content">
                  <p className="stat-label">Cashback Disponível</p>
                  <p className="stat-value">R$ 1250.50</p>
                  <p className="stat-description">Disponível para saque</p>
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
                  <p className="stat-label">Total de Lances</p>
                  <p className="stat-value">47</p>
                  <p className="stat-description">Lances realizados</p>
                  <div className="stat-trend">
                    <span className="trend-up">↑ 12%</span>
                    <span className="trend-label">vs ontem</span>
                  </div>
                </div>
                <div className="stat-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8"></path>
                    <path d="m16 16 6-6"></path>
                    <path d="m8 8 6-6"></path>
                    <path d="m9 7 8 8"></path>
                    <path d="m21 11-8-8"></path>
                  </svg>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <p className="stat-label">Leilões Vencidos</p>
                  <p className="stat-value">5</p>
                  <p className="stat-description">Produtos arrematados</p>
                </div>
                <div className="stat-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                    <path d="M3 6h18"></path>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <p className="stat-label">Lances Ativos</p>
                  <p className="stat-value">3</p>
                  <p className="stat-description">Leilões participando</p>
                </div>
                <div className="stat-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
              </div>
            </div>
            <div className="quick-actions">
              <h2>Ações Rápidas</h2>
              <div className="actions-grid">
                <Link to="/" className="action-card">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                    <path d="M3 6h18"></path>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                  <span>Ver Leilões</span>
                </Link>
                <Link to="/dashboard-usuario/meus-lances" className="action-card">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8"></path>
                    <path d="m16 16 6-6"></path>
                    <path d="m8 8 6-6"></path>
                    <path d="m9 7 8 8"></path>
                    <path d="m21 11-8-8"></path>
                  </svg>
                  <span>Meus Lances</span>
                </Link>
                <Link to="/dashboard-usuario/meu-cashback" className="action-card">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
                  </svg>
                  <span>Meu Cashback</span>
                </Link>
                <Link to="/dashboard-usuario/minha-conta" className="action-card">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Minha Conta</span>
                </Link>
              </div>
            </div>
            <div className="active-auctions">
              <div className="section-header">
                <h2>Seus Lances Ativos</h2>
                <Link to="/dashboard-usuario/meus-lances" className="btn-ver-todos">
                  Ver todos
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
              <div className="auctions-grid">
                {activeAuctions.map(auction => (
                  <div key={auction.id} className="auction-card">
                    <div className="auction-image-wrapper">
                      <img src={auction.image} alt={auction.title} className="auction-image" />
                      {auction.isHot && (
                        <div className="badge-hot">Hot</div>
                      )}
                      {auction.discount && (
                        <div className="discount-badge">-{auction.discount}%</div>
                      )}
                      {auction.cashbackPercent && (
                        <div className="cashback-badge">{auction.cashbackPercent} Cashback</div>
                      )}
                      <div className="timer-badge">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <Countdown timeString={auction.timer} />
                      </div>
                    </div>
                    <div className="auction-details">
                      <h3>{auction.title}</h3>
                      <div className="price-row">
                        <span className="current-price">{auction.price}</span>
                        {auction.oldPrice && (
                          <span className="old-price">{auction.oldPrice}</span>
                        )}
                      </div>
                      <div className="bids-count">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        {auction.bids} lances
                      </div>
                      <Link to={`/produto/${auction.id}`} className="btn-ver-leilao">Ver Leilão</Link>
                    </div>
                  </div>
                ))}
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
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                      <label>Valor da Recarga (R$)</label>
                      <input 
                        type="number" 
                        placeholder="0,00" 
                        value={creditAmount}
                        onChange={(e) => setCreditAmount(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Número do Cartão</label>
                      <input type="text" placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Validade</label>
                        <input type="text" placeholder="MM/AA" />
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input type="text" placeholder="123" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Nome no Cartão</label>
                      <input type="text" placeholder="Nome como está no cartão" />
                    </div>
                    <button className="btn-submit-payment">Finalizar Pagamento</button>
                  </form>
                </div>
              ) : (
                <div className="pix-payment">
                  <button className="btn-back" onClick={() => setPaymentMethod(null)}>
                    ← Voltar
                  </button>
                  <h3>Pagamento via Pix</h3>
                  {pixError && <div className="alert alert-error" style={{marginBottom: '1rem', padding: '0.8rem', fontSize: '0.9rem'}}>{pixError}</div>}
                  {!pixData ? (
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
                    </div>
                  ) : (
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
                        O pagamento será processado automaticamente após a confirmação.
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
