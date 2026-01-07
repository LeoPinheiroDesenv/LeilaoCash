import React from 'react';
import DynamicPage from './DynamicPage';
import './Privacidade.css';

const Privacidade = () => {
  return (
    <DynamicPage 
      contentKey="page_privacidade" 
      defaultTitle="Política de Privacidade" 
    />
  );
};

export default Privacidade;
