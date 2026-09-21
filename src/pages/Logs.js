import React from 'react';
import AdminLayout from '../components/AdminLayout';
import ConfiguracoesLogs from './ConfiguracoesLogs';
import './Configuracoes.css';

const Logs = () => {
  return (
    <AdminLayout pageTitle="Logs" pageSubtitle="Registros de operações do sistema">
      <ConfiguracoesLogs />
    </AdminLayout>
  );
};

export default Logs;
