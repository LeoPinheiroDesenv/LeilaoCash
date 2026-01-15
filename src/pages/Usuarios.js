import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';
import './Usuarios.css';

const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [availableScreens, setAvailableScreens] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filters, setFilters] = useState({
    search: '',
    user_type: '',
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
    email: '',
    password: '',
    cpf: '',
    phone: '',
    birth_date: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    user_type: 'common',
    permissions: [],
    is_active: true
  });

  useEffect(() => {
    loadUsers();
    loadAvailableScreens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.current_page]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current_page,
        per_page: pagination.per_page,
      });

      if (filters.search) params.append('search', filters.search);
      if (filters.user_type) params.append('user_type', filters.user_type);
      if (filters.is_active !== '') params.append('is_active', filters.is_active);

      const response = await api.get(`/users?${params.toString()}`);
      
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
      console.error('Erro ao carregar usuários:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar usuários' });
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableScreens = async () => {
    try {
      const response = await api.get('/users/screens');
      if (response.data.success) {
        setAvailableScreens(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar telas disponíveis:', error);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      // Formatar CPF e telefone ao editar
      const formatCPFForEdit = (cpf) => {
        if (!cpf) return '';
        const clean = cpf.replace(/\D/g, '');
        return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      };
      
      const formatPhoneForEdit = (phone) => {
        if (!phone) return '';
        const clean = phone.replace(/\D/g, '');
        if (clean.length === 11) {
          return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (clean.length === 10) {
          return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return phone;
      };

      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        cpf: formatCPFForEdit(user.cpf),
        phone: formatPhoneForEdit(user.phone),
        birth_date: user.birth_date || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zip_code: user.zip_code || '',
        user_type: user.user_type || 'common',
        permissions: user.permissions || [],
        is_active: user.is_active !== undefined ? user.is_active : true
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        cpf: '',
        phone: '',
        birth_date: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        user_type: 'common',
        permissions: [],
        is_active: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setMessage({ type: '', text: '' });
  };

  const formatCPF = (value) => {
    // Remove tudo que não é dígito e limita a 11 caracteres
    const cleaned = value.replace(/\D/g, '').slice(0, 11);
    // Aplica a máscara 000.000.000-00
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value) => {
    // Remove tudo que não é dígito e limita a 11 caracteres
    const cleaned = value.replace(/\D/g, '').slice(0, 11);
    // Aplica a máscara (00) 00000 0000
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2 $3');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let formattedValue = value;

    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'phone') {
      formattedValue = formatPhone(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : formattedValue
    }));

    // Limpar permissões se mudar para tipo que não precisa
    if (name === 'user_type' && value !== 'secondary') {
      setFormData(prev => ({
        ...prev,
        permissions: []
      }));
    }
  };

  const handlePermissionToggle = (screen) => {
    setFormData(prev => {
      const permissions = prev.permissions || [];
      const newPermissions = permissions.includes(screen)
        ? permissions.filter(p => p !== screen)
        : [...permissions, screen];
      
      return {
        ...prev,
        permissions: newPermissions
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const dataToSend = { ...formData };
      
      // Remover formatação de CPF e telefone antes de enviar
      if (dataToSend.cpf) {
        dataToSend.cpf = dataToSend.cpf.replace(/\D/g, '');
      }
      if (dataToSend.phone) {
        dataToSend.phone = dataToSend.phone.replace(/\D/g, '');
      }
      
      // Não enviar senha se estiver vazia (edição)
      if (editingUser && !dataToSend.password) {
        delete dataToSend.password;
      }

      // Garantir que campos vazios sejam null ao invés de string vazia
      if (dataToSend.cpf && dataToSend.cpf.trim() === '') {
        dataToSend.cpf = null;
      }
      if (dataToSend.phone && dataToSend.phone.trim() === '') {
        dataToSend.phone = null;
      }

      // Garantir que is_active é boolean
      if (typeof dataToSend.is_active === 'undefined') {
        dataToSend.is_active = true;
      } else {
        dataToSend.is_active = Boolean(dataToSend.is_active);
      }

      let response;
      if (editingUser) {
        response = await api.put(`/users/${editingUser.id}`, dataToSend);
      } else {
        response = await api.post('/users', dataToSend);
      }

      if (response.data.success) {
        setMessage({ type: 'success', text: editingUser ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!' });
        handleCloseModal();
        loadUsers();
      }
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao salvar usuário';
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

  const handleDelete = async (userId) => {
    if (!window.confirm('Tem certeza que deseja deletar este usuário?')) {
      return;
    }

    try {
      const response = await api.delete(`/users/${userId}`);
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Usuário deletado com sucesso!' });
        loadUsers();
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao deletar usuário';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const getUserTypeLabel = (type) => {
    const labels = {
      principal: 'Admin Principal',
      secondary: 'Admin Secundário',
      common: 'Usuário Comum'
    };
    return labels[type] || type;
  };

  const getUserTypeBadgeClass = (type) => {
    const classes = {
      principal: 'badge-primary',
      secondary: 'badge-secondary',
      common: 'badge-common'
    };
    return classes[type] || '';
  };

  return (
    <AdminLayout 
      pageTitle="Gerenciamento de Usuários" 
      pageSubtitle="Cadastre, edite e gerencie usuários da plataforma"
    >
      <div className="usuarios-page">
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="usuarios-header">
          <div className="filters-section">
            <div className="filter-group">
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <select
                value={filters.user_type}
                onChange={(e) => setFilters({ ...filters, user_type: e.target.value })}
                className="filter-select"
              >
                <option value="">Todos os tipos</option>
                <option value="principal">Admin Principal</option>
                <option value="secondary">Admin Secundário</option>
                <option value="common">Usuário Comum</option>
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
            Novo Usuário
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Carregando usuários...</p>
          </div>
        ) : (
          <>
            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Tipo</th>
                    <th>Status</th>
                    <th>Cadastrado em</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        Nenhum usuário encontrado
                      </td>
                    </tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-info-cell">
                            <div className="user-avatar-small">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${getUserTypeBadgeClass(user.user_type)}`}>
                            {getUserTypeLabel(user.user_type)}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                            {user.is_active ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td>{new Date(user.created_at).toLocaleDateString('pt-BR')}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-icon"
                              onClick={() => handleOpenModal(user)}
                              title="Editar"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>
                            <button
                              className="btn-icon btn-icon-danger"
                              onClick={() => handleDelete(user.id)}
                              title="Deletar"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h2>
                <button className="modal-close" onClick={handleCloseModal}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="user-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nome Completo *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Senha {!editingUser && '*'}</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!editingUser}
                      minLength={8}
                      className="form-input"
                      placeholder={editingUser ? 'Deixe em branco para manter a senha atual' : ''}
                    />
                  </div>
                  <div className="form-group">
                    <label>CPF</label>
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Telefone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div className="form-group">
                    <label>Data de Nascimento</label>
                    <input
                      type="date"
                      name="birth_date"
                      value={formData.birth_date}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Endereço</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Cidade</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Estado</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      maxLength={2}
                      className="form-input"
                      placeholder="SP"
                    />
                  </div>
                  <div className="form-group">
                    <label>CEP</label>
                    <input
                      type="text"
                      name="zip_code"
                      value={formData.zip_code}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="00000-000"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo de Usuário *</label>
                    <select
                      name="user_type"
                      value={formData.user_type}
                      onChange={handleInputChange}
                      required
                      className="form-select"
                    >
                      <option value="common">Usuário Comum</option>
                      <option value="secondary">Administrador Secundário</option>
                      <option value="principal">Administrador Principal</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        id="is_active"
                      />
                      <label htmlFor="is_active">Usuário ativo</label>
                    </div>
                  </div>
                </div>

                {formData.user_type === 'secondary' && (
                  <div className="form-group permissions-section">
                    <label>Permissões de Acesso *</label>
                    <p className="permissions-description">
                      Selecione as telas que este administrador secundário poderá acessar:
                    </p>
                    <div className="permissions-grid">
                      {Object.entries(availableScreens).map(([key, label]) => (
                        <div key={key} className="permission-item">
                          <input
                            type="checkbox"
                            id={`permission-${key}`}
                            checked={formData.permissions.includes(key)}
                            onChange={() => handlePermissionToggle(key)}
                          />
                          <label htmlFor={`permission-${key}`}>{label}</label>
                        </div>
                      ))}
                    </div>
                    {formData.permissions.length === 0 && (
                      <p className="form-error">Selecione pelo menos uma permissão</p>
                    )}
                  </div>
                )}

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
                      editingUser ? 'Atualizar' : 'Criar'
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

export default Usuarios;

