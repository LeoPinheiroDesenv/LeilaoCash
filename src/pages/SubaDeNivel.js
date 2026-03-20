import React from 'react';
import DynamicPage from './DynamicPage';
import './SubaDeNivel.css';

const SubaDeNivel = () => {
  return (
      <div className="page_suba_de_nivel">
    <DynamicPage 
      contentKey="page_suba_de_nivel"
      defaultTitle="Suba de Nível"
    />
      </div>
  );
};

export default SubaDeNivel;


