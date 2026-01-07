import React from 'react';
import DynamicPage from './DynamicPage';
import './SubaDeNivel.css';

const SubaDeNivel = () => {
  return (
    <DynamicPage 
      contentKey="page_suba_de_nivel" 
      defaultTitle="Suba de Nível" 
    />
  );
};

export default SubaDeNivel;
