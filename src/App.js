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
import SubaDeNivel from './pages/SubaDeNivel';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardUsuario from './pages/DashboardUsuario';
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
// Produtos estáticos removidos - agora buscamos da API via HomePage component
// HomePage está em src/components/HomePage.js

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
            
            {/* Rotas protegidas - Admin apenas */}
            <Route path="/dashboard-admin" element={
              <ProtectedRoute adminOnly={true}>
                <DashboardAdmin />
              </ProtectedRoute>
            } />
            <Route path="/dashboard-admin/usuarios" element={
              <ProtectedRoute adminOnly={true}>
                <Usuarios />
              </ProtectedRoute>
            } />
            <Route path="/dashboard-admin/categorias" element={
              <ProtectedRoute adminOnly={true}>
                <Categorias />
              </ProtectedRoute>
            } />
            <Route path="/dashboard-admin/produtos" element={
              <ProtectedRoute adminOnly={true}>
                <Produtos />
              </ProtectedRoute>
            } />
            <Route path="/dashboard-admin/leiloes" element={
              <ProtectedRoute adminOnly={true}>
                <Leiloes />
              </ProtectedRoute>
            } />
            <Route path="/dashboard-admin/lances" element={
              <ProtectedRoute adminOnly={true}>
                <DashboardAdminLances />
              </ProtectedRoute>
            } />
            <Route path="/dashboard-admin/cashback" element={
              <ProtectedRoute adminOnly={true}>
                <DashboardAdminCashback />
              </ProtectedRoute>
            } />
            <Route path="/dashboard-admin/transacoes" element={
              <ProtectedRoute adminOnly={true}>
                <DashboardAdminTransacoes />
              </ProtectedRoute>
            } />
            <Route path="/dashboard-admin/relatorios" element={
              <ProtectedRoute adminOnly={true}>
                <DashboardAdminRelatorios />
              </ProtectedRoute>
            } />
            <Route path="/dashboard-admin/configuracoes" element={
              <ProtectedRoute adminOnly={true}>
                <Configuracoes />
              </ProtectedRoute>
            } />
            
            {/* Rotas protegidas - Usuários */}
            <Route path="/dashboard-usuario" element={
              <ProtectedRoute>
                <DashboardUsuario />
              </ProtectedRoute>
            } />
            <Route path="/dashboard-usuario/minha-conta" element={
              <ProtectedRoute>
                <DashboardUsuarioMinhaConta />
              </ProtectedRoute>
            } />
            <Route path="/dashboard-usuario/meus-lances" element={
              <ProtectedRoute>
                <DashboardUsuarioMeusLances />
              </ProtectedRoute>
            } />
            <Route path="/dashboard-usuario/meu-cashback" element={
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
