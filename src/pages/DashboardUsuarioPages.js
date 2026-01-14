import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserLayout from '../components/UserLayout';
import Countdown from '../components/Countdown';
import api from '../services/api';
import '../pages/DashboardUsuario.css';

export const DashboardUsuarioMinhaConta = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    birth_date: '',
    address: '',
    city: '',
    state: '',
    zip_code: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/me');
      if (response.data.success) {
        const userData = response.data.data;
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          cpf: userData.cpf || '',
          birth_date: userData.birth_date || '',
          address: userData.address || '',
          city: userData.city || '',
          state: userData.state || '',
          zip_code: userData.zip_code || ''
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar dados' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      
      // Remove email do formData antes de enviar, pois o backend não permite atualizar email
      const { email, ...profileData } = formData;
      
      const response = await api.put('/auth/profile', profileData);
      if (response.data.success) {
        updateUser(response.data.data);
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Erro ao atualizar perfil' });
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Erro ao atualizar perfil. Tente novamente.' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'A senha deve ter pelo menos 8 caracteres' });
      return;
    }

    try {
      setSavingPassword(true);
      setMessage({ type: '', text: '' });
      
      const response = await api.put('/auth/change-password', {
        current_password: passwordData.currentPassword,
        password: passwordData.newPassword,
        password_confirmation: passwordData.confirmPassword
      });
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Erro ao alterar senha' });
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Erro ao alterar senha. Verifique a senha atual.' 
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  if (loading) {
    return (
      <UserLayout>
        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <p style={{ color: '#8da4bf' }}>Carregando dados...</p>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Minha Conta</h1>
          <p>Gerencie suas informações pessoais</p>
        </div>
      </div>
      
      {message.text && (
        <div style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          borderRadius: '8px',
          background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(229, 95, 82, 0.1)',
          border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(229, 95, 82, 0.3)'}`,
          color: message.type === 'success' ? '#10b981' : '#E55F52'
        }}>
          {message.text}
        </div>
      )}

      <div className="profile-section">
        <div className="profile-header">
          <div className="profile-avatar-large">{getInitials(formData.name || user?.name)}</div>
        </div>
        <div className="profile-info">
          <h3>{formData.name || user?.name || 'Usuário'}</h3>
          <p>Membro desde {user?.created_at ? formatDate(user.created_at) : 'indefinido'}</p>
        </div>
      </div>
      
      <form onSubmit={handleSaveProfile} className="form-section">
        <div className="section-header-form">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <h3>Informações Pessoais</h3>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Nome completo</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <div className="input-with-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                disabled
                title="O email não pode ser alterado"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Telefone</label>
            <div className="input-with-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Data de Nascimento</label>
            <input 
              type="date" 
              value={formData.birth_date}
              onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Endereço</label>
            <input 
              type="text" 
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Cidade</label>
            <input 
              type="text" 
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Estado</label>
            <input 
              type="text" 
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              maxLength="2"
              placeholder="SP"
            />
          </div>
          <div className="form-group">
            <label>CEP</label>
            <input 
              type="text" 
              value={formData.zip_code}
              onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>CPF</label>
            <div className="input-with-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input 
                type="text" 
                value={formData.cpf}
                disabled
              />
            </div>
          </div>
        </div>
        <button type="submit" className="btn-save" disabled={saving}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
      
      <form onSubmit={handleChangePassword} className="form-section">
        <div className="section-header-form">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <h3>Alterar Senha</h3>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Senha atual</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Nova senha</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                required
                minLength="8"
              />
          </div>
          <div className="form-group">
            <label>Confirmar nova senha</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                required
                minLength="8"
              />
          </div>
        </div>
        <button type="submit" className="btn-save" disabled={savingPassword}>
          {savingPassword ? 'Alterando...' : 'Alterar Senha'}
        </button>
      </form>
    </UserLayout>
  );
};

