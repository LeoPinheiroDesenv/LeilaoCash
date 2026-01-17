import React from 'react';
import DynamicPage from './DynamicPage';
import './ComoFunciona.css'; // Reutilizando estilos por enquanto

const Contato = () => {
  return (
    <DynamicPage 
      contentKey="page_contato" 
      defaultTitle="Contato" 
    />
  );
};

export default Contato;
