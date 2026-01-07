import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import ProductPage from './components/ProductPage';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import ComoFunciona from './pages/ComoFunciona';
import FAQ from './pages/FAQ';
import Termos from './pages/Termos';
import Privacidade from './pages/Privacidade';
import Regras from './pages/Regras';
import RecuperarSenha from './pages/RecuperarSenha';
import ResetPassword from './pages/ResetPassword'; // Importa o novo componente
import SubaDeNivel from './pages/SubaDeNivel';
import Dashboard from './pages/Dashboard';
import Configuracoes from './pages/Configuracoes';
import Usuarios from './pages/Usuarios';
import Categorias from './pages/Categorias';
import Produtos from './pages/Produtos';
import Leiloes from './pages/Leiloes';
import {
  DashboardAdminLances,
  DashboardAdminCashback,
  DashboardAdminTransacoes,
  DashboardAdminRelatorios
} from './pages/DashboardAdminPages';
import {
  DashboardUsuarioMinhaConta,
  DashboardUsuarioMeusLances,
  DashboardUsuarioMeuCashback
} from './pages/DashboardUsuarioPages';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <div className="App">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/recuperar-senha" element={<RecuperarSenha />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Rota Unificada do Dashboard */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            {/* Sub-rotas do Dashboard (Admin) */}
            <Route path="/dashboard/usuarios" element={
              <ProtectedRoute adminOnly={true}>
                <Usuarios />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/categorias" element={
              <ProtectedRoute adminOnly={true}>
                <Categorias />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/produtos" element={
              <ProtectedRoute adminOnly={true}>
                <Produtos />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/leiloes" element={
              <ProtectedRoute adminOnly={true}>
                <Leiloes />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/lances" element={
              <ProtectedRoute adminOnly={true}>
                <DashboardAdminLances />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/cashback" element={
              <ProtectedRoute adminOnly={true}>
                <DashboardAdminCashback />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/transacoes" element={
              <ProtectedRoute adminOnly={true}>
                <DashboardAdminTransacoes />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/relatorios" element={
              <ProtectedRoute adminOnly={true}>
                <DashboardAdminRelatorios />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/configuracoes" element={
              <ProtectedRoute adminOnly={true}>
                <Configuracoes />
              </ProtectedRoute>
            } />
            
            {/* Sub-rotas do Dashboard (Usuário) */}
            <Route path="/dashboard/minha-conta" element={
              <ProtectedRoute>
                <DashboardUsuarioMinhaConta />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/meus-lances" element={
              <ProtectedRoute>
                <DashboardUsuarioMeusLances />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/meu-cashback" element={
              <ProtectedRoute>
                <DashboardUsuarioMeuCashback />
              </ProtectedRoute>
            } />
            
            {/* Rotas públicas */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/produto/:id" element={<Layout><ProductPage /></Layout>} />
            <Route path="/suba-de-nivel" element={<Layout><SubaDeNivel /></Layout>} />
            <Route path="/como-funciona" element={<Layout><ComoFunciona /></Layout>} />
            <Route path="/faq" element={<Layout><FAQ /></Layout>} />
            <Route path="/termos" element={<Layout><Termos /></Layout>} />
            <Route path="/privacidade" element={<Layout><Privacidade /></Layout>} />
            <Route path="/regras" element={<Layout><Regras /></Layout>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
    </ThemeProvider>
  );
}

export default App;
