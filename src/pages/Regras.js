import React from 'react';
import DynamicPage from './DynamicPage';
import './Regras.css';

const Regras = () => {
  return (
    <DynamicPage 
      contentKey="page_regras" 
      defaultTitle="Regras dos Leilões" 
    />
  );
};

export default Regras;
