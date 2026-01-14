import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

const Layout = ({ children, onSearch }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <div className="site-root">
      <Header onSearch={onSearch} showSearch={!isHomePage} />
      <main className="site-main">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

