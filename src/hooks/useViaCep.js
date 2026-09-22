import { useCallback, useState } from 'react';

/**
 * Consulta de endereço por CEP via ViaCEP (https://viacep.com.br).
 * Baseado no fluxo do pacote react-via-cep, reimplementado como hook
 * para se integrar aos formulários controlados do projeto.
 */
export const useViaCep = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAddressByCep = useCallback(async (cep) => {
    const cleaned = (cep || '').replace(/\D/g, '');

    if (cleaned.length !== 8) {
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);

      if (!response.ok) {
        throw new Error('Falha na consulta do CEP');
      }

      const data = await response.json();

      if (data.erro) {
        setError('CEP não encontrado.');
        return null;
      }

      return {
        cep: data.cep,
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
        ibge: data.ibge || '',
      };
    } catch (err) {
      setError('Não foi possível consultar o CEP. Tente novamente.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchAddressByCep, loading, error };
};
