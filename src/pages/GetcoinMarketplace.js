import React, { useState, useEffect, useCallback } from 'react';
import UserLayout from '../components/UserLayout';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './DashboardUsuario.css';

const GetcoinMarketplace = () => {
  const { user, updateUser } = useAuth();
  const [info, setInfo] = useState({ vibeget_price: 0.50, active_offers: 0, avg_viber_price: null });
  const [offers, setOffers] = useState([]);
  const [myOffers, setMyOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyAmount, setBuyAmount] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [buying, setBuying] = useState(false);
  const [showSellForm, setShowSellForm] = useState(false);
  const [sellData, setSellData] = useState({ amount: '', price_per_unit: '0.50' });
  const [activeTab, setActiveTab] = useState('buy'); // buy, offers, my-offers

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [infoRes, offersRes, myOffersRes] = await Promise.all([
        api.get('/getcoin/info'),
        api.get('/getcoin/offers'),
        api.get('/getcoin/my-offers')
      ]);
      if (infoRes.data.success) setInfo(infoRes.data.data);
      if (offersRes.data.success) setOffers(offersRes.data.data.data || []);
      if (myOffersRes.data.success) setMyOffers(myOffersRes.data.data.data || []);
    } catch (error) {
      console.error('Erro ao carregar marketplace:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleBuyFromVibeget = async (e) => {
    e.preventDefault();
    if (!buyAmount || buyAmount <= 0) return;
    setBuying(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await api.post('/getcoin/buy-vibeget', { amount: parseFloat(buyAmount) });
      if (response.data.success) {
        setMessage({ type: 'success', text: response.data.message });
        setBuyAmount('');
        const meRes = await api.get('/auth/me');
        if (meRes.data.success) updateUser(meRes.data.data);
        loadData();
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erro ao comprar GetCoin' });
    } finally {
      setBuying(false);
    }
  };

  const handleBuyOffer = async (offerId) => {
    if (!window.confirm('Confirma a compra desta oferta?')) return;
    setMessage({ type: '', text: '' });
    try {
      const response = await api.post(`/getcoin/offers/${offerId}/buy`);
      if (response.data.success) {
        setMessage({ type: 'success', text: response.data.message });
        const meRes = await api.get('/auth/me');
        if (meRes.data.success) updateUser(meRes.data.data);
        loadData();
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erro ao comprar' });
    }
  };

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const response = await api.post('/getcoin/offers', {
        amount: parseFloat(sellData.amount),
        price_per_unit: parseFloat(sellData.price_per_unit)
      });
      if (response.data.success) {
        setMessage({ type: 'success', text: response.data.message });
        setSellData({ amount: '', price_per_unit: '0.50' });
        setShowSellForm(false);
        const meRes = await api.get('/auth/me');
        if (meRes.data.success) updateUser(meRes.data.data);
        loadData();
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erro ao criar oferta' });
    }
  };

  const handleCancelOffer = async (offerId) => {
    if (!window.confirm('Cancelar esta oferta?')) return;
    try {
      const response = await api.delete(`/getcoin/offers/${offerId}`);
      if (response.data.success) {
        setMessage({ type: 'success', text: response.data.message });
        const meRes = await api.get('/auth/me');
        if (meRes.data.success) updateUser(meRes.data.data);
        loadData();
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erro ao cancelar' });
    }
  };

  const canSell = ['bronze', 'silver', 'gold', 'platinum', 'diamond'].includes(user?.viber_level);
  const totalCost = buyAmount ? (parseFloat(buyAmount) * info.vibeget_price).toFixed(2) : '0.00';

  if (loading) {
    return (
      <UserLayout>
        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <p style={{ color: '#8da4bf' }}>Carregando marketplace...</p>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Marketplace GetCoin</h1>
          <p>Compre GetCoin da VibeGet ou de outros Vibers</p>
        </div>
      </div>

      {message.text && (
        <div style={{
          padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px',
          background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(229, 95, 82, 0.1)',
          border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(229, 95, 82, 0.3)'}`,
          color: message.type === 'success' ? '#10b981' : '#E55F52'
        }}>
          {message.text}
        </div>
      )}

      {/* Info cards */}
      <div className="bids-stats" style={{marginBottom: '2rem'}}>
        <div className="bid-stat-card">
          <p className="stat-number">R$ {info.vibeget_price?.toFixed(2)}</p>
          <p className="stat-label">Preço VibeGet</p>
        </div>
        <div className="bid-stat-card">
          <p className="stat-number">{info.active_offers}</p>
          <p className="stat-label">Ofertas de Vibers</p>
        </div>
        <div className="bid-stat-card">
          <p className="stat-number">R$ {user?.cashback_balance || '0.00'}</p>
          <p className="stat-label">Seu GetCoin</p>
        </div>
        <div className="bid-stat-card">
          <p className="stat-number">R$ {user?.balance || '0.00'}</p>
          <p className="stat-label">Saldo R$</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap'}}>
        <button onClick={() => setActiveTab('buy')} style={{padding: '0.6rem 1.2rem', borderRadius: '8px', border: activeTab === 'buy' ? '2px solid #4A9FD8' : '1px solid rgba(255,255,255,0.1)', background: activeTab === 'buy' ? 'rgba(74,159,216,0.15)' : 'rgba(255,255,255,0.05)', color: '#e6eef8', cursor: 'pointer'}}>
          Comprar da VibeGet
        </button>
        <button onClick={() => setActiveTab('offers')} style={{padding: '0.6rem 1.2rem', borderRadius: '8px', border: activeTab === 'offers' ? '2px solid #4A9FD8' : '1px solid rgba(255,255,255,0.1)', background: activeTab === 'offers' ? 'rgba(74,159,216,0.15)' : 'rgba(255,255,255,0.05)', color: '#e6eef8', cursor: 'pointer'}}>
          Ofertas de Vibers ({info.active_offers})
        </button>
        {canSell && (
          <button onClick={() => setActiveTab('my-offers')} style={{padding: '0.6rem 1.2rem', borderRadius: '8px', border: activeTab === 'my-offers' ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)', background: activeTab === 'my-offers' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', color: '#e6eef8', cursor: 'pointer'}}>
            Minhas Ofertas
          </button>
        )}
      </div>

      {/* Comprar da VibeGet */}
      {activeTab === 'buy' && (
        <div style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem'}}>
          <h3 style={{color: '#e6eef8', marginBottom: '1rem'}}>Comprar GetCoin da VibeGet</h3>
          <p style={{color: '#8da4bf', marginBottom: '1rem', fontSize: '0.9rem'}}>
            Preço fixo: R$ {info.vibeget_price?.toFixed(2)} por GetCoin. Debitado do seu saldo em R$.
          </p>
          <form onSubmit={handleBuyFromVibeget} style={{display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap'}}>
            <div style={{flex: 1, minWidth: '150px'}}>
              <label style={{display: 'block', color: '#8da4bf', fontSize: '0.85rem', marginBottom: '0.3rem'}}>Quantidade de GetCoin</label>
              <input type="number" min="1" step="1" value={buyAmount} onChange={(e) => setBuyAmount(e.target.value)} placeholder="Ex: 100" style={{width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e6eef8', fontSize: '1rem'}} />
            </div>
            <div style={{minWidth: '120px'}}>
              <p style={{color: '#4A9FD8', fontWeight: '600', fontSize: '1.1rem'}}>= R$ {totalCost}</p>
            </div>
            <button type="submit" disabled={buying || !buyAmount} style={{padding: '0.75rem 1.5rem', background: '#4A9FD8', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', opacity: buying || !buyAmount ? 0.5 : 1}}>
              {buying ? 'Comprando...' : 'Comprar'}
            </button>
          </form>
        </div>
      )}

      {/* Ofertas de Vibers */}
      {activeTab === 'offers' && (
        <div>
          {offers.length === 0 ? (
            <p style={{color: '#8da4bf', textAlign: 'center', padding: '2rem'}}>Nenhuma oferta disponível no momento.</p>
          ) : (
            <div style={{display: 'grid', gap: '1rem'}}>
              {offers.map(offer => (
                <div key={offer.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '1rem 1.5rem'}}>
                  <div>
                    <p style={{color: '#e6eef8', fontWeight: '600'}}>{parseFloat(offer.amount).toFixed(0)} GetCoin</p>
                    <p style={{color: '#8da4bf', fontSize: '0.85rem'}}>
                      R$ {parseFloat(offer.price_per_unit).toFixed(2)}/un — Vendedor: {offer.seller?.name || 'Viber'}
                      {offer.seller?.viber_level && ` (${offer.seller.viber_level})`}
                    </p>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <p style={{color: '#4A9FD8', fontWeight: '700', fontSize: '1.1rem'}}>R$ {parseFloat(offer.total_price).toFixed(2)}</p>
                    <button onClick={() => handleBuyOffer(offer.id)} style={{marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem'}}>
                      Comprar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Minhas ofertas + criar nova */}
      {activeTab === 'my-offers' && canSell && (
        <div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
            <h3 style={{color: '#e6eef8'}}>Minhas Ofertas de Venda</h3>
            <button onClick={() => setShowSellForm(!showSellForm)} style={{padding: '0.6rem 1.2rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'}}>
              {showSellForm ? 'Cancelar' : '+ Nova Oferta'}
            </button>
          </div>

          {showSellForm && (
            <form onSubmit={handleCreateOffer} style={{background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem'}}>
              <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                <div style={{flex: 1, minWidth: '150px'}}>
                  <label style={{display: 'block', color: '#8da4bf', fontSize: '0.85rem', marginBottom: '0.3rem'}}>Quantidade GetCoin</label>
                  <input type="number" min="1" step="1" value={sellData.amount} onChange={(e) => setSellData({...sellData, amount: e.target.value})} placeholder="Ex: 50" required style={{width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e6eef8'}} />
                </div>
                <div style={{flex: 1, minWidth: '150px'}}>
                  <label style={{display: 'block', color: '#8da4bf', fontSize: '0.85rem', marginBottom: '0.3rem'}}>Preço por GetCoin (R$)</label>
                  <input type="number" min="0.01" step="0.01" value={sellData.price_per_unit} onChange={(e) => setSellData({...sellData, price_per_unit: e.target.value})} required style={{width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e6eef8'}} />
                </div>
                <div style={{display: 'flex', alignItems: 'flex-end'}}>
                  <button type="submit" style={{padding: '0.75rem 1.5rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'}}>
                    Publicar
                  </button>
                </div>
              </div>
              {sellData.amount && sellData.price_per_unit && (
                <p style={{color: '#10b981', marginTop: '0.75rem', fontSize: '0.9rem'}}>
                  Total: {sellData.amount} GetCoin por R$ {(parseFloat(sellData.amount || 0) * parseFloat(sellData.price_per_unit || 0)).toFixed(2)}
                </p>
              )}
            </form>
          )}

          {myOffers.length === 0 ? (
            <p style={{color: '#8da4bf', textAlign: 'center', padding: '2rem'}}>Você não tem ofertas ativas.</p>
          ) : (
            <div style={{display: 'grid', gap: '1rem'}}>
              {myOffers.map(offer => (
                <div key={offer.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '1rem 1.5rem'}}>
                  <div>
                    <p style={{color: '#e6eef8', fontWeight: '600'}}>{parseFloat(offer.amount).toFixed(0)} GetCoin @ R$ {parseFloat(offer.price_per_unit).toFixed(2)}/un</p>
                    <p style={{color: '#8da4bf', fontSize: '0.85rem'}}>
                      Status: {offer.status === 'active' ? '🟢 Ativa' : offer.status === 'sold' ? '✅ Vendida' : '❌ Cancelada'}
                      {offer.buyer && ` — Comprador: ${offer.buyer.name}`}
                    </p>
                  </div>
                  {offer.status === 'active' && (
                    <button onClick={() => handleCancelOffer(offer.id)} style={{padding: '0.5rem 1rem', background: 'rgba(229,95,82,0.15)', color: '#E55F52', border: '1px solid rgba(229,95,82,0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem'}}>
                      Cancelar
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!canSell && activeTab === 'my-offers' && (
        <div style={{padding: '2rem', textAlign: 'center', color: '#8da4bf'}}>
          <p>Apenas Vibers nível Bronze ou superior podem vender GetCoin.</p>
          <p style={{fontSize: '0.85rem', marginTop: '0.5rem'}}>Vença sua primeira Vibe para subir de nível!</p>
        </div>
      )}
    </UserLayout>
  );
};

export default GetcoinMarketplace;
