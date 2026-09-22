import { useState, useEffect } from 'react';
import api from '../services/api';

/** Lista de estados (UFs) para preencher um select. */
export const useEstados = () => {
  const [estados, setEstados] = useState([]);

  useEffect(() => {
    let active = true;
    api.get('/estados').then((response) => {
      if (active && response.data.success) {
        setEstados(response.data.data);
      }
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  return estados;
};

/** Lista de cidades do estado (sigla) informado, para preencher um select dependente. */
export const useCidades = (siglaEstado) => {
  const [cidades, setCidades] = useState([]);

  useEffect(() => {
    if (!siglaEstado) {
      setCidades([]);
      return;
    }

    let active = true;
    api.get(`/estados/${siglaEstado}/cidades`).then((response) => {
      if (active && response.data.success) {
        setCidades(response.data.data);
      }
    }).catch(() => {
      if (active) setCidades([]);
    });
    return () => { active = false; };
  }, [siglaEstado]);

  return cidades;
};

/** Busca as cidades de um estado sob demanda (fora do ciclo de render), usado no autofill de CEP. */
export const fetchCidadesByEstado = async (siglaEstado) => {
  if (!siglaEstado) return [];
  try {
    const response = await api.get(`/estados/${siglaEstado}/cidades`);
    return response.data.success ? response.data.data : [];
  } catch {
    return [];
  }
};
