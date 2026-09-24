import React from 'react';
import './pegueAVisao.css';

const TERMOS = [
  { termo: 'VIBE', descricao: 'Disputa de um determinado produto, por um grupo de pessoas.' },
  { termo: 'GET', descricao: 'Valor ofertado e pago com o objetivo de vencer a Vibe.' },
  { termo: 'CHAMPION GET', descricao: 'Get vencedor da Vibe.' },
  { termo: 'VIBER', descricao: 'Pessoa cadastrada na plataforma, vencedor de pelo menos uma Vibe.' },
  { termo: 'R$', descricao: 'Valor em Reais no pagamento de um Get.' },
  { termo: 'GETCOIN', descricao: 'Cashback para diversas situações e para compor um Get.' },
];

export default function PegueAVisao() {
  return (
    <section className="pegue-a-visao-section">
      <div className="container">
        <div className="pav-header">
          <h2>Pegue a visão</h2>
        </div>
        <dl className="pav-grid">
          {TERMOS.map(({ termo, descricao }) => (
            <div className="pav-item" key={termo}>
              <dt>{termo}</dt>
              <dd>{descricao}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
