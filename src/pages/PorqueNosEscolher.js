import React from 'react';
import DynamicPage from './DynamicPage';
import './ComoFunciona.css';

const PorqueNosEscolher = () => {
  return (
    <DynamicPage 
      contentKey="page_porque_nos_escolher" 
      defaultTitle="Porque Nos Escolher"
    />
  );
};

export default PorqueNosEscolher;