export const DashboardUsuarioMeusLances = () => {
  const { user } = useAuth();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    winning: 0,
    active: 0,
    leading: 0
  });
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 15, total: 0 });

  const loadBids = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current_page,
        per_page: pagination.per_page
      });

      const response = await api.get(`/user/bids?${params.toString()}`);
      
      if (response.data.success) {
        const bidsData = response.data.data.data || response.data.data || [];
        setBids(bidsData);
        setPagination({
          current_page: response.data.data.current_page || 1,
          last_page: response.data.data.last_page || 1,
          per_page: response.data.data.per_page || 15,
          total: response.data.data.total || 0
        });

        // Calcular estatísticas dos dados retornados (página atual)
        // Nota: Para estatísticas totais precisaríamos de uma API separada ou usar o total da paginação
        const total = response.data.data.total || pagination.total || bidsData.length;
        const winning = bidsData.filter(b => b.is_winning).length;
        const activeAuctions = bidsData.filter(b => {
          const auction = b.auction;
          if (!auction) return false;
          return auction.status === 'active';
        }).length;
        const leading = bidsData.filter(b => {
          const auction = b.auction;
          if (!auction) return false;
          if (auction.status !== 'active') return false;
          const currentBid = parseFloat(auction.current_bid || auction.starting_bid || 0);
          const myBid = parseFloat(b.amount);
          return myBid >= currentBid;
        }).length;

        setStats({ total, winning, active: activeAuctions, leading });
      }
    } catch (error) {
      console.error('Erro ao carregar lances:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.current_page, pagination.per_page]);

  useEffect(() => {
    if (user) {
      loadBids();
    }
  }, [user, loadBids]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return `R$ ${parseFloat(price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getProductImage = (bid) => {
    // Tenta obter a imagem do produto relacionado
    if (bid.product?.image_url) {
      const img = bid.product.image_url;
      return img.startsWith('http') 
        ? img 
        : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8000'}${img}`;
    }
    // Se não tiver produto, tenta obter do primeiro produto do leilão
    if (bid.auction?.products && bid.auction.products.length > 0) {
      const firstProduct = bid.auction.products[0];
      if (firstProduct.image_url) {
        const img = firstProduct.image_url;
        return img.startsWith('http') 
          ? img 
          : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8000'}${img}`;
      }
    }
    return 'https://via.placeholder.com/400x300?text=Sem+Imagem';
  };

  const getProductName = (bid) => {
    if (bid.product?.name) {
      return bid.product.name;
    }
    // Se não tiver produto, tenta obter do primeiro produto do leilão
    if (bid.auction?.products && bid.auction.products.length > 0) {
      return bid.auction.products[0].name || bid.auction.title;
    }
    return bid.auction?.title || 'Produto sem nome';
  };

  const getProductId = (bid) => {
    if (bid.product?.id) {
      return bid.product.id;
    }
    // Se não tiver produto, tenta obter do primeiro produto do leilão
    if (bid.auction?.products && bid.auction.products.length > 0) {
      return bid.auction.products[0].id;
    }
    return null;
  };

  const getBidStatus = (bid) => {
    if (!bid.auction) return 'Finalizado';
    if (bid.auction.status === 'finished') return 'Finalizado';
    if (bid.is_winning) return 'Vencendo';
    
    const auction = bid.auction;
    const currentBid = parseFloat(auction.current_bid || auction.starting_bid || 0);
    const myBid = parseFloat(bid.amount);
    
    if (myBid >= currentBid) return 'Vencendo';
    return 'Superado';
  };

  const calculateTimeRemaining = (endDate) => {
    if (!endDate) return '00:00:00';
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) return '00:00:00';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <UserLayout>
        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <p style={{ color: '#8da4bf' }}>Carregando seus lances...</p>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Meus Lances</h1>
          <p>Acompanhe todos os seus lances</p>
        </div>
      </div>
      <div className="bids-stats">
        <div className="bid-stat-card">
          <p className="stat-number">{stats.total}</p>
          <p className="stat-label">Total de Lances</p>
        </div>
        <div className="bid-stat-card">
          <p className="stat-number">{stats.winning}</p>
          <p className="stat-label">Leilões Vencidos</p>
        </div>
        <div className="bid-stat-card">
          <p className="stat-number">{stats.active}</p>
          <p className="stat-label">Lances Ativos</p>
        </div>
        <div className="bid-stat-card">
          <p className="stat-number">{stats.leading}</p>
          <p className="stat-label">Vencendo</p>
        </div>
      </div>
      <div className="bids-history-section">
        <h3>Histórico de Lances</h3>
        {bids.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#8da4bf' }}>
            <p>Você ainda não fez nenhum lance.</p>
            <Link to="/" style={{ color: '#4A9FD8', textDecoration: 'none', marginTop: '1rem', display: 'inline-block' }}>
              Ver leilões disponíveis →
            </Link>
          </div>
        ) : (
          <>
            <div className="bids-list">
              {bids.map(bid => (
                <div key={bid.id} className="bid-history-card">
                  <div className="bid-card-content">
                    <div className="bid-image">
                      <img src={getProductImage(bid)} alt={getProductName(bid)} />
                      <div className="bid-info-main">
                        <div className="bid-title-section">
                          <h4>{getProductName(bid)}</h4>
                          <p className="bid-date">Lance em {formatDate(bid.created_at)}</p>
                        </div>
                        <div className="bid-status-badge">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          {getBidStatus(bid)}
                        </div>
                      </div>
                      <div className="bid-values">
                        <div className="bid-value-item">
                          <p className="bid-value-label">Seu lance</p>
                          <p className="bid-value-amount">{formatPrice(bid.amount)}</p>
                        </div>
                        <div className="bid-value-item">
                          <p className="bid-value-label">Lance atual</p>
                          <p className="bid-value-amount">
                            {formatPrice(bid.auction?.current_bid || bid.auction?.starting_bid || 0)}
                          </p>
                        </div>
                        {bid.auction?.end_date && bid.auction.status === 'active' && (
                          <div className="bid-timer">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                              <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            <Countdown timeString={calculateTimeRemaining(bid.auction.end_date)} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {getProductId(bid) && (
                    <Link to={`/produto/${getProductId(bid)}`} className="btn-ver-leilao-bid">Ver Leilão</Link>
                  )}
                </div>
              ))}
            </div>
            
            {pagination.last_page > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                <button 
                  onClick={() => setPagination({...pagination, current_page: pagination.current_page - 1})}
                  disabled={pagination.current_page === 1}
                  style={{ padding: '0.5rem 1rem', background: '#1a2942', border: '1px solid #2a3a52', color: '#e6eef8', borderRadius: '8px', cursor: pagination.current_page === 1 ? 'not-allowed' : 'pointer' }}
                >
                  Anterior
                </button>
                <span style={{ padding: '0.5rem 1rem', color: '#8da4bf' }}>
                  Página {pagination.current_page} de {pagination.last_page}
                </span>
                <button 
                  onClick={() => setPagination({...pagination, current_page: pagination.current_page + 1})}
                  disabled={pagination.current_page === pagination.last_page}
                  style={{ padding: '0.5rem 1rem', background: '#1a2942', border: '1px solid #2a3a52', color: '#e6eef8', borderRadius: '8px', cursor: pagination.current_page === pagination.last_page ? 'not-allowed' : 'pointer' }}
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </UserLayout>
  );
};

export const DashboardUsuarioMeuCashback = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState({ balance: 0, cashback_balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 15, total: 0 });

  const loadBalance = useCallback(async () => {
    try {
      const response = await api.get('/user/balance');
      if (response.data.success) {
        setBalance(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar saldo:', error);
    }
  }, []);

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current_page,
        per_page: pagination.per_page,
        type: 'cashback'
      });

      const response = await api.get(`/user/transactions?${params.toString()}`);
      
      if (response.data.success) {
        const transactionsData = response.data.data.data || response.data.data || [];
        setTransactions(transactionsData);
        setPagination({
          current_page: response.data.data.current_page || 1,
          last_page: response.data.data.last_page || 1,
          per_page: response.data.data.per_page || 15,
          total: response.data.data.total || 0
        });
      }
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.current_page, pagination.per_page]);

  useEffect(() => {
    if (user) {
      loadBalance();
      loadTransactions();
    }
  }, [user, loadBalance, loadTransactions]);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      setMessage({ type: 'error', text: 'Valor inválido' });
      return;
    }

    if (amount > parseFloat(balance.cashback_balance)) {
      setMessage({ type: 'error', text: 'Saldo insuficiente' });
      return;
    }

    try {
      setWithdrawing(true);
      setMessage({ type: '', text: '' });
      
      // TODO: Implementar endpoint de saque quando disponível
      // Por enquanto, apenas simular
      setMessage({ type: 'info', text: 'Funcionalidade de saque será implementada em breve.' });
      setWithdrawAmount('');
    } catch (error) {
      console.error('Erro ao processar saque:', error);
      setMessage({ type: 'error', text: 'Erro ao processar saque. Tente novamente.' });
    } finally {
      setWithdrawing(false);
    }
  };

  const formatPrice = (price) => {
    return `R$ ${parseFloat(price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const getTypeDescription = (transaction) => {
    if (transaction.type === 'cashback') {
      return transaction.description || 'Cashback de leilão';
    }
    if (transaction.type === 'withdrawal') {
      return 'Saque via Pix';
    }
    return transaction.description || transaction.type;
  };

  // Calcular totais
  const totalReceived = transactions
    .filter(t => t.type === 'cashback' && t.status === 'completed')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  
  const totalWithdrawn = transactions
    .filter(t => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  if (loading && transactions.length === 0) {
    return (
      <UserLayout>
        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <p style={{ color: '#8da4bf' }}>Carregando dados de cashback...</p>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Meu Cashback</h1>
          <p>Gerencie seu saldo e histórico</p>
        </div>
      </div>
      
      {message.text && (
        <div style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          borderRadius: '8px',
          background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : message.type === 'error' ? 'rgba(229, 95, 82, 0.1)' : 'rgba(74, 159, 216, 0.1)',
          border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : message.type === 'error' ? 'rgba(229, 95, 82, 0.3)' : 'rgba(74, 159, 216, 0.3)'}`,
          color: message.type === 'success' ? '#10b981' : message.type === 'error' ? '#E55F52' : '#4A9FD8'
        }}>
          {message.text}
        </div>
      )}

      <div className="cashback-balance-section">
        <div className="balance-card-main">
          <p className="balance-label">Saldo Disponível</p>
          <p className="balance-amount">{formatPrice(balance.cashback_balance)}</p>
        </div>
        <div className="balance-cards-secondary">
          <div className="balance-card-secondary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
              <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
            </svg>
            <div>
              <p className="balance-secondary-label">Total Recebido</p>
              <p className="balance-secondary-amount">{formatPrice(totalReceived)}</p>
            </div>
          </div>
          <div className="balance-card-secondary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <div>
              <p className="balance-secondary-label">Total Sacado</p>
              <p className="balance-secondary-amount">{formatPrice(totalWithdrawn)}</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleWithdraw} className="withdraw-section">
          <div className="withdraw-form">
            <label>Valor do saque</label>
            <div className="input-with-prefix">
              <span className="input-prefix">R$</span>
              <input 
                type="number" 
                placeholder="0,00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                step="0.01"
                min="0.01"
                max={balance.cashback_balance}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn-withdraw" disabled={withdrawing || parseFloat(balance.cashback_balance) <= 0}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="2" x2="12" y2="22"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            {withdrawing ? 'Processando...' : 'Sacar via Pix'}
          </button>
        </form>
      </div>
      <div className="info-card">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <div>
          <h4>Como funciona o Cashback?</h4>
          <p>Você ganha cashback em cada lance dado! A porcentagem varia de 3% a 10% dependendo do leilão. O valor é creditado automaticamente após o encerramento do leilão e pode ser sacado via Pix.</p>
        </div>
      </div>
      <div className="cashback-history-section">
        <div className="section-header-form">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18"></path>
            <path d="m19 9-5 5-4-4-3 3"></path>
          </svg>
          <h3>Extrato de Cashback</h3>
        </div>
        {transactions.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#8da4bf' }}>
            <p>Nenhuma transação de cashback encontrada.</p>
          </div>
        ) : (
          <>
            <div className="history-list">
              {transactions.map(item => (
                <div key={item.id} className="history-item">
                  <div className="history-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {item.type === 'cashback' ? (
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      ) : (
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      )}
                    </svg>
                  </div>
                  <div className="history-details">
                    <p className="history-description">{getTypeDescription(item)}</p>
                    <p className="history-date">{formatDate(item.created_at)}</p>
                  </div>
                  <div className={`history-amount ${item.type === 'cashback' ? 'credit' : 'debit'}`}>
                    {item.type === 'cashback' ? '+' : '-'} {formatPrice(item.amount)}
                  </div>
                </div>
              ))}
            </div>
            
            {pagination.last_page > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                <button 
                  onClick={() => setPagination({...pagination, current_page: pagination.current_page - 1})}
                  disabled={pagination.current_page === 1}
                  style={{ padding: '0.5rem 1rem', background: '#1a2942', border: '1px solid #2a3a52', color: '#e6eef8', borderRadius: '8px', cursor: pagination.current_page === 1 ? 'not-allowed' : 'pointer' }}
                >
                  Anterior
                </button>
                <span style={{ padding: '0.5rem 1rem', color: '#8da4bf' }}>
                  Página {pagination.current_page} de {pagination.last_page}
                </span>
                <button 
                  onClick={() => setPagination({...pagination, current_page: pagination.current_page + 1})}
                  disabled={pagination.current_page === pagination.last_page}
                  style={{ padding: '0.5rem 1rem', background: '#1a2942', border: '1px solid #2a3a52', color: '#e6eef8', borderRadius: '8px', cursor: pagination.current_page === pagination.last_page ? 'not-allowed' : 'pointer' }}
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </UserLayout>
  );
};
