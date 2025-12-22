import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';
import './Leiloes.css';

const Leiloes = () => {
  const [auctions, setAuctions] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAuction, setEditingAuction] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'draft',
    start_date: '',
    end_date: '',
    starting_bid: '',
    bid_increment: '1.00',
    min_bids: '0',
    cashback_percentage: '0',
    product_ids: []
  });

  useEffect(() => {
    loadAuctions();
  }, [filters, pagination.current_page]);

  const loadAuctions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current_page,
        per_page: pagination.per_page,
      });

      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);

      const response = await api.get(`/auctions?${params.toString()}`);
      
      if (response.data.success) {
        setAuctions(response.data.data.data);
        setPagination({
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          per_page: response.data.data.per_page,
          total: response.data.data.total
        });
      }
    } catch (error) {
      console.error('Erro ao carregar leilões:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar leilões' });
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await api.get('/products/available');
      
      if (response.data.success) {
        setAvailableProducts(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos disponíveis:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleOpenModal = async (auction = null) => {
    await loadAvailableProducts();
    
    if (auction) {
      setEditingAuction(auction);
      setFormData({
        title: auction.title || '',
        description: auction.description || '',
        status: auction.status || 'draft',
        start_date: auction.start_date ? new Date(auction.start_date).toISOString().slice(0, 16) : '',
        end_date: auction.end_date ? new Date(auction.end_date).toISOString().slice(0, 16) : '',
        starting_bid: auction.starting_bid || '',
        bid_increment: auction.bid_increment || '1.00',
        min_bids: auction.min_bids || '0',
        cashback_percentage: auction.cashback_percentage || '0',
        product_ids: auction.products ? auction.products.map(p => p.id) : []
      });
    } else {
      setEditingAuction(null);
      setFormData({
        title: '',
        description: '',
        status: 'draft',
        start_date: '',
        end_date: '',
        starting_bid: '',
        bid_increment: '1.00',
        min_bids: '0',
        cashback_percentage: '0',
        product_ids: []
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAuction(null);
    setMessage({ type: '', text: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductToggle = (productId) => {
    setFormData(prev => {
      const productIds = prev.product_ids;
      if (productIds.includes(productId)) {
        return {
          ...prev,
          product_ids: productIds.filter(id => id !== productId)
        };
      } else {
        return {
          ...prev,
          product_ids: [...productIds, productId]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    if (formData.product_ids.length === 0) {
      setMessage({ type: 'error', text: 'Selecione pelo menos um produto' });
      setSaving(false);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        starting_bid: parseFloat(formData.starting_bid),
        bid_increment: parseFloat(formData.bid_increment),
        min_bids: parseInt(formData.min_bids),
        cashback_percentage: parseFloat(formData.cashback_percentage),
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
      };

      let response;
      if (editingAuction) {
        response = await api.put(`/auctions/${editingAuction.id}`, dataToSend);
      } else {
        response = await api.post('/auctions', dataToSend);
      }

      if (response.data.success) {
        setMessage({ type: 'success', text: editingAuction ? 'Leilão atualizado com sucesso!' : 'Leilão criado com sucesso!' });
        handleCloseModal();
        loadAuctions();
      }
    } catch (error) {
      console.error('Erro ao salvar leilão:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao salvar leilão';
      const errors = error.response?.data?.errors;
      
      if (errors) {
        const firstError = Object.values(errors)[0];
        setMessage({ type: 'error', text: Array.isArray(firstError) ? firstError[0] : firstError });
      } else {
        setMessage({ type: 'error', text: errorMessage });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (auctionId) => {
    if (!window.confirm('Tem certeza que deseja deletar este leilão?')) {
      return;
    }

    try {
      const response = await api.delete(`/auctions/${auctionId}`);
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Leilão deletado com sucesso!' });
        loadAuctions();
      }
    } catch (error) {
      console.error('Erro ao deletar leilão:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao deletar leilão';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      draft: { label: 'Rascunho', class: 'status-draft' },
      scheduled: { label: 'Agendado', class: 'status-scheduled' },
      active: { label: 'Ativo', class: 'status-active' },
      paused: { label: 'Pausado', class: 'status-paused' },
      finished: { label: 'Finalizado', class: 'status-finished' },
      cancelled: { label: 'Cancelado', class: 'status-cancelled' }
    };

    const statusInfo = statusMap[status] || statusMap.draft;
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  return (
    <AdminLayout 
      pageTitle="Gerenciamento de Leilões" 
      pageSubtitle="Crie e gerencie leilões de produtos"
    >
      <div className="leiloes-page">
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="leiloes-header">
          <div className="filters-section">
            <div className="filter-group">
              <input
                type="text"
                placeholder="Buscar leilões..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="filter-select"
              >
                <option value="">Todos os status</option>
                <option value="draft">Rascunho</option>
                <option value="scheduled">Agendado</option>
                <option value="active">Ativo</option>
                <option value="paused">Pausado</option>
                <option value="finished">Finalizado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </div>
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Novo Leilão
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Carregando leilões...</p>
          </div>
        ) : (
          <>
            <div className="auctions-list">
              {auctions.length === 0 ? (
                <div className="empty-state">
                  Nenhum leilão encontrado
                </div>
              ) : (
                auctions.map(auction => (
                  <div key={auction.id} className="auction-card">
                    <div className="auction-header">
                      <div className="auction-title-section">
                        <h3 className="auction-title">{auction.title}</h3>
                        <div className="auction-meta">
                          {getStatusBadge(auction.status)}
                          <span className="auction-products-count">
                            {auction.products?.length || 0} produto(s)
                          </span>
                        </div>
                      </div>
                      <div className="auction-actions">
                        <button
                          className="btn-icon"
                          onClick={() => handleOpenModal(auction)}
                          title="Editar"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          className="btn-icon btn-icon-danger"
                          onClick={() => handleDelete(auction.id)}
                          title="Deletar"
                          disabled={['active', 'scheduled'].includes(auction.status)}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {auction.description && (
                      <p className="auction-description">{auction.description}</p>
                    )}

                    <div className="auction-details">
                      <div className="detail-item">
                        <span className="detail-label">Lance Inicial:</span>
                        <span className="detail-value">R$ {parseFloat(auction.starting_bid).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Lance Atual:</span>
                        <span className="detail-value">R$ {parseFloat(auction.current_bid).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Incremento:</span>
                        <span className="detail-value">R$ {parseFloat(auction.bid_increment).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      {auction.cashback_percentage > 0 && (
                        <div className="detail-item">
                          <span className="detail-label">Cashback:</span>
                          <span className="detail-value">{parseFloat(auction.cashback_percentage).toFixed(1)}%</span>
                        </div>
                      )}
                    </div>

                    {auction.start_date && (
                      <div className="auction-dates">
                        <div className="date-item">
                          <span className="date-label">Início:</span>
                          <span className="date-value">
                            {new Date(auction.start_date).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        {auction.end_date && (
                          <div className="date-item">
                            <span className="date-label">Fim:</span>
                            <span className="date-value">
                              {new Date(auction.end_date).toLocaleString('pt-BR')}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {auction.products && auction.products.length > 0 && (
                      <div className="auction-products">
                        <h4 className="products-title">Produtos no Leilão:</h4>
                        <div className="products-list">
                          {auction.products.map(product => (
                            <div key={product.id} className="product-tag">
                              {product.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {pagination.last_page > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setPagination({ ...pagination, current_page: pagination.current_page - 1 })}
                  disabled={pagination.current_page === 1}
                >
                  Anterior
                </button>
                <span className="pagination-info">
                  Página {pagination.current_page} de {pagination.last_page} ({pagination.total} total)
                </span>
                <button
                  className="pagination-btn"
                  onClick={() => setPagination({ ...pagination, current_page: pagination.current_page + 1 })}
                  disabled={pagination.current_page === pagination.last_page}
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingAuction ? 'Editar Leilão' : 'Novo Leilão'}</h2>
                <button className="modal-close" onClick={handleCloseModal}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="auction-form">
                <div className="form-group form-group-full">
                  <label>Título do Leilão *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Descrição</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="form-textarea"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="draft">Rascunho</option>
                      <option value="scheduled">Agendado</option>
                      <option value="active">Ativo</option>
                      <option value="paused">Pausado</option>
                      <option value="finished">Finalizado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Lance Inicial (R$) *</label>
                    <input
                      type="number"
                      name="starting_bid"
                      value={formData.starting_bid}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="form-input"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Data/Hora de Início</label>
                    <input
                      type="datetime-local"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Data/Hora de Fim</label>
                    <input
                      type="datetime-local"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Incremento de Lance (R$)</label>
                    <input
                      type="number"
                      name="bid_increment"
                      value={formData.bid_increment}
                      onChange={handleInputChange}
                      min="0.01"
                      step="0.01"
                      className="form-input"
                      placeholder="1.00"
                    />
                  </div>
                  <div className="form-group">
                    <label>Lances Mínimos</label>
                    <input
                      type="number"
                      name="min_bids"
                      value={formData.min_bids}
                      onChange={handleInputChange}
                      min="0"
                      className="form-input"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Cashback (%)</label>
                  <input
                    type="number"
                    name="cashback_percentage"
                    value={formData.cashback_percentage}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.1"
                    className="form-input"
                    placeholder="0"
                  />
                </div>

                <div className="form-group form-group-full">
                  <label>Selecionar Produtos *</label>
                  {loadingProducts ? (
                    <div className="loading-products">
                      <div className="spinner-small"></div>
                      Carregando produtos...
                    </div>
                  ) : availableProducts.length === 0 ? (
                    <div className="no-products">
                      Nenhum produto disponível. Crie produtos primeiro em <strong>Produtos</strong>.
                    </div>
                  ) : (
                    <div className="products-selection">
                      {availableProducts.map(product => (
                        <div
                          key={product.id}
                          className={`product-checkbox-item ${formData.product_ids.includes(product.id) ? 'selected' : ''}`}
                          onClick={() => handleProductToggle(product.id)}
                        >
                          <input
                            type="checkbox"
                            checked={formData.product_ids.includes(product.id)}
                            onChange={() => handleProductToggle(product.id)}
                            className="product-checkbox"
                          />
                          <div className="product-checkbox-info">
                            <span className="product-checkbox-name">{product.name}</span>
                            <span className="product-checkbox-price">
                              R$ {parseFloat(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {formData.product_ids.length > 0 && (
                    <div className="selected-count">
                      {formData.product_ids.length} produto(s) selecionado(s)
                    </div>
                  )}
                </div>

                {message.text && (
                  <div className={`form-message form-message-${message.type}`}>
                    {message.text}
                  </div>
                )}

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary" disabled={saving || formData.product_ids.length === 0}>
                    {saving ? (
                      <>
                        <div className="spinner-small"></div>
                        Salvando...
                      </>
                    ) : (
                      editingAuction ? 'Atualizar' : 'Criar'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Leiloes;

