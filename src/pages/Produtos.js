import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';
import './Produtos.css';

const Produtos = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    is_active: ''
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    price: '',
    image: null,
    additional_images: [],
    brand: '',
    model: '',
    specifications: {},
    is_active: true
  });

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current_page,
        per_page: pagination.per_page,
      });

      if (filters.search) params.append('search', filters.search);
      if (filters.category_id) params.append('category_id', filters.category_id);
      if (filters.is_active !== '') params.append('is_active', filters.is_active);

      const response = await api.get(`/products?${params.toString()}`);
      
      if (response.data.success) {
        setProducts(response.data.data.data);
        setPagination({
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          per_page: response.data.data.per_page,
          total: response.data.data.total
        });
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar produtos' });
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.current_page, pagination.per_page]);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts]);

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories?is_active=true');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category_id: product.category_id || '',
        price: product.price || '',
        image: null,
        additional_images: [],
        brand: product.brand || '',
        model: product.model || '',
        specifications: product.specifications || {},
        is_active: product.is_active !== undefined ? product.is_active : true
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        category_id: '',
        price: '',
        image: null,
        additional_images: [],
        brand: '',
        model: '',
        specifications: {},
        is_active: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setMessage({ type: '', text: '' });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      if (name === 'additional_images') {
        // Permitir múltiplos arquivos (até 5)
        const fileArray = Array.from(files);
        const maxImages = 5;
        const currentCount = formData.additional_images.length;
        const availableSlots = maxImages - currentCount;
        
        if (availableSlots <= 0) {
          setMessage({ type: 'error', text: 'Limite de 5 imagens adicionais atingido' });
          return;
        }
        
        const filesToAdd = fileArray.slice(0, availableSlots);
        setFormData(prev => ({
          ...prev,
          additional_images: [...prev.additional_images, ...filesToAdd]
        }));
        
        if (fileArray.length > availableSlots) {
          setMessage({ type: 'warning', text: `Apenas ${availableSlots} imagem(ns) foram adicionadas. Limite de 5 imagens.` });
        }
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: files[0] || null
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleRemoveAdditionalImage = (index) => {
    setFormData(prev => ({
      ...prev,
      additional_images: prev.additional_images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description || '');
      if (formData.category_id) formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('brand', formData.brand || '');
      formDataToSend.append('model', formData.model || '');
      // Converter boolean para string para FormData
      formDataToSend.append('is_active', formData.is_active ? '1' : '0');
      
      // Imagem principal
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      // Imagens adicionais (upload de arquivos)
      if (formData.additional_images && formData.additional_images.length > 0) {
        formData.additional_images.forEach((img, index) => {
          if (img instanceof File) {
            formDataToSend.append(`additional_images[${index}]`, img);
          }
        });
      }

      let response;
      if (editingProduct) {
        response = await api.put(`/products/${editingProduct.id}`, formDataToSend);
      } else {
        response = await api.post('/products', formDataToSend);
      }

      if (response.data.success) {
        setMessage({ type: 'success', text: editingProduct ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!' });
        handleCloseModal();
        loadProducts();
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao salvar produto';
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

  const handleDelete = async (productId) => {
    if (!window.confirm('Tem certeza que deseja deletar este produto?')) {
      return;
    }

    try {
      const response = await api.delete(`/products/${productId}`);
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Produto deletado com sucesso!' });
        loadProducts();
      }
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao deletar produto';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const getStatusBadge = (product) => {
    if (product.auction_id) {
      return <span className="badge badge-warning">Em Leilão</span>;
    }
    return product.is_active 
      ? <span className="status-badge active">Ativo</span>
      : <span className="status-badge inactive">Inativo</span>;
  };

  return (
    <AdminLayout 
      pageTitle="Gerenciamento de Produtos" 
      pageSubtitle="Cadastre e gerencie produtos para leilão"
    >
      <div className="produtos-page">
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="produtos-header">
          <div className="filters-section">
            <div className="filter-group">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <select
                value={filters.category_id}
                onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}
                className="filter-select"
              >
                <option value="">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <select
                value={filters.is_active}
                onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
                className="filter-select"
              >
                <option value="">Todos</option>
                <option value="true">Ativos</option>
                <option value="false">Inativos</option>
              </select>
            </div>
          </div>
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Novo Produto
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Carregando produtos...</p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {products.length === 0 ? (
                <div className="empty-state">
                  Nenhum produto encontrado
                </div>
              ) : (
                products.map(product => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} />
                      ) : (
                        <div className="product-image-placeholder">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                          </svg>
                        </div>
                      )}
                      {product.auction_id && (
                        <div className="product-auction-badge">
                          Em Leilão
                        </div>
                      )}
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-category">{product.categoryModel?.name || product.category || 'Sem categoria'}</p>
                      <p className="product-price">R$ {parseFloat(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      <div className="product-status">
                        {getStatusBadge(product)}
                      </div>
                    </div>
                    <div className="product-actions">
                      <button
                        className="btn-icon"
                        onClick={() => handleOpenModal(product)}
                        title="Editar"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        className="btn-icon btn-icon-danger"
                        onClick={() => handleDelete(product.id)}
                        title="Deletar"
                        disabled={product.auction_id}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
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
                <h2>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
                <button className="modal-close" onClick={handleCloseModal}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="product-form">
                <div className="form-row">
                  <div className="form-group form-group-full">
                    <label>Nome do Produto *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
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
                    <label>Categoria</label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">Selecione...</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Preço *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
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
                    <label>Marca</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Modelo</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Imagem Principal</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                    onChange={handleInputChange}
                    className="form-input"
                  />
                  {formData.image && (
                    <div className="image-preview">
                      <img src={URL.createObjectURL(formData.image)} alt="Preview" />
                    </div>
                  )}
                  {!formData.image && editingProduct && editingProduct.image_url && (
                    <div className="image-preview">
                      <img src={editingProduct.image_url.startsWith('http') ? editingProduct.image_url : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8000'}${editingProduct.image_url}`} alt="Preview" />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Imagens Adicionais (até 5 imagens)</label>
                  <input
                    type="file"
                    name="additional_images"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                    onChange={handleInputChange}
                    multiple
                    className="form-input"
                    disabled={formData.additional_images.length >= 5}
                  />
                  <p className="form-help">
                    Selecione até 5 imagens (máximo 5MB cada).
                    {formData.additional_images.length >= 5 && (
                      <span style={{ color: '#ffc107', fontWeight: '600', marginLeft: '0.5rem' }}> Limite atingido!</span>
                    )}
                  </p>
                  
                  {formData.additional_images && formData.additional_images.length > 0 && (
                    <div className="additional-images-preview">
                      {formData.additional_images.map((img, index) => (
                        <div key={index} className="additional-image-item">
                          <img 
                            src={URL.createObjectURL(img)} 
                            alt={`Preview ${index + 1}`}
                            className="additional-image-preview"
                          />
                          <button
                            type="button"
                            className="btn-remove-additional-image"
                            onClick={() => handleRemoveAdditionalImage(index)}
                            title="Remover imagem"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {formData.additional_images.length > 0 && (
                    <div className="images-count">
                      {formData.additional_images.length} de 5 imagens adicionais
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      id="is_active"
                    />
                    <label htmlFor="is_active">Produto ativo</label>
                  </div>
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
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? (
                      <>
                        <div className="spinner-small"></div>
                        Salvando...
                      </>
                    ) : (
                      editingProduct ? 'Atualizar' : 'Criar'
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

export default Produtos;
