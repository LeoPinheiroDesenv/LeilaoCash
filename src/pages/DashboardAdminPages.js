import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import Countdown from '../components/Countdown';
import api from '../services/api';
import '../pages/DashboardAdmin.css';

const users = [
  { id: 1, name: 'João Silva', email: 'joao@email.com', cashback: 'R$ 1250.50', bids: '47', status: 'active' },
  { id: 2, name: 'Maria Santos', email: 'maria@email.com', cashback: 'R$ 890.25', bids: '32', status: 'active' },
  { id: 3, name: 'Carlos Oliveira', email: 'carlos@email.com', cashback: 'R$ 2100.00', bids: '89', status: 'active' },
  { id: 4, name: 'Ana Costa', email: 'ana@email.com', cashback: 'R$ 450.75', bids: '15', status: 'inactive' }
];

const products = [
  { id: 1, name: 'iPhone 15 Pro Max 256GB', category: 'smartphones', price: 'R$ 9.999', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800' },
  { id: 2, name: 'MacBook Pro M3 14"', category: 'notebooks', price: 'R$ 16.999', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800' },
  { id: 3, name: 'PlayStation 5 Digital', category: 'games', price: 'R$ 3.999', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800' },
  { id: 4, name: 'Apple Watch Ultra 2', category: 'wearables', price: 'R$ 9.499', image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800' },
  { id: 5, name: 'Samsung Galaxy S24 Ultra', category: 'smartphones', price: 'R$ 8.999', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800' },
  { id: 6, name: 'DJI Mini 4 Pro', category: 'drones', price: 'R$ 7.499', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800' },
  { id: 7, name: 'Sony WH-1000XM5', category: 'audio', price: 'R$ 2.499', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800' },
  { id: 8, name: 'iPad Pro M4 12.9"', category: 'tablets', price: 'R$ 13.999', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800' }
];

export const DashboardAdminUsuarios = () => (
  <AdminLayout pageTitle="Usuários" pageSubtitle="Visualize e gerencie todos os usuários da plataforma">
    <div className="content-header">
      <div>
        <h1 className="page-title">Usuários</h1>
      </div>
      <button className="btn-export">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Exportar
      </button>
    </div>
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Email</th>
            <th>Cashback</th>
            <th>Lances</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                <div className="user-cell">
                  <div className="user-avatar-small">{(user.name.split(' ')[0][0] + user.name.split(' ')[1][0]).toUpperCase()}</div>
                  <span>{user.name}</span>
                </div>
              </td>
              <td>{user.email}</td>
              <td>{user.cashback}</td>
              <td>{user.bids}</td>
              <td>
                <span className={`status-badge ${user.status}`}>{user.status}</span>
              </td>
              <td>
                <div className="action-buttons">
                  <button className="btn-icon" title="Editar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button className="btn-icon" title="Excluir">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </AdminLayout>
);

export const DashboardAdminProdutos = () => (
  <AdminLayout pageTitle="Produtos" pageSubtitle="Gerencie o catálogo de produtos disponíveis para leilão">
    <div className="content-header">
      <div>
        <h1 className="page-title">Produtos</h1>
      </div>
      <button className="btn-new-product">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Novo Produto
      </button>
    </div>
    <div className="products-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <div className="product-image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="product-info">
            <h3>{product.name}</h3>
            <div className="product-meta">
              <span className="product-category">{product.category}</span>
              <span className="product-price">{product.price}</span>
            </div>
            <div className="product-actions">
              <button className="btn-edit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Editar
              </button>
              <button className="btn-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </AdminLayout>
);

const auctions = [
  { id: 1, name: 'iPhone 15 Pro Max 256GB', price: 'R$ 4523.00', bids: '892', timer: '01:59:50', status: 'active', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800' },
  { id: 2, name: 'MacBook Pro M3 14"', price: 'R$ 8234.50', bids: '1205', timer: '00:59:50', status: 'active', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800' },
  { id: 3, name: 'PlayStation 5 Digital', price: 'R$ 1890.00', bids: '456', timer: '03:59:50', status: 'active', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800' },
  { id: 4, name: 'Apple Watch Ultra 2', price: 'R$ 3456.00', bids: '678', timer: '00:29:50', status: 'active', image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800' },
  { id: 5, name: 'Samsung Galaxy S24 Ultra', price: 'R$ 5678.50', bids: '934', timer: '01:29:50', status: 'active', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800' },
  { id: 6, name: 'DJI Mini 4 Pro', price: 'R$ 2345.00', bids: '312', timer: '02:59:50', status: 'active', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800' },
  { id: 7, name: 'Sony WH-1000XM5', price: 'R$ 890.50', bids: '178', timer: '04:59:50', status: 'active', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800' },
  { id: 8, name: 'iPad Pro M4 12.9"', price: 'R$ 7890.00', bids: '1567', timer: '00:14:50', status: 'active', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800' }
];

// Dados estáticos removidos - agora buscamos da API

export const DashboardAdminLeiloes = () => (
  <AdminLayout pageTitle="Leilões" pageSubtitle="Gerencie todos os leilões ativos e finalizados">
    <div className="content-header">
      <div>
        <h1 className="page-title">Leilões</h1>
      </div>
      <button className="btn-new-product">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Novo Leilão
      </button>
    </div>
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Preço Atual</th>
            <th>Lances</th>
            <th>Tempo</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {auctions.map(auction => (
            <tr key={auction.id}>
              <td>
                <div className="user-cell">
                  <img src={auction.image} alt={auction.name} className="table-product-image" />
                  <span>{auction.name}</span>
                </div>
              </td>
              <td>{auction.price}</td>
              <td>{auction.bids}</td>
              <td>
                <div className="timer-inline">
                  <Countdown timeString={auction.timer} />
                </div>
              </td>
              <td>
                <span className={`status-badge ${auction.status}`}>{auction.status}</span>
              </td>
              <td>
                <div className="action-buttons">
                  <button className="btn-icon" title="Editar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button className="btn-icon" title="Excluir">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </AdminLayout>
);

export const DashboardAdminLances = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 15, total: 0 });
  const [filters, setFilters] = useState({ user_id: '', auction_id: '', is_winning: '' });

  useEffect(() => {
    loadBids();
  }, [pagination.current_page, filters]);

  const loadBids = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current_page,
        per_page: pagination.per_page,
      });

      if (filters.user_id) params.append('user_id', filters.user_id);
      if (filters.auction_id) params.append('auction_id', filters.auction_id);
      if (filters.is_winning !== '') params.append('is_winning', filters.is_winning);

      const response = await api.get(`/bids?${params.toString()}`);
      
      if (response.data.success) {
        setBids(response.data.data.data);
        setPagination({
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          per_page: response.data.data.per_page,
          total: response.data.data.total
        });
      }
    } catch (error) {
      console.error('Erro ao carregar lances:', error);
    } finally {
      setLoading(false);
    }
  };

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
    return `R$ ${parseFloat(price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <AdminLayout pageTitle="Lances" pageSubtitle="Visualize e gerencie todos os lances realizados">
      <div className="content-header">
        <div>
          <h1 className="page-title">Histórico de Lances</h1>
        </div>
      </div>
      
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#8da4bf' }}>Carregando lances...</p>
        </div>
      ) : bids.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#8da4bf' }}>Nenhum lance encontrado.</p>
        </div>
      ) : (
        <>
          <div className="bids-list-admin">
            {bids.map(bid => (
              <div key={bid.id} className="bid-item-admin">
                <div className="bid-user-info">
                  <div className="user-avatar-small">{getInitials(bid.user?.name)}</div>
                  <div>
                    <p className="bid-user-name">{bid.user?.name || 'Usuário desconhecido'}</p>
                    <p className="bid-date-small">{formatDate(bid.created_at)}</p>
                    {bid.auction && <p style={{ fontSize: '0.85rem', color: '#8da4bf', marginTop: '0.25rem' }}>{bid.auction.title}</p>}
                  </div>
                </div>
                <div className="bid-amount-admin">
                  {formatPrice(bid.amount)}
                  {bid.is_winning && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#4A9FD8' }}>🏆</span>}
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
    </AdminLayout>
  );
};

export const DashboardAdminCashback = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 15, total: 0 });
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadCashbackUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current_page, search]);

  const loadCashbackUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current_page,
        per_page: pagination.per_page,
      });

      if (search) params.append('search', search);

      const response = await api.get(`/reports/cashback-by-user?${params.toString()}`);
      
      if (response.data.success) {
        setUsers(response.data.data.data);
        setPagination({
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          per_page: response.data.data.per_page,
          total: response.data.data.total
        });
      }
    } catch (error) {
      console.error('Erro ao carregar cashback:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `R$ ${parseFloat(price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <AdminLayout pageTitle="Cashback" pageSubtitle="Gerencie o sistema de cashback e pagamentos">
      <div className="content-header">
        <div>
          <h1 className="page-title">Gestão de Cashback</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Buscar usuário..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination({...pagination, current_page: 1});
            }}
            style={{ padding: '0.5rem 1rem', background: '#1a2942', border: '1px solid #2a3a52', borderRadius: '8px', color: '#e6eef8', minWidth: '250px' }}
          />
        </div>
      </div>
      
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#8da4bf' }}>Carregando dados de cashback...</p>
        </div>
      ) : users.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#8da4bf' }}>Nenhum usuário encontrado.</p>
        </div>
      ) : (
        <>
          <div className="cashback-users-grid">
            {users.map(user => (
              <div key={user.id} className="cashback-user-card">
                <div className="user-avatar-small">{getInitials(user.name)}</div>
                <h3>{user.name}</h3>
                <p style={{ fontSize: '0.9rem', color: '#8da4bf', marginBottom: '1rem' }}>{user.email}</p>
                <div className="cashback-amount-display">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
                  </svg>
                  <span>{formatPrice(user.total_cashback)}</span>
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#8da4bf' }}>
                  <p>Saldo atual: {formatPrice(user.current_balance)}</p>
                  <p>Total sacado: {formatPrice(user.total_withdrawn)}</p>
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
    </AdminLayout>
  );
};

export const DashboardAdminTransacoes = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 15, total: 0 });
  const [filters, setFilters] = useState({ type: '', status: '' });

  useEffect(() => {
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current_page, filters.type, filters.status]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current_page,
        per_page: pagination.per_page,
      });

      if (filters.type) params.append('type', filters.type);
      if (filters.status) params.append('status', filters.status);

      const response = await api.get(`/transactions?${params.toString()}`);
      
      if (response.data.success) {
        setTransactions(response.data.data.data);
        setPagination({
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          per_page: response.data.data.per_page,
          total: response.data.data.total
        });
      }
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return `R$ ${parseFloat(price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getTypeLabel = (type) => {
    const types = {
      'bid_purchase': 'Compra de Lance',
      'cashback': 'Cashback',
      'withdrawal': 'Saque',
      'deposit': 'Depósito',
      'refund': 'Reembolso'
    };
    return types[type] || type;
  };

  return (
    <AdminLayout pageTitle="Transações" pageSubtitle="Visualize todas as transações financeiras">
      <div className="content-header">
        <div>
          <h1 className="page-title">Transações</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select
            value={filters.type}
            onChange={(e) => {
              setFilters({...filters, type: e.target.value});
              setPagination({...pagination, current_page: 1});
            }}
            style={{ padding: '0.5rem 1rem', background: '#1a2942', border: '1px solid #2a3a52', borderRadius: '8px', color: '#e6eef8' }}
          >
            <option value="">Todos os tipos</option>
            <option value="bid_purchase">Compra de Lance</option>
            <option value="cashback">Cashback</option>
            <option value="withdrawal">Saque</option>
            <option value="deposit">Depósito</option>
            <option value="refund">Reembolso</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => {
              setFilters({...filters, status: e.target.value});
              setPagination({...pagination, current_page: 1});
            }}
            style={{ padding: '0.5rem 1rem', background: '#1a2942', border: '1px solid #2a3a52', borderRadius: '8px', color: '#e6eef8' }}
          >
            <option value="">Todos os status</option>
            <option value="pending">Pendente</option>
            <option value="completed">Concluída</option>
            <option value="failed">Falhou</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#8da4bf' }}>Carregando transações...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#8da4bf' }}>Nenhuma transação encontrada.</p>
        </div>
      ) : (
        <>
          <div className="transactions-list">
            {transactions.map(transaction => (
              <div key={transaction.id} className="transaction-card">
                <div className="transaction-user-info">
                  <div className="user-avatar-small">{getInitials(transaction.user?.name)}</div>
                  <div>
                    <p className="transaction-user-name">{transaction.user?.name || 'Usuário desconhecido'}</p>
                    <p className="transaction-type">{getTypeLabel(transaction.type)}</p>
                    <p style={{ fontSize: '0.85rem', color: '#8da4bf', marginTop: '0.25rem' }}>{formatDate(transaction.created_at)}</p>
                  </div>
                </div>
                <div className="transaction-details">
                  <div className="transaction-amount">{formatPrice(transaction.amount)}</div>
                  <span className={`status-badge ${transaction.status}`}>{transaction.status}</span>
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
    </AdminLayout>
  );
};

export const DashboardAdminRelatorios = () => {
  const [generalReport, setGeneralReport] = useState(null);
  const [todayMetrics, setTodayMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const [generalResponse, todayResponse] = await Promise.all([
        api.get('/reports/general'),
        api.get('/reports/today')
      ]);

      if (generalResponse.data.success) {
        setGeneralReport(generalResponse.data.data);
      }

      if (todayResponse.data.success) {
        setTodayMetrics(todayResponse.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `R$ ${parseFloat(price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatNumber = (num) => {
    return parseFloat(num || 0).toLocaleString('pt-BR');
  };

  return (
    <AdminLayout pageTitle="Relatórios" pageSubtitle="Acesse relatórios e análises da plataforma">
      <div className="content-header">
        <div>
          <h1 className="page-title">Relatórios</h1>
        </div>
      </div>
      
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#8da4bf' }}>Carregando relatórios...</p>
        </div>
      ) : (
        <div className="reports-sections">
          <div className="report-section-card">
            <div className="report-section-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"></path>
                <path d="m19 9-5 5-4-4-3 3"></path>
              </svg>
              <h3>Resumo Geral</h3>
            </div>
            <div className="report-metrics">
              <div className="report-metric-item">
                <p className="report-metric-label">Total Usuários</p>
                <p className="report-metric-value">{formatNumber(generalReport?.total_users)}</p>
              </div>
              <div className="report-metric-item">
                <p className="report-metric-label">Usuários Ativos</p>
                <p className="report-metric-value">{formatNumber(generalReport?.active_users)}</p>
              </div>
              <div className="report-metric-item">
                <p className="report-metric-label">Leilões Finalizados</p>
                <p className="report-metric-value">{formatNumber(generalReport?.finished_auctions)}</p>
              </div>
              <div className="report-metric-item">
                <p className="report-metric-label">Leilões Ativos</p>
                <p className="report-metric-value">{formatNumber(generalReport?.active_auctions)}</p>
              </div>
              <div className="report-metric-item">
                <p className="report-metric-label">Total de Lances</p>
                <p className="report-metric-value">{formatNumber(generalReport?.total_bids)}</p>
              </div>
              <div className="report-metric-item">
                <p className="report-metric-label">Receita Total</p>
                <p className="report-metric-value">{formatPrice(generalReport?.total_revenue)}</p>
              </div>
              <div className="report-metric-item">
                <p className="report-metric-label">Cashback Total</p>
                <p className="report-metric-value">{formatPrice(generalReport?.total_cashback)}</p>
              </div>
              <div className="report-metric-item">
                <p className="report-metric-label">Saques Pendentes</p>
                <p className="report-metric-value">{formatNumber(generalReport?.pending_withdrawals)}</p>
              </div>
              <div className="report-metric-item">
                <p className="report-metric-label">Valor Pendente</p>
                <p className="report-metric-value">{formatPrice(generalReport?.pending_withdrawals_amount)}</p>
              </div>
            </div>
          </div>
          <div className="report-section-card">
            <div className="report-section-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <h3>Métricas de Hoje</h3>
            </div>
            <div className="report-metrics">
              <div className="report-metric-item">
                <p className="report-metric-label">Lances Hoje</p>
                <p className="report-metric-value">{formatNumber(todayMetrics?.bids_today)}</p>
              </div>
              <div className="report-metric-item">
                <p className="report-metric-label">Lances Ontem</p>
                <p className="report-metric-value">{formatNumber(todayMetrics?.bids_yesterday)}</p>
              </div>
              <div className="report-metric-item">
                <p className="report-metric-label">Novos Usuários Hoje</p>
                <p className="report-metric-value">{formatNumber(todayMetrics?.new_users_today)}</p>
              </div>
              <div className="report-metric-item">
                <p className="report-metric-label">Novos Usuários Ontem</p>
                <p className="report-metric-value">{formatNumber(todayMetrics?.new_users_yesterday)}</p>
              </div>
              <div className="report-metric-item">
                <p className="report-metric-label">Saques Pendentes</p>
                <p className="report-metric-value">{formatNumber(todayMetrics?.pending_withdrawals)}</p>
              </div>
              <div className="report-metric-item">
                <p className="report-metric-label">Receita Hoje</p>
                <p className="report-metric-value">{formatPrice(todayMetrics?.revenue_today)}</p>
              </div>
              <div className="report-metric-item">
                <p className="report-metric-label">Cashback Hoje</p>
                <p className="report-metric-value">{formatPrice(todayMetrics?.cashback_today)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
