import React from 'react';
import DynamicPage from './DynamicPage';
import './ComoFunciona.css';

const ComoFunciona = () => {
  return (
    <DynamicPage 
      contentKey="page_como_funciona" 
      defaultTitle="Como Funciona"
    >
      <div className="tabela-comparativa-container">
        <h2 className="tabela-titulo">Comparativo de Vantagens</h2>
        <div className="tabela-wrapper">
          <table className="tabela-comparativa">
            <thead>
              <tr>
                <th></th>
                <th className="coluna-leilaocash">
                  <div className="logo-header">LeilãoCash</div>
                </th>
                <th className="coluna-outros">Outros Sites de Leilão</th>
                <th className="coluna-varejo">Varejo Tradicional</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="feature-cell">Preço dos Produtos</td>
                <td className="highlight-cell">Até 90% OFF</td>
                <td>Até 90% OFF</td>
                <td>Preço Cheio</td>
              </tr>
              <tr>
                <td className="feature-cell">Cashback em Lances</td>
                <td className="highlight-cell">SIM (Até 10%)</td>
                <td>NÃO</td>
                <td>NÃO</td>
              </tr>
              <tr>
                <td className="feature-cell">Garantia de Entrega</td>
                <td className="highlight-cell">SIM</td>
                <td>Variável</td>
                <td>SIM</td>
              </tr>
              <tr>
                <td className="feature-cell">Produtos Novos</td>
                <td className="highlight-cell">SIM</td>
                <td>Variável</td>
                <td>SIM</td>
              </tr>
              <tr>
                <td className="feature-cell">Frete Grátis</td>
                <td className="highlight-cell">Em Promoções</td>
                <td>Raro</td>
                <td>Depende do Valor</td>
              </tr>
              <tr>
                <td className="feature-cell">Suporte 24h</td>
                <td className="highlight-cell">SIM</td>
                <td>NÃO</td>
                <td>Horário Comercial</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DynamicPage>
  );
};

export default ComoFunciona;
