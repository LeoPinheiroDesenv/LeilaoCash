import React from 'react';
import DynamicPage from './DynamicPage';
import './Termos.css';

const Termos = () => {
  return (
    <DynamicPage 
      contentKey="page_termos" 
      defaultTitle="Termos de Uso" 
    />
  );
};

export default Termos;
