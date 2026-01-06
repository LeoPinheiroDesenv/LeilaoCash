import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';
import './DashboardAdmin.css';

const DashboardAdmin = () => {
  const [generalReport, setGeneralReport] = useState(null);
  const [todayMetrics, setTodayMetrics] = useState(null);
  const [recentAuctions, setRecentAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [generalResponse, todayResponse, auctionsResponse] = await Promise.all([
        api.get('/reports/general'),
        api.get('/reports/today'),
        api.get('/auctions?status=active&per_page=5&order_by=created_at&order_dir=desc')
      ]);

      if (generalResponse.data.success) {
        setGeneralReport(generalResponse.data.data);
      }

      if (todayResponse.data.success) {
        setTodayMetrics(todayResponse.data.data);
      }

      if (auctionsResponse.data.success) {
        setRecentAuctions(auctionsResponse.data.data.data || auctionsResponse.data.data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'R$ 0,00';
    const value = parseFloat(price);
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(0)}K`;
    }
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return parseFloat(num).toLocaleString('pt-BR');
  };

  const calculateTrend = (today, yesterday) => {
    if (!yesterday || yesterday === 0) return null;
    const change = ((today - yesterday) / yesterday) * 100;
    return {
      value: Math.abs(change).toFixed(0),
      isPositive: change >= 0
    };
  };

  const getProductName = (auction) => {
    if (auction.products && auction.products.length > 0) {
      return auction.products[0].name || 'Produto sem nome';
    }
    return auction.title || 'Leilão sem título';
  };

  const getBidCount = (auction) => {
    // TODO: Implementar contagem real de lances quando disponível
    return auction.min_bids || 0;
  };

  if (loading) {
    return (
      <AdminLayout pageTitle="Dashboard Administrativo" pageSubtitle="Visão geral da plataforma">
        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <p style={{ color: '#8da4bf' }}>Carregando dados do dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  const usersTrend = todayMetrics ? calculateTrend(todayMetrics.new_users_today, todayMetrics.new_users_yesterday) : null;

  return (
    <AdminLayout pageTitle="Dashboard Administrativo" pageSubtitle="Visão geral da plataforma">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <p className="stat-label">Total de Usuários</p>
            <p className="stat-value">{formatNumber(generalReport?.total_users || 0)}</p>
            {todayMetrics?.new_users_today > 0 && (
              <p className="stat-change">+{formatNumber(todayMetrics.new_users_today)} hoje</p>
            )}
            {usersTrend && (
              <div className="stat-trend">
                <span className={usersTrend.isPositive ? 'trend-up' : 'trend-down'}>
                  {usersTrend.isPositive ? '↑' : '↓'} {usersTrend.value}%
                </span>
                <span className="trend-label">vs ontem</span>
              </div>
            )}
          </div>
          <div className="stat-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <p className="stat-label">Leilões Ativos</p>
            <p className="stat-value">{formatNumber(generalReport?.active_auctions || 0)}</p>
          </div>
          <div className="stat-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <path d="M3 6h18"></path>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <p className="stat-label">Receita Total</p>
            <p className="stat-value">{formatPrice(generalReport?.total_revenue || 0)}</p>
            {todayMetrics?.revenue_today > 0 && (
              <p className="stat-change">+{formatPrice(todayMetrics.revenue_today)} hoje</p>
            )}
          </div>
          <div className="stat-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="2" x2="12" y2="22"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <p className="stat-label">Cashback Total</p>
            <p className="stat-value">{formatPrice(generalReport?.total_cashback || 0)}</p>
            {todayMetrics?.cashback_today > 0 && (
              <p className="stat-change">+{formatPrice(todayMetrics.cashback_today)} hoje</p>
            )}
          </div>
          <div className="stat-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
              <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
            </svg>
          </div>
        </div>
      </div>
      <div className="dashboard-sections">
        <div className="section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Leilões Recentes</h3>
            <Link to="/dashboard/leiloes" style={{ color: '#4A9FD8', textDecoration: 'none', fontSize: '0.9rem' }}>
              Ver todos →
            </Link>
          </div>
          {recentAuctions.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#8da4bf' }}>
              <p>Nenhum leilão ativo no momento.</p>
            </div>
          ) : (
            <div className="auctions-list">
              {recentAuctions.map(auction => (
                <div key={auction.id} className="auction-item">
                  <div className="auction-info">
                    <p className="auction-title">{getProductName(auction)}</p>
                    <p className="auction-bids">{getBidCount(auction)} lances mínimos</p>
                  </div>
                  <div className="auction-price">
                    {formatPrice(auction.current_bid || auction.starting_bid || 0)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="section-card">
          <h3>Métricas Rápidas</h3>
          <div className="metrics-grid">
            <div className="metric-item">
              <p className="metric-value">{formatNumber(todayMetrics?.bids_today || 0)}</p>
              <p className="metric-label">Lances Hoje</p>
            </div>
            <div className="metric-item">
              <p className="metric-value">{formatNumber(generalReport?.finished_auctions || 0)}</p>
              <p className="metric-label">Leilões Finalizados</p>
            </div>
            <div className="metric-item">
              <p className="metric-value">{formatNumber(generalReport?.pending_withdrawals || 0)}</p>
              <p className="metric-label">Saques Pendentes</p>
            </div>
            <div className="metric-item">
              <p className="metric-value">{formatNumber(todayMetrics?.new_users_today || 0)}</p>
              <p className="metric-label">Novos Usuários</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardAdmin;
