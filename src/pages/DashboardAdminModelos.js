import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';
import Modal from '../components/Modal';
import './DashboardAdmin.css';

const DashboardAdminModelos = () => {
  const [models, setModels] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [formData, setFormData] = useState({ name: '', brand_id: '', is_active: true });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadModels();
    loadBrands();
  }, [search]);

  const loadModels = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      
      const response = await api.get(`/models?${params.toString()}`);
      if (response.data.success) {
        setModels(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar modelos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBrands = async () => {
    try {
      const response = await api.get('/brands?is_active=true');
      if (response.data.success) {
        setBrands(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar marcas:', error);
    }
  };

  const handleOpenModal = (model = null) => {
    if (model) {
      setEditingModel(model);
      setFormData({ name: model.name, brand_id: model.brand_id, is_active: model.is_active });
    } else {
      setEditingModel(null);
      setFormData({ name: '', brand_id: '', is_active: true });
    }
    setShowModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingModel(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingModel) {
        response = await api.put(`/models/${editingModel.id}`, formData);
      } else {
        response = await api.post('/models', formData);
      }

      if (response.data.success) {
        setMessage({ type: 'success', text: editingModel ? 'Modelo atualizado com sucesso!' : 'Modelo criado com sucesso!' });
        loadModels();
        setTimeout(handleCloseModal, 1500);
      }
    } catch (error) {
      console.error('Erro ao salvar modelo:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erro ao salvar modelo' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este modelo?')) return;

    try {
      const response = await api.delete(`/models/${id}`);
      if (response.data.success) {
        loadModels();
      }
    } catch (error) {
      console.error('Erro ao excluir modelo:', error);
      alert(error.response?.data?.message || 'Erro ao excluir modelo');
    }
  };

  return (
    <AdminLayout pageTitle="Modelos" pageSubtitle="Gerencie os modelos dos produtos">
      <div className="content-header">
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Buscar modelo..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="search-input"
          />
          <button className="btn-primary" onClick={() => handleOpenModal()}>Novo Modelo</button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner"></div></div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Marca</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {models.map(model => (
                <tr key={model.id}>
                  <td>{model.name}</td>
                  <td>{model.brand?.name}</td>
                  <td>
                    <span className={`status-badge ${model.is_active ? 'active' : 'inactive'}`}>
                      {model.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => handleOpenModal(model)} title="Editar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(model.id)} title="Excluir">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={handleCloseModal} title={editingModel ? 'Editar Modelo' : 'Novo Modelo'}>
        <form onSubmit={handleSubmit} className="admin-form">
          {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
          <div className="form-group">
            <label>Nome do Modelo</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Marca</label>
            <select 
              value={formData.brand_id} 
              onChange={(e) => setFormData({...formData, brand_id: e.target.value})} 
              required 
              className="form-select"
            >
              <option value="">Selecione uma marca</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={formData.is_active} 
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})} 
              />
              <span>Ativo</span>
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancelar</button>
            <button type="submit" className="btn-primary">Salvar</button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default DashboardAdminModelos;
