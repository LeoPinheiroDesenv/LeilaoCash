import React from 'react';
import DynamicPage from './DynamicPage';
import './ComoFunciona.css';

const ComoFunciona = () => {
  return (
    <DynamicPage 
      contentKey="page_como_funciona" 
      defaultTitle="Como Funciona" 
    />
  );
};

export default ComoFunciona;
