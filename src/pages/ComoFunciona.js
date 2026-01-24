import React from 'react';
import DynamicPage from './DynamicPage';
import './ComoFunciona.css';

const ComoFunciona = () => {
  return (
      <div className="page_como_funciona">
    <DynamicPage 
      contentKey="page_como_funciona" 
      defaultTitle="Como Funciona"
    />
      </div>
  );
};

export default ComoFunciona;
