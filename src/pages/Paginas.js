import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import TextEditor from '../components/TextEditor';
import api from '../services/api';
import './Paginas.css';

const Paginas = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingPage, setEditingPage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('pt');
  const [form, setForm] = useState({
    title: '', title_en: '', title_es: '',
    slug: '',
    content_pt: '', content_en: '', content_es: '',
    section: 'quick_links',
    sort_order: 0,
    is_active: true
  });
  const [slugError, setSlugError] = useState('');

  // Rotas fixas do sistema que não podem ser usadas como slug
  const reservedSlugs = [
    'login', 'cadastro', 'recuperar-senha', 'reset-password',
    'dashboard', 'leiloes', 'produto', 'suba-de-nivel',
    'como-funciona', 'contato', 'faq', 'termos', 'privacidade',
    'regras', 'manual', 'p'
  ];

  useEffect(() => { loadPages(); }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      const res = await api.get('/pages');
      if (res.data.success) setPages(res.data.data);
    } catch (err) {
      console.error('Erro ao carregar páginas:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: '', title_en: '', title_es: '',
      slug: '',
      content_pt: '', content_en: '', content_es: '',
      section: 'quick_links', sort_order: 0, is_active: true
    });
    setEditingPage(null);
    setShowForm(false);
    setActiveTab('pt');
    setSlugError('');
  };

  const validateSlug = (slug) => {
    if (!slug) {
      setSlugError('');
      return true;
    }
    const normalized = slug.toLowerCase().trim();
    if (reservedSlugs.includes(normalized)) {
      setSlugError(`A URL "/${normalized}" é uma rota do sistema e não pode ser usada.`);
      return false;
    }
    const duplicate = pages.find(p => p.slug === normalized && (!editingPage || p.id !== editingPage.id));
    if (duplicate) {
      setSlugError(`A URL "/${normalized}" já está em uso pela página "${duplicate.title}".`);
      return false;
    }
    setSlugError('');
    return true;
  };

  const handleSlugChange = (value) => {
    const slug = value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    setForm({ ...form, slug });
    validateSlug(slug);
  };

  const handleEdit = (page) => {
    setForm({
      title: page.title || '',
      title_en: page.title_en || '',
      title_es: page.title_es || '',
      slug: page.slug || '',
      content_pt: page.content_pt || '',
      content_en: page.content_en || '',
      content_es: page.content_es || '',
      section: page.section || 'quick_links',
      sort_order: page.sort_order || 0,
      is_active: page.is_active !== false
    });
    setEditingPage(page);
    setShowForm(true);
    setActiveTab('pt');
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setMessage({ type: 'error', text: 'O título em português é obrigatório.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }
    if (!form.content_pt || form.content_pt.trim() === '') {
      setMessage({ type: 'error', text: 'O conteúdo em português é obrigatório.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }
    // Validar slug antes de salvar
    const slugToCheck = form.slug || form.title.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!validateSlug(slugToCheck)) {
      setMessage({ type: 'error', text: slugError || 'A URL informada já está em uso.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    try {
      setSaving(true);
      let res;
      if (editingPage) {
        res = await api.put(`/pages/${editingPage.id}`, form);
      } else {
        res = await api.post('/pages', form);
      }
      if (res.data.success) {
        setMessage({ type: 'success', text: editingPage ? '✅ Página atualizada!' : '✅ Página criada!' });
        resetForm();
        await loadPages();
      }
    } catch (err) {
      console.error('Erro ao salvar página:', err);
      setMessage({ type: 'error', text: '❌ Erro ao salvar página.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta página?')) return;
    try {
      const res = await api.delete(`/pages/${id}`);
      if (res.data.success) {
        setMessage({ type: 'success', text: '✅ Página excluída.' });
        await loadPages();
      }
    } catch (err) {
      setMessage({ type: 'error', text: '❌ Erro ao excluir página.' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const quickLinks = pages.filter(p => p.section === 'quick_links');
  const legalPages = pages.filter(p => p.section === 'legal');

  if (loading) {
    return (
      <AdminLayout pageTitle="Páginas" pageSubtitle="Gerencie as páginas do rodapé">
        <div className="loading-container"><div className="spinner"></div><p>Carregando...</p></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Páginas" pageSubtitle="Gerencie as páginas exibidas no rodapé do site">
      <div className="paginas-admin">
        {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

        {!showForm ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
              <button className="btn-save" onClick={() => { resetForm(); setShowForm(true); }}>
                + Nova Página
              </button>
            </div>

            {/* Links Rápidos */}
            <div className="pages-section">
              <h3 style={{ color: '#4A9FD8', marginBottom: '1rem' }}>📌 Links Rápidos</h3>
              {quickLinks.length === 0 ? (
                <p style={{ color: '#8da4bf' }}>Nenhuma página cadastrada nesta seção.</p>
              ) : (
                <div className="pages-list">
                  {quickLinks.map(page => (
                    <div key={page.id} className="page-item">
                      <div className="page-info">
                        <span className="page-title">{page.title}</span>
                        <span className="page-slug">/{page.slug}</span>
                        {!page.is_active && <span className="badge-inactive">Inativa</span>}
                      </div>
                      <div className="page-actions">
                        <button className="btn-edit" onClick={() => handleEdit(page)}>Editar</button>
                        <button className="btn-delete" onClick={() => handleDelete(page.id)}>Excluir</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Legal */}
            <div className="pages-section" style={{ marginTop: '2rem' }}>
              <h3 style={{ color: '#4A9FD8', marginBottom: '1rem' }}>⚖️ Legal</h3>
              {legalPages.length === 0 ? (
                <p style={{ color: '#8da4bf' }}>Nenhuma página cadastrada nesta seção.</p>
              ) : (
                <div className="pages-list">
                  {legalPages.map(page => (
                    <div key={page.id} className="page-item">
                      <div className="page-info">
                        <span className="page-title">{page.title}</span>
                        <span className="page-slug">/{page.slug}</span>
                        {!page.is_active && <span className="badge-inactive">Inativa</span>}
                      </div>
                      <div className="page-actions">
                        <button className="btn-edit" onClick={() => handleEdit(page)}>Editar</button>
                        <button className="btn-delete" onClick={() => handleDelete(page.id)}>Excluir</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="page-form">
            <h3 style={{ color: '#e6eef8', marginBottom: '1.5rem' }}>
              {editingPage ? 'Editar Página' : 'Nova Página'}
            </h3>

            {/* Dados básicos */}
            <div className="form-row">
              <div className="form-group" style={{ flex: 2 }}>
                <label>Título (Português) *</label>
                <input type="text" className="text-input" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ex: Sobre Nós" />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Slug (URL)</label>
                <input type="text" className={`text-input ${slugError ? 'input-error' : ''}`} value={form.slug}
                  onChange={e => handleSlugChange(e.target.value)} placeholder="sobre-nos (auto)" />
                {slugError && (
                  <span style={{ color: '#E55F52', fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' }}>
                    ⚠️ {slugError}
                  </span>
                )}
                {form.slug && !slugError && (
                  <span style={{ color: '#4A9FD8', fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' }}>
                    URL: /p/{form.slug}
                  </span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Título (Inglês)</label>
                <input type="text" className="text-input" value={form.title_en}
                  onChange={e => setForm({ ...form, title_en: e.target.value })} placeholder="About Us" />
              </div>
              <div className="form-group">
                <label>Título (Espanhol)</label>
                <input type="text" className="text-input" value={form.title_es}
                  onChange={e => setForm({ ...form, title_es: e.target.value })} placeholder="Sobre Nosotros" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Seção do Rodapé</label>
                <select className="text-input" value={form.section}
                  onChange={e => setForm({ ...form, section: e.target.value })}>
                  <option value="quick_links">Links Rápidos</option>
                  <option value="legal">Legal</option>
                </select>
              </div>
              <div className="form-group">
                <label>Ordem</label>
                <input type="number" className="text-input" value={form.sort_order}
                  onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select className="text-input" value={form.is_active ? 'true' : 'false'}
                  onChange={e => setForm({ ...form, is_active: e.target.value === 'true' })}>
                  <option value="true">Ativa</option>
                  <option value="false">Inativa</option>
                </select>
              </div>
            </div>

            {/* Tabs de idioma para conteúdo */}
            <div className="content-tabs" style={{ marginTop: '1.5rem' }}>
              <button className={`content-tab ${activeTab === 'pt' ? 'active' : ''}`} onClick={() => setActiveTab('pt')}>
                🇧🇷 Português *
              </button>
              <button className={`content-tab ${activeTab === 'en' ? 'active' : ''}`} onClick={() => setActiveTab('en')}>
                🇺🇸 Inglês {!form.content_en && <span style={{ color: '#ff9800', fontSize: '0.7rem' }}>⚠️</span>}
              </button>
              <button className={`content-tab ${activeTab === 'es' ? 'active' : ''}`} onClick={() => setActiveTab('es')}>
                🇪🇸 Espanhol {!form.content_es && <span style={{ color: '#ff9800', fontSize: '0.7rem' }}>⚠️</span>}
              </button>
            </div>

            <div style={{ marginTop: '1rem' }}>
              {activeTab === 'pt' && (
                <TextEditor value={form.content_pt} onChange={val => setForm({ ...form, content_pt: val })} />
              )}
              {activeTab === 'en' && (
                <TextEditor value={form.content_en} onChange={val => setForm({ ...form, content_en: val })} />
              )}
              {activeTab === 'es' && (
                <TextEditor value={form.content_es} onChange={val => setForm({ ...form, content_es: val })} />
              )}
            </div>

            {/* Botões */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn-save" onClick={handleSave} disabled={saving || !!slugError}>
                {saving ? 'Salvando...' : (editingPage ? 'Salvar Alterações' : 'Criar Página')}
              </button>
              <button className="btn-cancel" onClick={resetForm}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Paginas;
