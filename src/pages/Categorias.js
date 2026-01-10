import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';
import './Categorias.css';

const Categorias = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filters, setFilters] = useState({
    search: '',
    is_active: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    is_active: true,
    sort_order: 0
  });

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.search) params.append('search', filters.search);
      if (filters.is_active !== '') params.append('is_active', filters.is_active);

      const response = await api.get(`/categories?${params.toString()}`);
      
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar categorias' });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        icon: category.icon || '',
        is_active: category.is_active !== undefined ? category.is_active : true,
        sort_order: category.sort_order || 0
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        icon: '',
        is_active: true,
        sort_order: 0
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setMessage({ type: '', text: '' });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const dataToSend = {
        ...formData,
        sort_order: parseInt(formData.sort_order) || 0
      };

      // Se o slug estiver vazio, não enviar (será gerado automaticamente pelo backend)
      if (!dataToSend.slug || dataToSend.slug.trim() === '') {
        delete dataToSend.slug;
      }

      // Garantir que is_active é boolean
      dataToSend.is_active = Boolean(dataToSend.is_active);

      let response;
      if (editingCategory) {
        response = await api.put(`/categories/${editingCategory.id}`, dataToSend);
      } else {
        response = await api.post('/categories', dataToSend);
      }

      if (response.data.success) {
        setMessage({ type: 'success', text: editingCategory ? 'Categoria atualizada com sucesso!' : 'Categoria criada com sucesso!' });
        handleCloseModal();
        loadCategories();
      }
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao salvar categoria';
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

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Tem certeza que deseja deletar esta categoria?')) {
      return;
    }

    try {
      const response = await api.delete(`/categories/${categoryId}`);
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Categoria deletada com sucesso!' });
        loadCategories();
      }
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao deletar categoria';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  return (
    <AdminLayout 
      pageTitle="Gerenciamento de Categorias" 
      pageSubtitle="Cadastre e gerencie categorias de produtos"
    >
      <div className="categorias-page">
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="categorias-header">
          <div className="filters-section">
            <div className="filter-group">
              <input
                type="text"
                placeholder="Buscar categorias..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <select
                value={filters.is_active}
                onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
                className="filter-select"
              >
                <option value="">Todas</option>
                <option value="true">Ativas</option>
                <option value="false">Inativas</option>
              </select>
            </div>
          </div>
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Nova Categoria
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Carregando categorias...</p>
          </div>
        ) : (
          <div className="categories-grid">
            {categories.length === 0 ? (
              <div className="empty-state">
                Nenhuma categoria encontrada
              </div>
            ) : (
              categories.map(category => (
                <div key={category.id} className="category-card">
                  <div className="category-header">
                    <div className="category-icon">{category.icon || '📦'}</div>
                    <div className="category-info">
                      <h3 className="category-name">{category.name}</h3>
                      <p className="category-slug">/{category.slug}</p>
                    </div>
                    <div className="category-status">
                      {category.is_active 
                        ? <span className="status-badge active">Ativa</span>
                        : <span className="status-badge inactive">Inativa</span>
                      }
                    </div>
                  </div>
                  {category.description && (
                    <p className="category-description">{category.description}</p>
                  )}
                  <div className="category-footer">
                    <span className="category-order">Ordem: {category.sort_order}</span>
                    <div className="category-actions">
                      <button
                        className="btn-icon"
                        onClick={() => handleOpenModal(category)}
                        title="Editar"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        className="btn-icon btn-icon-danger"
                        onClick={() => handleDelete(category.id)}
                        title="Deletar"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h2>
                <button className="modal-close" onClick={handleCloseModal}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="category-form">
                <div className="form-group form-group-full">
                  <label>Nome da Categoria *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group form-group-full">
                  <label>Slug (URL amigável)</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="sera-gerado-automaticamente"
                  />
                  <p className="form-help">Deixe em branco para gerar automaticamente a partir do nome</p>
                </div>

                <div className="form-group form-group-full">
                  <label>Descrição</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="form-textarea"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ícone (Emoji ou texto)</label>
                    <input
                      type="text"
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="📦"
                      maxLength="10"
                    />
                  </div>
                  <div className="form-group">
                    <label>Ordem de Exibição</label>
                    <input
                      type="number"
                      name="sort_order"
                      value={formData.sort_order}
                      onChange={handleInputChange}
                      min="0"
                      className="form-input"
                      placeholder="0"
                    />
                  </div>
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
                    <label htmlFor="is_active">Categoria ativa</label>
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
                      editingCategory ? 'Atualizar' : 'Criar'
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

export default Categorias;
