import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardAdmin from './DashboardAdmin';
import DashboardUsuario from './DashboardUsuario';
import LoadingScreen from '../components/LoadingScreen'; // Supondo que você tenha um componente de loading

const Dashboard = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    // Exibe uma tela de carregamento enquanto o status de autenticação é verificado
    return <LoadingScreen />;
  }

  return isAdmin ? <DashboardAdmin /> : <DashboardUsuario />;
};

export default Dashboard;
