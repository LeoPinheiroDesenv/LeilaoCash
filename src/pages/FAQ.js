import React from 'react';
import DynamicPage from './DynamicPage';
import './FAQ.css';

const FAQ = () => {
  return (
    <DynamicPage 
      contentKey="page_faq" 
      defaultTitle="Perguntas Frequentes" 
    />
  );
};

export default FAQ;
