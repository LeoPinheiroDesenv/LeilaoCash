import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';
import Modal from '../components/Modal';
import './DashboardAdmin.css';

const DashboardAdminMarcas = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({ name: '', is_active: true });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadBrands();
  }, [search]);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      
      const response = await api.get(`/brands?${params.toString()}`);
      if (response.data.success) {
        setBrands(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar marcas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (brand = null) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({ name: brand.name, is_active: brand.is_active });
    } else {
      setEditingBrand(null);
      setFormData({ name: '', is_active: true });
    }
    setShowModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBrand(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingBrand) {
        response = await api.put(`/brands/${editingBrand.id}`, formData);
      } else {
        response = await api.post('/brands', formData);
      }

      if (response.data.success) {
        setMessage({ type: 'success', text: editingBrand ? 'Marca atualizada com sucesso!' : 'Marca criada com sucesso!' });
        loadBrands();
        setTimeout(handleCloseModal, 1500);
      }
    } catch (error) {
      console.error('Erro ao salvar marca:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erro ao salvar marca' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta marca?')) return;

    try {
      const response = await api.delete(`/brands/${id}`);
      if (response.data.success) {
        loadBrands();
      }
    } catch (error) {
      console.error('Erro ao excluir marca:', error);
      alert(error.response?.data?.message || 'Erro ao excluir marca');
    }
  };

  return (
    <AdminLayout pageTitle="Marcas" pageSubtitle="Gerencie as marcas dos produtos">
      <div className="content-header">
        <div><h1 className="page-title">Marcas</h1></div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Buscar marca..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="search-input"
          />
          <button className="btn-primary" onClick={() => handleOpenModal()}>Nova Marca</button>
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
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {brands.map(brand => (
                <tr key={brand.id}>
                  <td>{brand.name}</td>
                  <td>
                    <span className={`status-badge ${brand.is_active ? 'active' : 'inactive'}`}>
                      {brand.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => handleOpenModal(brand)} title="Editar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(brand.id)} title="Excluir">
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

      <Modal isOpen={showModal} onClose={handleCloseModal} title={editingBrand ? 'Editar Marca' : 'Nova Marca'}>
        <form onSubmit={handleSubmit} className="admin-form">
          {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
          <div className="form-group">
            <label>Nome da Marca</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
              className="form-input"
            />
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

export default DashboardAdminMarcas;
